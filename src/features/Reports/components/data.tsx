// data.ts
import { AlertTriangle, Calendar, Check, FileText, MapPin } from 'lucide-react';
import type { Report } from './types';

export const reportData: Report[] = [
  {
    id: 1, reportName: 'بيانات معدات الرياض', reportType: 'XLSX', source: 'نظام المعدات', size: '1.6 MB', date: '15/05/2023', status: 'مكتمل', equipmentType: 'شاحنة نقالة', location: 'الرياض', referenceNo: '20230419-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined
  },
  {
    id: 2, reportName: 'قائمة معدات الرياض', reportType: 'PDF', source: 'نظام المعدات', size: '0.9 MB', date: '12/05/2023', status: 'مكتمل', equipmentType: 'آلية متحركة', location: 'الرياض', referenceNo: '20230429-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined
  },
  {
    id: 3, reportName: 'تقرير معدات جدة', reportType: 'CSV', source: 'نظام المعدات', size: '0.7 MB', date: '10/05/2023', status: 'مكتمل', equipmentType: 'حفارة', location: 'جدة', referenceNo: '20230413-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined
  },
  {
    id: 4, reportName: 'بيانات معدات لوجي', reportType: 'XLSX', source: 'نظام المعدات', size: '1.2 MB', date: '08/05/2023', status: 'مكتمل', equipmentType: 'شاحنة نقالة', location: 'لوجي', referenceNo: '20230517-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined
  },
  {
    id: 5, reportName: 'تقرير معدات الدمام', reportType: 'XLSX', source: 'نظام المعدات', size: '0.8 MB', date: '05/05/2023', status: 'مكتمل', equipmentType: 'آلية متحركة', location: 'الدمام', referenceNo: '20230428-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined
  },
  {
    id: 6, reportName: 'تقرير معدات الدمام', reportType: 'XLSX', source: 'نظام المعدات', size: '0.8 MB', date: '01/05/2023', status: 'مكتمل', equipmentType: 'آلية متحركة', location: 'الدمام', referenceNo: '20230428-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined
  },
  {
    id: 7, reportName: 'بيانات معدات الرياض', reportType: 'XLSX', source: 'نظام المعدات', size: '6.3 MB', date: '28/04/2023', status: 'مكتمل', equipmentType: 'شاحنة نقالة', location: 'الرياض', referenceNo: '20230418-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined
  },
  {
    id: 8, reportName: 'بيانات معدات الرياض', reportType: 'XLSX', source: 'نظام المعدات', size: '5.2 MB', date: '25/04/2023', status: 'مكتمل', equipmentType: 'شاحنة نقالة', location: 'الرياض', referenceNo: '20230415-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined
  }
];

// Column defs matching Screenshot 2 UI precisely
export const columns = [

  // ID
  {
    header: "ID",
    accessor: "id",
    className: "w-12 tabular-nums text-gray-700",
    render: (v: string | number) => <span className="tabular-nums">{v}</span>,
  },

  // REPORT NAME (file icon + type chip + size line)
  {
    header: "REPORT NAME",
    accessor: "reportName",
    className: "min-w-[280px]",
    render: (_: string, row: Report) => (
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-blue-100">
          <FileText className="h-4 w-4 text-blue-600" />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-gray-900 leading-5 line-clamp-2">{row.reportName}</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 uppercase tracking-wide">
              {row.reportType || "PDF"}
            </span>
            <span className="text-gray-400">•</span>
            <span>{row.size}</span>
          </div>
        </div>
      </div>
    ),
  },

  // REFERENCE
  {
    header: "REFERENCE",
    accessor: "referenceNo",
    className: "min-w-[120px] text-gray-700",
    render: (v: string) => <span className="tabular-nums">{v}</span>,
  },

  // PRESENTED BY (two lines)
  {
    header: "PRESENTED BY",
    accessor: "source",
    className: "min-w-[190px]",
    render: (v: string) => (
      <div className="leading-tight">
        <div className="font-medium text-gray-900">{v}</div>
        <div className="text-xs text-gray-500">قسم العقارات</div>
      </div>
    ),
  },

  // PROPERTY TYPE pill
  {
    header: "PROPERTY TYPE",
    accessor: "equipmentType",
    className: "min-w-[160px]",
    render: (v: string) => (
      <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-100">
        {v}
      </span>
    ),
  },

  // THE SITE (pin + city)
  {
    header: "THE SITE",
    accessor: "location",
    className: "min-w-[140px]",
    render: (v: string) => (
      <div className="flex items-center gap-1.5 text-gray-700">
        <MapPin className="h-4 w-4 text-gray-400" />
        <span>{v}</span>
      </div>
    ),
  },

  // AREA (quantity + m²)
  {
    header: "AREA",
    accessor: "quantity",
    className: "w-24",
    render: (v: string | number) => (
      <div className="text-gray-900">
        {v} <span className="text-gray-500 text-xs">m²</span>
      </div>
    ),
  },

  // VALUE (derived for visuals)
  {
    header: "VALUE",
    accessor: "__value",
    className: "min-w-[120px]",
    render: (_: any, row: Report) => {
      const mb = parseFloat(String(row.size || "0").replace(/[^\d.]/g, "")) || 1;
      const val = Math.round((mb * 1_000_000) / 400);
      return (
        <div className="text-emerald-700 font-medium">
          {val.toLocaleString("en-US")}
          <span className="ml-1 text-xs text-gray-500">riyals</span>
        </div>
      );
    },
  },

  // PRIORITY (red / yellow / green)
  {
    header: "PRIORITY",
    accessor: "__priority",
    className: "w-28",
    render: (_: any, row: Report) => {
      const mb = parseFloat(String(row.size || "0").replace(/[^\d.]/g, "")) || 0;
      const level = mb >= 1.5 ? "High" : mb >= 0.9 ? "middle" : "low";
      const styles: Record<string, string> = {
        High: "bg-rose-50 text-rose-700 ring-rose-100",
        middle: "bg-amber-50 text-amber-700 ring-amber-100",
        low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      };
      return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${styles[level]}`}>
          {level}
        </span>
      );
    },
  },

  // THE DATE
  {
    header: "THE DATE",
    accessor: "date",
    className: "min-w-[120px]",
    render: (v: string) => (
      <div className="flex items-center gap-1.5 text-gray-700">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="tabular-nums">{v}</span>
      </div>
    ),
  },

  // THE CONDITION (status)
  {
    header: "THE CONDITION",
    accessor: "status",
    className: "w-36",
    render: (value: string) =>
      value === 'مكتمل' ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-100">
          <Check className="h-3.5 w-3.5" /> مكتمل
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-100">
          <AlertTriangle className="h-3.5 w-3.5" /> {value}
        </span>
      ),
  },
];
