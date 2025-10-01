import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import UploadBlock from "../components/UploadBlock";
import { extractReportData } from "../api";

const CreateReport: React.FC = () => {
  const navigate = useNavigate();

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [excelDataSheets, setExcelDataSheets] = useState<any[][][]>([]);
  const [excelError, setExcelError] = useState<string>("");

  const handleExcelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setExcelFile(files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetsData: any[][][] = workbook.SheetNames.map(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        });
        setExcelDataSheets(sheetsData);
        setExcelError("");
      };
      reader.readAsArrayBuffer(files[0]);
    }
  };

  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) setPdfFile(files[0]);
  };

  // تحقق من الحقول الفارغة بناءً على ما يظهر في الجدول فقط
const hasEmptyFields = (sheets: any[][][]) => {
  for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;

    let startCol = 0;
    if ((sheetIdx === 1 || sheetIdx === 2) && (sheet[0][0] === undefined || sheet[0][0] === "")) {
      startCol = 1;
    }

    const headerLength = rowLength(sheet[0]); // الطول الفعلي للهيدر

    // تحقق فقط من الصفوف بعد الهيدر
    for (let i = 1; i < sheet.length; i++) {
      const rowLen = rowLength(sheet[i]); // الطول الفعلي للصف
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
  const allowedPurposeIds = [1,2,5,6,8,9,10,12,14];
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
  const allowedValuePremiseIds = [1,2,3,4,5];
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
    const errors: { count: number; message: string }[] = [];
    let emptyCount = 0;
    for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
      const sheet = sheets[sheetIdx];
      if (!sheet || sheet.length < 2) continue;
      let startCol = 0;
      if ((sheetIdx === 1 || sheetIdx === 2) && (sheet[0][0] === undefined || sheet[0][0] === "")) {
        startCol = 1;
      }
      // تحقق فقط من الصفوف بعد الهيدر (أي من الصف الثاني وما بعده)
      for (let i = 1; i < sheet.length; i++) {
        // استخدم طول الهيدر فقط للتحقق من الأعمدة
        for (let j = startCol; j < sheet[0]?.length; j++) {
          // فقط إذا كان الحقل فعلاً غير معرف أو فارغ (وليس موجود في البيانات)
          if ((j < rowLength(sheet[i])) && (sheet[i][j] === undefined || sheet[i][j] === "")) {
            emptyCount++;
          }
        }
      }
    }
    if (emptyCount > 0) {
      errors.push({ count: emptyCount, message: "يوجد حقول فارغه بدون قيمه من فضلك قم بملء الحقل ببيانات صحيحه" });
    }
    let fractionCount = 0;
    for (let sheetIdx = 1; sheetIdx <= 2; sheetIdx++) {
      const sheet = sheets[sheetIdx];
      if (!sheet || sheet.length < 2) continue;
      const finalValueIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "final_value");
      if (finalValueIdx === -1) continue;
      for (let i = 1; i < sheet.length; i++) {
        const val = sheet[i][finalValueIdx];
        if (val !== undefined && val !== "" && !Number.isInteger(Number(val))) {
          fractionCount++;
        }
      }
    }
    if (fractionCount > 0) {
      errors.push({ count: fractionCount, message: "من فضلك ادخل قيمه صحيحه في القيمه النهائيه (يجب أن يكون الرقم بدون كسور)" });
    }
    return errors;
  };

  // helper: get actual row length
  function rowLength(row: any[]) {
    if (!row) return 0;
    let lastIdx = row.length - 1;
    while (lastIdx >= 0 && (row[lastIdx] === undefined || row[lastIdx] === "")) {
      lastIdx--;
    }
    return lastIdx + 1;
  }

  // دالة لحساب مجموع عمود final_value في شيت 2 و 3
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

  // تحقق من تطابق مجموع final_value مع قيمة value في الشيت الأول
  function isReportValueEqualToAssetsSum(sheets: any[][][], assetsSum: number) {
    const sheet1 = sheets[0];
    if (!sheet1 || sheet1.length < 2) return true;
    const valueIdx = sheet1[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "value");
    if (valueIdx === -1) return true;
    const reportValue = sheet1[1]?.[valueIdx];
    if (reportValue === undefined || reportValue === "" || isNaN(Number(reportValue))) return true;
    return Number(reportValue) === assetsSum;
  }

  // تحقق من جميع الدوال قبل الحفظ
  const isExcelValid =
    !hasEmptyFields(excelDataSheets) &&
    !hasFractionInFinalValue(excelDataSheets) &&
    !hasInvalidPurposeId(excelDataSheets) &&
    !hasInvalidValuePremiseId(excelDataSheets);

  const handleSave = async () => {
    if (!excelFile || !pdfFile) return;
    if (!isExcelValid) {
      setExcelError("يوجد أخطاء في البيانات، يرجى تصحيحها قبل الحفظ.");
      return;
    }
    // إذا لم توجد أخطاء انتقل للحفظ
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

  const excelErrors = getExcelErrors(excelDataSheets);
  const finalValueSum = getFinalValueSum(excelDataSheets);
  const isReportValueValid = isReportValueEqualToAssetsSum(excelDataSheets, finalValueSum);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 pb-16">
      <div className="max-w-3xl mx-auto pt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center drop-shadow">إنشاء تقرير جديد للأصول</h1>
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
            <div className="flex justify-end mt-8">
              <button
                onClick={handleSave}
                disabled={!excelFile || !pdfFile || !isExcelValid}
                className={`
                  px-8 py-2 border rounded-full font-semibold transition-colors shadow-lg
                  ${excelFile && pdfFile && isExcelValid
                    ? "border-blue-600 text-white bg-blue-600 hover:bg-blue-700" 
                    : "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                  }
                `}
              >
                حفظ التقرير
              </button>
            </div>
            {/* رسائل الأخطاء بناءً على دوال التحقق */}
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
                  </div>
                </div>
              </div>
            )}
            {!isReportValueValid && (
              <div className="mb-6 flex justify-center">
                <div className="bg-gradient-to-r from-red-100 via-yellow-100 to-red-100 border-2 border-red-400 rounded-xl shadow-lg px-8 py-4 flex items-center gap-4">
                  <span className="text-2xl text-red-700 font-bold">⚠️</span>
                  <span className="text-xl font-bold text-red-700">القيمه النهائي للتقرير لا يساوي مجموع القيم النهائيه للأصول</span>
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
        </div>
      </div>
    </div>
  );
};

export default CreateReport;
