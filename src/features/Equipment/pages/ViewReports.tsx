import { useEffect, useState } from "react";
import { getReportsData, halfReportSubmit, checkMacros, retryMacros, pause, resume, stop } from "../api";
import { RefreshCcw, CheckCircle, Pause, Play, StopCircle } from "lucide-react";
import LoginModal from "../components/EquipmentTaqeemLogin";
import { useTaqeemAuth } from "../../../shared/context/TaqeemAuthContext";

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
    value: string;
    createdAt?: string;
    owner_name: string;
    report_id: string;
}

interface ProgressState {
    phase: 1 | 2 | 3;
    progress: number;
    message: string;
    paused: boolean;
    stopped: boolean;
    actionType?: "submit" | "retry" | "check";
}

const ViewEquipmentReports: React.FC = () => {
    const { isLoggedIn: loggedIn } = useTaqeemAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [openReports, setOpenReports] = useState<Record<string, boolean>>({});
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [progressStates, setProgressStates] = useState<Record<string, ProgressState>>({});
    const [activeReportId, setActiveReportId] = useState<string | null>(null);
    const [newestReportId, setNewestReportId] = useState<string | null>(null);
    const [tabsNum, setTabsNum] = useState(3);
    const [actionDropdownOpen, setActionDropdownOpen] = useState<Record<string, boolean>>({});
    const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});

    function getReportStatus(report: Report): "green" | "yellow" | "orange" {
        const incompleteCount = report.asset_data.filter(a => a.submitState === 0).length;
        if (incompleteCount === 0) return "green";
        if (incompleteCount === report.asset_data.length) return "orange";
        return "yellow";
    }

    async function fetchReports() {
        const data: Report[] = await getReportsData();
        const sortedReports = data.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });
        setNewestReportId(sortedReports[0]?._id || null);
        setReports(sortedReports);
    }

    useEffect(() => {
        fetchReports();
    }, []);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const updateProgress = (reportId: string, updates: Partial<ProgressState>) => {
        setProgressStates(prev => ({
            ...prev,
            [reportId]: { ...prev[reportId], ...updates } as ProgressState
        }));
    };

    const clearProgress = (reportId: string) => {
        setProgressStates(prev => {
            const copy = { ...prev };
            delete copy[reportId];
            return copy;
        });
        setActiveReportId(null);
    };

    async function animateProgress(
        reportId: string,
        duration: number,
        message: string
    ): Promise<boolean> {
        const startTime = Date.now();
        const intervalTime = 100;

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                setProgressStates(prev => {
                    const state = prev[reportId];

                    if (!state || state.stopped) {
                        clearInterval(interval);
                        resolve(false);
                        return prev;
                    }

                    if (state.paused) {
                        clearInterval(interval);
                        resolve(false);
                        return prev;
                    }

                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(100, Math.floor((elapsed / duration) * 100));

                    if (progress >= 100) {
                        clearInterval(interval);
                        resolve(true);
                        return {
                            ...prev,
                            [reportId]: { ...state, progress: 100, message }
                        };
                    }

                    return {
                        ...prev,
                        [reportId]: { ...state, progress, message }
                    };
                });
            }, intervalTime);
        });
    }

    async function runPhase1(reportId: string, assetCount: number, currentTabsNum: number) {
        updateProgress(reportId, { phase: 1, progress: 0 });

        const batches = Math.ceil(assetCount / 10);
        const baseTime = batches <= 1 ? 3000 : 6000;
        const scaledTime = (baseTime / currentTabsNum) + 2000;

        const steps = [
            { duration: 3000, message: "Navigating to report page..." },
            { duration: 2500, message: "Filling report data..." },
            { duration: scaledTime, message: `Setting number of macros (${assetCount})...` },
            { duration: 1500, message: "Setting up macros for filling..." }
        ];

        const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
        const startTime = Date.now();

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                setProgressStates(prev => {
                    const state = prev[reportId];

                    if (!state || state.stopped) {
                        clearInterval(interval);
                        resolve(false);
                        return prev;
                    }

                    if (state.paused) {
                        clearInterval(interval);
                        resolve(false);
                        return prev;
                    }

                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(100, Math.floor((elapsed / totalDuration) * 100));

                    let accumulatedTime = 0;
                    let currentMessage = steps[0].message;
                    for (const step of steps) {
                        if (elapsed < accumulatedTime + step.duration) {
                            currentMessage = step.message;
                            break;
                        }
                        accumulatedTime += step.duration;
                    }

                    if (progress >= 100) {
                        clearInterval(interval);
                        resolve(true);
                        return {
                            ...prev,
                            [reportId]: { ...state, progress: 100, message: steps[steps.length - 1].message }
                        };
                    }

                    return {
                        ...prev,
                        [reportId]: { ...state, progress, message: currentMessage }
                    };
                });
            }, 100);
        });
    }

    async function runPhase2(reportId: string, macroCount: number, currentTabsNum: number) {
        updateProgress(reportId, { phase: 2, progress: 0 });

        const baseTimePerMacro = 9000;
        const scaledTimePerMacro = baseTimePerMacro / currentTabsNum;
        const totalDuration = macroCount * scaledTimePerMacro;
        const startTime = Date.now();

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                setProgressStates(prev => {
                    const state = prev[reportId];

                    if (!state || state.stopped) {
                        clearInterval(interval);
                        resolve(false);
                        return prev;
                    }

                    if (state.paused) {
                        clearInterval(interval);
                        resolve(false);
                        return prev;
                    }

                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
                    const currentMacro = Math.min(macroCount, Math.ceil((elapsed / totalDuration) * macroCount));

                    if (progress >= 100) {
                        clearInterval(interval);
                        resolve(true);
                        return {
                            ...prev,
                            [reportId]: {
                                ...state,
                                progress: 100,
                                message: `Filling macros (${macroCount}/${macroCount})...`
                            }
                        };
                    }

                    return {
                        ...prev,
                        [reportId]: {
                            ...state,
                            progress,
                            message: `Filling macros (${currentMacro}/${macroCount})...`
                        }
                    };
                });
            }, 100);
        });
    }

    async function runPhase3(reportId: string, assetCount: number) {
        updateProgress(reportId, { phase: 3, progress: 0 });

        const setupDuration = 2000;
        const checkDuration = assetCount * 400;
        const totalDuration = setupDuration + checkDuration;
        const startTime = Date.now();

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                setProgressStates(prev => {
                    const state = prev[reportId];

                    if (!state || state.stopped) {
                        clearInterval(interval);
                        resolve(false);
                        return prev;
                    }

                    if (state.paused) {
                        clearInterval(interval);
                        resolve(false);
                        return prev;
                    }

                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(100, Math.floor((elapsed / totalDuration) * 100));

                    let message: string;
                    if (elapsed < setupDuration) {
                        message = "Setting up checks...";
                    } else {
                        const checkElapsed = elapsed - setupDuration;
                        const currentCheck = Math.min(assetCount, Math.ceil((checkElapsed / checkDuration) * assetCount));
                        message = `Checking (${currentCheck}/${assetCount})...`;
                    }

                    if (progress >= 100) {
                        clearInterval(interval);
                        resolve(true);
                        return {
                            ...prev,
                            [reportId]: {
                                ...state,
                                progress: 100,
                                message: `Checking (${assetCount}/${assetCount})...`
                            }
                        };
                    }

                    return {
                        ...prev,
                        [reportId]: {
                            ...state,
                            progress,
                            message
                        }
                    };
                });
            }, 100);
        });
    }

    async function runWithPhases(reportId: string, actionType: "submit" | "retry" | "check") {
        const report = reports.find(r => r._id === reportId);
        if (!report) return;

        const assetCount = report.asset_data.length;
        const incompleteCount = report.asset_data.filter(a => a.submitState === 0).length;

        setActiveReportId(reportId);
        setProgressStates(prev => ({
            ...prev,
            [reportId]: {
                phase: actionType === "retry" ? 2 : actionType === "check" ? 3 : 1,
                progress: 0,
                message: "Starting...",
                paused: false,
                stopped: false,
                actionType: actionType
            }
        }));

        let actionPromise: Promise<any>;
        let macroCount = assetCount;

        if (actionType === "submit") {
            actionPromise = halfReportSubmit(reportId, tabsNum);
        } else if (actionType === "retry") {
            macroCount = incompleteCount;
            actionPromise = retryMacros(reportId, tabsNum);
        } else {
            actionPromise = checkMacros(reportId, tabsNum);
        }

        try {
            const apiCall = actionPromise.catch(err => {
                console.error("API error:", err);
                updateProgress(reportId, { message: "Error: " + (err.message || "Unknown error") });
                throw err;
            });

            // Phase 1: Setup (skip for retry and check)
            if (actionType !== "check" && actionType !== "retry") {
                const phase1Success = await runPhase1(reportId, macroCount, tabsNum);
                if (!phase1Success) {
                    if (progressStates[reportId]?.stopped) {
                        clearProgress(reportId);
                    }
                    return;
                }
            }

            // Phase 2: Filling (skip for check)
            if (actionType !== "check") {
                const phase2Success = await runPhase2(reportId, macroCount, tabsNum);
                if (!phase2Success) {
                    if (progressStates[reportId]?.stopped) {
                        clearProgress(reportId);
                    }
                    return;
                }
            }

            // Phase 3: Checking
            const phase3Success = await runPhase3(reportId, assetCount);
            if (!phase3Success) {
                if (progressStates[reportId]?.stopped) {
                    clearProgress(reportId);
                }
                return;
            }

            const response = await apiCall;
            console.log("Response:", response);

            updateProgress(reportId, { progress: 100, message: "Complete!" });
            await delay(1500);
            clearProgress(reportId);
            fetchReports();

        } catch (error) {
            console.error("Action failed:", error);
            updateProgress(reportId, { message: "Failed: " + (error as Error).message, progress: 0 });
            await delay(3000);
            clearProgress(reportId);
        }
    }

    const handleSubmit = (reportId: string) => runWithPhases(reportId, "submit");
    const handleRetry = (reportId: string) => runWithPhases(reportId, "retry");
    const handleCheck = (reportId: string) => runWithPhases(reportId, "check");

    const handlePause = async (reportId: string) => {
        try {
            updateProgress(reportId, { paused: true });
            const response = await pause(reportId);
            console.log("Pause response:", response);
        } catch (err) {
            console.error(err);
            updateProgress(reportId, { paused: false });
        }
    };

    const handleResume = async (reportId: string) => {
        try {
            const response = await resume(reportId);
            console.log("Resume response:", response);

            updateProgress(reportId, { paused: false });

            const state = progressStates[reportId];
            if (!state) return;

            const report = reports.find(r => r._id === reportId);
            if (!report) return;

            const assetCount = report.asset_data.length;
            const incompleteCount = report.asset_data.filter(a => a.submitState === 0).length;

            if (state.phase === 1) {
                if (await runPhase1(reportId, assetCount, tabsNum)) {
                    if (await runPhase2(reportId, incompleteCount, tabsNum)) {
                        await runPhase3(reportId, assetCount);
                    }
                }
            } else if (state.phase === 2) {
                if (await runPhase2(reportId, incompleteCount, tabsNum)) {
                    await runPhase3(reportId, assetCount);
                }
            } else if (state.phase === 3) {
                await runPhase3(reportId, assetCount);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleStop = async (reportId: string) => {
        try {
            updateProgress(reportId, { stopped: true });
            const response = await stop(reportId);
            console.log("Stop response:", response);
            await delay(500);
            clearProgress(reportId);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleDropdown = (reportId: string) => {
        setOpenReports(prev => ({ ...prev, [reportId]: !prev[reportId] }));
        setDropdownOpen(prev => ({ ...prev, [reportId]: !prev[reportId] }));
    };

    const toggleActionDropdown = (reportId: string) => {
        setActionDropdownOpen(prev => ({ ...prev, [reportId]: !prev[reportId] }));
    };

    // Check if controls should be shown
    const shouldShowControls = (state: ProgressState) => {
        // Hide controls if in phase 3 OR if action type is "check"
        return state.phase !== 3 && state.actionType !== "check";
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
                const progressState = progressStates[report._id];
                const statusColor = getReportStatus(report);

                return (
                    <div
                        key={report._id}
                        className="relative bg-white shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition"
                    >
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => toggleDropdown(report._id)}>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Report {report.report_id ? report.report_id : report.title}
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
                                            >
                                                {statusColor === "green"
                                                    ? "Complete"
                                                    : statusColor === "yellow"
                                                        ? "Partial"
                                                        : "Pending"}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        value={tabsNum}
                                        onChange={(e) => setTabsNum(Number(e.target.value))}
                                        onClick={(e) => e.stopPropagation()}
                                        disabled={!loggedIn}
                                        className="w-16 px-2 py-1 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        title="Number of tabs"
                                    />

                                    <button
                                        onClick={e => { e.stopPropagation(); handleSubmit(report._id); }}
                                        disabled={!loggedIn || !!report.report_id || !!progressState}
                                        className={`px-4 py-2 font-semibold rounded-lg transition ${(!loggedIn || !!report.report_id || !!progressState)
                                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                            : 'bg-blue-400 text-white hover:bg-blue-500'
                                            }`}
                                    >
                                        Submit
                                    </button>

                                    <button
                                        onClick={e => { e.stopPropagation(); handleRetry(report._id); }}
                                        disabled={!loggedIn || !report.report_id || incompleteCount === 0 || !!progressState}
                                        className={`p-2 rounded-lg transition ${(!loggedIn || !report.report_id || incompleteCount === 0 || !!progressState)
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-blue-400 text-white hover:bg-blue-500"
                                            }`}
                                        title="Retry"
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={e => { e.stopPropagation(); handleCheck(report._id); }}
                                        disabled={!loggedIn || !report.report_id || !!progressState}
                                        className={`p-2 rounded-lg transition ${(!loggedIn || !report.report_id || !!progressState)
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-green-300 hover:bg-green-400'
                                            }`}
                                        title="Check Assets"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                    </button>

                                    {progressState && shouldShowControls(progressState) && (
                                        <div className="flex gap-1">
                                            {!progressState.paused ? (
                                                <button
                                                    onClick={e => { e.stopPropagation(); handlePause(report._id); }}
                                                    className="p-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 transition"
                                                    title="Pause"
                                                >
                                                    <Pause className="w-4 h-4 text-white" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={e => { e.stopPropagation(); handleResume(report._id); }}
                                                    className="p-2 rounded-lg bg-green-400 hover:bg-green-500 transition"
                                                    title="Resume"
                                                >
                                                    <Play className="w-4 h-4 text-white" />
                                                </button>
                                            )}
                                            {/* <button
                                                onClick={e => { e.stopPropagation(); handleStop(report._id); }}
                                                className="p-2 rounded-lg bg-red-400 hover:bg-red-500 transition"
                                                title="Stop"
                                            >
                                                <StopCircle className="w-4 h-4 text-white" />
                                            </button> */}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {progressState && (
                                <div className="px-4 pb-3 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-2 transition-all duration-200 ${progressState.phase === 3
                                                    ? 'bg-green-500'
                                                    : 'bg-blue-500'
                                                    }`}
                                                style={{ width: `${progressState.progress}%` }}
                                            />
                                        </div>
                                        {!progressState.paused && (
                                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">
                                            {progressState.paused ? "⏸ Paused: " : ""}
                                            {progressState.message}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Phase {progressState.phase}/3
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {openReports[report._id] && (
                            <div className="px-4 pb-4 space-y-3">
                                {report.asset_data.map(asset => (
                                    <div key={asset._id} className="flex justify-between items-center rounded-lg p-3 border border-gray-100 bg-gray-50 transition">
                                        <div>
                                            <p className="font-medium text-gray-800">{asset.asset_name}</p>
                                            <p className="text-sm text-gray-500">
                                                {asset.final_value} • {report.owner_name}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${asset.submitState === 1
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}>
                                            {asset.submitState === 1 ? "Complete" : "Incomplete"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                />
            )}
        </div>
    );
};

export default ViewEquipmentReports;