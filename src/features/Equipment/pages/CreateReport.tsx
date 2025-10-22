import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx-js-style";

import UploadBlock from "../components/UploadBlock";
import DownloadFirstRowExcel from "../components/DownloadFirstRowExcel";

import { extractReportData } from "../api";
import { AlertCircle } from "lucide-react";

const CreateReport: React.FC = () => {
  const navigate = useNavigate();

  // files & data
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [excelDataSheets, setExcelDataSheets] = useState<any[][][]>([]);
  const [excelError, setExcelError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // UI state
  const [showTables, setShowTables] = useState(false); // default: hidden
  const [errorsModalOpen, setErrorsModalOpen] = useState(false);
  const [excelErrors, setExcelErrors] = useState<{ sheetIdx: number; row: number; col: number; message: string }[]>([]);
  const [showValidationSuccess, setShowValidationSuccess] = useState(false);

  // Required headers for each sheet
  const requiredHeaders = {
    0: [ // Sheet 1 - Report data
      'title', 'purpose_id', 'value_premise_id', 'report_type', 'valued_at', 
      'submitted_at', 'inspection_date', 'assumptions', 'special_assumptions', 
      'value', 'client_name', 'owner_name', 'telephone', 'email', 'region', 'city'
    ],
    1: [ // Sheet 2 - Market assets
      'asset_name', 'asset_usage_id', 'final_value'
    ],
    2: [ // Sheet 3 - Cost assets
      'asset_name', 'asset_usage_id', 'final_value'
    ]
  };

  // --------------------------
  // Excel reading
  // --------------------------
  const handleExcelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setExcelFile(files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetsData: any[][][] = workbook.SheetNames.map((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            return XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: undefined , blankrows: false});
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

  // --------------------------
  // PDF reading
  // --------------------------
  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setPdfFile(files[0]);
    }
  };

  // --------------------------
  // Helpers & validation (same logic, slightly reorganized)
  // --------------------------
  const allowedPurposeIds = [1, 2, 5, 6, 8, 9, 10, 12, 14];
  const allowedValuePremiseIds = [1, 2, 3, 4, 5];

  function rowLength(row: any[]) {
    if (!row) return 0;
    return row.length;
  }

  function validateDate(dateVal: any): boolean {
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

  function formatCellValue(val: any, headerName: string): string {
    if (headerName === "valued_at" || headerName === "submitted_at" || headerName === "inspection_date") {
      if (val instanceof Date) {
        return val.toLocaleDateString('en-GB');
      } else if (typeof val === 'number') {
        const date = new Date((val - 25569) * 86400 * 1000);
        return date.toLocaleDateString('en-GB');
      } else if (typeof val === 'string') {
        return val;
      }
    }
    return String(val);
  }

  interface EmptyFieldInfo {
    sheetIndex: number;
    rowIndex: number;
    colIndex: number;
    columnName?: string;
  }

  // Check if all required headers are present in a sheet
  const hasMissingRequiredHeaders = (sheet: any[][], sheetIdx: number): string[] => {
    if (!sheet || sheet.length === 0) return requiredHeaders[sheetIdx as keyof typeof requiredHeaders] || [];
    
    const headers = sheet[0] || [];
    const headerNames = headers.map((h: any) => h?.toString().trim().toLowerCase());
    
    const missingHeaders: string[] = [];
    const requiredForSheet = requiredHeaders[sheetIdx as keyof typeof requiredHeaders] || [];
    
    requiredForSheet.forEach(requiredHeader => {
      if (!headerNames.includes(requiredHeader.toLowerCase())) {
        missingHeaders.push(requiredHeader);
      }
    });
    
    return missingHeaders;
  };

  const hasEmptyFields = (sheets: any[][][]): { hasEmpty: boolean; emptyFields: EmptyFieldInfo[] } => {
    const emptyFields: EmptyFieldInfo[] = [];

    for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
      const sheet = sheets[sheetIdx];
      if (!sheet || sheet.length < 2) continue;

      if (sheetIdx === 0) {
        // For sheet 1, only check the second row (data row)
        const headerLength = rowLength(sheet[0]);
        const row = sheet[1];
        if (!row) continue;
        const rowLen = rowLength(row);

        for (let j = 0; j < headerLength; j++) {
          const value = j < rowLen ? row[j] : undefined;

          if (value === undefined || value === "") {
            emptyFields.push({
              sheetIndex: sheetIdx + 1,
              rowIndex: 2,
              colIndex: j + 1,
              columnName: sheet[0][j] || `Column ${j + 1}`,
            });
          }
        }
      } else {
        // For sheets 2 and 3, check all data rows up to maxCols
        const maxCols = Math.max(...sheet.map(row => rowLength(row)));

        for (let i = 1; i < sheet.length; i++) {
          const row = sheet[i];
          const rowLen = rowLength(row);

          for (let j = 0; j < maxCols; j++) {
            const value = j < rowLen ? row[j] : undefined;

            if (value === undefined || value === " ") {
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
    }

    return {
      hasEmpty: emptyFields.length > 0,
      emptyFields,
    };
  };







  
  const hasFractionInFinalValue = (sheets: any[][][]) => {
    for (let sheetIdx = 1; sheetIdx <= 2; sheetIdx++) {
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
    for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
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
    for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
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

    // First, check for missing required headers in all sheets
    for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
      const sheet = sheets[sheetIdx];
      if (!sheet || sheet.length === 0) continue;
      
      const missingHeaders = hasMissingRequiredHeaders(sheet, sheetIdx);
      if (missingHeaders.length > 0) {
        errors.push({
          sheetIdx,
          row: 0, // Header row
          col: 0,
          message: `العناوين المطلوبة مفقودة: ${missingHeaders.join(', ')}`
        });
      }
    }

    for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
      const sheet = sheets[sheetIdx];
      if (!sheet || sheet.length < 2) continue;

      if (sheetIdx === 0) {
        // For sheet 1, only check the second row
        const headerLength = rowLength(sheet[0]);
        const row = sheet[1];
        if (!row) continue;
        const rowLen = rowLength(row);

        for (let j = 0; j < headerLength; j++) {
          const cell = j < rowLen ? row[j] : undefined;
          const headerName = (sheet[0][j] ?? "").toString().trim().toLowerCase();

          // empty
          if (cell === undefined || cell === "") {
            errors.push({
              sheetIdx,
              row: 1,
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
                row: 1,
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
                row: 1,
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
                row: 1,
                col: j,
                message: `قيمة غير مسموح بها في أساس القيمة (مسموح: ${allowedValuePremiseIds.join(",")})`
              });
            }
          }

          // date validations
          if (headerName === "valued_at" || headerName === "submitted_at" || headerName === "inspection_date") {
            if (!validateDate(cell)) {
              errors.push({
                sheetIdx,
                row: 1,
                col: j,
                message: `تاريخ غير صحيح في حقل ${headerName}، يجب أن يكون بتنسيق DD/MM/YYYY مع قيم صحيحة`
              });
            }
          }
        }
      } else {
        // For sheets 2 and 3, check all data rows
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
              if (!validateDate(cell)) {
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
    }

    return errors;
  };

  function getFinalValueSum(sheets: any[][][]) {
    let sum = 0;
    for (let sheetIdx = 1; sheetIdx <= 2; sheetIdx++) {
      const sheet = sheets[sheetIdx];
      if (!sheet || sheet.length < 2) continue;
      const finalValueIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "final_value");
      if (finalValueIdx === -1) continue;
      for (let i = 1; i < sheet.length; i++) {
        const val = sheet[i][finalValueIdx];
        if (val !== undefined && val !== "" && !isNaN(Number(val))) {
          sum += Number(val);
        }
      }
    }
    return sum;
  }

  function isReportValueEqualToAssetsSum(sheets: any[][][], assetsSum: number) {
    const sheet1 = sheets[0];
    if (!sheet1 || sheet1.length < 2) return true;
    const valueIdx = sheet1[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "value");
    if (valueIdx === -1) return true;
    const reportValue = sheet1[1]?.[valueIdx];
    if (reportValue === undefined || reportValue === "" || isNaN(Number(reportValue))) return true;
    return Number(reportValue) === assetsSum;
  }

  // Check if all required headers are present in all sheets
  const hasAllRequiredHeaders = (sheets: any[][][]) => {
    if (sheets.length < 3) return false;
    
    for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
      const missingHeaders = hasMissingRequiredHeaders(sheets[sheetIdx], sheetIdx);
      if (missingHeaders.length > 0) {
        return false;
      }
    }
    return true;
  };

  // derived / memoized values
  const finalValueSum = useMemo(() => getFinalValueSum(excelDataSheets), [excelDataSheets]);
  const isReportValueValid = useMemo(() => isReportValueEqualToAssetsSum(excelDataSheets, finalValueSum), [excelDataSheets, finalValueSum]);

  const isExcelValid =
    excelDataSheets.length > 0 &&
    hasAllRequiredHeaders(excelDataSheets) &&
    !hasEmptyFields(excelDataSheets) &&
    !hasFractionInFinalValue(excelDataSheets) &&
    !hasInvalidPurposeId(excelDataSheets) &&
    !hasInvalidValuePremiseId(excelDataSheets) &&
    isReportValueValid;

  // Fix: update isExcelValid when excelErrors change to enable save button correctly
  useEffect(() => {
    if (excelErrors.length === 0 && excelDataSheets.length > 0) {
      // no errors, excel is valid
      // This will trigger re-render and enable save button if pdfFile is present
    }
  }, [excelErrors, excelDataSheets]);

  // When excelDataSheets change, compute errors and open modal if needed
  useEffect(() => {
    if (!excelDataSheets || excelDataSheets.length === 0) {
      setExcelErrors([]);
      return;
    }
    const exErrors = getExcelErrors(excelDataSheets);

    // add report value mismatch error if exists
    if (!isReportValueValid) {
      const sheet1 = excelDataSheets[0];
      if (sheet1 && sheet1.length >= 2) {
        const valueIdx = sheet1[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "value");
        if (valueIdx !== -1) {
          exErrors.push({
            sheetIdx: 0,
            row: 1,
            col: valueIdx,
            message: "القيمة النهائية للتقرير لا تساوي مجموع القيم النهائية للأصول"
          });
        }
      }
    }

    setExcelErrors(exErrors);
    setShowValidationSuccess(exErrors.length === 0 && excelDataSheets.length > 0);

    // auto-open errors modal if there are errors
    if (exErrors.length > 0) {
      setErrorsModalOpen(true);
    }
  }, [excelDataSheets, isReportValueValid]);

  // --------------------------
  // Download corrected Excel (keeps logic, but now uses excelErrors)
  // --------------------------
  const downloadCorrectedExcel = () => {
    if (isExcelValid) return;
    if (!excelDataSheets.length) return;

    const workbook = XLSX.utils.book_new();
    const allErrors = [...excelErrors];

    excelDataSheets.forEach((sheet, sheetIdx) => {
      if (!sheet || sheet.length === 0) return;

      const newSheetData = sheet.map((r) => (Array.isArray(r) ? [...r] : r));
      const errorsForThisSheet = allErrors.filter((e) => e.sheetIdx === sheetIdx);

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

  // --------------------------
  // Save report (API)
  // --------------------------
  const handleSave = async () => {
    if (!excelFile || !pdfFile) return;
    if (excelErrors.length > 0) {
      setExcelError("يوجد أخطاء في البيانات، يرجى فتح قائمة الأخطاء وتصحيحها قبل الحفظ.");
      setErrorsModalOpen(true);
      return;
    }
    try {
      setRefreshing(true);
      const response: any = await extractReportData(excelFile, [pdfFile]);
      setRefreshing(false);
      if (response?.status === "FAILED" && response.error) {
        setExcelError(response.error);
        return;
      }
      if (response?.status === "SAVED" || response?.status === "SUCCESS") {
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/equipment/viewReports");
        }, 1200);
      }
    } catch (error) {
      console.error("Error:", error);
      setRefreshing(false);
      setExcelError("حدث خطأ أثناء حفظ التقرير. حاول مرة أخرى.");
    }
  };

  // --------------------------
  // Small helpers for modal copy
  // --------------------------
  const copyErrorToClipboard = async (err: { sheetIdx: number; row: number; col: number; message: string }) => {
    try {
      await navigator.clipboard.writeText(
        `Sheet:${err.sheetIdx + 1} Row:${err.row + 1} Col:${err.col + 1} - ${err.message}`
      );
      // temporary feedback could be added
    } catch (e) {
      // ignore
    }
  };

  // --------------------------
  // JSX
  // --------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 pb-16">
      <div className="max-w-4xl mx-auto pt-10 px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100 overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight flex items-center gap-3">
                🎯 إنشاء تقرير جديد للأصول
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <DownloadFirstRowExcel filename="/Create.xlsx" />
              <button
                onClick={() => {
                  setShowTables((s) => !s);
                }}
                className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
              >
                {showTables ? "إخفاء الجداول" : "إظهار الجداول"}
              </button>

              <button
                onClick={() => setErrorsModalOpen(true)}
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${excelErrors.length ? "bg-red-50 border-red-200 text-red-700" : "bg-gray-50 border-gray-200 text-gray-700"} border shadow-sm hover:shadow-md`}
                title="عرض الأخطاء"
              >
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">عرض الأخطاء ({excelErrors.length})</span>
              </button>
            </div>
          </div>

          {/* Uploads */}
          <div className="space-y-6">
            <UploadBlock
              label="رفع ملف Excel"
              accept=".xlsx,.xls"
              inputId="excel-upload"
              type="excel"
              onFileChange={handleExcelChange}
            />
            {excelFile && (
              <p className="text-sm text-gray-600 text-center">
                الملف المختار: <span className="font-medium text-blue-700">{excelFile.name}</span>
              </p>
            )}

            <UploadBlock
              label="رفع ملف PDF"
              accept=".pdf"
              inputId="pdf-upload"
              type="pdf"
              onFileChange={handlePdfChange}
            />
            {pdfFile && (
              <p className="text-sm text-gray-600 text-center">
                الملف المختار: <span className="font-medium text-green-700">{pdfFile.name}</span>
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
              <button
                onClick={downloadCorrectedExcel}
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
                onClick={handleSave}
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

            {/* Error / Success summary (compact) */}
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

              {/* Show required headers info when there are header errors */}
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

            {/* Inline error banner (if api or other text) */}
            {excelError && (
              <div className="mt-3 text-center text-red-600 font-semibold">
                {excelError}
              </div>
            )}
          </div>

          {/* Tables area (hidden by default) */}
          {showTables && (
            <div className="mt-6 space-y-6">
              {excelDataSheets.length === 0 ? (
                <div className="text-center text-sm text-gray-500 py-6">لا توجد جداول للعرض حالياً — ارفع ملف إكسل أولاً</div>
              ) : (
                excelDataSheets.slice(0, 3).map((sheet, sheetIdx) => {
                  const title = sheetIdx === 0 ? "بيانات التقرير" : sheetIdx === 1 ? "بيانات الأصول - أسلوب السوق" : "بيانات الأصول - أسلوب التكلفة";
                  // if sheet is empty skip
                  if (!sheet || sheet.length === 0) return null;
                  const headers: any[] = sheet[0] ?? [];
                  const rows = sheetIdx === 0 ? (sheet[1] ? [sheet[1]] : []) : sheet.slice(1);

                  return (
                    <div key={sheetIdx} className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-auto">
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <div className="font-semibold text-blue-700">{title}</div>
                        <div className="text-xs text-gray-500">{rows.length} صف</div>
                      </div>

                      <table className="min-w-full text-sm table-auto border-collapse border border-gray-400">
                        <thead className="bg-gray-200">
                          <tr>
                            {headers.map((hd: any, idx: number) => (
                              <th key={idx} className="px-2 py-1 text-center font-medium text-gray-800 border border-gray-400">{hd ?? ""}</th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {rows.length === 0 ? (
                            <tr>
                              <td className="p-6 text-center text-gray-400 border border-gray-400" colSpan={Math.max(1, headers.length)}>
                                لا توجد بيانات في هذا الجدول
                              </td>
                            </tr>
                          ) : (
                            rows.map((row: any[], rIdx: number) => (
                              <tr key={rIdx} className={`${rIdx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}>
                                {Array(headers.length).fill(0).map((_, cIdx) => {
                                  const val = row[cIdx];
                                  const headerName = (headers[cIdx] ?? "").toString().trim().toLowerCase();
                                  const isEmpty = val === undefined || val === "";
                                  const hasError = excelErrors.some(e => e.sheetIdx === sheetIdx && e.row === (sheetIdx === 0 ? 1 : rIdx + 1) && e.col === cIdx);
                                  const bgColor = hasError ? "#FDD017" : isEmpty ? "#FEF3C7" : "";
                                  return (
                                    <td
                                      key={cIdx}
                                      className="px-2 py-1 text-center align-middle border border-gray-400"
                                      style={{ minWidth: 120, fontFamily: "Cairo, sans-serif", backgroundColor: bgColor }}
                                    >
                                      {isEmpty ? <span className="text-xs text-red-500 font-medium">مفقود</span> : formatCellValue(val, headerName)}
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
                })
              )}
            </div>
          )}

          {/* Footer summary */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {excelDataSheets.length > 0 ? `${excelDataSheets.length} شيت في الملف` : "لم يتم رفع ملف بعد"}
          </div>
        </div>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg z-50 animate-fadeIn">
          تم حفظ التقرير بنجاح
          <button onClick={() => setShowSuccess(false)} className="mr-3 text-sm underline">إغلاق</button>
        </div>
      )}

      {/* Errors Modal */}
      {errorsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/40" onClick={() => setErrorsModalOpen(false)} />

          <div className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <div className="font-semibold text-lg text-gray-800">قائمة الأخطاء ({excelErrors.length})</div>
                  <div className="text-xs text-gray-500">تفاصيل الصف والعمود ونوع الخطأ</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    // download corrected excel from modal too
                    downloadCorrectedExcel();
                  }}
                  className="px-3 py-1 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm shadow-sm"
                >
                  تنزيل ملف معدل
                </button>
                <button
                  onClick={() => setErrorsModalOpen(false)}
                  className="px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-700 text-sm"
                >
                  إغلاق
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-auto p-6 space-y-4">
              {excelErrors.length === 0 ? (
                <div className="text-center text-gray-500">لا توجد أخطاء</div>
              ) : (
                excelErrors.map((err, idx) => (
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
      )}
    </div>
  );
};

export default CreateReport;