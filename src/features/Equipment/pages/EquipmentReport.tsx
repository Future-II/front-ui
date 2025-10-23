import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Components
import StepList from "../components/StepList";
import DownloadFirstRowExcel from "../components/DownloadFirstRowExcel";
import SuccessToast from "../components/EquipmentReport/SuccessToast";
import Step1FileUpload from "../components/EquipmentReport/Step1FileUpload";
import Step2ReportId from "../components/EquipmentReport/Step2ReportId";
import ErrorsModal from "../components/EquipmentReport/ErrorsModal";

// Utils
import { handleExcelFile, downloadCorrectedExcel } from "../utils/excelProcessing";
import { 
  getEquipmentExcelErrors, 
  isEquipmentExcelValid 
} from "../utils/onlyAssetValidation";

// Types
import { EquipmentExcelError } from "../types";

// API
import { uploadAssetsToDB } from "../api";

const EquipmentReport: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  // Excel validation states
  const [excelDataSheets, setExcelDataSheets] = useState<any[][][]>([]);
  const [excelError, setExcelError] = useState<string>("");
  const [excelErrors, setExcelErrors] = useState<EquipmentExcelError[]>([]);
  const [showValidationSuccess, setShowValidationSuccess] = useState(false);
  const [errorsModalOpen, setErrorsModalOpen] = useState(false);
  const [reportId, setReportId] = useState("");
  const [isFileValidated, setIsFileValidated] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  const steps = [
    { number: 1, label: `${t("equipment.steps.1.label")}` },
    { number: 2, label: `${t("equipment.steps.2.label")}` },
    { number: 3, label: `${t("equipment.steps.3.label")}` },
    { number: 4, label: `${t("equipment.steps.4.label")}` },
  ];

  // Event Handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setExcelFile(files[0]);
      setIsFileValidated(false);
      setShowValidationSuccess(false);
      setExcelErrors([]);
      setHasValidated(false);
      
      handleExcelFile(
        files[0],
        (sheetsData) => {
          setExcelDataSheets(sheetsData);
          setExcelError("");
        },
        (error) => setExcelError(error)
      );
    }
  };

  const handleValidateFile = () => {
    if (!excelFile) return;
    
    setIsValidating(true);
    setHasValidated(true);
    
    setTimeout(() => {
      const exErrors = getEquipmentExcelErrors(excelDataSheets);
      setExcelErrors(exErrors);
      const isValid = exErrors.length === 0;
      setShowValidationSuccess(isValid);
      setIsFileValidated(isValid);
      setIsValidating(false);
      
      if (!isValid) {
        setErrorsModalOpen(true);
      }
    }, 1000);
  };

  const handleExtractAndStore = async () => {
    if (!excelFile || !isExcelValid || !reportId.trim()) return;
    
    setIsExtracting(true);
    
    try {
      const response = await uploadAssetsToDB(reportId, excelFile);
      console.log(response);
      if (response.status === "SAVED") {
        setIsExtracting(false);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsExtracting(false);
    }
  };

  const handleDownloadCorrectedExcel = () => {
    downloadCorrectedExcel(excelDataSheets, excelErrors, isExcelValid);
  };

  // Derived values
  const isExcelValid = isEquipmentExcelValid(excelDataSheets);

  return (
    <div>
      <StepList steps={steps} activeStep={currentStep} />
      <div className="mt-5" ></div>
      <DownloadFirstRowExcel filename="/ID.xlsx" />

      <div className="mt-6 max-w-md mx-auto">
        {/* Step 1: File Selection */}
        {currentStep === 1 && (
          <Step1FileUpload
            excelFile={excelFile}
            onFileChange={handleFileChange}
            onValidateFile={handleValidateFile}
            onContinue={() => setCurrentStep(2)}
            isValidating={isValidating}
            isFileValidated={isFileValidated}
            hasValidated={hasValidated}
            showValidationSuccess={showValidationSuccess}
            excelError={excelError}
            excelErrors={excelErrors}
            excelDataSheets={excelDataSheets}
          />
        )}

        {/* Step 2: Report ID and Data Extraction */}
        {currentStep === 2 && (
          <Step2ReportId
            reportId={reportId}
            onReportIdChange={setReportId}
            onBack={() => setCurrentStep(1)}
            onExtractAndStore={handleExtractAndStore}
            isExtracting={isExtracting}
          />
        )}
      </div>

      {showSuccess && (
        <SuccessToast 
          onClose={() => {
            setShowSuccess(false);
            navigate("/equipment/allReports");
          }} 
          reportId={reportId}
        />
      )}

      <ErrorsModal
        isOpen={errorsModalOpen}
        onClose={() => setErrorsModalOpen(false)}
        errors={excelErrors}
        onDownloadCorrected={handleDownloadCorrectedExcel}
        excelFile={excelFile}
        isExcelValid={isExcelValid}
      />
    </div>
  );
};

export default EquipmentReport;