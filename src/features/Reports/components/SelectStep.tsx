import React from 'react';
import { Search } from 'lucide-react';
import Table from '../../../shared/components/Common/Table';
import type { Report } from './types';

type Props = {
  columns: any[];
  data: Report[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedRows: number[];
  onRowSelect: (rowId: number) => void;
  onSelectAll: () => void;
  onContinue: () => void;
};

const SelectStep: React.FC<Props> = ({
  columns,
  data,
  searchTerm,
  setSearchTerm,
  selectedRows,
  onRowSelect,
  onSelectAll,
  onContinue
}) => {
  const filtered = data.filter(
    (r) =>
      (r.reportName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (r.source?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (r.location?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">سحب التقارير التلقائي</h3>
        <p className="text-gray-600 mb-4">
          اختر التقارير التي ترغب في سحبها وإرسالها تلقائياً إلى نظام الهيئة
        </p>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="البحث في التقارير..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filtered}
          selectable
          selectedRows={selectedRows}
          onRowSelect={onRowSelect}
          onSelectAll={onSelectAll}
        />
      </div>

      {selectedRows.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <h4 className="font-medium text-gray-900 mb-3">
            تم اختيار {selectedRows.length} تقارير
          </h4>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={onContinue}
            >
              متابعة للتحقق من البيانات
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectStep;
