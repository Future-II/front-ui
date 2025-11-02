import React, { useEffect, useState, useRef } from "react";
import { getReportsData, deleteReport } from "../api";
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
import Pagination from "../components/ViewReports/Pagination";
import { Report } from "../types";

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

const ViewEquipmentReports: React.FC = () => {
    const { isLoggedIn: loggedIn } = useTaqeemAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [openReports, setOpenReports] = useState<Record<string, boolean>>({});
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [newestReportId, setNewestReportId] = useState<string | null>(null);
    const [tabsNum, setTabsNum] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 10;
    
    // Ref to track if we should scroll after loading
    const shouldScrollAfterLoad = useRef(false);

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
    }, [hasCompleteStatus, currentPage]);

    // Effect to scroll after loading completes
    useEffect(() => {
        if (!loading && shouldScrollAfterLoad.current) {
            scrollToTop();
            shouldScrollAfterLoad.current = false;
        }
    }, [loading]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Set flag to scroll after loading completes
        shouldScrollAfterLoad.current = true;
    };

    async function fetchReports() {
        setLoading(true);
        try {
            const data = await getReportsData(currentPage, itemsPerPage);
            
            // Handle both response formats (with/without pagination wrapper)
            if (data.assets && data.pagination) {
                setReports(data.assets);
                setPagination(data.pagination);
                setNewestReportId(data.assets[0]?._id || null);
            } else {
                // Fallback for non-paginated response
                setReports(data);
                setNewestReportId(data[0]?._id || null);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    }

    // Delete handler function
    const handleDeleteReport = async (reportId: string) => {
        try {
            await deleteReport(reportId);
            
            // Remove the deleted report from state
            setReports(prev => prev.filter(report => report._id !== reportId));
            
            // If the deleted report was the newest, update newestReportId
            if (reportId === newestReportId) {
                const remainingReports = reports.filter(report => report._id !== reportId);
                setNewestReportId(remainingReports[0]?._id || null);
            }

            // Update pagination if available
            if (pagination) {
                setPagination(prev => prev ? {
                    ...prev,
                    totalItems: prev.totalItems - 1
                } : null);
            }

            // Refetch if page becomes empty
            if (reports.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }
        } catch (error) {
            console.error('Error deleting report:', error);
            alert('Failed to delete report. Please try again.');
        }
    };

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

            {loading && reports.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                    <div className="text-gray-500">Loading reports...</div>
                </div>
            ) : reports.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                    <div className="text-gray-500">No reports found</div>
                </div>
            ) : (
                <>
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
                                                onDelete={handleDeleteReport}
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
                </>
            )}

            {/* Pagination Component */}
            {pagination && (
                <Pagination
                    pagination={pagination}
                    currentPage={currentPage}
                    loading={loading}
                    onPageChange={handlePageChange}
                />
            )}

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