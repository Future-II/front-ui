import React, { useState, useCallback, useEffect } from "react";
import { extractReportData, getReportsData, checkHalfReport } from "../api";
import * as XLSX from "xlsx-js-style";
import { Download, Upload, AlertCircle, CheckCircle, Trash2, CheckSquare, Square } from "lucide-react";

interface AssetData {
  asset_name: string;
  asset_usage_id: number;
  final_value: number;
  market_approach?: string | number;
  cost_approach?: string | number;
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
}

const ShowExcel: React.FC = () => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [updatingCheck, setUpdatingCheck] = useState<string | null>(null);

  // Fetch reports on component mount
  const fetchReports = async () => {
    try {
      setLoading(true);
      const data: ReportData[] = await getReportsData();
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

  // Handle checkbox toggle - improved version
// In your React component - improved version
const handleCheckToggle = async (_id: string, currentChecked: boolean) => {
  const previousReports = reports; // Store for rollback
  
  try {
    setUpdatingCheck(_id);
    
    // Optimistically update the UI
    setReports(prev => prev.map(report => 
      report._id === _id 
        ? { ...report, checked: !currentChecked }
        : report
    ));

    // Make the API call
    const response = await checkHalfReport(_id);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to update check status');
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
  // Handle Excel file upload
  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setExcelFile(files[0]);
      setError("");
      setSuccess(false);
    }
  };

  // Process the Excel file using existing API
  const processExcelFile = async () => {
    if (!excelFile) {
      setError("Please select an Excel file first");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      const response: any = await extractReportData(excelFile, []);
      console.log('API Response:', response);
      
      if (response?.status === "FAILED" && response.error) {
        setError(response.error);
        return;
      }

      if (response?.data) {
        // The main data is in response.data
        const processedData = processResponseData(response.data);
        const newReport: ReportData = {
          ...processedData,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          checked: false // Default to unchecked for new reports
        };
        
        // Add to the beginning of the array for newest first
        setReports(prev => [newReport, ...prev]);
        setSuccess(true);
        setExcelFile(null); // Reset file input
        
        // Refresh the reports list to get the latest from the server
        await fetchReports();
      } else {
        setError("No data found in response");
      }
    } catch (err) {
      console.error("Error processing Excel:", err);
      setError("An error occurred while processing the file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Process the response data structure
  const processResponseData = (data: any): Omit<ReportData, '_id' | 'createdAt' | 'checked'> => {
    console.log('Processing data:', data);
    
    // Extract report info and asset data
    const reportInfo: Omit<ReportData, '_id' | 'createdAt' | 'checked'> = {
      title: data.title,
      purpose_id: data.purpose_id,
      value_premise_id: data.value_premise_id,
      report_type: data.report_type,
      valued_at: data.valued_at,
      submitted_at: data.submitted_at,
      inspection_date: data.inspection_date,
      assumptions: data.assumptions,
      special_assumptions: data.special_assumptions,
      value: data.value,
      client_name: data.client_name,
      owner_name: data.owner_name,
      telephone: data.telephone,
      email: data.email,
      region: data.region,
      city: data.city,
      asset_count: data.asset_count,
      asset_data: data.asset_data || []
    };

    // If region and city are not in the main data but are in asset_data, extract from first asset
    if ((!reportInfo.region || !reportInfo.city) && data.asset_data && data.asset_data.length > 0) {
      const firstAsset = data.asset_data[0];
      if (!reportInfo.region && firstAsset.region) {
        reportInfo.region = firstAsset.region;
      }
      if (!reportInfo.city && firstAsset.city) {
        reportInfo.city = firstAsset.city;
      }
    }

    return reportInfo;
  };

  // Convert individual report data back to Excel
  const downloadReportAsExcel = useCallback((report: ReportData) => {
    try {
      const workbook = XLSX.utils.book_new();

      // Sheet 1: Report Information
      const reportInfoSheet = createReportInfoSheet(report);
      XLSX.utils.book_append_sheet(workbook, reportInfoSheet, "report_info");

      // Sheet 2: Market Approach Assets
      const marketAssets = report.asset_data?.filter(asset => 
        asset.market_approach === 1 || asset.market_approach === "1"
      ) || [];
      
      if (marketAssets.length > 0) {
        const marketSheet = createAssetSheet(marketAssets);
        XLSX.utils.book_append_sheet(workbook, marketSheet, "market_assets");
      }

      // Sheet 3: Cost Approach Assets
      const costAssets = report.asset_data?.filter(asset => 
        asset.cost_approach === 1 || asset.cost_approach === "1"
      ) || [];
      
      if (costAssets.length > 0) {
        const costSheet = createAssetSheet(costAssets);
        XLSX.utils.book_append_sheet(workbook, costSheet, "cost_assets");
      }

      // Generate filename
      const title = report.title || "asset_report";
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${title}_${timestamp}.xlsx`;

      // Download the file
      XLSX.writeFile(workbook, filename);
      
      setError("");
    } catch (err) {
      console.error("Error generating Excel:", err);
      setError("An error occurred while creating Excel file");
    }
  }, []);

  // Create Report Info sheet with proper header layout
  const createReportInfoSheet = (data: ReportData) => {
    const reportFields = [
      { field: "title", value: data.title },
      { field: "purpose_id", value: data.purpose_id },
      { field: "value_premise_id", value: data.value_premise_id },
      { field: "report_type", value: data.report_type },
      { field: "valued_at", value: data.valued_at },
      { field: "submitted_at", value: data.submitted_at },
      { field: "inspection_date", value: data.inspection_date },
      { field: "assumptions", value: data.assumptions },
      { field: "special_assumptions", value: data.special_assumptions },
      { field: "value", value: data.value },
      { field: "client_name", value: data.client_name },
      { field: "owner_name", value: data.owner_name },
      { field: "telephone", value: data.telephone },
      { field: "email", value: data.email },
      { field: "region", value: data.region },
      { field: "city", value: data.city },
      { field: "asset_count", value: data.asset_count },
    ];

    // Filter out undefined/null values and create headers and single data row
    const validFields = reportFields.filter(field => field.value !== undefined && field.value !== null);
    
    // Create headers (field names)
    const headers = validFields.map(field => field.field);
    
    // Create single data row with values
    const dataRow = validFields.map(field => field.value);

    const sheetData = [headers, dataRow];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    applyReportInfoStyles(worksheet, headers.length, 2);

    return worksheet;
  };

  // Create Asset sheet with original field names (no approach_type)
  const createAssetSheet = (assets: AssetData[]) => {
    if (!assets || assets.length === 0) {
      return XLSX.utils.aoa_to_sheet([["No data available"]]);
    }

    // Use original field names as headers (without approach_type)
    const headers = ["asset_name", "asset_usage_id", "final_value"];
    const rows = assets.map(asset => [
      asset.asset_name,
      asset.asset_usage_id,
      asset.final_value
    ]);

    const sheetData = [headers, ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    applyAssetSheetStyles(worksheet, headers.length, assets.length + 1);

    return worksheet;
  };

  // Apply styles to report info sheet (same as asset sheets)
  const applyReportInfoStyles = (worksheet: XLSX.WorkSheet, colCount: number, rowCount: number) => {
    // Style header row
    for (let col = 0; col < colCount; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
      if (worksheet[cellRef]) {
        worksheet[cellRef].s = {
          fill: { fgColor: { rgb: "2E5BFF" } },
          font: { bold: true, color: { rgb: "FFFFFF" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "1E40AF" } },
            left: { style: "thin", color: { rgb: "1E40AF" } },
            bottom: { style: "thin", color: { rgb: "1E40AF" } },
            right: { style: "thin", color: { rgb: "1E40AF" } }
          }
        };
      }
    }

    // Style data rows
    for (let row = 1; row < rowCount; row++) {
      for (let col = 0; col < colCount; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = {
            font: { name: "Arial", sz: 11 },
            alignment: { horizontal: "left", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "E5E7EB" } },
              left: { style: "thin", color: { rgb: "E5E7EB" } },
              bottom: { style: "thin", color: { rgb: "E5E7EB" } },
              right: { style: "thin", color: { rgb: "E5E7EB" } }
            }
          };

          // Add background color to alternate rows
          if (row % 2 === 0) {
            worksheet[cellRef].s.fill = { fgColor: { rgb: "F8FAFC" } };
          }
        }
      }
    }

    worksheet['!cols'] = Array(colCount).fill(null).map(() => ({ width: 20 }));
  };

  // Apply styles to asset sheets
  const applyAssetSheetStyles = (worksheet: XLSX.WorkSheet, colCount: number, rowCount: number) => {
    // Style header row
    for (let col = 0; col < colCount; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
      if (worksheet[cellRef]) {
        worksheet[cellRef].s = {
          fill: { fgColor: { rgb: "059669" } },
          font: { bold: true, color: { rgb: "FFFFFF" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "047857" } },
            left: { style: "thin", color: { rgb: "047857" } },
            bottom: { style: "thin", color: { rgb: "047857" } },
            right: { style: "thin", color: { rgb: "047857" } }
          }
        };
      }
    }

    // Style data rows
    for (let row = 1; row < rowCount; row++) {
      for (let col = 0; col < colCount; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = {
            font: { name: "Arial", sz: 11 },
            alignment: { horizontal: "left", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "E5E7EB" } },
              left: { style: "thin", color: { rgb: "E5E7EB" } },
              bottom: { style: "thin", color: { rgb: "E5E7EB" } },
              right: { style: "thin", color: { rgb: "E5E7EB" } }
            }
          };

          // Add background color to alternate rows
          if (row % 2 === 0) {
            worksheet[cellRef].s.fill = { fgColor: { rgb: "F8FAFC" } };
          }
        }
      }
    }

    worksheet['!cols'] = Array(colCount).fill(null).map(() => ({ width: 20 }));
  };

  // Calculate asset counts for a report
  const getAssetCounts = (report: ReportData) => {
    const marketAssets = report.asset_data?.filter(asset => 
      asset.market_approach === 1 || asset.market_approach === "1"
    ) || [];

    const costAssets = report.asset_data?.filter(asset => 
      asset.cost_approach === 1 || asset.cost_approach === "1"
    ) || [];

    return {
      total: marketAssets.length + costAssets.length,
      market: marketAssets.length,
      cost: costAssets.length
    };
  };

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
                      Client
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
                    const assetCounts = getAssetCounts(report);
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
                            {report.client_name || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>Total: {assetCounts.total}</div>
                            <div className="text-xs text-gray-500">
                              Market: {assetCounts.market} | Cost: {assetCounts.cost}
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