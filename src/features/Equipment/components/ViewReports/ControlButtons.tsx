import React, { useState } from 'react';
import { RefreshCcw, CheckCircle, Pause, Play, Trash2 } from 'lucide-react';
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
    onDelete: (reportId: string) => void;
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
    onDelete,
    hasReportId,
}) => {
    const hasProgress = !!progressState;
    const showControls = progressState ? shouldShowControls(progressState) : false;

    const MAX_TABS = 30;
    const MIN_TABS = 1;
    
    // Local state for the input value to allow temporary invalid states during editing
    const [localValue, setLocalValue] = useState<string>(tabsNum.toString());

    // Update local value when tabsNum prop changes
    React.useEffect(() => {
        setLocalValue(tabsNum.toString());
    }, [tabsNum]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalValue(value); // Allow any input temporarily
        
        // Only update parent if it's a valid number within range
        const numValue = Number(value);
        if (!isNaN(numValue) && numValue >= MIN_TABS && numValue <= MAX_TABS) {
            onTabsNumChange(numValue);
        }
    };

    const handleBlur = () => {
        const numValue = Number(localValue);
        
        // Reset to valid value on blur
        if (isNaN(numValue) || numValue < MIN_TABS) {
            onTabsNumChange(MIN_TABS);
            setLocalValue(MIN_TABS.toString());
        } else if (numValue > MAX_TABS) {
            onTabsNumChange(MAX_TABS);
            setLocalValue(MAX_TABS.toString());
        } else {
            // Ensure local value matches the validated tabsNum
            setLocalValue(tabsNum.toString());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow Enter key to trigger blur behavior
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            onDelete(reportId);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={localValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                disabled={!loggedIn}
                className="w-16 px-2 py-1 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                title={`Number of tabs (${MIN_TABS}-${MAX_TABS})`}
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

            {/* Delete Button */}
            <button
                onClick={handleDeleteClick}
                disabled={hasProgress}
                className={`p-2 rounded-lg transition ${(hasProgress)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
                title="Delete Report"
            >
                <Trash2 className="w-4 h-4" />
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