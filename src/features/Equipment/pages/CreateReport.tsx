import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import UploadBlock from "../components/UploadBlock";
import { extractReportData } from "../api";

const CreateReport: React.FC = () => {
  const navigate = useNavigate();

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExcelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) setExcelFile(files[0]);
  };

  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) setPdfFile(files[0]);
  };

  const handleSave = async () => {
    if (!excelFile || !pdfFile) return;
    try {
      const response: any = await extractReportData(excelFile, [pdfFile]);
      console.log(response);
      if (response.status === "SAVED") {
        setTimeout(() => {
          setShowSuccess(true);
        }, 3500);
        navigate("/equipment/viewReports");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6">

      <div className="mt-6 space-y-6">
       
        <UploadBlock
          label="Upload Excel File"
          accept=".xlsx,.xls"
          inputId="excel-upload"
          type="excel"
          onFileChange={handleExcelChange}
        />
        {excelFile && (
          <p className="text-sm text-gray-600">
            Selected file: <span className="font-medium">{excelFile.name}</span>
          </p>
        )}

        {/* PDF Upload */}
        <UploadBlock
          label="Upload PDF File"
          accept=".pdf"
          inputId="pdf-upload"
          type="pdf"
          onFileChange={handlePdfChange}
        />
        {pdfFile && (
          <p className="text-sm text-gray-600">
            Selected file: <span className="font-medium">{pdfFile.name}</span>
          </p>
        )}

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            disabled={!excelFile || !pdfFile}
            className={`
              px-8 py-2 border rounded-sm font-semibold transition-colors
              ${excelFile && pdfFile 
                ? "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" 
                : "border-gray-300 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Save
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
          Report saved successfully
          <button
            onClick={() => setShowSuccess(false)}
            className="ml-3 text-sm underline hover:text-gray-200"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateReport;
