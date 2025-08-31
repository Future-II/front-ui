import React, { useState } from "react";
import { columns, useReportsData, reportData } from "../components/data";
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

  // Database integration
  const { reports: dbReports, loading, error, fetchReports } = useReportsData();
  
  // Use database reports if available, fallback to manual data
  const currentReports = dbReports.length > 0 ? dbReports : reportData;

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
      prev.length === currentReports.length ? [] : currentReports.map((_, index) => index)
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

  const handleSearch = () => {
    // Build filters object
    const filters: any = {};
    
    if (reportName) filters.reportName = reportName;
    if (siteLocation) filters.site = siteLocation;
    if (condition && condition !== "") filters.condition = condition;
    if (referenceNumber) filters.referenceNo = referenceNumber;
    if (propertyType) filters.propertyType = propertyType;
    if (fromDate) filters.fromDate = fromDate;
    if (toDate) filters.toDate = toDate;
    
    // Reset to page 1 for new search
    filters.page = 1;
    filters.limit = 25;

    console.log("Search with filters:", filters);
    
    // Call the database fetch with filters
    fetchReports(filters);
  };


  // Search Interface Component
  const SearchInterface = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="mb-6">
        {/* <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Automatic property report extraction</h2>
            <p className="text-sm text-gray-500 mt-1">Select the property reports you wish to extract and have them automatically sent to the Authority's system.</p>
          </div>
          <button
            onClick={handleUpdateFromScale}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium"
            disabled={loading}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Updating...' : 'Update From Scale'}
          </button>
        </div> */}
        
        {/* <div className="flex gap-2 mt-4">
          <button className="px-4 py-1 bg-green-100 text-green-700 rounded-md text-sm">
            Send specific reports
          </button>
          <button className="px-4 py-1 bg-red-100 text-red-700 rounded-md text-sm">
            Delete selected reports
          </button>
        </div> */}
      </div>

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

      {/* Search Button */}
      <div>
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
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading reports...</span>
        </div>
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
            return (
              <SelectStep
                columns={columns}
                data={currentReports}
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
                reportData={currentReports}
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