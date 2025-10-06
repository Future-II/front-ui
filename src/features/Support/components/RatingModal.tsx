import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { api } from "../../../shared/utils/api";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  ticketSubject: string;
  onRatingSubmitted: (rating: number, comment: string) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  ticketId,
  ticketSubject,
  onRatingSubmitted,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onRatingSubmitted(rating, comment.trim() || "");
      onClose();
    } catch (err: any) {
      console.error("Error submitting rating:", err);
      setError(err.message || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setRating(0);
      setComment("");
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Rate Our Service</h2>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Ticket</h3>
            <p className="text-gray-900 text-sm">{ticketSubject}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you rate our service?
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  disabled={submitting}
                  className="focus:outline-none disabled:opacity-50"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    } hover:text-yellow-400 transition-colors`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={submitting}
              placeholder="Tell us more about your experience..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              rows={3}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || rating === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Rating"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;

