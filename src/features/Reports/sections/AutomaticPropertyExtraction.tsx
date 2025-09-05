import React, { useState } from "react";
import { columns, useReportsData } from "../components/data"; // Removed reportData import
import SelectStep from "../components/SelectStep";
import VerifyStep from "../components/VerifyStep";
import SendStep from "../components/SendStep";
import ResultStep from "../components/ResultStep";
import type { ProgressStage, WorkflowStep } from "../components/types";
import { useTranslation } from "react-i18next";

const AutomaticPropertyExtraction: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [progressStage, setProgressStage] = useState<ProgressStage>("withdraw");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("select");
  const [processingResult, setProcessingResult] = useState<"success" | "error" | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<Record<number, boolean>>({});
  const { t } = useTranslation();

  // Database integration - using the fixed hook
  const { reports, loading, error, fetchReports, searchReports } = useReportsData();

  // New state for search filters
  const [reportName, setReportName] = useState("");
  const [siteLocation, setSiteLocation] = useState("");
  const [condition, setCondition] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleRowSelect = (rowId: number) => {
    setSelectedRows((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows((prev) =>
      prev.length === reports.length ? [] : reports.map((_, index) => index)
    );
  };

  const startProcess = () => {
    setCurrentStep("verify");
    const initial: Record<number, boolean> = {};
    selectedRows.forEach((rowIndex) => (initial[rowIndex] = true));
    setVerificationStatus(initial);
  };

  const startSendingProcess = () => {
    setCurrentStep("send");
    setIsProcessing(true);
    setProgressStage("withdraw");
    setProgressPercentage(0);

    const withdraw = setInterval(() => {
      setProgressPercentage((p) => {
        if (p >= 100) {
          clearInterval(withdraw);
          setProgressStage("verify");
          setProgressPercentage(0);

          const verify = setInterval(() => {
            setProgressPercentage((p2) => {
              if (p2 >= 100) {
                clearInterval(verify);
                setProgressStage("send");
                setProgressPercentage(0);

                const send = setInterval(() => {
                  setProgressPercentage((p3) => {
                    if (p3 >= 100) {
                      clearInterval(send);
                      setIsProcessing(false);
                      setCurrentStep("result");
                      setProcessingResult(Math.random() > 0.2 ? "success" : "error");
                      return 100;
                    }
                    return p3 + 5;
                  });
                }, 200);

                return 100;
              }
              return p2 + 5;
            });
          }, 150);

          return 100;
        }
        return p + 2;
      });
    }, 100);
  };

  const cancelProcess = () => {
    setIsProcessing(false);
    setCurrentStep("select");
  };

  const resetWorkflow = () => {
    setCurrentStep("select");
    setSelectedRows([]);
    setProcessingResult(null);
    setProgressPercentage(0);
    setIsProcessing(false);
  };

  const toggleVerificationStatus = (rowIndex: number) => {
    setVerificationStatus((prev) => ({ ...prev, [rowIndex]: !prev[rowIndex] }));
  };

  const handleSearch = async () => {
    // Clear previous selections when searching
    setSelectedRows([]);
    
    // Check if we have any search criteria
    const hasSearchCriteria = reportName || siteLocation || condition || referenceNumber || propertyType || fromDate || toDate;
    
    if (!hasSearchCriteria) {
      // No search criteria - fetch all reports
      console.log("No search criteria, fetching all reports");
      await fetchReports();
      return;
    }

    // Build filters object for API
    const filters: any = {};
    
    if (reportName) filters.reportTitle = reportName;
    if (siteLocation) filters.city = siteLocation; // Assuming site maps to city
    if (condition && condition !== "") filters.status = condition;
    if (referenceNumber) filters.certificateNumber = referenceNumber;
    if (propertyType) filters.assetType = propertyType;
    if (fromDate) filters.fromDate = fromDate;
    if (toDate) filters.toDate = toDate;
    
    // Reset to page 1 for new search
    filters.page = 1;
    filters.limit = 25;

    console.log("Search with filters:", filters);
    
    // Use searchReports if we have reportName, otherwise use fetchReports with filters
    if (reportName) {
      await searchReports(reportName, filters);
    } else {
      await fetchReports(filters);
    }
  };

  const clearSearch = () => {
    setReportName("");
    setSiteLocation("");
    setCondition("");
    setReferenceNumber("");
    setPropertyType("");
    setFromDate("");
    setToDate("");
    setSelectedRows([]);
    // Fetch all reports without filters
    fetchReports();
  };

  // Search Interface Component
  const SearchInterface = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Search Filters */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <input
            type="text"
            placeholder={t("automation.automation report.report name")}
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder={t("automation.automation report.site")}
            value={siteLocation}
            onChange={(e) => setSiteLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t("automation.automation report.condition.a")}</option>
            <option value="مكتمل">{t("automation.automation report.condition.b")}</option>
            <option value="معلق">{t("automation.automation report.condition.c")}</option>
            <option value="مسودة">{t("automation.automation report.condition.d")}</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder={t("automation.automation report.reference")}
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder={t("automation.automation report.property")}
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Search Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-md font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {loading ? 'Searching...' : t("automation.automation report.button")}
        </button>
        
        <button
          onClick={clearSearch}
          disabled={loading}
          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-md font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Error fetching reports: {error}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="mt-4 flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading reports...</span>
        </div>
      )}
    </div>
  );

  // Empty State Component
  const EmptyState = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
      <p className="text-gray-500 mb-6">
        {reportName || siteLocation || condition || referenceNumber || propertyType || fromDate || toDate
          ? "No reports match your search criteria. Try adjusting your filters."
          : "There are currently no reports in the database. Import some data to get started."
        }
      </p>
      {(reportName || siteLocation || condition || referenceNumber || propertyType || fromDate || toDate) && (
        <button
          onClick={clearSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium"
        >
          Clear Search Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Show search interface when on select step */}
      {currentStep === "select" && <SearchInterface />}

      {(() => {
        switch (currentStep) {
          case "select":
            // Show empty state if no reports and not loading
            if (reports.length === 0 && !loading) {
              return <EmptyState />;
            }
            
            return (
              <SelectStep
                columns={columns}
                data={reports}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedRows={selectedRows}
                onRowSelect={handleRowSelect}
                onSelectAll={handleSelectAll}
                onContinue={startProcess}
              />
            );
          case "verify":
            return (
              <VerifyStep
                reportData={reports}
                selectedRows={selectedRows}
                verificationStatus={verificationStatus}
                toggleVerificationStatus={toggleVerificationStatus}
                setCurrentStep={setCurrentStep}
                startSendingProcess={startSendingProcess}
              />
            );
          case "send":
            return (
              <SendStep
                progressPercentage={progressPercentage}
                progressStage={progressStage}
                cancelProcess={cancelProcess}
              />
            );
          case "result":
            return (
              <ResultStep
                processingResult={processingResult}
                selectedCount={selectedRows.length}
                resetWorkflow={resetWorkflow}
              />
            );
          default:
            return null;
        }
      })()}
    </>
  );
};

export default AutomaticPropertyExtraction;