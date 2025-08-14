import React, { useState } from "react";
import UploadBlock from "../components/UploadBlock";
import Stepper from "../components/Stepper";
import type { WorkflowStep } from "../components/types";

const ManualPropertyExtraction: React.FC = () => {
  // default to first step — can be wired to actual progress later
  const [currentStep] = useState<WorkflowStep>("select");

  return (
    <div>
      {/* Stepper header */}
      <Stepper current={currentStep} />

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Manual property report extraction
        </h3>
        <p className="text-gray-600">
          Upload report files from your device to send to the authority system
        </p>

        <div className="space-y-4 mt-4">
          <UploadBlock
            label="Drag Excel here or click to upload"
            accept=".xlsx,.xls"
            inputId="excel-upload"
          />
          <UploadBlock
            label="Drag related PDFs here or click to upload"
            accept=".pdf"
            inputId="pdf-upload"
            multiple
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled
        >
          Start extraction &amp; sending
        </button>
      </div>
    </div>
  );
};

export default ManualPropertyExtraction;
