import { useEffect, useState } from "react";
import { getAllAssets, addAssetsToReport } from "../api";

// ---- Types ----
interface Asset {
  _id: string;
  report_id: string;
  final_value: string;
  asset_name: string;
  asset_type: string;
  owner_name: string;
}

interface Report {
  report_id: string;
  assets: Asset[];
  totalValue: number;
}

const AllReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [openReports, setOpenReports] = useState<Record<string, boolean>>({});

  async function handleSubmit(reportId: string) {
    try {
      const response = await addAssetsToReport(reportId);
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    async function fetchAssets() {
      const assets: Asset[] = await getAllAssets();

      // Group assets by report_id
      const grouped = assets.reduce<Record<string, Report>>((acc, asset) => {
        const { report_id, final_value } = asset;
        if (!acc[report_id]) {
          acc[report_id] = { report_id, assets: [], totalValue: 0 };
        }
        acc[report_id].assets.push(asset);
        acc[report_id].totalValue += Number(final_value) || 0;
        return acc;
      }, {});

      setReports(Object.values(grouped));
    }

    fetchAssets();
  }, []);

  const toggleDropdown = (reportId: string) => {
    setOpenReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  const handleSubmitReport = (reportId: string) => {
    alert(`Report ${reportId} submitted!`);
  };

  const handleCheckAsset = (assetId: string) => {
    alert(`Asset ${assetId} checked!`);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">All Reports</h2>

      {reports.map((report) => (
        <div
          key={report.report_id}
          className="bg-white shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition"
        >
          {/* Report Header */}
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleDropdown(report.report_id)}
          >
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Report #{report.report_id}
              </h3>
              <p className="text-sm text-gray-500">
                Total Assets: {report.assets.length} • Final Value:{" "}
                <span className="text-blue-500">
                  {report.totalValue.toLocaleString()}
                </span>
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // ⚡ prevent dropdown toggle
                handleSubmit(report.report_id);
              }}
              className="ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
            >
              Submit
            </button>
          </div>


          {/* Dropdown: Asset List */}
          {openReports[report.report_id] && (
            <div className="px-4 pb-4 space-y-3">
              {report.assets.map((asset) => (
                <div
                  key={asset._id}
                  className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-100 hover:bg-blue-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">{asset.asset_name}</p>
                    <p className="text-sm text-gray-500">
                      {asset.asset_type} • {asset.owner_name}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                      Submitted: No
                    </span>
                    <button
                      onClick={() => handleCheckAsset(asset._id)}
                      className="px-3 py-1 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition text-sm"
                    >
                      ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllReports;
