import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

import StepList from "../components/StepList";
import UploadBlock from "../components/UploadBlock";
import LoginModal from "../components/EquipmentTaqeemLogin";

import { addAssetsToReport } from "../api";

// Add CSS for shimmer animation
const shimmerStyles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .shimmer-animation {
    animation: shimmer 2s infinite linear;
  }
`;

const SuccessToast: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
       Report saved successfully
      <button
        onClick={onClose}
        className="ml-3 text-sm underline hover:text-gray-200"
      >
        Close
      </button>
    </div>
  );
};

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const circumference = 2 * Math.PI * 20; // radius = 20
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center mt-8 mb-6">
      {/* Main Progress Section */}
      <div className="relative w-full max-w-md">
        {/* Progress Bar Container */}
        <div className="relative h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          
          {/* Main Progress Fill */}
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full relative overflow-hidden transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer Effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 shimmer-animation"
            ></div>
            
            {/* Progress Dots Animation */}
            {progress > 0 && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
            )}
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="flex justify-between items-center mt-3">
          <span className="text-sm font-medium text-gray-600">Processing...</span>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-600">{Math.round(progress)}%</span>
            
            {/* Circular Progress Indicator */}
            {progress < 100 && (
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 44 44">
                  {/* Background Circle */}
                  <circle
                    cx="22"
                    cy="22"
                    r="20"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                    fill="none"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="22"
                    cy="22"
                    r="20"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-700 ease-out"
                  />
                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center Loading Dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                </div>
              </div>
            )}
            
            {/* Success Checkmark */}
            {progress === 100 && (
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Steps Indicator */}
      <div className="flex items-center justify-center space-x-6 mt-6">
        {[
          { step: 1, label: 'Upload', threshold: 20 },
          { step: 2, label: 'Validate', threshold: 50 },
          { step: 3, label: 'Process', threshold: 80 },
          { step: 4, label: 'Complete', threshold: 100 }
        ].map(({ step, label, threshold }) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ${
              progress >= threshold 
                ? 'bg-blue-500 text-white shadow-lg scale-110' 
                : progress >= threshold - 20 
                  ? 'bg-blue-100 text-blue-600 animate-pulse' 
                  : 'bg-gray-200 text-gray-400'
            }`}>
              {progress >= threshold ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step
              )}
            </div>
            <span className={`text-xs mt-1 transition-colors duration-300 ${
              progress >= threshold ? 'text-blue-600 font-medium' : 'text-gray-400'
            }`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------- Main Component --------------------
const EquipmentReport: React.FC = () => {
  const { t } = useTranslation();

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [showReportIdForm, setShowReportIdForm] = useState(false);
  const [reportId, setReportId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const requestRef = useRef<Promise<any> | null>(null);

  const steps = [
    { number: 1, label: `${t("equipment.steps.1.label")}` },
    { number: 2, label: `${t("equipment.steps.2.label")}` },
    { number: 3, label: `${t("equipment.steps.3.label")}` },
    { number: 4, label: `${t("equipment.steps.4.label")}` },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setExcelFile(files[0]);
    }
  };

  const handleContinue = () => setShowReportIdForm(true);

  const simulateProgress = () => {
    // Step progression
    setCurrentStep(1);
    setTimeout(() => setCurrentStep(2), 1500);
    setTimeout(() => setCurrentStep(3), 3000);

    // Step 4 + progress bar animation
    setTimeout(() => {
      setCurrentStep(4);
      let current = 0;
      const interval = setInterval(() => {
        current += 2;
        if (current >= 85) {
          current = 85;
          clearInterval(interval);
        }
        setProgress(current);
      }, 100);
    }, 2500);
  };

  const handleSubmit = async () => {
    if (!excelFile) return;

    try {
      simulateProgress(); // run fake UI

      // Send backend request
      requestRef.current = addAssetsToReport(reportId, excelFile);
      const response = await requestRef.current;
      console.log(response)

      if (response.status === "SAVED") {
        // Wait for animation to finish (align with fake progression)
        setTimeout(() => {
          setProgress(100);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }, 3500);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!loggedIn) {
    return <LoginModal isOpen={true} onClose={() => {}} setIsLoggedIn={setLoggedIn} />;
  }

  return (
    <div>
      {/* Inject CSS styles */}
      <style>{shimmerStyles}</style>
      
      <StepList steps={steps} activeStep={currentStep} />

      <div className="mt-6 max-w-md mx-auto">
        {showReportIdForm ? (
          <>
            {currentStep === 4 && <ProgressBar progress={progress} />}
            <label className="block mt-10 mb-2 font-medium text-gray-700">Report ID</label>
            <input
              type="text"
              value={reportId}
              onChange={(e) => setReportId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter report ID"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmit}
                className="px-8 py-2 border border-blue-600 text-blue-600 rounded-sm transition-colors font-semibold hover:bg-blue-600 hover:text-white"
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <>
            <UploadBlock
              label="Upload your asset data file"
              accept=".xlsx,.xls"
              inputId="excel-upload"
              type="excel"
              onFileChange={handleFileChange}
            />
            {excelFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: <span className="font-medium">{excelFile.name}</span>
              </p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleContinue}
                className="px-8 py-2 border border-blue-600 text-blue-600 rounded-sm transition-colors font-semibold hover:bg-blue-600 hover:text-white"
              >
                {t("equipment.button")}
              </button>
            </div>
          </>
        )}
      </div>

      {showSuccess && <SuccessToast onClose={() => setShowSuccess(false)} />}
    </div>
  );
};

export default EquipmentReport;