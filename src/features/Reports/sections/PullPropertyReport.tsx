import React, { useState } from "react";
import { FileText, MapPin, LayoutGrid, Search } from "lucide-react";
import Stepper from "../components/Stepper";
import type { WorkflowStep } from "../components/types";

type PropertyType = "all" | "residential" | "commercial" | "industrial" | "land";

const PullPropertyReport: React.FC = () => {
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Pull one property report</h3>
        <p className="text-gray-600">
          Search for a specific property report, extract it, and submit it to the Authority&apos;s system.
        </p>
      </div>

      <form onSubmit={onSearch} className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
        <h4 className="text-base font-medium text-gray-900 mb-4">Search for the report</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reference number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="inline-flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" aria-hidden />
                Reference number
              </span>
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Enter the reference number (example: 065428)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Report name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" aria-hidden />
                Report name
              </span>
            </label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Enter the name of the report or part of it."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* the site */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" aria-hidden />
                the site
              </span>
            </label>
            <input
              type="text"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              placeholder="Enter the name of the city or region"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Property type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="inline-flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-gray-500" aria-hidden />
                Property type
              </span>
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All types</option>
              <option value="residential">Residential villa</option>
              <option value="commercial">Commercial office</option>
              <option value="industrial">Industrial warehouse</option>
              <option value="land">Residential apartment</option>
              <option value="land">Commercial store</option>
              <option value="land">Investment complex</option>
              <option value="land">Agricultural land</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Search className="h-4 w-4" aria-hidden />
            Search for the report
          </button>
          <button
            type="button"
            onClick={onClear}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear fields
          </button>
        </div>
      </form>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div className="md:col-span-2">
          <div className="text-gray-600 text-sm mb-2">Find the report and select it to proceed.</div>

          <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-xl py-10 text-gray-500 bg-gray-50">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Look up a report to begin</p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            disabled
            className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-600 cursor-not-allowed"
          >
            Select a report to follow up on.
          </button>
        </div>
      </div>
    </div>
  );
};

export default PullPropertyReport;
