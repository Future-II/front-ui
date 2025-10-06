import { useEffect, useState, useRef } from "react";
import { getReportsData } from "../api";
import { RefreshCcw, CheckCircle, Pause, Play, StopCircle } from "lucide-react";
import LoginModal from "../components/EquipmentTaqeemLogin";
import { useTaqeemAuth } from "../../../shared/context/TaqeemAuthContext";
import io, { Socket } from 'socket.io-client';

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

interface ProgressData {
    step?: number;
    total_steps?: number;
    total?: number;
    current?: number;
    percentage?: number;
    macro_id?: number;
    form_id?: string;
    error?: string;
}

interface ProgressState {
    status: string;
    message: string;
    progress: number;
    paused: boolean;
    stopped: boolean;
    actionType?: "submit" | "retry" | "check";
    data?: ProgressData;
}

const ViewEquipmentReports: React.FC = () => {
    const { isLoggedIn: loggedIn } = useTaqeemAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [openReports, setOpenReports] = useState<Record<string, boolean>>({});
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [progressStates, setProgressStates] = useState<Record<string, ProgressState>>({});
    const [newestReportId, setNewestReportId] = useState<string | null>(null);
    const [tabsNum, setTabsNum] = useState(3);
    const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
    
    const socketRef = useRef<Socket | null>(null);
    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // Initialize Socket.IO connection
    useEffect(() => {
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('[SOCKET] Connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('[SOCKET] Disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('[SOCKET] Connection error:', error);
        });

        // Listen for form fill events
        socket.on('form_fill_started', (data) => {
            console.log('[SOCKET] Form fill started:', data);
        });

        socket.on('form_fill_progress', (data) => {
            console.log('[SOCKET] Progress update:', data);
            updateProgressFromSocket(data);
        });

        socket.on('form_fill_complete', (data) => {
            console.log('[SOCKET] Form fill complete:', data);
            handleCompletion(data.reportId);
        });

        socket.on('form_fill_error', (data) => {
            console.error('[SOCKET] Form fill error:', data);
            handleError(data.reportId, data.error);
        });

        socket.on('form_fill_paused', (data) => {
            console.log('[SOCKET] Form fill paused:', data);
            updateProgress(data.reportId, { paused: true });
        });

        socket.on('form_fill_resumed', (data) => {
            console.log('[SOCKET] Form fill resumed:', data);
            updateProgress(data.reportId, { paused: false });
        });

        socket.on('form_fill_stopped', (data) => {
            console.log('[SOCKET] Form fill stopped:', data);
            clearProgress(data.reportId);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            socket.off('form_fill_started');
            socket.off('form_fill_progress');
            socket.off('form_fill_complete');
            socket.off('form_fill_error');
            socket.off('form_fill_paused');
            socket.off('form_fill_resumed');
            socket.off('form_fill_stopped');
            socket.disconnect();
        };
    }, []);

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
    };

    const updateProgressFromSocket = (data: any) => {
        const { reportId, status, message, data: progressData } = data;
        
        let progress = 0;
        
        // Calculate progress based on status and data
        if (progressData?.percentage !== undefined) {
            progress = progressData.percentage;
        } else if (progressData?.current && progressData?.total) {
            progress = Math.round((progressData.current / progressData.total) * 100);
        } else {
            // Estimate progress based on status
            switch (status) {
                case 'INITIALIZING':
                case 'FETCHING_RECORD':
                    progress = 5;
                    break;
                case 'NAVIGATING':
                    progress = 10;
                    break;
                case 'STEP_STARTED':
                    if (progressData?.step && progressData?.total_steps) {
                        progress = Math.round((progressData.step / progressData.total_steps) * 60);
                    }
                    break;
                case 'STEP_COMPLETE':
                    if (progressData?.step && progressData?.total_steps) {
                        progress = Math.round(((progressData.step + 1) / progressData.total_steps) * 60);
                    }
                    break;
                case 'MACRO_PROCESSING':
                case 'MACRO_EDIT':
                case 'RETRY_PROGRESS':
                    progress = progressData?.percentage || 70;
                    break;
                case 'MACRO_COMPLETE':
                case 'MACRO_EDIT_COMPLETE':
                    progress = 85;
                    break;
                case 'CHECKING':
                case 'CHECK_STARTED':
                    progress = 90;
                    break;
                case 'RETRYING':
                case 'RETRY_STARTED':
                    progress = 50;
                    break;
                case 'RETRY_COMPLETE':
                case 'CHECK_COMPLETE':
                    progress = 95;
                    break;
                case 'COMPLETE':
                    progress = 100;
                    break;
                case 'REPORT_SAVED':
                    progress = 80;
                    break;
            }
        }

        updateProgress(reportId, {
            status,
            message,
            progress,
            data: progressData
        });
    };

    const handleCompletion = async (reportId: string) => {
        updateProgress(reportId, { 
            progress: 100, 
            message: 'Complete!',
            status: 'COMPLETE'
        });
        await delay(2000);
        clearProgress(reportId);
        fetchReports();
    };

    const handleError = async (reportId: string, error: string) => {
        updateProgress(reportId, { 
            message: `Error: ${error}`,
            progress: 0,
            status: 'FAILED'
        });
        await delay(3000);
        clearProgress(reportId);
    };

const handleSubmit = (reportId: string) => {
        if (!socketRef.current || !socketRef.current.connected) {
            console.error('[SOCKET] Socket not connected');
            alert('Connection lost. Please refresh the page.');
            return;
        }

        // Join the report-specific room and start form fill
        socketRef.current.emit('join_ticket', `report_${reportId}`);
        socketRef.current.emit('start_form_fill', {
            reportId,
            tabsNum,
            userId: 'current_user', // Replace with actual user ID
            actionType: 'submit'
        });

        // Initialize progress state
        setProgressStates(prev => ({
            ...prev,
            [reportId]: {
                status: 'INITIALIZING',
                progress: 0,
                message: 'Starting form submission...',
                paused: false,
                stopped: false,
                actionType: 'submit'
            }
        }));
    };

    const handleRetry = (reportId: string) => {
        if (!socketRef.current || !socketRef.current.connected) {
            console.error('[SOCKET] Socket not connected');
            alert('Connection lost. Please refresh the page.');
            return;
        }

        // Join the report-specific room and start retry
        socketRef.current.emit('join_ticket', `report_${reportId}`);
        socketRef.current.emit('start_form_fill', {
            reportId,
            tabsNum,
            userId: 'current_user', // Replace with actual user ID
            actionType: 'retry'
        });

        // Initialize progress state
        setProgressStates(prev => ({
            ...prev,
            [reportId]: {
                status: 'INITIALIZING',
                progress: 0,
                message: 'Starting retry for incomplete macros...',
                paused: false,
                stopped: false,
                actionType: 'retry'
            }
        }));
    };

    const handleCheck = (reportId: string) => {
        if (!socketRef.current || !socketRef.current.connected) {
            console.error('[SOCKET] Socket not connected');
            alert('Connection lost. Please refresh the page.');
            return;
        }

        // Join the report-specific room and start check
        socketRef.current.emit('join_ticket', `report_${reportId}`);
        socketRef.current.emit('start_form_fill', {
            reportId,
            tabsNum,
            userId: 'current_user', // Replace with actual user ID
            actionType: 'check'
        });

        // Initialize progress state
        setProgressStates(prev => ({
            ...prev,
            [reportId]: {
                status: 'INITIALIZING',
                progress: 0,
                message: 'Checking asset statuses...',
                paused: false,
                stopped: false,
                actionType: 'check'
            }
        }));
    };

    const handlePause = async (reportId: string) => {
        if (!socketRef.current || !socketRef.current.connected) return;
        
        socketRef.current.emit('pause_form_fill', { reportId });
        updateProgress(reportId, { paused: true, message: 'Paused' });
    };

    const handleResume = async (reportId: string) => {
        if (!socketRef.current || !socketRef.current.connected) return;
        
        socketRef.current.emit('resume_form_fill', { reportId });
        updateProgress(reportId, { paused: false, message: 'Resumed' });
    };

    const handleStop = async (reportId: string) => {
        if (!socketRef.current || !socketRef.current.connected) return;
        
        socketRef.current.emit('stop_form_fill', { reportId });
        updateProgress(reportId, { stopped: true, message: 'Stopping...' });
        await delay(500);
        clearProgress(reportId);
    };

    const toggleDropdown = (reportId: string) => {
        setOpenReports(prev => ({ ...prev, [reportId]: !prev[reportId] }));
        setDropdownOpen(prev => ({ ...prev, [reportId]: !prev[reportId] }));
    };

    // Check if controls should be shown (not during checking phase)
    const shouldShowControls = (state: ProgressState) => {
        const checkingStatuses = ['CHECKING', 'CHECK_STARTED', 'CHECK_COMPLETE'];
        return !checkingStatuses.includes(state.status) && state.actionType !== "check";
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
                                                className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                                                    statusColor === "green"
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
                                        className={`px-4 py-2 font-semibold rounded-lg transition ${
                                            (!loggedIn || !!report.report_id || !!progressState)
                                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                : 'bg-blue-400 text-white hover:bg-blue-500'
                                        }`}
                                    >
                                        Submit
                                    </button>

                                    <button
                                        onClick={e => { e.stopPropagation(); handleRetry(report._id); }}
                                        disabled={!loggedIn || !report.report_id || incompleteCount === 0 || !!progressState}
                                        className={`p-2 rounded-lg transition ${
                                            (!loggedIn || !report.report_id || incompleteCount === 0 || !!progressState)
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
                                        className={`p-2 rounded-lg transition ${
                                            (!loggedIn || !report.report_id || !!progressState)
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
                                                className={`h-2 transition-all duration-300 ${
                                                    progressState.status === 'COMPLETE'
                                                        ? 'bg-green-500'
                                                        : progressState.status === 'FAILED'
                                                        ? 'bg-red-500'
                                                        : 'bg-blue-500'
                                                }`}
                                                style={{ width: `${progressState.progress}%` }}
                                            />
                                        </div>
                                        {!progressState.paused && progressState.status !== 'COMPLETE' && progressState.status !== 'FAILED' && (
                                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">
                                            {progressState.paused ? "⏸ Paused: " : ""}
                                            {progressState.message}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {progressState.progress}%
                                        </span>
                                    </div>
                                    {progressState.data?.current !== undefined && progressState.data?.total !== undefined && (
                                        <div className="text-xs text-gray-500">
                                            {progressState.data.current} / {progressState.data.total}
                                        </div>
                                    )}
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
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            asset.submitState === 1
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