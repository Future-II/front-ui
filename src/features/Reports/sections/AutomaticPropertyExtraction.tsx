import React, { useState } from "react";
import { columns, useReportsData } from "../components/data";
import SelectStep from "../components/SelectStep";
import { useTranslation } from "react-i18next";

type WorkflowStep = "select";

const AutomaticPropertyExtraction: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStep] = useState<WorkflowStep>("select"); // only select step remains
  const { t } = useTranslation();

  const { reports, loading, error, fetchReports, searchReports } = useReportsData();

  // Search filters
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

  const handleSearch = async () => {
    setSelectedRows([]);
    const hasSearchCriteria =
      reportName || siteLocation || condition || referenceNumber || propertyType || fromDate || toDate;

    if (!hasSearchCriteria) {
      await fetchReports();
      return;
    }

    const filters: any = {};
    if (reportName) filters.reportTitle = reportName;
    if (siteLocation) filters.city = siteLocation;
    if (condition) filters.status = condition;
    if (referenceNumber) filters.certificateNumber = referenceNumber;
    if (propertyType) filters.assetType = propertyType;
    if (fromDate) filters.fromDate = fromDate;
    if (toDate) filters.toDate = toDate;
    filters.page = 1;
    filters.limit = 25;

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
    fetchReports();
  };

  const SearchInterface = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Filters */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder={t("automation.automation report.report name")}
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
        <input
          type="text"
          placeholder={t("automation.automation report.site")}
          value={siteLocation}
          onChange={(e) => setSiteLocation(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">{t("automation.automation report.condition.a")}</option>
          <option value="مكتمل">{t("automation.automation report.condition.b")}</option>
          <option value="معلق">{t("automation.automation report.condition.c")}</option>
          <option value="مسودة">{t("automation.automation report.condition.d")}</option>
        </select>
        <input
          type="text"
          placeholder={t("automation.automation report.reference")}
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
        <input
          type="text"
          placeholder={t("automation.automation report.property")}
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded-md"
        >
          {loading ? "Searching..." : t("automation.automation report.button")}
        </button>
        <button
          onClick={clearSearch}
          disabled={loading}
          className="bg-gray-500 text-white px-6 py-2 rounded-md"
        >
          Clear
        </button>
      </div>

      {error && <p className="text-red-600 mt-4">Error: {error}</p>}
      {loading && <p className="mt-4">Loading reports...</p>}
    </div>
  );

  const EmptyState = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
      <p className="text-gray-500 mb-6">
        {reportName || siteLocation || condition || referenceNumber || propertyType || fromDate || toDate
          ? "No reports match your search criteria."
          : "There are currently no reports in the database."}
      </p>
      {(reportName || siteLocation || condition || referenceNumber || propertyType || fromDate || toDate) && (
        <button
          onClick={clearSearch}
          className="bg-blue-500 text-white px-6 py-2 rounded-md"
        >
          Clear Search Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <SearchInterface />
      {currentStep === "select" &&
        (reports.length === 0 && !loading ? (
          <EmptyState />
        ) : (
          <SelectStep
            columns={columns}
            data={reports}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            onContinue={() => console.log("Selected rows:", selectedRows)}
          />
        ))}
    </>
  );
};

export default AutomaticPropertyExtraction;
