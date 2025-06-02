
import React, { useRef, useCallback, useState } from 'react';
import { Camera, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState<string>('');

  const startCamera = useCallback(async () => {
    if (stream) {
      console.log('Camera already started, skipping...');
      return;
    }

    try {
      console.log('Requesting camera access...');
      setHasError(false);
      setErrorType('');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setIsStreaming(true);
        console.log('Camera stream started successfully');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasError(true);
      
      if (error instanceof Error) {
        setErrorType(error.name);
        if (error.name === 'NotAllowedError') {
          toast.error('Camera access denied. Please allow camera access in your browser settings.');
        } else if (error.name === 'NotFoundError') {
          toast.error('No camera found on this device.');
        } else if (error.name === 'NotReadableError') {
          toast.error('Camera is being used by another application.');
        } else {
          toast.error('Error accessing camera: ' + error.message);
        }
      } else {
        toast.error('Error accessing camera. Please try again.');
      }
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      console.log('Stopping camera stream...');
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
      setHasError(false);
      setErrorType('');
      console.log('Camera stream stopped');
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current && isStreaming) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageData);
        handleClose();
        toast.success('Photo captured successfully!');
      }
    } else {
      toast.error('Camera not ready. Please wait for the camera to start.');
    }
  }, [onCapture, isStreaming]);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  React.useEffect(() => {
    if (isOpen && !stream && !hasError) {
      startCamera();
    } else if (!isOpen) {
      stopCamera();
    }
  }, [isOpen, startCamera, stopCamera, stream, hasError]);

  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const renderErrorMessage = () => {
    if (errorType === 'NotAllowedError') {
      return (
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <div>
            <h3 className="font-medium mb-2">Camera Access Denied</h3>
            <p className="text-sm text-muted-foreground mb-4">
              To use the camera, please:
            </p>
            <ol className="text-sm text-left space-y-1 max-w-sm mx-auto">
              <li>1. Look for the camera icon in your browser's address bar</li>
              <li>2. Click it and select "Allow"</li>
              <li>3. Or go to browser settings and allow camera access for this site</li>
              <li>4. Refresh the page if needed</li>
            </ol>
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-center">
        <X className="w-12 h-12 mx-auto mb-2 text-red-500" />
        <p className="text-sm">Camera error. Please try again.</p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Take Photo</DialogTitle>
          <DialogDescription>
            Capture a photo using your device's camera
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {!isStreaming && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Starting camera...</p>
                </div>
              </div>
            )}

            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center text-white p-4">
                {renderErrorMessage()}
              </div>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="flex justify-center space-x-3">
            {isStreaming && (
              <Button onClick={capturePhoto} size="lg">
                <Camera className="w-5 h-5 mr-2" />
                Capture Photo
              </Button>
            )}
            
            {hasError && (
              <Button onClick={() => {
                setHasError(false);
                setErrorType('');
                startCamera();
              }} size="lg">
                <Camera className="w-5 h-5 mr-2" />
                Retry Camera
              </Button>
            )}
            
            <Button variant="outline" onClick={handleClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraCapture;
