
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-accent/10 p-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-6 text-7xl font-bold text-primary">404</div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find the page you were looking for. Let us help you get back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/analysis">Skin Analysis</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/chat">Chat with AI</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
