import React, { useState } from "react";
import { FileText } from "lucide-react";
import Stepper from "../components/Stepper";
import type { WorkflowStep } from "../components/types";

const PullPropertyReport: React.FC = () => {
  // we just mirror the header UI; default stays on "select"
  const [currentStep] = useState<WorkflowStep>("select");

  return (
    <div>
      {/* Stepper header (same as automatic tab) */}
      <Stepper current={currentStep} />

      {/* Page body */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Pull property report</h3>
        <p className="text-gray-600">
          Search a specific property report and send it to the authority system.
        </p>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Enter report number or name…"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Search
          </button>
        </div>
      </div>

      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <p>Look up a report to begin</p>
      </div>
    </div>
  );
};

export default PullPropertyReport;
