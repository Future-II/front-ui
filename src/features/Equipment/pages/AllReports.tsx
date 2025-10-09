import { useEffect, useState } from "react";
import { getAllAssets, addAssetsToReport, checkAssets } from "../api";
import { RefreshCcw, CheckCircle } from "lucide-react";
import LoginModal from "../components/EquipmentTaqeemLogin";

interface Asset {
  _id: string;
  report_id: string;
  final_value: string;
  asset_name: string;
  asset_type: string;
  owner_name: string;
  submitState: number;
  created_at?: string;
}

interface Report {
  report_id: string;
  assets: Asset[];
  totalValue: number;
  incompleteCount: number;
  created_at?: string;
}

const AllReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [openReports, setOpenReports] = useState<Record<string, boolean>>({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [newestReportId, setNewestReportId] = useState<string | null>(null);

  function getReportStatus(report: Report): "green" | "yellow" | "orange" {
    if (report.incompleteCount === 0) return "green"; // all submitted
    if (report.incompleteCount === report.assets.length) return "orange"; // none submitted
    return "yellow"; // partial
  }

async function fetchAssets() {
  const assets: Asset[] = await getAllAssets();

  const grouped = assets.reduce<Record<string, Report>>((acc, asset) => {
    const { report_id, final_value, submitState, created_at } = asset;
    if (!acc[report_id]) {
      acc[report_id] = {
        report_id,
        assets: [],
        totalValue: 0,
        incompleteCount: 0,
        created_at,
      };
    }
    acc[report_id].assets.push(asset);
    acc[report_id].totalValue += Number(final_value) || 0;
    if (submitState === 0) acc[report_id].incompleteCount += 1;
    return acc;
  }, {});

  const reportsArr = Object.values(grouped);

  reportsArr.sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  setNewestReportId(reportsArr[0]?.report_id || null);
  setReports(reportsArr);
}

// 2. Call it on login
useEffect(() => {
  if (!loggedIn) return;
  fetchAssets();
}, [loggedIn]);

// 3. Update runWithProgress to refetch after completion
async function runWithProgress(
  reportId: string,
  action: (id: string) => Promise<any>
) {
  const report = reports.find((r) => r.report_id === reportId);
  if (!report) return;

  const incompleteSeconds = report.incompleteCount * 11 * 1000;
  const minDuration = 15000;
  const totalDuration = Math.max(incompleteSeconds, minDuration);

  const intervalTime = 200;
  const totalTicks = Math.ceil(totalDuration / intervalTime);
  let tick = 0;

  setActiveReportId(reportId);
  setProgressMap((prev) => ({ ...prev, [reportId]: 0 }));

  const interval = setInterval(() => {
    tick++;
    const newProgress = Math.min(
      95,
      Math.floor((tick / totalTicks) * 100)
    );
    setProgressMap((prev) => ({ ...prev, [reportId]: newProgress }));
  }, intervalTime);

  try {
    const response = await action(reportId);
    console.log("Response: ", response);
    clearInterval(interval);
    setProgressMap((prev) => ({ ...prev, [reportId]: 100 }));
    setTimeout(() => {
      setProgressMap((prev) => ({ ...prev, [reportId]: 0 }));
      setActiveReportId(null);

      // ✅ Refetch assets after completion
      fetchAssets();
    }, 500);
  } catch (error) {
    clearInterval(interval);
    setProgressMap((prev) => ({ ...prev, [reportId]: 0 }));
    setActiveReportId(null);
    alert("Action failed for report " + reportId);
  }
}


  const handleSubmit = (reportId: string) => runWithProgress(reportId, addAssetsToReport);
  const handleRetry = (reportId: string) => runWithProgress(reportId, addAssetsToReport);
  const handleCheck = (reportId: string) => runWithProgress(reportId, checkAssets);

  const toggleDropdown = (reportId: string) => {
    setOpenReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  if (!loggedIn) {
    return (
      <LoginModal isOpen={true} onClose={() => { /* do nothing */ }} setIsLoggedIn={setLoggedIn} />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">All Reports</h2>

      {reports.map((report) => {
        const completeCount = report.assets.length - report.incompleteCount;
        const progress = progressMap[report.report_id] || 0;
        const statusColor = getReportStatus(report);

        return (
          <div
            key={report.report_id}
            className="relative bg-white shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition"
          >
            <div
              className="flex flex-col cursor-pointer"
              onClick={() => toggleDropdown(report.report_id)}
            >
              <div className="flex justify-between items-center p-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Report #{report.report_id}
                  </h3>

                  {/* Capsules */}
                  {/* Capsules + badges */}
                  <div className="flex flex-wrap gap-2 mt-1 items-center">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                      Total Assets: {report.assets.length}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                      Incomplete: {report.incompleteCount}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      Complete: {completeCount}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                      Final Value: {report.totalValue.toLocaleString()}
                    </span>

                    {/* New badge */}
                    {report.report_id === newestReportId && report.incompleteCount === report.assets.length && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white shadow-sm">
                        New
                      </span>
                    )}

                    {/* Status badge (if not showing New) */}
                    {!(report.report_id === newestReportId && report.incompleteCount === report.assets.length) && (
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${statusColor === "green"
                            ? "bg-green-100 text-green-700"
                            : statusColor === "yellow"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        title={`Status: ${statusColor}`}
                      >
                        {statusColor === "green"
                          ? "Complete"
                          : statusColor === "yellow"
                            ? "Partial"
                            : "Pending"}
                      </span>
                    )}


                    {/* Status badge */}
 
                  </div>

                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmit(report.report_id);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                  >
                    Submit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRetry(report.report_id);
                    }}
                    className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    title="Retry"
                  >
                    <RefreshCcw className="text-gray-700 w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheck(report.report_id);
                    }}
                    className="p-2 bg-green-300 rounded-lg hover:bg-green-400 transition"
                    title="Check Assets"
                  >
                    <CheckCircle className="text-gray-700 w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {progress > 0 && (
                <div className="flex items-center mx-4 mb-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-blue-500 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="ml-3 w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Dropdown: Asset List */}
            {openReports[report.report_id] && (
              <div className="px-4 pb-4 space-y-3">
                {report.assets.map((asset) => (
                  <div
                    key={asset._id}
                    className="flex justify-between items-center rounded-lg p-3 border border-gray-100 bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{asset.asset_name}</p>
                      <p className="text-sm text-gray-500">
                        {asset.asset_type} • {asset.owner_name}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${asset.submitState === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        Submitted: {asset.submitState === 1 ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AllReports;
