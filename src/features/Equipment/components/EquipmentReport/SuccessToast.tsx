import React from 'react';
import { useNavigate } from "react-router-dom";

interface SuccessToastProps {
  onClose: () => void;
  reportId: string;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ onClose, reportId }) => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-4 rounded-md shadow-lg z-50 animate-fade-in-out max-w-md">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Report saved successfully!</div>
          <div className="text-sm mt-1">Report ID: {reportId}</div>
        </div>
        <button
          onClick={() => navigate("/equipment/viewReports")}
          className="ml-4 px-4 py-2 bg-white text-green-600 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          View Reports
        </button>
      </div>
      <button
        onClick={onClose}
        className="mt-3 text-sm underline hover:text-gray-200 block"
      >
        Close
      </button>
    </div>
  );
};

export default SuccessToast;