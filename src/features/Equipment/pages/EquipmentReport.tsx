import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx-js-style";

import StepList from "../components/StepList";
import UploadBlock from "../components/UploadBlock";

import { uploadAssetsToDB } from "../api";

const SuccessToast: React.FC<{ onClose: () => void; reportId: string }> = ({ onClose, reportId }) => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-4 rounded-md shadow-lg z-50 animate-fade-in-out max-w-md">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Report saved successfully!</div>
          <div className="text-sm mt-1">Report ID: {reportId}</div>
        </div>
        <button
          onClick={() => navigate("/equipment/viewReports")}
          className="ml-4 px-4 py-2 bg-white text-green-600 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          View Reports
        </button>
      </div>
      <button
        onClick={onClose}
        className="mt-3 text-sm underline hover:text-gray-200 block"
      >
        Close
      </button>
    </div>
  );
};

const allowedPurposeIds = [1, 2, 5, 6, 8, 9, 10, 12, 14];
const allowedValuePremiseIds = [1, 2, 3, 4, 5];

function rowLength(row: any[]) {
  if (!row) return 0;
  return row.length;
}

function validateExcelDate(dateVal: any): boolean {
  let day, month, year;
  if (dateVal instanceof Date) {
    day = dateVal.getDate();
    month = dateVal.getMonth() + 1;
    year = dateVal.getFullYear();
  } else if (typeof dateVal === 'string') {
    const parts = dateVal.split('/');
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    year = parseInt(parts[2], 10);
  } else if (typeof dateVal === 'number') {
    const date = new Date((dateVal - 25569) * 86400 * 1000);
    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
  } else {
    return false;
  }
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  return true;
}


interface EmptyFieldInfo {
  sheetIndex: number;
  rowIndex: number;
  colIndex: number;
  columnName?: string;
}

const hasEmptyFields = (sheets: any[][][]): { hasEmpty: boolean; emptyFields: EmptyFieldInfo[] } => {
  const emptyFields: EmptyFieldInfo[] = [];

  // Only check the first two sheets (asset sheets)
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;

    // For both asset sheets, check all data rows up to maxCols
    const maxCols = Math.max(...sheet.map(row => rowLength(row)));

    for (let i = 1; i < sheet.length; i++) {
      const row = sheet[i];
      const rowLen = rowLength(row);

      for (let j = 0; j < maxCols; j++) {
        const value = j < rowLen ? row[j] : undefined;

        if (value === undefined || value === "") {
          emptyFields.push({
            sheetIndex: sheetIdx + 1,
            rowIndex: i + 1,
            colIndex: j + 1,
            columnName: sheet[0][j] || `Column ${j + 1}`,
          });
        }
      }
    }
  }

  return {
    hasEmpty: emptyFields.length > 0,
    emptyFields,
  };
};

const hasFractionInFinalValue = (sheets: any[][][]) => {
  // Check both asset sheets (sheet 0 and 1)
  for (let sheetIdx = 0; sheetIdx <= 1; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const finalValueIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "final_value");
    if (finalValueIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i][finalValueIdx];
      if (val !== undefined && val !== "" && !Number.isInteger(Number(val))) {
        return true;
      }
    }
  }
  return false;
};

const hasInvalidPurposeId = (sheets: any[][][]) => {
  // Check both asset sheets (sheet 0 and 1)
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const purposeIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "purpose_id");
    if (purposeIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i][purposeIdx];
      if (val !== undefined && val !== "" && !allowedPurposeIds.includes(Number(val))) {
        return true;
      }
    }
  }
  return false;
};

const hasInvalidValuePremiseId = (sheets: any[][][]) => {
  // Check both asset sheets (sheet 0 and 1)
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const premiseIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "value_premise_id");
    if (premiseIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i][premiseIdx];
      if (val !== undefined && val !== "" && !allowedValuePremiseIds.includes(Number(val))) {
        return true;
      }
    }
  }
  return false;
};

const getExcelErrors = (sheets: any[][][]) => {
  const errors: { sheetIdx: number; row: number; col: number; message: string }[] = [];

  // Only validate the first two sheets (asset sheets)
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;

    // For both asset sheets, check all data rows
    const maxCols = Math.max(...sheet.map(row => rowLength(row)));

    for (let i = 1; i < sheet.length; i++) {
      const row = sheet[i];
      const rowLen = rowLength(row);

      for (let j = 0; j < maxCols; j++) {
        const cell = j < rowLen ? row[j] : undefined;
        const headerName = (sheet[0][j] ?? "").toString().trim().toLowerCase();

        // empty
        if (cell === undefined || cell === "") {
          errors.push({
            sheetIdx,
            row: i,
            col: j,
            message: "يوجد حقل فارغ، من فضلك املأ الحقل بقيمة صحيحة"
          });
          continue;
        }

        // final_value integer
        if (headerName === "final_value") {
          if (!Number.isInteger(Number(cell))) {
            errors.push({
              sheetIdx,
              row: i,
              col: j,
              message: "القيمة النهائية يجب أن تكون عددًا صحيحًا (بدون كسور)"
            });
          }
        }

        // purpose_id
        if (headerName === "purpose_id") {
          if (!allowedPurposeIds.includes(Number(cell))) {
            errors.push({
              sheetIdx,
              row: i,
              col: j,
              message: `قيمة غير مسموح بها في عمود الغرض (مسموح: ${allowedPurposeIds.join(",")})`
            });
          }
        }

        // value_premise_id
        if (headerName === "value_premise_id") {
          if (!allowedValuePremiseIds.includes(Number(cell))) {
            errors.push({
              sheetIdx,
              row: i,
              col: j,
              message: `قيمة غير مسموح بها في أساس القيمة (مسموح: ${allowedValuePremiseIds.join(",")})`
            });
          }
        }

        // date validations
        if (headerName === "valued_at" || headerName === "submitted_at" || headerName === "inspection_date") {
          if (!validateExcelDate(cell)) {
            errors.push({
              sheetIdx,
              row: i,
              col: j,
              message: `تاريخ غير صحيح في حقل ${headerName}، يجب أن يكون بتنسيق DD/MM/YYYY مع قيم صحيحة`
            });
          }
        }
      }
    }
  }

  return errors;
};

