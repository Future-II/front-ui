import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx-js-style";

import UploadBlock from "../components/UploadBlock";
import { extractReportData } from "../api";

const CreateReport: React.FC = () => {
  const navigate = useNavigate();

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [excelDataSheets, setExcelDataSheets] = useState<any[][][]>([]);
  const [excelError, setExcelError] = useState<string>("");

  // --------------------------
  // قراءة ملف Excel 
  // --------------------------
  const handleExcelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setExcelFile(files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        // نقرأ بواسطة xlsx-js-style (يدعم style)
        const workbook = XLSX.read(data, { type: "array" });
        const sheetsData: any[][][] = workbook.SheetNames.map((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          // header:1 => مصفوفة مصفوفات
          return XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: undefined });
        });
        setExcelDataSheets(sheetsData);
        setExcelError("");
      };
      reader.readAsArrayBuffer(files[0]);
    }
  };

  // --------------------------
  // قراءة ملف PDF
  // --------------------------
  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) setPdfFile(files[0]);
  };

  // --------------------------
  // Helpers & Validation
  // --------------------------
  const allowedPurposeIds = [1, 2, 5, 6, 8, 9, 10, 12, 14];
  const allowedValuePremiseIds = [1, 2, 3, 4, 5];

  // helper: actual row length (ignore trailing undefined/empty)
  function rowLength(row: any[]) {
    if (!row) return 0;
    let lastIdx = row.length - 1;
    while (lastIdx >= 0 && (row[lastIdx] === undefined || row[lastIdx] === "")) {
      lastIdx--;
    }
    return lastIdx + 1;
  }

  // تحقق من الحقول الفارغة بناءً على ما يظهر (الهيدر + طول الصف الفعلي)
  const hasEmptyFields = (sheets: any[][][]) => {
    for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
      const sheet = sheets[sheetIdx];
      if (!sheet || sheet.length < 2) continue;
      let startCol = 0;
      if ((sheetIdx === 1 || sheetIdx === 2) && (sheet[0][0] === undefined || sheet[0][0] === "")) {
        startCol = 1;
      }
      const headerLength = rowLength(sheet[0]);
      for (let i = 1; i < sheet.length; i++) {
        const rowLen = rowLength(sheet[i]);
        for (let j = startCol; j < headerLength; j++) {
          if (j < rowLen) {
            if (sheet[i][j] === undefined || sheet[i][j] === "") {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  // تحقق من وجود كسور في final_value
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

  // تحقق من صحة purpose_id
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

  // تحقق من صحة value_premise_id
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

  // تجميع الأخطاء مع موقعها ونوعها + رسائل مخصصة
  const getExcelErrors = (sheets: any[][][]) => {
    const errors: { sheetIdx: number; row: number; col: number; message: string }[] = [];

    for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
      const sheet = sheets[sheetIdx];
      if (!sheet || sheet.length < 2) continue;

      let startCol = 0;
      if ((sheetIdx === 1 || sheetIdx === 2) && (sheet[0][0] === undefined || sheet[0][0] === "")) {
        startCol = 1;
      }

      const headerLength = rowLength(sheet[0]);

      for (let i = 1; i < sheet.length; i++) {
        const rowLen = rowLength(sheet[i]);
        for (let j = startCol; j < headerLength; j++) {
          // نتحقق فقط للأعمدة التي تظهر بناءً على headerLength
          if (j < rowLen) {
            const cell = sheet[i][j];

            const headerName = (sheet[0][j] ?? "").toString().trim().toLowerCase();

            // حقل فارغ
            if (cell === undefined || cell === "") {
              errors.push({
                sheetIdx,
                row: i,
                col: j,
                message: "يوجد حقل فارغ، من فضلك املأ الحقل بقيمة صحيحة"
              });
              continue;
            }

            // final_value يجب أن يكون عدد صحيح (بدون كسور)
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
                  message: `قيمة غير مسموح بها في عمود الغرض (القيم المسموح بها: ${allowedPurposeIds.join(",")})`
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
                  message: `قيمة غير مسموح بها في أساس القيمة (القيم المسموح بها: ${allowedValuePremiseIds.join(",")})`
                });
              }
            }
          }
        }
      }
    }

    return errors;
  };

  // حساب مجموع final_value في شيتات 1 و 2 (index 1 و 2)
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

  // التحقق من تساوي قيمة التقرير مع مجموع الأصول
  function isReportValueEqualToAssetsSum(sheets: any[][][], assetsSum: number) {
    const sheet1 = sheets[0];
    if (!sheet1 || sheet1.length < 2) return true;
    const valueIdx = sheet1[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "value");
    if (valueIdx === -1) return true;
    const reportValue = sheet1[1]?.[valueIdx];
    if (reportValue === undefined || reportValue === "" || isNaN(Number(reportValue))) return true;
    return Number(reportValue) === assetsSum;
  }

  // جمع الشروط النهائية لصلاحية الاكسل
  const finalValueSum = getFinalValueSum(excelDataSheets);
  const isReportValueValid = isReportValueEqualToAssetsSum(excelDataSheets, finalValueSum);

  const isExcelValid =
    excelDataSheets.length > 0 &&
    !hasEmptyFields(excelDataSheets) &&
    !hasFractionInFinalValue(excelDataSheets) &&
    !hasInvalidPurposeId(excelDataSheets) &&
    !hasInvalidValuePremiseId(excelDataSheets) &&
    isReportValueValid;

  // --------------------------
  // دالة تنزيل ملف الإكسل المعدل
  // --------------------------
  const downloadCorrectedExcel = () => {
    // if excel is valid, no need to download corrected file
    if (isExcelValid) return;
    if (!excelDataSheets.length) return;

    const workbook = XLSX.utils.book_new();

    // نحصل على جميع الأخطاء في الملف
    const allErrors = getExcelErrors(excelDataSheets);

    // إذا كانت هناك مشكلة في تطابق قيمة التقرير، نضيف خطأ مخصص للمكان المناسب في الشيت الأول
    if (!isReportValueValid) {
      const sheet1 = excelDataSheets[0];
      if (sheet1 && sheet1.length >= 2) {
        const valueIdx = sheet1[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "value");
        if (valueIdx !== -1) {
          // أضف خطأ: sheetIdx 0، row 1 (الصف الثاني في الإكسل)، col valueIdx
          allErrors.push({
            sheetIdx: 0,
            row: 1, // row index in data array (1 = second row where report value usually sits)
            col: valueIdx,
            message: "القيمة النهائية للتقرير لا تساوي مجموع القيم النهائية للأصول"
          } as any);
        }
      }
    }

    excelDataSheets.forEach((sheet, sheetIdx) => {
      if (!sheet || sheet.length === 0) return;

      // clone sheet data to avoid mutating original state
      const newSheetData = sheet.map((r) => (Array.isArray(r) ? [...r] : r));

      // نضيف رسائل الأخطاء إلى الخلايا المناسبة
      const errorsForThisSheet = allErrors.filter((e: any) => e.sheetIdx === sheetIdx);

      errorsForThisSheet.forEach((err: any) => {
        const r = err.row;
        const c = err.col;
        // تأكد وجود الصف
        if (!newSheetData[r]) newSheetData[r] = [];
        const oldVal = newSheetData[r][c] === undefined || newSheetData[r][c] === null ? "" : newSheetData[r][c];
        // نلصق القيمة القديمة ثم مسافة ثم رسالة التحذير
        newSheetData[r][c] = `${oldVal} ⚠ ${err.message}`;
      });

      // نحول إلى worksheet
      const ws = XLSX.utils.aoa_to_sheet(newSheetData);

      // تلوين الخلايا التي تحتوي على التحذير
      Object.keys(ws).forEach((cellRef) => {
        if (cellRef[0] === "!") return; // تجاهل المفاتيح الخاصة
        const cell = ws[cellRef];
        const v = (cell && cell.v) ? cell.v.toString() : "";
        if (v.includes("⚠")) {
          // نمط الخلية: خلفية صفراء ونص أحمر عريض
          cell.s = {
            fill: { fgColor: { rgb: "FFFF00" } },
            font: { color: { rgb: "FF0000" }, bold: true }
          };
        }
      });

      XLSX.utils.book_append_sheet(workbook, ws, `Sheet${sheetIdx + 1}`);
    });

    // حفظ الملف المعدل
    XLSX.writeFile(workbook, "corrected_report.xlsx", { bookType: "xlsx" });
  };

  // --------------------------
  // حفظ التقرير (API)
  // --------------------------
  const handleSave = async () => {
    if (!excelFile || !pdfFile) return;
    if (!isExcelValid) {
      setExcelError("يوجد أخطاء في البيانات، يرجى تصحيحها قبل الحفظ.");
      return;
    }
    try {
      const response: any = await extractReportData(excelFile, [pdfFile]);
      if (response.status === "FAILED" && response.error) {
        setExcelError(response.error);
        return;
      }
      if (response.status === "SAVED" || response.status === "SUCCESS") {
        setTimeout(() => {
          setShowSuccess(true);
        }, 3500);
        navigate("/equipment/viewReports");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // --------------------------
  // JSX
  // --------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 pb-16">
      <div className="max-w-3xl mx-auto pt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center drop-shadow">
            إنشاء تقرير جديد للأصول
          </h1>
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

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={downloadCorrectedExcel}
                disabled={!excelFile || isExcelValid}
                className={`px-6 py-2 border rounded-full font-semibold transition-colors shadow-lg ${
                  excelFile
                    ? "border-yellow-600 text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                    : "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                }`}
              >
                تنزيل ملف معدل
              </button>

              <button
                onClick={handleSave}
                disabled={!excelFile || !pdfFile || !isExcelValid}
                className={`px-8 py-2 border rounded-full font-semibold transition-colors shadow-lg ${
                  excelFile && pdfFile && isExcelValid
                    ? "border-blue-600 text-white bg-blue-600 hover:bg-blue-700"
                    : "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                }`}
              >
                حفظ التقرير
              </button>
            </div>

            {/* رسائل الأخطاء - صندوق موحد يشمل كل الرسائل بما فيها تطابق القيمة النهائية */}
            {!isExcelValid && (
              <div className="mb-6 flex flex-col items-center">
                <div className="w-full max-w-xl bg-gradient-to-r from-red-100 via-yellow-100 to-red-100 border-2 border-red-400 rounded-xl shadow-lg p-4 animate-pulse">
                  <div className="flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-red-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" /></svg>
                    <span className="text-xl font-bold text-red-700">تنبيه!</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {hasEmptyFields(excelDataSheets) && (
                      <div className="flex items-center border border-red-300 rounded-lg bg-white p-3 shadow-sm">
                        <span className="text-red-600 text-2xl ml-3">❗</span>
                        <span className="text-red-700 font-semibold text-lg text-right w-full">يوجد حقول فارغه بدون قيمه من فضلك قم بملء الحقل ببيانات صحيحه</span>
                      </div>
                    )}
                    {hasFractionInFinalValue(excelDataSheets) && (
                      <div className="flex items-center border border-red-300 rounded-lg bg-white p-3 shadow-sm">
                        <span className="text-red-600 text-2xl ml-3">❗</span>
                        <span className="text-red-700 font-semibold text-lg text-right w-full">من فضلك ادخل قيمه صحيحه في القيمه النهائيه (يجب أن يكون الرقم بدون كسور)</span>
                      </div>
                    )}
                    {hasInvalidPurposeId(excelDataSheets) && (
                      <div className="flex items-center border border-red-300 rounded-lg bg-white p-3 shadow-sm">
                        <span className="text-red-600 text-2xl ml-3">❗</span>
                        <span className="text-red-700 font-semibold text-lg text-right w-full">يوجد قيم غير مسموح بها في عمود الغرض (purpose_id)</span>
                      </div>
                    )}
                    {hasInvalidValuePremiseId(excelDataSheets) && (
                      <div className="flex items-center border border-red-300 rounded-lg bg-white p-3 shadow-sm">
                        <span className="text-red-600 text-2xl ml-3">❗</span>
                        <span className="text-red-700 font-semibold text-lg text-right w-full">يوجد قيم غير مسموح بها في عمود أساس القيمة (value_premise_id)</span>
                      </div>
                    )}
                    {/* أضفنا هنا رسالة تطابق القيمة النهائية داخل نفس الصندوق */}
                    {!isReportValueValid && (
                      <div className="flex items-center border border-red-300 rounded-lg bg-white p-3 shadow-sm">
                        <span className="text-yellow-600 text-2xl ml-3">⚠️</span>
                        <span className="text-red-700 font-semibold text-lg text-right w-full">القيمة النهائية للتقرير لا تساوي مجموع القيم النهائية للأصول</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {finalValueSum > 0 && (
              <div className="mb-6 flex justify-center">
                <div className="bg-gradient-to-r from-green-100 via-blue-100 to-green-100 border-2 border-green-400 rounded-xl shadow-lg px-8 py-4 flex items-center gap-4">
                  <span className="text-2xl text-green-700 font-bold">💰</span>
                  <span className="text-xl font-bold text-green-700">إجمالي القيم النهائية للأصول: </span>
                  <span className="text-2xl font-extrabold text-blue-900">{finalValueSum.toLocaleString()}</span>
                </div>
              </div>
            )}
                        {/* رسالة نجاح: الملف جاهز للحفظ أو الإرسال */}
            {excelFile && isExcelValid && finalValueSum > 0 && (
              <div className="mb-6 flex justify-center">
                <div className="bg-gradient-to-r from-green-100 via-blue-100 to-green-100 border-2 border-green-400 rounded-xl shadow-lg px-8 py-4 flex flex-col items-center gap-2">
                  <span className="text-2xl text-green-700 font-bold">🎉 الملف جاهز للحفظ </span>
                  <span className="text-lg text-blue-800 font-semibold">يمكنك الآن حفظ التقرير </span>
                </div>
              </div>
            )}

            {excelDataSheets.length > 0 && excelDataSheets.map((sheet, sheetIdx) => (
              sheetIdx === 3 ? null : (
                <div key={sheetIdx} className="overflow-auto border rounded-2xl mb-8 shadow-lg bg-white">
                  <div className="font-bold mb-2 text-blue-700 text-lg text-center">
                    {sheetIdx === 0 ? "بيانات التقرير" : sheetIdx === 1 ? "بيانات الأصول - أسلوب السوق" : "بيانات الأصول - أسلوب التكلفة"}
                  </div>
                  <table className="min-w-full text-sm border-collapse" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        {sheet[0]?.map((header: any, idx: number) => (
                          <th key={idx} className="px-4 py-2 border-b border-r text-center font-semibold" style={{ minWidth: '120px', background: '#d0f5df', color: '#222', fontSize: '1.1rem', fontFamily: 'Cairo, monospace' }}>{header ?? ""}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sheetIdx === 0
                        ? [sheet[1]].map((row: any[], i: number) => (
                            <tr key={i} className="hover:bg-blue-50 transition">
                              {Array(sheet[0]?.length).fill(0).map((_, j) => (
                                <td
                                  key={j}
                                  className={`px-4 py-2 border-b border-r text-center ${row[j] === undefined || row[j] === "" ? "bg-yellow-200 border-red-400 animate-pulse" : "bg-white"}`}
                                  style={{ background: row[j] === undefined || row[j] === "" ? '#ffe066' : '#fff', minWidth: '120px', fontFamily: 'Cairo, monospace', fontSize: '1rem', border: row[j] === undefined || row[j] === "" ? '2px solid #ff9800' : undefined }}
                                >
                                  {row[j] === undefined || row[j] === "" ? "" : row[j]}
                                </td>
                              ))}
                            </tr>
                          ))
                        : sheet.slice(1).map((row: any[], i: number) => (
                            <tr key={i} className="hover:bg-green-50 transition">
                              {Array(sheet[0]?.length).fill(0).map((_, j) => (
                                <td
                                  key={j}
                                  className={`px-4 py-2 border-b border-r text-center ${row[j] === undefined || row[j] === "" ? "bg-yellow-200 border-red-400 animate-pulse" : "bg-white"}`}
                                  style={{ background: row[j] === undefined || row[j] === "" ? '#ffe066' : '#fff', minWidth: '120px', fontFamily: 'Cairo, monospace', fontSize: '1rem', border: row[j] === undefined || row[j] === "" ? '2px solid #ff9800' : undefined }}
                                >
                                  {row[j] === undefined || row[j] === "" ? "" : row[j]}
                                </td>
                              ))}
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              )
            ))}
          </div>

          {showSuccess && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
              تم حفظ التقرير بنجاح
              <button
                onClick={() => setShowSuccess(false)}
                className="ml-3 text-sm underline hover:text-gray-200"
              >
                إغلاق
              </button>
            </div>
          )}

          {excelError && (
            <div className="mt-4 text-center text-red-600 font-semibold">
              {excelError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateReport;