import { api } from "../../shared/utils/api";

// Keep your existing functions
export const taqeemLogin = async (email: string, password: string, otp?: string) => {
  try {
    const response = await api.post('/scripts/taqeemLogin', {
      email,
      password,
      otp, 
    });
    return response.data;
  } catch (error) {
    throw new Error('Error logging in');
  }
};

export const uploadFiles = async (excelFile: File, pdfFiles: any[]) => {
  const formData = new FormData();
  formData.append('excel', excelFile);

  Array.from(pdfFiles).forEach(file => {
    formData.append('pdfs', file);
  });

  try {
    const response = await api.post('/scripts/taqeemLogin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error uploading files');
  }
};

export const retryUpload = async (batchId: string) => {
  try {
    const response = await api.post(`/scripts/retryTaqeem/${batchId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error retrying upload');
  }
};

// Add new reports functions
export interface ReportFilters {
  reportName?: string;
  site?: string;
  propertyType?: string;
  condition?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  referenceNo?: string;
}

export interface DBReport {
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

export interface ReportsResponse {
  success: boolean;
  data: {
    reports: DBReport[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalReports: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export const getReports = async (filters: ReportFilters = {}): Promise<ReportsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/reports?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const getReport = async (id: string) => {
  try {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};