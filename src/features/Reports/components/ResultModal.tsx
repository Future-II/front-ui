import React from "react";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  failedRecords: number;
  batchId: string;
  onRetry: (batchId: string) => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  onClose,
  failedRecords,
  batchId,
  onRetry,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {failedRecords === 0
            ? "All Records Were Submitted"
            : "Some Records Failed"}
        </h2>

        {failedRecords > 0 && (
          <p className="text-gray-600 mb-4">
            {failedRecords} record(s) failed to submit. Would you like to retry?
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Close
          </button>

          {failedRecords > 0 && (
            <button
              onClick={() => onRetry(batchId)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
