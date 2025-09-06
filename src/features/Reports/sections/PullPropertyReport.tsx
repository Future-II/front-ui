import React, { useState } from "react";
import { FileText, Search, Filter } from "lucide-react";
import type { WorkflowStep } from "../components/types";
import { useTranslation } from "react-i18next";

type PropertyType = "all" | "residential" | "commercial" | "industrial" | "land";

const PullPropertyReport: React.FC = () => {
  const { t } = useTranslation();

  // FIX: cast the literal to WorkflowStep
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("select" as WorkflowStep);

  const [referenceNumber, setReferenceNumber] = useState("");
  const [reportName, setReportName] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [site, setSite] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>("all");
  const [condition, setCondition] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ referenceNumber, reportName, site, propertyType, condition, fromDate, toDate });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            {t("mekyas.selectStep.title")}
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          {t("mekyas.selectStep.description3")}
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <form onSubmit={onSearch} className="space-y-4">
          {/* Basic Search Fields */}
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder={t("automation.automation report.reference")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder={t("automation.automation report.report name")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Advanced Search Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Filter className="h-4 w-4" />
            Advanced Search
            <span className={`transform transition-transform ${showAdvancedSearch ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>

          {/* Advanced Search Fields */}
          {showAdvancedSearch && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* Site Field */}
              <div>
                <input
                  type="text"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  placeholder={t("automation.automation report.site")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Property Type Field */}
              <div>
                <input
                  type="text"
                  value={propertyType === "all" ? "" : propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                  placeholder={t("automation.automation report.property")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Condition Dropdown */}
              <div>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-500"
                >
                  <option value="">{t("automation.automation report.condition.a")}</option>
                  <option value="complete">{t("automation.automation report.condition.b")}</option>
                  <option value="pending">{t("automation.automation report.condition.c")}</option>
                  <option value="draft">{t("automation.automation report.condition.d")}</option>
                </select>
              </div>

              {/* Date Range Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    placeholder="mm/dd/yyyy"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    placeholder="mm/dd/yyyy"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" />
              {t("automation.automation report.button")}
            </button>
          </div>
        </form>
      </div>

      {/* Results Area */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">{t("automation.pull property.title")}</p>
          <p className="text-sm text-gray-400">
            {t("automation.pull property.description")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PullPropertyReport;
