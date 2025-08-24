import { useState, useEffect } from "react";
import AuthSystem from "./Layout/login/AuthSystem";
import { api } from "../utils/api";

interface GlobalAuthGuardProps {
  children: JSX.Element;
}

export default function GlobalAuthGuard({ children }: GlobalAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setIsAuthenticated(false);
      setShowAuthModal(true);
      return;
    }

    try {
      // Verify token with backend
      const response = await api.get("/users/verify");
      
      if (response.data.success) {
        setIsAuthenticated(true);
        // Update user data in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        throw new Error("Token verification failed");
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      // Clear invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleAuthClose = () => {
    // Don't allow closing without authentication
    // User must authenticate to proceed
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show auth modal if not authenticated
  if (!isAuthenticated && showAuthModal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthSystem 
          onClose={handleAuthClose}
          onSuccess={handleAuthSuccess}
        />
        {/* Optional: Show a background page */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to Real Estate System
            </h1>
            <p className="text-gray-600">
              Please sign in or create an account to continue
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Return protected content if authenticated
  return children;
}