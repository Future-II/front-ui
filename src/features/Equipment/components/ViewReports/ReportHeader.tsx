import React from 'react';
import { Report } from '../../types';
import { formatRelativeTime, getReportStatus } from '../../utils/viewEquipmentReports';

interface ReportHeaderProps {
    report: Report;
    isNewest: boolean;
    isOpen: boolean;
    onToggle: () => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ 
    report, 
    isNewest, 
    onToggle, 
}) => {
    const completeCount = report.asset_data.filter(a => a.submitState === 1).length;
    const incompleteCount = report.asset_data.length - completeCount;
    const statusColor = getReportStatus(report);
    
    const hasReportId = !!report.report_id;

    return (
        <div className="flex justify-between items-center p-4 cursor-pointer" onClick={onToggle}>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                            Report {hasReportId ? report.report_id : report.title}
                        </h3>
                        
                        {/* Show title as subtitle when report_id exists */}
                        {hasReportId && report.title && (
                            <p className="text-sm text-gray-600 mb-5">
                                {report.title}
                            </p>
                        )}
                    </div>
                    
                    {/* Delete Button */}
                </div>

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
                    {report.value && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                            Final Value: {Number(report.value).toLocaleString()}
                        </span>
                    )}

                    {isNewest && incompleteCount === report.asset_data.length && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white shadow-sm">
                            New
                        </span>
                    )}

                    {!(isNewest && incompleteCount === report.asset_data.length) && (
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
                <div className="mt-3 gap-2 flex flex-wrap">
                    {report.startSubmitTime && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                            Started: {formatRelativeTime(report.startSubmitTime)}
                        </span>
                    )}
                    {report.endSubmitTime && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                            Ended: {formatRelativeTime(report.endSubmitTime)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportHeader;