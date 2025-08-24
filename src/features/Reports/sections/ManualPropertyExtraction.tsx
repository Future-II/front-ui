import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import UploadBlock from "../components/UploadBlock";
import Stepper2 from "../components/Stepper manual";
import type { WorkflowStep } from "../components/types";
import { uploadFiles } from "../api";
import LoginModal from "../components/TaqeemLoginModal";

const ManualPropertyExtraction: React.FC = () => {
  const { t } = useTranslation();

  const [currentStep] = useState<WorkflowStep>("select");
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);


  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "excel" | "pdf"
  ) => {
    const files = event.target.files;
    if (files) {
      if (type === "excel") {
        setExcelFile(files[0]);
      } else if (type === "pdf") {
        setPdfFiles((prevFiles) => {
          const newFiles = Array.from(files);
          return [...prevFiles, ...newFiles];
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!excelFile || pdfFiles.length === 0) {
      alert("Please select both an Excel file and at least one PDF file.");
      return;
    }

    try {
      const data = await uploadFiles(excelFile, pdfFiles);
      console.log("Upload successful:", data);
      alert("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("An error occurred while uploading the files. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("mekyas.manual.title") || "Manually submit a report"}
          </h1>
          <p className="text-gray-600">
            {t("mekyas.manual.subtitle2") ||
              "Manually upload and send property reports to the Authority’s system"}
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
            <Stepper2 current={currentStep} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {t("mekyas.manual.title") || "Manually submit a report"}
              </h3>
              <p className="text-gray-600">
                {t("mekyas.manual.subtitle") ||
                  "Upload the property report files from your device to send them to the Authority’s system."}
              </p>
            </div>
            <button
              onClick={handleOpen}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t("taqeem.loginButton") || "Login"}
            </button>
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

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t("mekyas.manual.submit") || "Submit Report"}
            </button>
          </div>
        </div>
      </div>
      <LoginModal isOpen={isOpen} onClose={handleClose} />
    </div>
  );
};

export default ManualPropertyExtraction;
