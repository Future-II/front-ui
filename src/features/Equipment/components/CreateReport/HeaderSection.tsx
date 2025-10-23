import React from 'react';
import DownloadFirstRowExcel from '../DownloadFirstRowExcel';
import { AlertCircle } from 'lucide-react';

interface HeaderSectionProps {
  showTables: boolean;
  setShowTables: (show: boolean) => void;
  errorsModalOpen: boolean;
  setErrorsModalOpen: (open: boolean) => void;
  excelErrors: any[];
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  showTables,
  setShowTables,
  setErrorsModalOpen,
  excelErrors
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight flex items-center gap-3">
          🎯 إنشاء تقرير جديد للأصول
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <DownloadFirstRowExcel filename="/Create.xlsx" />
        <button
          onClick={() => setShowTables(!showTables)}
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
  );
};

export default HeaderSection;