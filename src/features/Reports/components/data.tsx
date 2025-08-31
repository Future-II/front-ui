// data.ts
import { AlertTriangle, Calendar, Check, FileText, MapPin, Edit, Trash2, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../../shared/utils/api';
import type { Report } from './types';

// Extended Report type to include procedures
interface ExtendedReport extends Report {
  procedures?: string[];
}

// Database Report interface matching MongoDB structure
interface DBReport {
  _id: string;
  reportName: string;
  reportType: string;
  source: string;
  size: string;
  date: string;
  status: string;
  equipmentType: string;
  location: string;
  referenceNo: string;
  quantity: string;
  condition: string;
  propertyType: string;
  reference: string | null;
  site: string | null;
  name: string | null;
  area: string;
  value: number;
  priority: 'High' | 'middle' | 'low';
  procedures: string[];
  presentedBy: string;
  createdAt: string;
  updatedAt: string;
}


interface ReportFilters {
  reportName?: string;
  site?: string;
  propertyType?: string;
  condition?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

// Hook for fetching reports from database
export const useReportsData = () => {
  const [reports, setReports] = useState<ExtendedReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReports: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchReports = async (filters: ReportFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await api.get(`/reports?${queryParams.toString()}`);
      
      if (response.data.success) {
        // Transform DB data to match existing interface
        const transformedReports: ExtendedReport[] = response.data.data.reports.map((dbReport: DBReport, index: number) => ({
          id: index + 1,
          reportName: dbReport.reportName,
          reportType: dbReport.reportType,
          source: dbReport.source,
          size: dbReport.size,
          date: new Date(dbReport.date).toLocaleDateString('en-GB'),
          status: dbReport.status,
          equipmentType: dbReport.equipmentType,
          location: dbReport.location,
          referenceNo: dbReport.referenceNo,
          quantity: dbReport.quantity,
          condition: dbReport.condition,
          propertyType: dbReport.propertyType,
          reference: dbReport.reference,
          site: dbReport.site,
          name: dbReport.name,
          procedures: dbReport.procedures || ['an_offer', 'amendment', 'delete', 'send']
        }));
        
        setReports(transformedReports);
        setPagination(response.data.data.pagination);
      } else {
        throw new Error('Failed to fetch reports');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshReports = () => {
    fetchReports();
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    error,
    pagination,
    fetchReports,
    refreshReports
  };
};

// Fallback manual data (keep as backup)
export const reportData: ExtendedReport[] = [
  {
    id: 1, reportName: 'بيانات معدات الرياض', reportType: 'XLSX', source: 'نظام المعدات', size: '1.6 MB', date: '15/05/2023', status: 'مكتمل', equipmentType: 'شاحنة نقالة', location: 'الرياض', referenceNo: '20230419-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined,
    site: undefined,
    name: undefined,
    procedures: ['an_offer', 'amendment', 'delete', 'send']
  },
  {
    id: 2, reportName: 'قائمة معدات الرياض', reportType: 'PDF', source: 'نظام المعدات', size: '0.9 MB', date: '12/05/2023', status: 'مكتمل', equipmentType: 'آلية متحركة', location: 'الرياض', referenceNo: '20230429-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined,
    site: undefined,
    name: undefined,
    procedures: ['an_offer', 'amendment', 'delete', 'send']
  },
  {
    id: 3, reportName: 'تقرير معدات جدة', reportType: 'CSV', source: 'نظام المعدات', size: '0.7 MB', date: '10/05/2023', status: 'مكتمل', equipmentType: 'حفارة', location: 'جدة', referenceNo: '20230413-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined,
    site: undefined,
    name: undefined,
    procedures: ['an_offer', 'amendment', 'delete', 'send']
  },
  {
    id: 4, reportName: 'بيانات معدات لوجي', reportType: 'XLSX', source: 'نظام المعدات', size: '1.2 MB', date: '08/05/2023', status: 'مكتمل', equipmentType: 'شاحنة نقالة', location: 'لوجي', referenceNo: '20230517-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined,
    site: undefined,
    name: undefined,
    procedures: ['an_offer', 'amendment', 'delete', 'send']
  },
  {
    id: 5, reportName: 'షషرير معدات الدمام', reportType: 'XLSX', source: 'نظام المعدات', size: '0.8 MB', date: '05/05/2023', status: 'مكتمل', equipmentType: 'آلية متحركة', location: 'الدمام', referenceNo: '20230428-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined,
    site: undefined,
    name: undefined,
    procedures: ['an_offer', 'amendment', 'delete', 'send']
  },
  {
    id: 6, reportName: 'تقرير معدات الدمام', reportType: 'XLSX', source: 'نظام المعدات', size: '0.8 MB', date: '01/05/2023', status: 'مكتمل', equipmentType: 'آلية متحركة', location: 'الدمام', referenceNo: '20230428-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined,
    site: undefined,
    name: undefined,
    procedures: ['an_offer', 'amendment', 'delete', 'send']
  },
  {
    id: 7, reportName: 'بيانات معدات الرياض', reportType: 'XLSX', source: 'نظام المعدات', size: '6.3 MB', date: '28/04/2023', status: 'مكتمل', equipmentType: 'شاحنة نقالة', location: 'الرياض', referenceNo: '20230418-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined,
    site: undefined,
    name: undefined,
    procedures: ['an_offer', 'amendment', 'delete', 'send']
  },
  {
    id: 8, reportName: 'بيانات معدات الرياض', reportType: 'XLSX', source: 'نظام المعدات', size: '5.2 MB', date: '25/04/2023', status: 'مكتمل', equipmentType: 'شاحنة نقالة', location: 'الرياض', referenceNo: '20230415-1', quantity: '1',
    condition: '',
    propertyType: '',
    reference: undefined,
    site: undefined,
    name: undefined,
    procedures: ['amendment', 'delete', 'send']
  }
];

// Column defs matching Screenshot 2 UI precisely
export const columns = [
  {
    header: "reportTable.id",
    accessor: "id",
    className: "w-12 tabular-nums text-gray-700",
    render: (v: string | number) => <span className="tabular-nums">{v}</span>,
  },
  {
    header: "reportTable.reportName",
    accessor: "reportName",
    className: "min-w-[280px]",
    render: (_: string, row: ExtendedReport) => (
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
  {
    header: "reportTable.reference",
    accessor: "referenceNo",
    className: "min-w-[120px] text-gray-700",
    render: (v: string) => <span className="tabular-nums">{v}</span>,
  },
  {
    header: "reportTable.presentedBy",
    accessor: "source",
    className: "min-w-[190px]",
    render: (v: string) => (
      <div className="leading-tight">
        <div className="font-medium text-gray-900">{v}</div>
        <div className="text-xs text-gray-500">قسم العقارات</div>
      </div>
    ),
  },
  {
    header: "reportTable.propertyType",
    accessor: "equipmentType",
    className: "min-w-[160px]",
    render: (v: string) => (
      <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-100">
        {v}
      </span>
    ),
  },
  {
    header: "reportTable.theSite",
    accessor: "location",
    className: "min-w-[140px]",
    render: (v: string) => (
      <div className="flex items-center gap-1.5 text-gray-700">
        <MapPin className="h-4 w-4 text-gray-400" />
        <span>{v}</span>
      </div>
    ),
  },
  {
    header: "reportTable.area",
    accessor: "quantity",
    className: "w-24",
    render: (v: string | number) => (
      <div className="text-gray-900">
        {v} <span className="text-gray-500 text-xs">m²</span>
      </div>
    ),
  },
  {
    header: "reportTable.value",
    accessor: "__value",
    className: "min-w-[120px]",
    render: (_: any, row: ExtendedReport) => {
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
  {
    header: "reportTable.priority",
    accessor: "__priority",
    className: "w-28",
    render: (_: any, row: ExtendedReport) => {
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
  {
    header: "reportTable.theDate",
    accessor: "date",
    className: "min-w-[120px]",
    render: (v: string) => (
      <div className="flex items-center gap-1.5 text-gray-700">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="tabular-nums">{v}</span>
      </div>
    ),
  },
  {
    header: "reportTable.theCondition",
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
  // New Procedures Column
  {
    header: "procedures",
    accessor: "procedures",
    className: "w-80 text-center",
    render: (_: any, row: ExtendedReport) => (
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            onClick={() => console.log('An offer clicked for:', row.id)}
          >
            <FileText className="h-3.5 w-3.5" />
            an offer
          </button>
          <button
            className="inline-flex items-center gap-1 rounded-md bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100 transition-colors"
            onClick={() => console.log('Amendment clicked for:', row.id)}
          >
            <Edit className="h-3.5 w-3.5" />
            amendment
          </button>
          <button
            className="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
            onClick={() => console.log('Delete clicked for:', row.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            delete
          </button>
          <button
            className="inline-flex items-center gap-1 rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
            onClick={() => console.log('Send clicked for:', row.id)}
          >
            <Send className="h-3.5 w-3.5" />
            send
          </button>
        </div>
      </div>
    ),
  },
];