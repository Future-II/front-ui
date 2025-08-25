import React, { useMemo, useState } from "react";
import { Search, RefreshCw, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import Table from "../../../shared/components/Common/Table";
import type { Report } from "./types";

type Props = {
  columns: any[];
  data: Report[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedRows: number[];
  onRowSelect: (rowId: number) => void;
  onSelectAll: () => void;
  onContinue: () => void;
};

const SelectStep: React.FC<Props> = ({
  columns,
  data,
  searchTerm,
  setSearchTerm,
  selectedRows,
  onRowSelect,
  onSelectAll,
  onContinue,
}) => {
  const { t } = useTranslation();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const formattedLastUpdated = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(lastUpdated);

  // advanced search state
  const [advReportName, setAdvReportName] = useState("");
  const [advSite, setAdvSite] = useState("");
  const [advPropertyType, setAdvPropertyType] = useState("");
  const [advCondition, setAdvCondition] = useState<
    "all" | "complete" | "pending" | "failed"
  >("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const clearAdvanced = () => {
    setAdvReportName("");
    setAdvSite("");
    setAdvPropertyType("");
    setAdvCondition("all");
    setDateFrom("");
    setDateTo("");
  };

  const handleSendSpecificReports = () => {
    // Implement send specific reports logic
    console.log("Send specific reports for selected rows:", selectedRows);
  };

  const handleDeleteSelectedReports = () => {
    // Implement delete selected reports logic
    console.log("Delete selected reports:", selectedRows);
  };

  const filtered = useMemo(() => {
    const text = searchTerm.trim().toLowerCase();
    return data.filter((r) => {
      const passesText =
        !text ||
        (r.reportName?.toLowerCase() || "").includes(text) ||
        (r.source?.toLowerCase() || "").includes(text) ||
        (r.location?.toLowerCase() || "").includes(text) ||
        (r.reference?.toString() || "").includes(text);
      if (!passesText) return false;

      if (
        advReportName &&
        !(r.reportName || "").toLowerCase().includes(advReportName.toLowerCase())
      )
        return false;
      if (
        advSite &&
        !(r.location || "").toLowerCase().includes(advSite.toLowerCase())
      )
        return false;
      if (
        advPropertyType &&
        !(r.propertyType || "").toLowerCase().includes(advPropertyType.toLowerCase())
      )
        return false;

      if (advCondition !== "all") {
        const cond = (r.condition || "").toLowerCase();
        if (cond !== advCondition) return false;
      }

      if (dateFrom || dateTo) {
        const rd = r.date ? new Date(r.date) : null;
        if (!rd) return false;
        if (dateFrom && rd < new Date(dateFrom)) return false;
        if (dateTo) {
          const dt = new Date(dateTo);
          dt.setHours(23, 59, 59, 999);
          if (rd > dt) return false;
        }
      }
      return true;
    });
  }, [data, searchTerm, advReportName, advSite, advPropertyType, advCondition, dateFrom, dateTo]);

  // wrap column headers with t()
  const translatedColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        header: t(col.headerKey ?? col.header), // expects `headerKey` for i18n keys
      })),
    [columns, t]
  );

  return (
    <div>
      <div className="mb-6">
        {/* Title + Update button */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {t("mekyas.selectStep.title")}
          </h3>
          <button
            type="button"
            onClick={() => setLastUpdated(new Date())}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Update from Scale
          </button>
        </div>

        {/* Description + last updated */}
        <div className="mt-1 mb-4 flex items-center justify-between">
          <p className="text-gray-600 m-0">
            {t("mekyas.selectStep.description")}
          </p>
          <span className="text-xs text-gray-500">
            {t("mekyas.selectStep.lastUpdated")}: {formattedLastUpdated}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleSendSpecificReports}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
              selectedRows.length === 0
                ? 'bg-green-300 text-white opacity-60 cursor-not-allowed blur-[0.5px]'
                : 'bg-green-500 hover:bg-green-600 text-white opacity-100'
            }`}
            disabled={selectedRows.length === 0}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send specific reports
          </button>
          <button
            onClick={handleDeleteSelectedReports}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedRows.length === 0
                ? 'bg-red-300 text-white opacity-60 cursor-not-allowed blur-[0.5px]'
                : 'bg-red-500 hover:bg-red-600 text-white opacity-100'
            }`}
            disabled={selectedRows.length === 0}
          >
            Delete selected reports
          </button>
        </div>

        {/* Search + Advanced Search */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t("mekyas.selectStep.searchPlaceholder")}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-blue-100 hover:border-blue-500 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              {t("mekyas.selectStep.advancedSearch")}
            </button>
          </div>
        </div>

        {/* Advanced Search Panel */}
        {showAdvanced && (
          <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 md:p-5">
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              {t("mekyas.selectStep.advancedSearch")}
            </h4>
            {/* … unchanged advanced search inputs … */}
          </div>
        )}

        <Table
          columns={translatedColumns}
          data={filtered}
          selectable
          selectedRows={selectedRows}
          onRowSelect={onRowSelect}
          onSelectAll={onSelectAll}
        />
      </div>

      {selectedRows.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <h4 className="font-medium text-gray-900 mb-3">
            {t("mekyas.selectStep.selectedCount", { count: selectedRows.length })}
          </h4>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={onContinue}
            >
              {t("mekyas.selectStep.continue")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectStep;