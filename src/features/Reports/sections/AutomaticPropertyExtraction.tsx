import React, { useState } from "react";
import { columns, reportData } from "../components/data";
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
      prev.length === reportData.length ? [] : reportData.map((_, index) => index)
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
    // Implement search logic here
    console.log("Search with filters:", {
      reportName,
      siteLocation,
      condition,
      referenceNumber,
      propertyType,
      fromDate,
      toDate
    });
  };

  // Search Interface Component
  const SearchInterface = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Automatic property report extraction</h2>
        <p className="text-sm text-gray-500 mt-1">Select the property reports you wish to extract and have them automatically sent to the Authority's system.</p>
      </div> */}

      {/* Search Filters */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <input
            type="text"
            placeholder={t("automation.automation report.report name") }
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder={t("automation.automation report.site") }
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
            <option value="">{t("automation.automation report.condition.a") }</option>
            <option value="complete">{t("automation.automation report.condition.b") }</option>
            <option value="pending">{t("automation.automation report.condition.c") }</option>
            <option value="draft">{t("automation.automation report.condition.d") }</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder={t("automation.automation report.reference") }
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder={t("automation.automation report.property") }
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
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {t("automation.automation report.button") }
        </button>
      </div>
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
                data={reportData}
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
                reportData={reportData}
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