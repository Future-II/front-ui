import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import HeaderSection from "../components/CreateReport/HeaderSection";
import FileUploadSection from "../components/CreateReport/FileUploadSection";
import ActionButtons from "../components/CreateReport/ActionButtons";
import ValidationSummary from "../components/CreateReport/ValidationSummary";
import DataTables from "../components/CreateReport/DataTables";
import ErrorsModal from "../components/CreateReport/ErrorsModal";

// Utils
import { handleExcelFile, downloadCorrectedExcel } from "../utils/excelProcessing";
import {
  getExcelErrors,
  getFinalValueSum,
  isReportValueEqualToAssetsSum,
  hasAllRequiredHeaders,
  hasEmptyFields,
  hasFractionInFinalValue,
  hasInvalidPurposeId,
  hasInvalidValuePremiseId
} from "../utils/excelValidation";

// Types
import { ExcelError } from "../types";

// API
import { extractReportData } from "../api";

const CreateReport: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [excelDataSheets, setExcelDataSheets] = useState<any[][][]>([]);
  const [excelError, setExcelError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showTables, setShowTables] = useState(false);
  const [errorsModalOpen, setErrorsModalOpen] = useState(false);
  const [excelErrors, setExcelErrors] = useState<ExcelError[]>([]);
  const [showValidationSuccess, setShowValidationSuccess] = useState(false);

  // Event Handlers
  const handleExcelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setExcelFile(files[0]);
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

  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setPdfFile(files[0]);
    }
  };

  const handleDownloadCorrectedExcel = () => {
    downloadCorrectedExcel(excelDataSheets, excelErrors, isExcelValid);
  };

  const handleSave = async () => {
    if (!excelFile || !pdfFile) return;
    if (excelErrors.length > 0) {
      setExcelError("يوجد أخطاء في البيانات، يرجى فتح قائمة الأخطاء وتصحيحها قبل الحفظ.");
      setErrorsModalOpen(true);
      return;
    }
    
    try {
      setRefreshing(true);
      const response: any = await extractReportData(excelFile, [pdfFile]);
      setRefreshing(false);
      
      if (response?.status === "FAILED" && response.error) {
        setExcelError(response.error);
        return;
      }
      
      if (response?.status === "SAVED" || response?.status === "SUCCESS") {
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/equipment/viewReports");
        }, 1200);
      }
    } catch (error) {
      console.error("Error:", error);
      setRefreshing(false);
      setExcelError("حدث خطأ أثناء حفظ التقرير. حاول مرة أخرى.");
    }
  };

  // Derived values
  const finalValueSum = useMemo(() => getFinalValueSum(excelDataSheets), [excelDataSheets]);
  const isReportValueValid = useMemo(
    () => isReportValueEqualToAssetsSum(excelDataSheets, finalValueSum),
    [excelDataSheets, finalValueSum]
  );

  const isExcelValid =
    excelDataSheets.length > 0 &&
    hasAllRequiredHeaders(excelDataSheets) &&
    !hasEmptyFields(excelDataSheets).hasEmpty &&
    !hasFractionInFinalValue(excelDataSheets) &&
    !hasInvalidPurposeId(excelDataSheets) &&
    !hasInvalidValuePremiseId(excelDataSheets) &&
    isReportValueValid;

  // Effects
  useEffect(() => {
    if (excelErrors.length === 0 && excelDataSheets.length > 0) {
      // Trigger re-render for save button
    }
  }, [excelErrors, excelDataSheets]);

  useEffect(() => {
    if (!excelDataSheets || excelDataSheets.length === 0) {
      setExcelErrors([]);
      return;
    }
    
    const exErrors = getExcelErrors(excelDataSheets);

    // Add report value mismatch error if exists
    if (!isReportValueValid) {
      const sheet1 = excelDataSheets[0];
      if (sheet1 && sheet1.length >= 2) {
        const valueIdx = sheet1[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "value");
        if (valueIdx !== -1) {
          exErrors.push({
            sheetIdx: 0,
            row: 1,
            col: valueIdx,
            message: "القيمة النهائية للتقرير لا تساوي مجموع القيم النهائية للأصول"
          });
        }
      }
    }

    setExcelErrors(exErrors);
    setShowValidationSuccess(exErrors.length === 0 && excelDataSheets.length > 0);

    if (exErrors.length > 0) {
      setErrorsModalOpen(true);
    }
  }, [excelDataSheets, isReportValueValid]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 pb-16">
      <div className="max-w-4xl mx-auto pt-10 px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100 overflow-hidden transition-all duration-300">
          
          <HeaderSection
            showTables={showTables}
            setShowTables={setShowTables}
            errorsModalOpen={errorsModalOpen}
            setErrorsModalOpen={setErrorsModalOpen}
            excelErrors={excelErrors}
          />

          <FileUploadSection
            onExcelChange={handleExcelChange}
            onPdfChange={handlePdfChange}
            excelFile={excelFile}
            pdfFile={pdfFile}
          />

          <ActionButtons
            onDownloadCorrected={handleDownloadCorrectedExcel}
            onSave={handleSave}
            excelFile={excelFile}
            pdfFile={pdfFile}
            isExcelValid={isExcelValid}
            excelErrors={excelErrors}
            refreshing={refreshing}
          />

          <ValidationSummary
            finalValueSum={finalValueSum}
            showValidationSuccess={showValidationSuccess}
            excelErrors={excelErrors}
          />

          {excelError && (
            <div className="mt-3 text-center text-red-600 font-semibold">
              {excelError}
            </div>
          )}

          <DataTables
            showTables={showTables}
            excelDataSheets={excelDataSheets}
            excelErrors={excelErrors}
          />

          <div className="mt-6 text-center text-sm text-gray-500">
            {excelDataSheets.length > 0 ? `${excelDataSheets.length} شيت في الملف` : "لم يتم رفع ملف بعد"}
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg z-50 animate-fadeIn">
          تم حفظ التقرير بنجاح
          <button onClick={() => setShowSuccess(false)} className="mr-3 text-sm underline">إغلاق</button>
        </div>
      )}

      <ErrorsModal
        isOpen={errorsModalOpen}
        onClose={() => setErrorsModalOpen(false)}
        errors={excelErrors}
        onDownloadCorrected={handleDownloadCorrectedExcel}
      />
    </div>
  );
};

export default CreateReport;