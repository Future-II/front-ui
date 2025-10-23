import React from 'react';
import { ExcelError } from '../../types';
import { formatCellValue } from '../../utils/excelValidation';

interface DataTablesProps {
  showTables: boolean;
  excelDataSheets: any[][][];
  excelErrors: ExcelError[];
}

const DataTables: React.FC<DataTablesProps> = ({
  showTables,
  excelDataSheets,
  excelErrors
}) => {
  if (!showTables) return null;

  if (excelDataSheets.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 py-6">
        لا توجد جداول للعرض حالياً — ارفع ملف إكسل أولاً
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {excelDataSheets.slice(0, 3).map((sheet, sheetIdx) => {
        const title = sheetIdx === 0 
          ? "بيانات التقرير" 
          : sheetIdx === 1 
            ? "بيانات الأصول - أسلوب السوق" 
            : "بيانات الأصول - أسلوب التكلفة";
        
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
                    <th key={idx} className="px-2 py-1 text-center font-medium text-gray-800 border border-gray-400">
                      {hd ?? ""}
                    </th>
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
                        const hasError = excelErrors.some(e => 
                          e.sheetIdx === sheetIdx && 
                          e.row === (sheetIdx === 0 ? 1 : rIdx + 1) && 
                          e.col === cIdx
                        );
                        const bgColor = hasError ? "#FDD017" : isEmpty ? "#FEF3C7" : "";
                        
                        return (
                          <td
                            key={cIdx}
                            className="px-2 py-1 text-center align-middle border border-gray-400"
                            style={{ minWidth: 120, fontFamily: "Cairo, sans-serif", backgroundColor: bgColor }}
                          >
                            {isEmpty ? (
                              <span className="text-xs text-red-500 font-medium">مفقود</span>
                            ) : (
                              formatCellValue(val, headerName)
                            )}
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
  );
};

export default DataTables;