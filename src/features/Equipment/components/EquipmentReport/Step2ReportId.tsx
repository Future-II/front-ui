import React from 'react';

interface Step2ReportIdProps {
  reportId: string;
  onReportIdChange: (id: string) => void;
  onBack: () => void;
  onExtractAndStore: () => void;
  isExtracting: boolean;
}

const Step2ReportId: React.FC<Step2ReportIdProps> = ({
  reportId,
  onReportIdChange,
  onBack,
  onExtractAndStore,
  isExtracting
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Report ID
        </label>
        <input
          type="text"
          value={reportId}
          onChange={(e) => onReportIdChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter report ID"
        />
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-400 text-gray-600 rounded-sm transition-colors font-semibold hover:bg-gray-50"
        >
          Back
        </button>

        <button
          onClick={onExtractAndStore}
          disabled={!reportId.trim() || isExtracting}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            reportId.trim() && !isExtracting
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isExtracting ? "Extracting..." : "Extract Data and Store"}
        </button>
      </div>
    </div>
  );
};

export default Step2ReportId;