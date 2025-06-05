
import React, { useRef, useCallback, useState } from 'react';
import { Camera, X, AlertCircle, RefreshCw } from 'lucide-react';
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
  const [isInitializing, setIsInitializing] = useState(false);

  const stopCamera = useCallback(() => {
    if (stream) {
      console.log('Stopping camera stream...');
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.kind);
      });
      setStream(null);
      setIsStreaming(false);
      setHasError(false);
      setErrorType('');
      setIsInitializing(false);
      console.log('Camera stream stopped');
    }
  }, [stream]);

  const checkCameraPermission = async (): Promise<boolean> => {
    try {
      // Check if permissions API is available
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        console.log('Camera permission status:', permission.state);
        return permission.state === 'granted';
      }
      return true; // Assume granted if permissions API not available
    } catch (error) {
      console.log('Permissions API not available, proceeding with camera request');
      return true;
    }
  };

  const startCamera = useCallback(async () => {
    if (stream) {
      console.log('Camera already started, skipping...');
      return;
    }

    setIsInitializing(true);
    setHasError(false);
    setErrorType('');

    try {
      console.log('Checking camera permission...');
      
      // First check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      console.log('Requesting camera access...');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        }
      });
      
      console.log('Camera access granted, setting up stream...');
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready
        await new Promise((resolve, reject) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              console.log('Video metadata loaded');
              resolve(true);
            };
            videoRef.current.onerror = (error) => {
              console.error('Video error:', error);
              reject(error);
            };
            videoRef.current.play().catch(reject);
          }
        });
        
        setIsStreaming(true);
        setIsInitializing(false);
        console.log('Camera stream started successfully');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasError(true);
      setIsInitializing(false);
      
      if (error instanceof Error) {
        setErrorType(error.name);
        console.log('Error type:', error.name);
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          toast.error('Camera access denied. Please allow camera access and try again.');
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          toast.error('No camera found on this device.');
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          toast.error('Camera is being used by another application. Please close other apps using the camera.');
        } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
          toast.error('Camera constraints not supported. Trying basic settings...');
          // Try with basic constraints
          try {
            const basicStream = await navigator.mediaDevices.getUserMedia({
              video: true
            });
            setStream(basicStream);
            if (videoRef.current) {
              videoRef.current.srcObject = basicStream;
              await videoRef.current.play();
              setIsStreaming(true);
              setHasError(false);
              setErrorType('');
            }
          } catch (basicError) {
            console.error('Basic camera access also failed:', basicError);
          }
        } else {
          toast.error('Error accessing camera: ' + error.message);
        }
      } else {
        toast.error('Unknown error accessing camera. Please try again.');
      }
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

  const retryCamera = useCallback(() => {
    console.log('Retrying camera access...');
    stopCamera();
    setTimeout(() => {
      startCamera();
    }, 500);
  }, [stopCamera, startCamera]);

  React.useEffect(() => {
    if (isOpen && !stream && !hasError && !isInitializing) {
      console.log('Dialog opened, starting camera...');
      startCamera();
    } else if (!isOpen) {
      console.log('Dialog closed, stopping camera...');
      stopCamera();
    }
  }, [isOpen, startCamera, stopCamera, stream, hasError, isInitializing]);

  React.useEffect(() => {
    return () => {
      console.log('Component unmounting, cleaning up...');
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const renderErrorMessage = () => {
    if (errorType === 'NotAllowedError' || errorType === 'PermissionDeniedError') {
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
    
    if (errorType === 'NotFoundError' || errorType === 'DevicesNotFoundError') {
      return (
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
          <h3 className="font-medium mb-2">No Camera Found</h3>
          <p className="text-sm text-muted-foreground">No camera device was detected on this device.</p>
        </div>
      );
    }
    
    return (
      <div className="text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
        <h3 className="font-medium mb-2">Camera Error</h3>
        <p className="text-sm text-muted-foreground mb-2">
          {errorType === 'NotReadableError' ? 'Camera is in use by another application' : 'Unable to access camera'}
        </p>
        <p className="text-xs text-muted-foreground">Try closing other apps that might be using the camera</p>
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
            
            {isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                  <p>Starting camera...</p>
                </div>
              </div>
            )}

            {!isStreaming && !hasError && !isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Preparing camera...</p>
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
            {isStreaming && !isInitializing && (
              <Button onClick={capturePhoto} size="lg">
                <Camera className="w-5 h-5 mr-2" />
                Capture Photo
              </Button>
            )}
            
            {hasError && (
              <Button onClick={retryCamera} size="lg">
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
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