const EquipmentReport: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  // Excel validation states
  const [excelDataSheets, setExcelDataSheets] = useState<any[][][]>([]);
  const [excelError, setExcelError] = useState<string>("");
  const [excelErrors, setExcelErrors] = useState<{ sheetIdx: number; row: number; col: number; message: string }[]>([]);
  const [showValidationSuccess, setShowValidationSuccess] = useState(false);
  const [errorsModalOpen, setErrorsModalOpen] = useState(false);
  const [reportId, setReportId] = useState("");
  const [isFileValidated, setIsFileValidated] = useState(false);

  const steps = [
    { number: 1, label: `${t("equipment.steps.1.label")}` },
    { number: 2, label: `${t("equipment.steps.2.label")}` },
    { number: 3, label: `${t("equipment.steps.3.label")}` },
    { number: 4, label: `${t("equipment.steps.4.label")}` },
  ];

  // Excel file handling and validation
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setExcelFile(files[0]);
      setIsFileValidated(false);
      setShowValidationSuccess(false);
      setExcelErrors([]);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetsData: any[][][] = workbook.SheetNames.map((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            return XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: undefined });
          });
          setExcelDataSheets(sheetsData);
          setExcelError("");
        } catch (err) {
          console.error(err);
          setExcelError("حدث خطأ أثناء قراءة ملف الإكسل. تأكد من أن الملف صالح.");
        }
      };
      reader.readAsArrayBuffer(files[0]);
    }
  };

  const handleValidateFile = () => {
    if (!excelFile) return;
    
    setIsValidating(true);
    setTimeout(() => {
      const exErrors = getExcelErrors(excelDataSheets);
      setExcelErrors(exErrors);
      const isValid = exErrors.length === 0;
      setShowValidationSuccess(isValid);
      setIsFileValidated(isValid);
      setIsValidating(false);
      
      if (!isValid) {
        setErrorsModalOpen(true);
      }
    }, 1000);
  };

  const isExcelValid = excelDataSheets.length > 0 &&
    !hasEmptyFields(excelDataSheets).hasEmpty &&
    !hasFractionInFinalValue(excelDataSheets) &&
    !hasInvalidPurposeId(excelDataSheets) &&
    !hasInvalidValuePremiseId(excelDataSheets);

  const handleExtractAndStore = async () => {
    if (!excelFile || !isExcelValid || !reportId.trim()) return;
    
    setIsExtracting(true);
    
    try {
      const response = await uploadAssetsToDB(reportId, excelFile);
      console.log(response);
      if (response.status === "SAVED") {
        setIsExtracting(false);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsExtracting(false);
    }
  };

  // Download corrected Excel
  const downloadCorrectedExcel = () => {
    if (isExcelValid) return;
    if (!excelDataSheets.length) return;

    const workbook = XLSX.utils.book_new();
    
    excelDataSheets.forEach((sheet, sheetIdx) => {
      if (!sheet || sheet.length === 0) return;

      const newSheetData = sheet.map((r) => (Array.isArray(r) ? [...r] : r));
      const errorsForThisSheet = excelErrors.filter((e) => e.sheetIdx === sheetIdx);

      errorsForThisSheet.forEach((err) => {
        const r = err.row;
        const c = err.col;
        if (!newSheetData[r]) newSheetData[r] = [];
        const oldVal = newSheetData[r][c] === undefined || newSheetData[r][c] === null ? "" : newSheetData[r][c];
        newSheetData[r][c] = `${oldVal} ⚠ ${err.message}`;
      });

      const ws = XLSX.utils.aoa_to_sheet(newSheetData);

      Object.keys(ws).forEach((cellRef) => {
        if (cellRef[0] === "!") return;
        const cell = ws[cellRef];
        const v = (cell && cell.v) ? cell.v.toString() : "";
        if (v.includes("⚠")) {
          cell.s = {
            fill: { fgColor: { rgb: "FFFF00" } },
            font: { color: { rgb: "FF0000" }, bold: true }
          };
        }
      });

      XLSX.utils.book_append_sheet(workbook, ws, `Sheet${sheetIdx + 1}`);
    });

    XLSX.writeFile(workbook, "corrected_report.xlsx", { bookType: "xlsx" });
  };

  const copyErrorToClipboard = async (err: { sheetIdx: number; row: number; col: number; message: string }) => {
    try {
      await navigator.clipboard.writeText(
        `Sheet:${err.sheetIdx + 1} Row:${err.row + 1} Col:${err.col + 1} - ${err.message}`
      );
    } catch (e) {
      // ignore
    }
  };

  return (
    <div>
      <StepList steps={steps} activeStep={currentStep} />

      <div className="mt-6 max-w-md mx-auto">
        {/* Step 1: File Selection */}
        {currentStep === 1 && (
          <>
            <UploadBlock
              label="Upload your asset data file"
              accept=".xlsx,.xls"
              inputId="excel-upload"
              type="excel"
              onFileChange={handleFileChange}
            />
            {excelFile && (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-gray-600">
                  Selected file: <span className="font-medium">{excelFile.name}</span>
                </p>
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={handleValidateFile}
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
                    onClick={() => setCurrentStep(2)}
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
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Step 2: Report ID and Data Extraction */}
        {currentStep === 2 && (
          <>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Report ID
                </label>
                <input
                  type="text"
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter report ID"
                />
              </div>


              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 border border-gray-400 text-gray-600 rounded-sm transition-colors font-semibold hover:bg-gray-50"
                >
                  Back
                </button>

                <button
                  onClick={handleExtractAndStore}
                  disabled={!reportId.trim() || isExtracting}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    reportId.trim() && !isExtracting
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isExtracting ? "Extracting..." : "Extract Data and Store"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showSuccess && (
        <SuccessToast 
          onClose={() => {
            setShowSuccess(false);
            navigate("/equipment/allReports");
          }} 
          reportId={reportId}
        />
      )}

      {/* Errors Modal */}
      {errorsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setErrorsModalOpen(false)} />
          <div className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">!</span>
                </div>
                <div>
                  <div className="font-semibold text-lg text-gray-800">Excel Validation Errors ({excelErrors.length})</div>
                  <div className="text-xs text-gray-500">Details of row, column and error type</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={downloadCorrectedExcel}
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
                  onClick={() => setErrorsModalOpen(false)}
                  className="px-3 py-1 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="max-h-[60vh] overflow-auto p-6 space-y-4">
              {excelErrors.length === 0 ? (
                <div className="text-center text-gray-500">No errors found</div>
              ) : (
                excelErrors.map((err, idx) => (
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
      )}
    </div>
  );
};

export default EquipmentReport;