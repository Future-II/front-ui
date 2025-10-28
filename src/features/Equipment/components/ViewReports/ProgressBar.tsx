import React from 'react';
import { ProgressState } from '../../types';

interface ProgressBarProps {
    progressState: ProgressState;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progressState }) => {
    return (
        <div className="px-4 pb-3 space-y-2">
            <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-2 transition-all duration-300 ${progressState.status === 'COMPLETE'
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
    );
};

export default ProgressBar;