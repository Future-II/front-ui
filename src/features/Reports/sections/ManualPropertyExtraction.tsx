import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import UploadBlock from "../components/UploadBlock";
import Stepper2 from "../components/Stepper manual";
import type { WorkflowStep } from "../components/types";
import { retryUpload, uploadFiles } from "../api";
import LoginModal from "../components/TaqeemLoginModal";
import ResultModal from "../components/ResultModal";

const ManualPropertyExtraction: React.FC = () => {
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState<WorkflowStep>("verify");
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showPulsingLoader, setShowPulsingLoader] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [failedRecords, setFailedRecords] = useState(0);
  const [batchId, setBatchId] = useState<string | null>(null);

  const uploadRequestRef = useRef<Promise<any> | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "excel" | "pdf"
  ) => {
    const files = event.target.files;
    if (files) {
      if (type === "excel") {
        setExcelFile(files[0]);
      } else if (type === "pdf") {
        setPdfFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
      }
    }
  };

  const simulateProgress = async () => {
    setCurrentStep("verify");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setCurrentStep("prepare");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setCurrentStep("upload");
    for (let progress = 0; progress <= 85; progress += 17) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setUploadProgress(progress);
    }

    setIsPaused(true);
    setShowPulsingLoader(true);
  };

  const handleSubmit = async () => {
    if (!excelFile || pdfFiles.length === 0) {
      alert("Please select both an Excel file and at least one PDF file.");
      return;
    }

    try {
      setIsSubmitting(true);
      setShowPulsingLoader(false);
      simulateProgress();

      uploadRequestRef.current = uploadFiles(excelFile, pdfFiles);
      const data = await uploadRequestRef.current;

      console.log("Upload successful:", data);

      setUploadProgress(100);
      setShowPulsingLoader(false);
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (data.status === "SUCCESS") {
        setCurrentStep("completed");
        setBatchId(data.batchId || null);
        setFailedRecords(data.failed_records || 0);
        setShowResultModal(true);
      } else {
        alert("Upload completed but there might be an issue with form processing.");
        setCurrentStep("verify");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("An error occurred while uploading the files. Please try again.");
      setCurrentStep("verify");
      setShowPulsingLoader(false);
    } finally {
      setIsSubmitting(false);
      setIsPaused(false);
      setUploadProgress(0);
      uploadRequestRef.current = null;
    }
  };

  const handleRetry = async (batchId: string) => {
    try {
      console.log("Retrying batch:", batchId);
      setShowResultModal(false);
      setIsSubmitting(true);

      const retryData = await retryUpload(batchId);

      if (retryData.status === "SUCCESS") {
        setFailedRecords(retryData.failed_records || 0);
        setShowResultModal(true);
      }
    } catch (error) {
      console.error("Retry failed:", error);
      alert("Retry failed. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsSubmitting(false);
    setIsPaused(false);
    setShowPulsingLoader(false);
    setUploadProgress(0);
    setCurrentStep("verify");
  };

  if (!loggedIn) {
    return (
      <LoginModal
        isOpen={true}
        onClose={() => { /* do nothing */ }}
        setIsLoggedIn={setLoggedIn}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("mekyas.manual.title") || "Manually submit a report"}
          </h1>
          <p className="text-gray-600">
            {t("mekyas.manual.subtitle") ||
              "Manually upload and send property reports to the Authority's system"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/reports/mekyas"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("Back to Scale Reports") || "Back to Scale Reports"}
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <div className="mb-6 flex justify-center">
            <Stepper2
              current={currentStep}
              loading={currentStep === "upload" && (showPulsingLoader || !isPaused)}
            />
          </div>

          {currentStep === "upload" && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>
                  {isPaused ? "Finalizing upload..." : "Uploading..."}
                  {showPulsingLoader && " (Please wait)"}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 relative">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                {showPulsingLoader && (
                  <div className="absolute inset-0">
                    <div
                      className="bg-blue-400 h-2 rounded-full animate-pulse"
                      style={{ width: "85%", opacity: 0.7 }}
                    ></div>
                  </div>
                )}
              </div>
              {showPulsingLoader && (
                <div className="flex justify-center space-x-1 mt-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              )}
              {isPaused && !showPulsingLoader && (
                <p className="text-xs text-gray-500 mt-1">Almost done...</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {t("mekyas.manual.title") || "Manually submit a report"}
              </h3>
              <p className="text-gray-600">
                {t("mekyas.manual.subtitle") ||
                  "Upload the property report files from your device to send them to the Authority's system."}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-4">
              <UploadBlock
                label={
                  t("mekyas.manual.uploadExcel") ||
                  "Drag or click to upload an Excel file."
                }
                accept=".xlsx,.xls"
                inputId="excel-upload"
                type="excel"
                onFileChange={handleFileChange}
                disabled={isSubmitting}
              />
              {excelFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected Excel File: {excelFile.name}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-4">
              <UploadBlock
                label={
                  t("mekyas.manual.uploadPdf") ||
                  "Drag or click to upload linked PDF files."
                }
                accept=".pdf"
                inputId="pdf-upload"
                type="pdf"
                multiple
                onFileChange={handleFileChange}
                disabled={isSubmitting}
              />
              {pdfFiles.length > 0 && (
                <ul className="mt-2 text-sm text-gray-600">
                  {pdfFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-2 justify-end">
            {isSubmitting ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  disabled
                  className="px-4 py-2 bg-blue-400 text-white rounded-lg cursor-not-allowed flex items-center gap-2"
                >
                  {showPulsingLoader ? (
                    <>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      Processing...
                    </>
                  ) : (
                    "Uploading..."
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!excelFile || pdfFiles.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Submit Report
              </button>
            )}
          </div>
        </div>
      </div>

      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        failedRecords={failedRecords}
        batchId={batchId || ""}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default ManualPropertyExtraction;
