import { useState, useEffect } from "react";
import { Shield, CheckCircle, FileText } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import LanguageToggle from "../../Common/LanguageToggle";
import { useTranslation } from "react-i18next";


interface AuthSystemProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AuthSystem = ({ onClose, onSuccess }: AuthSystemProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { t } = useTranslation();

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
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl h-[75vh] flex overflow-hidden">

        {/* //LanguageToggle */}
        <div className="mt-2 ms-2 bg-gray-50  justify-center">
        <LanguageToggle/>
        </div>
        {/* Left Side - System Information */}
        <div className="flex-1 bg-gray-50 p-12 flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-10 text-center">
            <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
               {t("logintranslator.realstate.title")}
            </h1>
            <p className="text-gray-600 text-center max-w-md mx-auto">
               {t("logintranslator.realstate.description")}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6 max-w-md mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t("logintranslator.realstate.title1")}</h3>
                <p className="text-sm text-gray-600">{t("logintranslator.realstate.description1")}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t("logintranslator.realstate.title2")}</h3>
                <p className="text-sm text-gray-600">{t("logintranslator.realstate.description2")}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t("logintranslator.realstate.title3")}</h3>
                <p className="text-sm text-gray-600">{t("logintranslator.realstate.description3")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-96 bg-white flex flex-col border-l border-green-200 ">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-6 pt-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <button 
              className={`flex-1 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === "login" 
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`} 
              onClick={() => setActiveTab("login")}
            >
              {t("logintranslator.login.title")}
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === "register" 
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`} 
              onClick={() => setActiveTab("register")}
            >
              {t("logintranslator.register.title")}
            </button>
          </div>

          {/* Form Content */}
          <div className={`flex-1 p-6 ${activeTab === "login" ? "flex flex-col justify-center" : "overflow-y-auto"}`}>
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
    </div>
  );
};

export default AuthSystem;