import React from 'react';

interface ActionButtonsProps {
  onDownloadCorrected: () => void;
  onSave: () => void;
  excelFile: File | null;
  pdfFile: File | null;
  isExcelValid: boolean;
  excelErrors: any[];
  refreshing: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDownloadCorrected,
  onSave,
  excelFile,
  pdfFile,
  isExcelValid,
  excelErrors,
  refreshing
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
      <button
        onClick={onDownloadCorrected}
        disabled={!excelFile || isExcelValid}
        className={`px-5 py-2 rounded-full font-semibold transition-shadow shadow-lg ${
          excelFile
            ? "bg-yellow-100 border-yellow-400 text-yellow-800 hover:bg-yellow-200"
            : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        تنزيل ملف معدل
      </button>

      <button
        onClick={onSave}
        disabled={!excelFile || !pdfFile || excelErrors.length > 0 || refreshing}
        className={`px-6 py-2 rounded-full font-semibold transition transform shadow-lg ${
          excelFile && pdfFile && excelErrors.length === 0
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {refreshing ? "جاري الحفظ..." : "حفظ التقرير"}
      </button>
    </div>
  );
};

export default ActionButtons;