import { AlertTriangle, Check } from 'lucide-react';
import type { Report } from './types';

export const reportData: Report[] = [
  { id: 1, reportName: 'بيانات معدات الرياض', reportType: 'XLSX', source: 'نظام المعدات', size: '1.6 MB', date: '15/05/2023', status: 'مكتمل', equipmentType: 'شاحنة نقالة', location: 'الرياض', referenceNo: '20230419-1', quantity: '1' },
  { id: 2, reportName: 'قائمة معدات الرياض',  reportType: 'PDF',  source: 'نظام المعدات', size: '0.9 MB', date: '12/05/2023', status: 'مكتمل', equipmentType: 'آلية متحركة', location: 'الرياض', referenceNo: '20230429-1', quantity: '1' },
  { id: 3, reportName: 'تقرير معدات جدة',    reportType: 'CSV',  source: 'نظام المعدات', size: '0.7 MB', date: '10/05/2023', status: 'مكتمل', equipmentType: 'حفارة',       location: 'جدة',   referenceNo: '20230413-1', quantity: '1' },
  { id: 4, reportName: 'بيانات معدات لوجي',  reportType: 'XLSX', source: 'نظام المعدات', size: '1.2 MB', date: '08/05/2023', status: 'مكتمل', equipmentType: 'شاحنة نقالة', location: 'لوجي',  referenceNo: '20230517-1', quantity: '1' },
  { id: 5, reportName: 'تقرير معدات الدمام', reportType: 'XLSX', source: 'نظام المعدات', size: '0.8 MB', date: '05/05/2023', status: 'مكتمل', equipmentType: 'آلية متحركة', location: 'الدمام', referenceNo: '20230428-1', quantity: '1' },
  { id: 6, reportName: 'تقرير معدات الدمام', reportType: 'XLSX', source: 'نظام المعدات', size: '0.8 MB', date: '01/05/2023', status: 'مكتمل', equipmentType: 'آلية متحركة', location: 'الدمام', referenceNo: '20230428-1', quantity: '1' },
  { id: 7, reportName: 'بيانات معدات الرياض', reportType: 'XLSX', source: 'نظام المعدات', size: '6.3 MB', date: '28/04/2023', status: 'مكتمل', equipmentType: 'شاحنة نقالة', location: 'الرياض', referenceNo: '20230418-1', quantity: '1' },
  { id: 8, reportName: 'بيانات معدات الرياض', reportType: 'XLSX', source: 'نظام المعدات', size: '5.2 MB', date: '25/04/2023', status: 'مكتمل', equipmentType: 'شاحنة نقالة', location: 'الرياض', referenceNo: '20230415-1', quantity: '1' }
];

export const columns = [
  { header: '#', accessor: 'id' },
  { header: 'المعرف', accessor: 'id' },
  { header: 'اسم المستخدم', accessor: 'reportName' },
  { header: 'المصدر', accessor: 'source' },
  { header: 'نوع المعدة', accessor: 'equipmentType' },
  { header: 'الموقع', accessor: 'location' },
  { header: 'المرجع', accessor: 'referenceNo' },
  { header: 'الكمية', accessor: 'quantity' },
  {
    header: 'الحالة',
    accessor: 'status',
    render: (value: string) =>
      value === 'مكتمل' ? (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center w-fit">
          <Check className="h-3 w-3 mr-1" />
          {value}
        </span>
      ) : (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center w-fit">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {value}
        </span>
      )
  }
];
