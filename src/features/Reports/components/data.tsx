// data.ts
import { AlertTriangle, Calendar, Check, FileText, MapPin, Edit, Trash2, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../../shared/utils/api';
import type { Report } from './types';

// Extended Report type to include procedures
interface ExtendedReport extends Report {
  procedures?: string[];
}

// Database Report interface matching the ACTUAL response from backend
interface DBReport {
  id: string;
  title: string | { value: string; label_ar: string; label_en: string };
  reportType: string | { value: string; label_ar: string; label_en: string };
  valuationDate: string;
  submissionDate: string;
  finalValue: number;
  currency: number | { value: number; label_ar: string; label_en: string };
  clientName: string | { value: string; label_ar: string; label_en: string };
  clientEmail: string;
  clientPhone: string;
  assetType: number | { value: number; label_ar: string; label_en: string };
  assetUsage: number | { value: number; label_ar: string; label_en: string };
  inspectionDate: string;
  country: number | { value: number; label_ar: string; label_en: string };
  region: number | { value: number; label_ar: string; label_en: string };
  city: number | { value: number; label_ar: string; label_en: string };
  address: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  certificateNumber: string;
  landArea: number;
  buildingArea: number;
  assetAge: number;
  createdAt: string;
  updatedAt: string;
}

interface ReportFilters {
  reportTitle?: string;
  country?: string;
  region?: string;
  city?: string;
  assetType?: string;
  assetUsage?: string;
  valuationPurpose?: string;
  reportType?: string;
  fromDate?: string;
  toDate?: string;
  clientName?: string;
  certificateNumber?: string;
  page?: number;
  limit?: number;
}

// Report Statistics interface
interface ReportStats {
  totalReports: number;
  totalValue: number;
  averageValue: number;
  reportTypes: string[];
  countries: number[];
}

// Hook for fetching reports from database
export const useReportsData = () => {
  const [reports, setReports] = useState<ExtendedReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReports: 0,
    hasNext: false,
    hasPrev: false
  });

  // Fetch reports with filters
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
        // Check if reports array exists and has data
        const reportsArray = response.data.data?.reports || [];
        
        if (reportsArray.length === 0) {
          // No data in database - set empty array
          console.log('No reports found in database');
          setReports([]);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalReports: 0,
            hasNext: false,
            hasPrev: false
          });
          return;
        }

        // Transform DB data to match existing interface
        const transformedReports: ExtendedReport[] = reportsArray.map((dbReport: DBReport, index: number) => {
          // Debug log to see actual structure
          console.log(`Transforming report ${index + 1}:`, dbReport);
          
          return {
            id: index + 1,
            reportName: extractLabel(dbReport.title) || 'Unnamed Report',
            reportType: extractLabel(dbReport.reportType) || 'PDF',
            source: extractLabel(dbReport.clientName) || 'Unknown Client',
            size: calculateFileSize(extractValue(dbReport.finalValue)),
            date: dbReport.valuationDate ? new Date(dbReport.valuationDate).toLocaleDateString('en-GB') : 'No Date',
            status: 'مكتمل',
            equipmentType: getAssetTypeName(extractValue(dbReport.assetType)),
            location: getLocationName(
              extractValue(dbReport.country), 
              extractValue(dbReport.region), 
              extractValue(dbReport.city)
            ),
            referenceNo: extractValue(dbReport.certificateNumber) || `REP-${String(dbReport.id).slice(-6)}`,
            quantity: String(extractValue(dbReport.landArea) || '0'),
            condition: 'جيد',
            propertyType: getAssetTypeName(extractValue(dbReport.assetType)),
            reference: extractValue(dbReport.certificateNumber),
            site: getLocationName(
              extractValue(dbReport.country), 
              extractValue(dbReport.region), 
              extractValue(dbReport.city)
            ),
            name: extractLabel(dbReport.clientName),
            procedures: ['an_offer', 'amendment', 'delete', 'send']
          };
        });
        
        setReports(transformedReports);
        setPagination(response.data.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalReports: transformedReports.length,
          hasNext: false,
          hasPrev: false
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch reports');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching reports:', err);
      
      // Set empty array on error - don't use fallback data
      setReports([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalReports: 0,
        hasNext: false,
        hasPrev: false
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch report statistics
  const fetchStats = async () => {
    try {
      const response = await api.get('/reports/stats');
      if (response.data.success) {
        setStats(response.data.data.statistics);
      } else {
        // Set empty stats if no data
        setStats({
          totalReports: 0,
          totalValue: 0,
          averageValue: 0,
          reportTypes: [],
          countries: []
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setStats({
        totalReports: 0,
        totalValue: 0,
        averageValue: 0,
        reportTypes: [],
        countries: []
      });
    }
  };

  // Search reports
  const searchReports = async (searchTerm: string, filters: ReportFilters = {}) => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/reports/search', {
        searchTerm: searchTerm.trim(),
        filters
      });

      if (response.data.success) {
        const reportsArray = response.data.data?.reports || [];
        
        if (reportsArray.length === 0) {
          setReports([]);
          return;
        }

        const transformedReports: ExtendedReport[] = reportsArray.map((dbReport: DBReport, index: number) => ({
          id: index + 1,
          reportName: extractLabel(dbReport.title) || 'Unnamed Report',
          reportType: extractLabel(dbReport.reportType) || 'PDF',
          source: extractLabel(dbReport.clientName) || 'Unknown Client',
          size: calculateFileSize(extractValue(dbReport.finalValue)),
          date: dbReport.valuationDate ? new Date(dbReport.valuationDate).toLocaleDateString('en-GB') : 'No Date',
          status: 'مكتمل',
          equipmentType: getAssetTypeName(extractValue(dbReport.assetType)),
          location: getLocationName(
            extractValue(dbReport.country), 
            extractValue(dbReport.region), 
            extractValue(dbReport.city)
          ),
          referenceNo: extractValue(dbReport.certificateNumber) || `REP-${String(dbReport.id).slice(-6)}`,
          quantity: String(extractValue(dbReport.landArea) || '0'),
          condition: 'جيد',
          propertyType: getAssetTypeName(extractValue(dbReport.assetType)),
          reference: extractValue(dbReport.certificateNumber),
          site: getLocationName(
            extractValue(dbReport.country), 
            extractValue(dbReport.region), 
            extractValue(dbReport.city)
          ),
          name: extractLabel(dbReport.clientName),
          procedures: ['an_offer', 'amendment', 'delete', 'send']
        }));

        setReports(transformedReports);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('Error searching reports:', err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshReports = () => {
    fetchReports();
    fetchStats();
  };

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  return {
    reports,
    loading,
    error,
    stats,
    pagination,
    fetchReports,
    searchReports,
    refreshReports
  };
};

// Helper functions for data transformation
const extractValue = (field: any): any => {
  // Handle objects with {value, label_ar, label_en} structure
  if (field && typeof field === 'object' && field.value !== undefined) {
    return field.value;
  }
  return field;
};

const extractLabel = (field: any, lang: 'ar' | 'en' = 'ar'): string => {
  // Extract label from objects with {value, label_ar, label_en} structure
  if (field && typeof field === 'object') {
    if (lang === 'ar' && field.label_ar) return field.label_ar;
    if (lang === 'en' && field.label_en) return field.label_en;
    if (field.value !== undefined) return String(field.value);
  }
  return String(field || '');
};

const calculateFileSize = (value: number): string => {
  if (!value) return '0.1 MB';
  const sizeInMB = Math.max(0.1, value / 1000000); // Convert value to approximate file size
  return `${sizeInMB.toFixed(1)} MB`;
};

const getAssetTypeName = (assetTypeId: number): string => {
  // Map asset type IDs to names - you can expand this based on your data
  const assetTypes: { [key: number]: string } = {
    1: 'سكني',
    2: 'تجاري', 
    3: 'صناعي',
    4: 'زراعي',
    5: 'إداري',
    // Add more mappings as needed
  };
  return assetTypes[assetTypeId] || 'غير محدد';
};

const getLocationName = (countryId: number, regionId: number, cityId: number): string => {
  // Map location IDs to names - you can expand this based on your data
  const countries: { [key: number]: string } = {
    1: 'السعودية',
    // Add more countries as needed
  };
  
  const regions: { [key: number]: string } = {
    1: 'الرياض',
    2: 'مكة المكرمة',
    3: 'المنطقة الشرقية',
    4: 'عسير',
    5: 'جازان',
    // Add more regions as needed
  };
  
  const cities: { [key: number]: string } = {
    1: 'الرياض',
    2: 'جدة', 
    3: 'الدمام',
    4: 'الطائف',
    5: 'المدينة المنورة',
    // Add more cities as needed
  };

  const country = countries[countryId] || 'غير محدد';
  const region = regions[regionId] || 'غير محدد';
  const city = cities[cityId] || 'غير محدد';
  
  return `${city}, ${region}`;
};


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