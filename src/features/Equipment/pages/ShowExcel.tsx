import React, { useState, useCallback, useEffect } from "react";
import { 
  uploadExcelData, 
  getAllExcelData, 
  toggleExcelChecked,
  downloadExcelFile 
} from "../api"; // Update import path
import { Download, Upload, AlertCircle, CheckCircle, CheckSquare, Square } from "lucide-react";

interface AssetData {
  asset_name: string;
  asset_usage_id: number;
  final_value: number;
  market_approach?: string | number;
  cost_approach?: string | number;
  region?: string;
  city?: string;
}

interface ReportData {
  _id: string;
  title?: string;
  purpose_id?: number;
  value_premise_id?: number;
  report_type?: string;
  valued_at?: string;
  submitted_at?: string;
  inspection_date?: string;
  assumptions?: string;
  special_assumptions?: string;
  value?: number;
  client_name?: string;
  owner_name?: string;
  telephone?: string;
  email?: string;
  region?: string;
  city?: string;
  asset_count?: number;
  status?: string;
  error?: string;
  asset_data?: AssetData[];
  createdAt: string;
  checked?: boolean;
  market_count: number;
  cost_count: number;
}

const ShowExcel: React.FC = () => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [updatingCheck, setUpdatingCheck] = useState<string | null>(null);

  // Fetch reports on component mount - UPDATED
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getAllExcelData();
      const data: ReportData[] = response.data || [];
      const sortedReports = data.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setReports(sortedReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Handle checkbox toggle - UPDATED
  const handleCheckToggle = async (_id: string, currentChecked: boolean) => {
    const previousReports = reports;
    
    try {
      setUpdatingCheck(_id);
      
      // Optimistically update the UI
      setReports(prev => prev.map(report => 
        report._id === _id 
          ? { ...report, checked: !currentChecked }
          : report
      ));

      // Make the API call to the new endpoint
      const response = await toggleExcelChecked(_id);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update check status');
      }
      
      // Success - no need to refetch, optimistic update is correct
      
    } catch (err) {
      console.error("Error updating check status:", err);
      setError("Failed to update check status");
      
      // Revert to previous state on error
      setReports(previousReports);
      
      // Clear error after 3 seconds
      setTimeout(() => setError(""), 3000);
    } finally {
      setUpdatingCheck(null);
    }
  };

  // Handle Excel file upload - UPDATED
  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setExcelFile(files[0]);
      setError("");
      setSuccess(false);
    }
  };

  // Process the Excel file using NEW API - UPDATED
  const processExcelFile = async () => {
    if (!excelFile) {
      setError("Please select an Excel file first");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await uploadExcelData(excelFile);
      console.log('API Response:', response);
      
      if (response?.success) {
        const newReport: ReportData = {
          ...response.data,
          _id: response.data.id,
          createdAt: response.data.created_at || new Date().toISOString(),
          checked: false
        };
        
        // Add to the beginning of the array for newest first
        setReports(prev => [newReport, ...prev]);
        setSuccess(true);
        setExcelFile(null);
        
        // Refresh the reports list to get the latest from the server
        await fetchReports();
      } else {
        setError(response?.message || "Failed to upload Excel file");
      }
    } catch (err: any) {
      console.error("Error processing Excel:", err);
      setError(err.message || "An error occurred while processing the file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Convert individual report data back to Excel - UPDATED DOWNLOAD
  const downloadReportAsExcel = useCallback(async (report: ReportData) => {
    try {
      // Use the new download endpoint
      const blob = await downloadExcelFile(report._id);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename
      const filename = `${report.title || 'download'}.xlsx`;
      link.setAttribute('download', filename);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setError("");
    } catch (err) {
      console.error("Error downloading Excel:", err);
      setError("An error occurred while downloading the file");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                📈 Preview and Export Data
              </h1>
              <p className="text-gray-600 mt-2">
                Upload Excel files to preview data and export them in a structured format
              </p>
            </div>

            {/* Upload Section */}
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-dashed border-blue-200 min-w-[300px]">
              <div className="flex items-center gap-3 mb-3">
                <Upload className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Upload Excel File</h3>
              </div>
              
              <div className="space-y-3">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                
                <button
                  onClick={processExcelFile}
                  disabled={!excelFile || uploading}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Report
                    </>
                  )}
                </button>
              </div>

              {excelFile && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 text-center">
                    Selected file: <span className="font-medium">{excelFile.name}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-700 font-medium">
              Report uploaded successfully! You can now download it as an Excel file.
            </p>
          </div>
        )}

        {/* Reports Table */}
        {reports.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                Uploaded Reports ({reports.length})
              </h2>
            </div>
            
            <div className="overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => {
                    const isUpdating = updatingCheck === report._id;
                    
                    return (
                      <tr key={report._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleCheckToggle(report._id, report.checked || false)}
                            disabled={isUpdating}
                            className={`p-1 rounded transition-colors ${
                              report.checked 
                                ? 'text-green-600 hover:text-green-800' 
                                : 'text-gray-400 hover:text-gray-600'
                            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={report.checked ? "Mark as unchecked" : "Mark as checked"}
                          >
                            {isUpdating ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            ) : report.checked ? (
                              <CheckSquare className="h-5 w-5" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {report.title || "Untitled Report"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>Total: {report.market_count + report.cost_count}</div>
                            <div className="text-xs text-gray-500">
                              Market: {report.market_count} | Cost: {report.cost_count}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {report.value ? `$${report.value.toLocaleString()}` : "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => downloadReportAsExcel(report)}
                              className="text-green-600 hover:text-green-900 flex items-center gap-1"
                              title="Download as Excel"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
          </div>
        )}

        {/* Empty State */}
        {reports.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
            <div className="text-gray-400 mb-4">
              <Upload className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No reports uploaded yet</h3>
            <p className="text-gray-500">
              Upload Excel files to preview data and export them in a structured format
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowExcel;