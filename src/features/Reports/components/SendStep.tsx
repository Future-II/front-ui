import React from 'react';
import ProgressBar from '../../../shared/components/Common/ProgressBar';
import type { ProgressStage } from './types';

type Props = {
  progressPercentage: number;
  progressStage: ProgressStage;
  cancelProcess: () => void;
};

const SendStep: React.FC<Props> = ({ progressPercentage, progressStage, cancelProcess }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">جاري إرسال البيانات</h3>

      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            يرجى الانتظار حتى اكتمال عملية إرسال البيانات إلى نظام الهيئة
          </p>

          <div className="space-y-6">
            <ProgressBar percentage={progressPercentage} stage={progressStage} />
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-700">
                {progressStage === 'withdraw' && 'جاري سحب البيانات من النظام...'}
                {progressStage === 'verify' && 'جاري التحقق من صحة البيانات...'}
                {progressStage === 'send' && 'جاري إرسال البيانات إلى نظام الهيئة...'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={cancelProcess}
          >
            إلغاء العملية
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendStep;
