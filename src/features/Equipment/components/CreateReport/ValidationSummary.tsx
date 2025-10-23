import React from 'react';
import { requiredHeaders } from '../../types';

interface ValidationSummaryProps {
  finalValueSum: number;
  showValidationSuccess: boolean;
  excelErrors: any[];
}

const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  finalValueSum,
  showValidationSuccess,
  excelErrors
}) => {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {finalValueSum > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-lg p-3 shadow-inner">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <p className="text-sm text-green-700 font-semibold">إجمالي القيم النهائية للأصول</p>
                <p className="text-lg font-extrabold text-blue-900">{finalValueSum.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 italic">مجموع القيم من شيتات الأصول</div>
          </div>
        </div>
      )}

      {showValidationSuccess && (
        <div className="bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-lg p-3 shadow-inner">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-700">الملف صالح</p>
              <p className="text-sm text-gray-600">لا توجد أخطاء في الملف، جاهز للحفظ</p>
            </div>
          </div>
        </div>
      )}

      {excelErrors.some(error => error.message.includes('العناوين المطلوبة')) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-inner col-span-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-semibold text-yellow-700">العناوين المطلوبة</p>
              <div className="text-sm text-gray-600 mt-1">
                <p><strong>الشيت 1:</strong> {requiredHeaders[0].join(', ')}</p>
                <p><strong>الشيت 2 و 3:</strong> {requiredHeaders[1].join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationSummary;