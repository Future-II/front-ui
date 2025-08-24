import { useState, useEffect } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthSystemProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AuthSystem = ({ onClose, onSuccess }: AuthSystemProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { 
      document.body.style.overflow = "auto"; 
    };
  }, []);

  const handleAuthSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleSwitchToLogin = () => {
    setActiveTab("login");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-end p-4 border-b">
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button 
            className={`flex-1 py-4 ${
              activeTab === "login" 
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" 
                : "text-gray-500"
            }`} 
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button 
            className={`flex-1 py-4 ${
              activeTab === "register" 
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" 
                : "text-gray-500"
            }`} 
            onClick={() => setActiveTab("register")}
          >
            Create Account
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[calc(90vh-120px)] overflow-y-auto">
          {activeTab === "login" ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <RegisterForm 
              onSuccess={handleAuthSuccess} 
              onSwitchToLogin={handleSwitchToLogin}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthSystem;