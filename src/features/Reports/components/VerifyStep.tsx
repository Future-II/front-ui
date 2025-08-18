import React from 'react';
import { ChevronLeft } from 'lucide-react';
import type { Report, WorkflowStep } from './types';

type Props = {
  reportData: Report[];
  selectedRows: number[];
  verificationStatus: Record<number, boolean>;
  toggleVerificationStatus: (rowIndex: number) => void;
  setCurrentStep: (s: WorkflowStep) => void;
  startSendingProcess: () => void;
};

const VerifyStep: React.FC<Props> = ({
  reportData,
  selectedRows,
  verificationStatus,
  toggleVerificationStatus,
  setCurrentStep,
  startSendingProcess
}) => {
  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => setCurrentStep('select')}
          className="flex items-center text-blue-600 hover:text-blue-800 ml-4"
        >
          <ChevronLeft className="h-5 w-5 ml-1" />
          <span>العودة للاختيار</span>
        </button>
        <h3 className="text-lg font-medium text-gray-900">التحقق من بيانات التقارير</h3>
      </div>

      <div className="space-y-6 mb-6">
        {selectedRows.map((rowIndex) => {
          const report = reportData[rowIndex];
          return (
            <div key={rowIndex} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-medium text-lg text-gray-900">{report.reportName}</h4>
                  <p className="text-sm text-gray-500">{report.referenceNo}</p>
                </div>

                <div className="flex items-center">
                  <span
                    className={`mr-2 text-sm ${
                      verificationStatus[rowIndex] ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {verificationStatus[rowIndex] ? 'تم التحقق' : 'لم يتم التحقق'}
                  </span>

                  <div className="relative inline-block w-10 ml-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id={`verification-${rowIndex}`}
                      className="sr-only"
                      checked={!!verificationStatus[rowIndex]}
                      onChange={() => toggleVerificationStatus(rowIndex)}
                    />
                    <label
                      htmlFor={`verification-${rowIndex}`}
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        verificationStatus[rowIndex] ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute block h-5 w-5 rounded-full bg-white border border-gray-300 top-0.5 transition-transform duration-200 ease-in-out ${
                          verificationStatus[rowIndex]
                            ? 'right-0.5 transform -translate-x-0'
                            : 'right-7'
                        }`}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Row label="المصدر:" value={report.source} />
                  <Row label="نوع المعدة:" value={report.equipmentType} />
                  <Row label="الموقع:" value={report.location} />
                </div>
                <div className="space-y-2">
                  <Row label="الكمية:" value={report.quantity} />
                  <Row label="الحالة:" value={report.status} />
                  <Row label="التاريخ:" value={report.date} />
                </div>
              </div>

              {!verificationStatus[rowIndex] && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">يرجى التحقق من بيانات هذا التقرير قبل المتابعة</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ml-3"
          onClick={() => setCurrentStep('select')}
        >
          العودة
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={startSendingProcess}
          disabled={Object.values(verificationStatus).some((v) => !v)}
        >
          بدء عملية الإرسال
        </button>
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

export default VerifyStep;
