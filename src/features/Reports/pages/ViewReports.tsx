import React, { useState } from 'react';
import { Search, Download, FileText, FileSpreadsheet, Archive, Check, AlertTriangle } from 'lucide-react';
import Table from '../../../shared/components/Common/Table';
const ViewReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // Sample data for the reports table
  const reportData = [{
    id: 1,
    name: 'بيانات عقارات الرياض.xlsx',
    type: 'XLSX',
    source: 'مقياس',
    size: '2.4 MB',
    date: '15/05/2023',
    status: 'مكتمل'
  }, {
    id: 2,
    name: 'تقرير التقييم العقاري.pdf',
    type: 'PDF',
    source: 'مقياس',
    size: '4.8 MB',
    date: '12/05/2023',
    status: 'مكتمل'
  }, {
    id: 3,
    name: 'قائمة العقارات التجارية.csv',
    type: 'CSV',
    source: 'نقرة',
    size: '1.2 MB',
    date: '10/05/2023',
    status: 'مكتمل'
  }, {
    id: 4,
    name: 'صور العقارات.zip',
    type: 'ZIP',
    source: 'مقياس',
    size: '15.6 MB',
    date: '08/05/2023',
    status: 'خطأ'
  }, {
    id: 5,
    name: 'بيانات عقارات جدة.xlsx',
    type: 'XLSX',
    source: 'مقياس',
    size: '3.1 MB',
    date: '05/05/2023',
    status: 'مكتمل'
  }, {
    id: 6,
    name: 'تقرير السوق العقاري.pdf',
    type: 'PDF',
    source: 'نقرة',
    size: '5.7 MB',
    date: '01/05/2023',
    status: 'مكتمل'
  }];
  const columns = [{
    header: '#',
    accessor: 'id'
  }, {
    header: 'اسم الملف',
    accessor: 'name'
  }, {
    header: 'النوع',
    accessor: 'type',
    render: (value: string) => {
      const typeIcons: Record<string, React.ReactNode> = {
        XLSX: <FileSpreadsheet className="h-4 w-4 text-green-600" />,
        PDF: <div className="h-4 w-4 text-red-600" />,
        CSV: <FileText className="h-4 w-4 text-blue-600" />,
        ZIP: <Archive className="h-4 w-4 text-purple-600" />
      };
      const typeColors: Record<string, string> = {
        XLSX: 'bg-green-100 text-green-800',
        PDF: 'bg-red-100 text-red-800',
        CSV: 'bg-blue-100 text-blue-800',
        ZIP: 'bg-purple-100 text-purple-800'
      };
      return <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[value] || 'bg-gray-100 text-gray-800'} flex items-center w-fit`}>
            {typeIcons[value]}
            <span className="mr-1">{value}</span>
          </span>;
    }
  }, {
    header: 'المصدر',
    accessor: 'source'
  }, {
    header: 'الحجم',
    accessor: 'size'
  }, {
    header: 'تاريخ الاستيراد',
    accessor: 'date'
  }, {
    header: 'الحالة',
    accessor: 'status',
    render: (value: string) => {
      if (value === 'مكتمل') {
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center w-fit">
              <Check className="h-3 w-3 ml-1" />
              {value}
            </span>;
      }
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center w-fit">
            <AlertTriangle className="h-3 w-3 ml-1" />
            {value}
          </span>;
    }
  }, {
    header: 'الإجراءات',
    accessor: '',
    render: () => <button className="text-blue-600 hover:text-blue-800">
          <Download className="h-5 w-5" />
        </button>
  }];
  const filteredData = reportData.filter(report => report.name.toLowerCase().includes(searchTerm.toLowerCase()) || report.source.toLowerCase().includes(searchTerm.toLowerCase()));
  return <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">عرض التقارير</h1>
        <p className="text-gray-600">استعراض وتحميل تقارير العقارات</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input type="text" placeholder="البحث في التقارير..." className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <Table columns={columns} data={filteredData} />
        <div className="mt-4 text-sm text-gray-500 text-left">
          عرض {filteredData.length} من أصل {reportData.length} ملف
        </div>
      </div>
    </div>;
};
export default ViewReports;