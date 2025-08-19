import React, { useState } from "react";
import { FileText, MapPin, LayoutGrid, Search } from "lucide-react";
import Stepper from "../components/Stepper";
import type { WorkflowStep } from "../components/types";
import { useTranslation } from "react-i18next";

type PropertyType = "all" | "residential" | "commercial" | "industrial" | "land";

const PullPropertyReport: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep] = useState<WorkflowStep>("select");

  const [referenceNumber, setReferenceNumber] = useState("");
  const [reportName, setReportName] = useState("");
  const [site, setSite] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>("all");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ referenceNumber, reportName, site, propertyType });
  };

  const onClear = () => {
    setReferenceNumber("");
    setReportName("");
    setSite("");
    setPropertyType("all");
  };

  return (
    <div>
      <Stepper current={currentStep} />

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("mekyas.pullReport.title")}
        </h3>
        <p className="text-gray-600">{t("mekyas.pullReport.subtitle")}</p>
      </div>

      <form onSubmit={onSearch} className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
        <h4 className="text-base font-medium text-gray-900 mb-4">
          {t("mekyas.pullReport.searchTitle")}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reference number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="inline-flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" aria-hidden />
                {t("mekyas.pullReport.referenceNumber")}
              </span>
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder={t("mekyas.pullReport.referencePlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Report name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" aria-hidden />
                {t("mekyas.pullReport.reportName")}
              </span>
            </label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder={t("mekyas.pullReport.reportPlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Site */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" aria-hidden />
                {t("mekyas.pullReport.site")}
              </span>
            </label>
            <input
              type="text"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              placeholder={t("mekyas.pullReport.sitePlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="inline-flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-gray-500" aria-hidden />
                {t("mekyas.pullReport.propertyType")}
              </span>
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">{t("mekyas.pullReport.types.all")}</option>
              <option value="residential">{t("mekyas.pullReport.types.residential")}</option>
              <option value="commercial">{t("mekyas.pullReport.types.commercial")}</option>
              <option value="industrial">{t("mekyas.pullReport.types.industrial")}</option>
              <option value="land">{t("mekyas.pullReport.types.apartment")}</option>
              <option value="land">{t("mekyas.pullReport.types.store")}</option>
              <option value="land">{t("mekyas.pullReport.types.complex")}</option>
              <option value="land">{t("mekyas.pullReport.types.agriculture")}</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Search className="h-4 w-4" aria-hidden />
            {t("mekyas.pullReport.searchButton")}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t("mekyas.pullReport.clearButton")}
          </button>
        </div>
      </form>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div className="md:col-span-2">
          <div className="text-gray-600 text-sm mb-2">{t("mekyas.pullReport.selectHint")}</div>

          <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-xl py-10 text-gray-500 bg-gray-50">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>{t("mekyas.pullReport.lookupHint")}</p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            disabled
            className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-600 cursor-not-allowed"
          >
            {t("mekyas.pullReport.disabledButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PullPropertyReport;
