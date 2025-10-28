import React from 'react';
import { RefreshCcw, CheckCircle, Pause, Play } from 'lucide-react';
import { ProgressState } from '../../types';
import { shouldShowControls } from '../../utils/viewEquipmentReports';

interface ControlButtonsProps {
    reportId: string;
    tabsNum: number;
    loggedIn: boolean;
    progressState?: ProgressState;
    onTabsNumChange: (value: number) => void;
    onSubmit: (reportId: string) => void;
    onRetry: (reportId: string) => void;
    onCheck: (reportId: string) => void;
    onPause: (reportId: string) => void;
    onResume: (reportId: string) => void;
    hasReportId?: boolean;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
    reportId,
    tabsNum,
    loggedIn,
    progressState,
    onTabsNumChange,
    onSubmit,
    onRetry,
    onCheck,
    onPause,
    onResume,
    hasReportId,
}) => {
    const hasProgress = !!progressState;
    const showControls = progressState ? shouldShowControls(progressState) : false;

    return (
        <div className="flex items-center gap-2">
            <input
                type="number"
                min={1}
                max={20}
                value={tabsNum}
                onChange={(e) => onTabsNumChange(Number(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                disabled={!loggedIn}
                className="w-16 px-2 py-1 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                title="Number of tabs"
            />

            <button
                onClick={e => { e.stopPropagation(); onSubmit(reportId); }}
                disabled={!loggedIn || hasReportId || hasProgress}
                className={`px-4 py-2 font-semibold rounded-lg transition ${(!loggedIn || hasProgress || hasReportId)
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-400 text-white hover:bg-blue-500'
                    }`}
            >
                Submit
            </button>

            <button
                onClick={e => { e.stopPropagation(); onRetry(reportId); }}
                disabled={!loggedIn || hasProgress}
                className={`p-2 rounded-lg transition ${(!loggedIn || hasProgress)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-400 text-white hover:bg-blue-500"
                    }`}
                title="Retry"
            >
                <RefreshCcw className="w-4 h-4" />
            </button>

            <button
                onClick={e => { e.stopPropagation(); onCheck(reportId); }}
                disabled={!loggedIn || hasProgress}
                className={`p-2 rounded-lg transition ${(!loggedIn || hasProgress)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-300 hover:bg-green-400'
                    }`}
                title="Check Assets"
            >
                <CheckCircle className="w-4 h-4" />
            </button>

            {progressState && showControls && (
                <div className="flex gap-1">
                    {!progressState.paused ? (
                        <button
                            onClick={e => { e.stopPropagation(); onPause(reportId); }}
                            className="p-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 transition"
                            title="Pause"
                        >
                            <Pause className="w-4 h-4 text-white" />
                        </button>
                    ) : (
                        <button
                            onClick={e => { e.stopPropagation(); onResume(reportId); }}
                            className="p-2 rounded-lg bg-green-400 hover:bg-green-500 transition"
                            title="Resume"
                        >
                            <Play className="w-4 h-4 text-white" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ControlButtons;