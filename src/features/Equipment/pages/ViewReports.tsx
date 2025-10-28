import React, { useEffect, useState } from "react";
import { getReportsData } from "../api";
import LoginModal from "../components/EquipmentTaqeemLogin";
import { useTaqeemAuth } from "../../../shared/context/TaqeemAuthContext";
import { useSocketManager } from "../../../shared/hooks/useSocketManager";
import { useSocketManagement } from "../hooks/useSocketManagement";
import { useReportActions } from "../hooks/useReportActions";
import { useProgressManagement } from "../hooks/useProgressManagement";
import ReportHeader from "../components/ViewReports/ReportHeader";
import AssetList from "../components/ViewReports/AssetList";
import ControlButtons from "../components/ViewReports/ControlButtons";
import ProgressBar from "../components/ViewReports/ProgressBar";
import { Report } from "../types";
import { sortReportsByDate } from "../utils/viewEquipmentReports";

const ViewEquipmentReports: React.FC = () => {
    const { isLoggedIn: loggedIn } = useTaqeemAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [openReports, setOpenReports] = useState<Record<string, boolean>>({});
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [newestReportId, setNewestReportId] = useState<string | null>(null);
    const [tabsNum, setTabsNum] = useState(3);

    // Custom hooks
    useSocketManager();
    useSocketManagement();
    const { progressStates } = useProgressManagement();
    const {
        handleSubmit,
        handleRetry,
        handleCheck,
        handlePause,
        handleResume,
    } = useReportActions(tabsNum);

    const hasCompleteStatus = Object.values(progressStates).some(
        state => state.status === 'COMPLETE'
    );

    useEffect(() => {
        console.log("FETCH")
        fetchReports();
    }, [hasCompleteStatus]);

    async function fetchReports() {
        const data: Report[] = await getReportsData();
        const sortedReports = sortReportsByDate(data);
        setNewestReportId(sortedReports[0]?._id || null);
        setReports(sortedReports);
    }

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
                const progressState = progressStates[report._id];
                const isNewest = report._id === newestReportId;
                const hasReportId = !!report.report_id;

                return (
                    <div
                        key={report._id}
                        className="relative bg-white shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition"
                    >
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center p-4">
                                <div className="flex-1">
                                    <ReportHeader
                                        report={report}
                                        isNewest={isNewest}
                                        isOpen={!!openReports[report._id]}
                                        onToggle={() => toggleDropdown(report._id)}
                                    />
                                </div>

                                <div className="ml-4 flex-shrink-0">
                                    <ControlButtons
                                        reportId={report._id}
                                        tabsNum={tabsNum}
                                        loggedIn={loggedIn}
                                        progressState={progressState}
                                        onTabsNumChange={setTabsNum}
                                        onSubmit={handleSubmit}
                                        onRetry={handleRetry}
                                        onCheck={handleCheck}
                                        onPause={handlePause}
                                        onResume={handleResume}
                                        hasReportId={hasReportId}
                                    />
                                </div>
                            </div>

                            {progressState && (
                                <ProgressBar progressState={progressState} />
                            )}
                        </div>

                        {openReports[report._id] && (
                            <AssetList assets={report.asset_data} />
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