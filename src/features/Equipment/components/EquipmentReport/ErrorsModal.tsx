import React from 'react';
import { EquipmentExcelError } from '../../types';

interface ErrorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: EquipmentExcelError[];
  onDownloadCorrected: () => void;
  excelFile: File | null;
  isExcelValid: boolean;
}

const ErrorsModal: React.FC<ErrorsModalProps> = ({
  isOpen,
  onClose,
  errors,
  onDownloadCorrected,
  excelFile,
  isExcelValid
}) => {
  if (!isOpen) return null;

  const copyErrorToClipboard = async (err: EquipmentExcelError) => {
    try {
      await navigator.clipboard.writeText(
        `Sheet:${err.sheetIdx + 1} Row:${err.row + 1} Col:${err.col + 1} - ${err.message}`
      );
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">!</span>
            </div>
            <div>
              <div className="font-semibold text-lg text-gray-800">Excel Validation Errors ({errors.length})</div>
              <div className="text-xs text-gray-500">Details of row, column and error type</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onDownloadCorrected}
              disabled={!excelFile || isExcelValid}
              className={`px-5 py-2 rounded-lg font-semibold transition-colors ${
                excelFile && !isExcelValid
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Download Corrected File
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 text-sm"
            >
              Close
            </button>
          </div>
        </div>
        <div className="max-h-[60vh] overflow-auto p-6 space-y-4">
          {errors.length === 0 ? (
            <div className="text-center text-gray-500">No errors found</div>
          ) : (
            errors.map((err, idx) => (
              <div key={idx} className="border rounded-lg p-4 flex justify-between items-start gap-3 hover:shadow-sm transition">
                <div>
                  <div className="text-sm text-gray-700 font-medium">
                    Sheet {err.sheetIdx + 1} — Row {err.row + 1} — Column {err.col + 1}
                  </div>
                  <div className="text-sm text-red-700 mt-1">{err.message}</div>
                </div>
                <button
                  onClick={() => copyErrorToClipboard(err)}
                  className="px-3 py-1 text-xs bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Copy
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorsModal;