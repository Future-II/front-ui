import React from 'react';
import UploadBlock from '../UploadBlock';
import { equipmentRequiredHeadings } from '../../types';

interface Step1FileUploadProps {
  excelFile: File | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onValidateFile: () => void;
  onContinue: () => void;
  isValidating: boolean;
  isFileValidated: boolean;
  hasValidated: boolean;
  showValidationSuccess: boolean;
  excelError: string;
  excelErrors: any[];
  excelDataSheets: any[][][];
}

const Step1FileUpload: React.FC<Step1FileUploadProps> = ({
  excelFile,
  onFileChange,
  onValidateFile,
  onContinue,
  isValidating,
  isFileValidated,
  hasValidated,
  showValidationSuccess,
  excelError,
  excelErrors,
  excelDataSheets
}) => {
  return (
    <>
      <UploadBlock
        label="Upload your asset data file"
        accept=".xlsx,.xls"
        inputId="excel-upload"
        type="excel"
        onFileChange={onFileChange}
      />
      {excelFile && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-600">
            Selected file: <span className="font-medium">{excelFile.name}</span>
          </p>
          
          {/* Required Headings Info - Only show after validation attempt */}
          {hasValidated && !showValidationSuccess && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-semibold text-blue-700">Required Headings</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {equipmentRequiredHeadings.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <button
              onClick={onValidateFile}
              disabled={!excelFile || isValidating}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                excelFile && !isValidating
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isValidating ? "Validating..." : "Validate File"}
            </button>

            <button
              onClick={onContinue}
              disabled={!isFileValidated}
              className={`px-6 py-2 border rounded-sm transition-colors font-semibold ${
                isFileValidated
                  ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  : "border-gray-400 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>

          {/* Validation Status */}
          {excelDataSheets.length > 0 && (
            <div className="mt-4 space-y-3">
              {showValidationSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-green-700">File is Valid</p>
                      <p className="text-sm text-gray-600">No errors found, ready to continue</p>
                    </div>
                  </div>
                </div>
              )}

              {excelError && (
                <div className="text-center text-red-600 font-semibold">
                  {excelError}
                </div>
              )}

              {/* Show required headings info when there are heading errors */}
              {hasValidated && excelErrors.some(error => error.message.includes('العنوانات المطلوبة')) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-semibold text-yellow-700">Missing Required Headings</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Please ensure your Excel file contains all required columns: {equipmentRequiredHeadings.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Step1FileUpload;