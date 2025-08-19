import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { t } from 'i18next';

type Props = {
  processingResult: 'success' | 'error' | null;
  selectedCount: number;
  resetWorkflow: () => void;
};

const ResultStep: React.FC<Props> = ({ processingResult, selectedCount, resetWorkflow }) => {
  const isSuccess = processingResult === 'success';

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        {t('meykas.resultStep.title')}
      </h3>

      <div
        className={`bg-white p-6 rounded-lg border ${
          isSuccess ? 'border-green-200' : 'border-red-200'
        } mb-6`}
      >
        <div className="text-center py-6">
          <div
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              isSuccess ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {isSuccess ? (
              <Check className="h-8 w-8 text-green-600" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-red-600" />
            )}
          </div>

          <h4 className="text-xl font-medium mb-2">
            {isSuccess
              ? t('meykas.resultStep.success.title')
              : t('meykas.resultStep.error.title')}
          </h4>

          <p className="text-gray-600 mb-6">
            {isSuccess
              ? t('meykas.resultStep.success.message', { count: selectedCount })
              : t('meykas.resultStep.error.message')}
          </p>

          {isSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 text-right">
              <p className="text-sm text-green-700">
                {t('meykas.resultStep.success.ref', {
                  ref: `REF-${new Date().getTime().toString().slice(-8)}`
                })}
              </p>
              <p className="text-sm text-green-700">
                {t('meykas.resultStep.success.date', {
                  date: new Date().toLocaleDateString('ar-SA')
                })}
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 text-right">
              <p className="text-sm text-red-700">
                {t('meykas.resultStep.error.code', {
                  code: `ERR-${new Date().getTime().toString().slice(-6)}`
                })}
              </p>
              <p className="text-sm text-red-700">
                {t('meykas.resultStep.error.hint')}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={resetWorkflow}
          >
            {t('meykas.resultStep.back')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultStep;
