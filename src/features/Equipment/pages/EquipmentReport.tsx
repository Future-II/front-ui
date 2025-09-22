import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import StepList from "../components/StepList";
import UploadBlock from "../components/UploadBlock";
import LoginModal from "../components/EquipmentTaqeemLogin";

import { uploadAssetsToDB } from "../api";

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
  return (
    <div className="flex items-center mt-6">
      <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {/* Circling loader */}
      {progress < 100 && (
        <div className="ml-2 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      )}
    </div>
  );
};


const EquipmentReport: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();


  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [showReportIdForm, setShowReportIdForm] = useState(false);
  const [reportId, setReportId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);


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

  const handleSubmit = async () => {
    if (!excelFile) return;
    try {
      const response = await uploadAssetsToDB(reportId, excelFile);
      console.log(response);
      if (response.status === "SAVED") {
        setTimeout(() => {
          setProgress(100);
          setShowSuccess(true);
        }, 3500);
        navigate('/equipment/allReports');
      }
    }
    catch (error) {
      console.error("Error:", error);
    }
  };

  if (!loggedIn) {
    return <LoginModal isOpen={true} onClose={() => {}} setIsLoggedIn={setLoggedIn} />;
  }

  return (
    <div>
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
