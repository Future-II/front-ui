import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ExcelError } from '../../types';

interface ErrorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: ExcelError[];
  onDownloadCorrected: () => void;
}

const ErrorsModal: React.FC<ErrorsModalProps> = ({
  isOpen,
  onClose,
  errors,
  onDownloadCorrected
}) => {
  if (!isOpen) return null;

  const copyErrorToClipboard = async (err: ExcelError) => {
    try {
      await navigator.clipboard.writeText(
        `Sheet:${err.sheetIdx + 1} Row:${err.row + 1} Col:${err.col + 1} - ${err.message}`
      );
    } catch (e) {
      // ignore
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <div className="font-semibold text-lg text-gray-800">قائمة الأخطاء ({errors.length})</div>
              <div className="text-xs text-gray-500">تفاصيل الصف والعمود ونوع الخطأ</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onDownloadCorrected}
              className="px-3 py-1 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm shadow-sm"
            >
              تنزيل ملف معدل
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-700 text-sm"
            >
              إغلاق
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-auto p-6 space-y-4">
          {errors.length === 0 ? (
            <div className="text-center text-gray-500">لا توجد أخطاء</div>
          ) : (
            errors.map((err, idx) => (
              <div key={idx} className="border rounded-xl p-3 flex justify-between items-start gap-3 hover:shadow-sm transition">
                <div>
                  <div className="text-sm text-gray-700 font-medium">
                    شيت {err.sheetIdx + 1} — صف {err.row + 1} — عمود {err.col + 1}
                  </div>
                  <div className="text-sm text-red-700 mt-1">{err.message}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => copyErrorToClipboard(err)}
                    className="px-3 py-1 text-xs bg-gray-50 border border-gray-200 rounded-md"
                  >
                    نسخ
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorsModal;