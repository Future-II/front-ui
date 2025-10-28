import React from 'react';
import UploadBlock from '../UploadBlock';
import { ReportsManagementExcelError } from '../../types';
import { formatCellValue } from '../../utils/excelValidation';

interface Step2FileUploadProps {
  excelFile: File | null;
  pdfs: File[];
  excelDataSheets: any[][][];
  excelError: string;
  excelErrors: ReportsManagementExcelError[];
  showTables: boolean;
  showValidationSuccess: boolean;
  step2Validated: boolean;
  finalValueSum: number;
  isExcelValid: boolean;
  hasOnlyFinalValueMismatch: boolean;
  isLoading: boolean;
  onExcelUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPdfUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onShowTablesToggle: () => void;
  onErrorsModalOpen: () => void;
  onDownloadCorrectedExcel: () => void;
  onValidateStep2: () => void;
  onSubmitReport: () => void;
  onBack: () => void;
}

const Step2FileUpload: React.FC<Step2FileUploadProps> = ({
  excelFile,
  pdfs,
  excelDataSheets,
  excelError,
  excelErrors,
  showTables,
  showValidationSuccess,
  step2Validated,
  finalValueSum,
  isExcelValid,
  hasOnlyFinalValueMismatch,
  isLoading,
  onExcelUpload,
  onPdfUpload,
  onShowTablesToggle,
  onErrorsModalOpen,
  onDownloadCorrectedExcel,
  onValidateStep2,
  onSubmitReport,
  onBack
}) => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Upload Asset Data Files</h2>

        <div className="space-y-6">
          <UploadBlock
            label="Upload your asset data Excel file"
            accept=".xlsx,.xls"
            inputId="excel-upload"
            type="excel"
            onFileChange={onExcelUpload}
            disabled={isLoading}
          />

          {excelFile && (
            <p className="text-sm text-gray-600">Selected Excel File: {excelFile.name}</p>
          )}

          <UploadBlock
            label="Upload PDF files"
            accept=".pdf"
            inputId="pdf-upload"
            type="pdf"
            onFileChange={onPdfUpload}
            disabled={isLoading}
          />

          {pdfs.length > 0 && (
            <p className="text-sm text-gray-600">Selected PDF Files: {pdfs.map(pdf => pdf.name).join(', ')}</p>
          )}

          {/* Excel Validation Summary - Only show after validation */}
          {excelDataSheets.length > 0 && excelErrors.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">Excel Validation</h3>
                <div className="flex gap-3">
                  <button
                    onClick={onShowTablesToggle}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    {showTables ? "Hide Tables" : "Show Tables"}
                  </button>
                  <button
                    onClick={onErrorsModalOpen}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${excelErrors.length ? "bg-red-50 border-red-200 text-red-700" : "bg-gray-50 text-gray-700"
                      } border transition-colors`}
                  >
                    <span>View Errors ({excelErrors.length})</span>
                  </button>
                </div>
              </div>

              {/* Validation Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {finalValueSum > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700 font-semibold">Total Asset Values</p>
                        <p className="text-lg font-bold text-blue-900">{finalValueSum.toLocaleString()}</p>
                      </div>
                      <div className="text-sm text-gray-500">Sum from asset sheets</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tables Display */}
              {showTables && (
                <div className="mt-6 space-y-6">
                  {excelDataSheets.slice(0, 2).map((sheet, sheetIdx) => {
                    const title = sheetIdx === 0 ? "Market Approach Assets" : "Cost Approach Assets";

                    if (!sheet || sheet.length === 0) return null;
                    const headers: any[] = sheet[0] ?? [];
                    const rows = sheet.slice(1);

                    return (
                      <div key={sheetIdx} className="bg-white border border-gray-200 rounded-lg overflow-auto">
                        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                          <div className="font-semibold text-blue-700">{title}</div>
                          <div className="text-xs text-gray-500">{rows.length} rows</div>
                        </div>

                        <table className="min-w-full text-sm border-collapse border border-gray-300">
                          <thead className="bg-gray-100">
                            <tr>
                              {headers.map((hd: any, idx: number) => (
                                <th key={idx} className="px-3 py-2 text-center font-medium text-gray-800 border border-gray-300">
                                  {hd ?? ""}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.length === 0 ? (
                              <tr>
                                <td className="p-4 text-center text-gray-400 border border-gray-300" colSpan={headers.length}>
                                  No data in this table
                                </td>
                              </tr>
                            ) : (
                              rows.map((row: any[], rIdx: number) => (
                                <tr key={rIdx} className={`${rIdx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}>
                                  {Array(headers.length).fill(0).map((_, cIdx) => {
                                    const val = row[cIdx];
                                    const headerName = (headers[cIdx] ?? "").toString().trim().toLowerCase();
                                    const isEmpty = val === undefined || val === "";
                                    const hasError = excelErrors.some(e => e.sheetIdx === sheetIdx && e.row === rIdx + 1 && e.col === cIdx);
                                    const bgColor = hasError ? "#FDD017" : isEmpty ? "#FEF3C7" : "";

                                    return (
                                      <td
                                        key={cIdx}
                                        className="px-3 py-2 text-center border border-gray-300"
                                        style={{ backgroundColor: bgColor }}
                                      >
                                        {isEmpty ? <span className="text-xs text-red-500 font-medium">Missing</span> : formatCellValue(val, headerName)}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Success badge - only show after validation passes */}
          {step2Validated && showValidationSuccess && (
            <div className="mt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold text-green-700">Files Validated</p>
                    <p className="text-sm text-gray-600">No errors found, ready to submit</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {excelError && (
            <div className="mt-3 text-center text-red-600 font-semibold">
              {excelError}
            </div>
          )}

          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
            >
              Back
            </button>

            <div className="flex gap-3">
              <button
                onClick={onDownloadCorrectedExcel}
                disabled={!excelFile || isExcelValid || hasOnlyFinalValueMismatch}
                className={`px-5 py-3 rounded-lg font-semibold transition-colors ${excelFile && !isExcelValid && !hasOnlyFinalValueMismatch
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                Download Corrected File
              </button>

              <button
                onClick={onValidateStep2}
                disabled={!excelFile || !pdfs.length || isLoading || step2Validated}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${excelFile && pdfs.length && !step2Validated
                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                Validate Data
              </button>

              <button
                onClick={onSubmitReport}
                disabled={!step2Validated || isLoading}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${step2Validated && !isLoading
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {isLoading ? 'Submitting...' : 'Validate and Store'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2FileUpload;