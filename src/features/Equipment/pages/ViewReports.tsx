import { useEffect, useState } from "react";
import { getReportsData, halfReportSubmit, checkMacros, retryMacros } from "../api";
import { RefreshCcw, CheckCircle } from "lucide-react";
import LoginModal from "../components/EquipmentTaqeemLogin";

interface Asset {
    _id: string;
    final_value: string;
    asset_name: string;
    asset_type: string;
    owner_name: string;
    submitState: number;
}

interface Report {
    _id: string;
    title: string;
    asset_data: Asset[];
    value: string; // total report value
    createdAt?: string;
    owner_name: string;
    report_id: string;
}

const ViewEquipmentReports: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [openReports, setOpenReports] = useState<Record<string, boolean>>({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [progressMap, setProgressMap] = useState<Record<string, number>>({});
    const [progressMessages, setProgressMessages] = useState<Record<string, string>>({});
    const [activeReportId, setActiveReportId] = useState<string | null>(null);
    const [newestReportId, setNewestReportId] = useState<string | null>(null);
    const [tabsNum, setTabsNum] = useState(3);

    function getReportStatus(report: Report): "green" | "yellow" | "orange" {
        const incompleteCount = report.asset_data.filter(a => a.submitState === 0).length;
        if (incompleteCount === 0) return "green";
        if (incompleteCount === report.asset_data.length) return "orange";
        return "yellow";
    }

    async function fetchReports() {
        const data: Report[] = await getReportsData();

        // Sort newest first
        const sortedReports = data.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });
        console.log("Sorted Reports:", sortedReports);

        setNewestReportId(sortedReports[0]?._id || null);
        setReports(sortedReports);
    }
    //1506344

    useEffect(() => {
        fetchReports();
    }, []);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    // store timings per report + action
    interface ActionTiming {
        start: string;
        end: string;
        duration: string;
    }

    type ActionType = "submit" | "retry" | "check";

    const [actionTimings, setActionTimings] = useState<
        Record<string, Partial<Record<ActionType, ActionTiming>>>
    >({});

    async function runWithProgress(reportId: string, actionType: ActionType) {
        const report = reports.find(r => r._id === reportId);
        if (!report) return;

        const assetCount = report.asset_data.length;
        const incompleteAssets = report.asset_data.filter(a => a.submitState === 0).length;

        const secondsPerAsset = 11000 / tabsNum;
        const minDuration = 20000;

        let steps: string[] = [];
        let actionPromise: Promise<any>;
        let effectiveDuration = minDuration; // fallback

        // record start time
        const startTime = new Date();

        if (actionType === "submit") {
            effectiveDuration = Math.max(minDuration, assetCount * secondsPerAsset);
            actionPromise = halfReportSubmit(reportId, tabsNum);

            steps = [
                "Navigating to equipment page...",
                "🔹 Filling report data...",
                `🔹 Setting number of macros (${assetCount})...`,
                "🔹 Navigating to macro page...",
                ...Array.from({ length: assetCount }, (_, i) => `🔹 Filling ${i + 1}/${assetCount} macro...`),
                "🔹 Setting up checks...",
                "🔹 Running checks..."
            ];
        } else if (actionType === "retry") {
            effectiveDuration = Math.max(minDuration / 2, incompleteAssets * secondsPerAsset);
            actionPromise = retryMacros(reportId, tabsNum);

            steps = [
                "🔹 Navigating to macro page...",
                ...Array.from({ length: incompleteAssets }, (_, i) => `🔹 Filling ${i + 1}/${incompleteAssets} incomplete macro...`),
                "🔹 Setting up checks...",
                "🔹 Running checks..."
            ];
        } else if (actionType === "check") {
            effectiveDuration = minDuration / 2;
            actionPromise = checkMacros(reportId, tabsNum);

            steps = [
                "🔹 Setting up checks...",
                "🔹 Running checks..."
            ];
        } else {
            throw new Error("Unknown actionType");
        }

        const intervalTime = 200;
        const totalTicks = Math.ceil(effectiveDuration / intervalTime);
        let tick = 0;

        setActiveReportId(reportId);
        setProgressMap(prev => ({ ...prev, [reportId]: 0 }));

        const interval = setInterval(() => {
            tick++;
            const newProgress = Math.min(95, Math.floor((tick / totalTicks) * 100));
            setProgressMap(prev => ({ ...prev, [reportId]: newProgress }));
        }, intervalTime);

        try {
            const stepDuration = effectiveDuration / steps.length;
            for (const step of steps) {
                setProgressMessages(prev => ({ ...prev, [reportId]: step }));
                if (step === "🔹 Setting up checks...") {
                    await delay(5000);
                } else if (step === "🔹 Running checks...") {
                    break;
                } else {
                    await delay(stepDuration);
                }
            }

            const response = await actionPromise;
            console.log("Response:", response);

            // record end time
            const endTime = new Date();
            const durationMs = endTime.getTime() - startTime.getTime();
            const durationSec = (durationMs / 1000).toFixed(1) + "s";

            setActionTimings(prev => ({
                ...prev,
                [reportId]: {
                    ...prev[reportId],
                    [actionType]: {
                        start: startTime.toLocaleTimeString(),
                        end: endTime.toLocaleTimeString(),
                        duration: durationSec
                    }
                }
            }));

            clearInterval(interval);
            setProgressMap(prev => ({ ...prev, [reportId]: 100 }));
            setProgressMessages(prev => ({ ...prev, [reportId]: "✅ Complete!" }));

            await delay(1000);

            setProgressMap(prev => ({ ...prev, [reportId]: 0 }));
            setProgressMessages(prev => {
                const copy = { ...prev };
                delete copy[reportId];
                return copy;
            });
            setActiveReportId(null);
            fetchReports();
        } catch (error) {
            console.error("Action failed:", error);
            clearInterval(interval);
            setProgressMap(prev => ({ ...prev, [reportId]: 0 }));
            setProgressMessages(prev => {
                const copy = { ...prev };
                delete copy[reportId];
                return copy;
            });
            setActiveReportId(null);
            alert("Action failed for report " + reportId);
        }
    }

    const handleSubmit = (reportId: string) => runWithProgress(reportId, "submit");
    const handleRetry = (reportId: string) => runWithProgress(reportId, "retry");
    const handleCheck = (reportId: string) => runWithProgress(reportId, "check");


    const toggleDropdown = (reportId: string) => {
        setOpenReports(prev => ({ ...prev, [reportId]: !prev[reportId] }));
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">View Reports</h2>
                {!loggedIn && (
                    <button
                        onClick={() => setShowLoginModal(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                        Login
                    </button>
                )}
            </div>

            {reports.map(report => {
                const completeCount = report.asset_data.filter(a => a.submitState === 1).length;
                const incompleteCount = report.asset_data.length - completeCount;
                const progress = progressMap[report._id] || 0;
                const statusColor = getReportStatus(report);
                const messageForThis = progressMessages[report._id] || "";

                return (
                    <div
                        key={report._id}
                        className="relative bg-white shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition"
                    >
                        <div
                            className="flex flex-col"
                        >
                            <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => toggleDropdown(report._id)}>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Report {(report.report_id ? report.report_id : report.title)}
                                    </h3>

                                    <div className="flex flex-wrap gap-2 mt-1 items-center">
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                            Total Assets: {report.asset_data.length}
                                        </span>
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                                            Incomplete: {incompleteCount}
                                        </span>
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                            Complete: {completeCount}
                                        </span>
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                                            Final Value: {Number(report.value).toLocaleString()}
                                        </span>

                                        {report._id === newestReportId && incompleteCount === report.asset_data.length && (
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white shadow-sm">
                                                New
                                            </span>
                                        )}

                                        {!(report._id === newestReportId && incompleteCount === report.asset_data.length) && (
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
                                        {/* Timings for actions */}

                                    </div>
                                        {actionTimings[report._id] && (
                                            <div className="mt-2 space-y-1 text-xs text-gray-600">
                                                {Object.entries(actionTimings[report._id]).map(([action, timing]) => (
                                                    <div key={action}>
                                                        <span className="font-semibold capitalize">{action}:</span>{" "}
                                                        Started at {timing?.start}, Ended at {timing?.end}, Duration {timing?.duration}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Tabs number input */}
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        value={tabsNum}
                                        onChange={(e) => setTabsNum(Number(e.target.value))}
                                        onClick={(e) => e.stopPropagation()}
                                        disabled={!loggedIn}
                                        className="w-16 px-2 py-1 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        title="Number of tabs to use for macro filling"
                                    />

                                    {/* Submit button */}
                                    <button
                                        onClick={e => { e.stopPropagation(); handleSubmit(report._id); }}
                                        disabled={!loggedIn || !!report.report_id} // disable if logged out OR report_id exists
                                        className={`px-4 py-2 font-semibold rounded-lg transition ${(!loggedIn || !!report.report_id) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-400 text-white hover:bg-blue-500'}`}
                                    >
                                        Submit
                                    </button>

                                    {/* Retry button */}
                                    <button
                                        onClick={e => { e.stopPropagation(); handleRetry(report._id); }}
                                        disabled={!loggedIn || !report.report_id || incompleteCount === 0}
                                        className={`p-2 rounded-lg transition ${(!loggedIn || !report.report_id || incompleteCount === 0)
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-blue-400 text-white hover:bg-blue-500"
                                            }`}
                                        title="Retry"
                                    >
                                        <RefreshCcw className="text-gray-700 w-4 h-4" />
                                    </button>


                                    {/* Check button */}
                                    <button
                                        onClick={e => { e.stopPropagation(); handleCheck(report._id); }}
                                        disabled={!loggedIn || !report.report_id} // disable if logged out OR no report_id
                                        className={`p-2 rounded-lg transition ${(!loggedIn || !report.report_id) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-300 hover:bg-green-400'}`}
                                        title="Check Assets"
                                    >
                                        <CheckCircle className="text-gray-700 w-4 h-4" />
                                    </button>
                                </div>


                            </div>

                            {/* Progress row (bar + loader) */}
                            {progress > 0 && (
                                <div className="flex items-center mx-4 mb-2 gap-3">
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-2 bg-blue-500 transition-all duration-200"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>

                                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}

                            {/* Message only for the report that has a message */}
                            {messageForThis && (
                                <div className="mx-4 text-sm text-gray-700">{messageForThis}</div>
                            )}
                        </div>

                        {openReports[report._id] && (
                            <div className="px-4 pb-4 space-y-3">
                                {report.asset_data.map(asset => (
                                    <div
                                        key={asset._id}
                                        className="flex justify-between items-center rounded-lg p-3 border border-gray-100 bg-gray-50 transition"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-800">{asset.asset_name}</p>
                                            <p className="text-sm text-gray-500">
                                                {asset.final_value} • {report.owner_name}
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

            {/* Login Modal */}
            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    setIsLoggedIn={(status) => {
                        setLoggedIn(status);
                        setShowLoginModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default ViewEquipmentReports;
