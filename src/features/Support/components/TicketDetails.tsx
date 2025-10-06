import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, User, Paperclip, MessageCircle, Star } from "lucide-react";
import { api } from "../../../shared/utils/api";
import { useUnreadMessages } from "../context/UnreadMessagesContext";
import TicketChatModal from "./TicketChatModal";
import RatingModal from "./RatingModal";
import { Ticket } from "../types";

interface TicketDetailsViewProps {
  ticket: Ticket;
  onBack: () => void;
}



const TicketDetails: React.FC<TicketDetailsViewProps> = ({ ticket, onBack }) => {
  const [localTicket, setLocalTicket] = useState<Ticket>(ticket);
  const [showChat, setShowChat] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const { unreadMessages, incrementUnread, clearUnread, setOpenChatTicketId, openChatTicketId } = useUnreadMessages();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.email === "admin.tickets@gmail.com";

  useEffect(() => {
    setOpenChatTicketId(showChat ? localTicket._id : null);
  }, [showChat, localTicket._id, setOpenChatTicketId]);



  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status: Ticket["status"]): string => {
    const colors: Record<Ticket["status"], string> = {
      open: "blue",
      "in-progress": "amber", 
      resolved: "green",
      closed: "gray",
    };
    return colors[status] || "gray";
  };

  const getPriorityColor = (classification: Ticket["classification"]): string => {
    const colors: Record<Ticket["classification"], string> = {
      low: "green",
      medium: "amber",
      high: "red",
    };
    return colors[classification] || "gray";
  };

  const getStatusText = (status: Ticket["status"]): string => {
    const statusTexts: Record<Ticket["status"], string> = {
      open: "Open",
      "in-progress": "In Progress",
      resolved: "Resolved", 
      closed: "Closed",
    };
    return statusTexts[status] || status;
  };

  const getPriorityText = (classification: Ticket["classification"]): string => {
    const priorityTexts: Record<Ticket["classification"], string> = {
      low: "Low",
      medium: "Medium",
      high: "High",
    };
    return priorityTexts[classification] || classification;
  };

  const getStatusClasses = (status: Ticket["status"]): string => {
    const base = "px-3 py-1 text-sm font-medium rounded-full ";
    switch (status) {
      case "open": return base + "bg-blue-100 text-blue-800";
      case "in-progress": return base + "bg-amber-100 text-amber-800";
      case "resolved": return base + "bg-green-100 text-green-800";
      case "closed": return base + "bg-gray-100 text-gray-800";
      default: return base + "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityClasses = (classification: Ticket["classification"]): string => {
    const base = "px-3 py-1 text-sm font-medium rounded-full ";
    switch (classification) {
      case "low": return base + "bg-green-100 text-green-800";
      case "medium": return base + "bg-amber-100 text-amber-800";
      case "high": return base + "bg-red-100 text-red-800";
      default: return base + "bg-gray-100 text-gray-800";
    }
  };



  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };



  const handleUpdateStatus = async (status: Ticket["status"], priority?: number, classification?: Ticket["classification"]) => {
    // If customer is closing the ticket, show rating modal instead
    if (status === "closed" && localTicket.status !== "closed" && !isAdmin) {
      setShowRatingModal(true);
      return;
    }

    setUpdatingStatus(true);
    try {
      const { data } = await api.put(`/tickets/${localTicket._id}/status`, {
        status,
        priority,
        classification,
      });
      if (data.success) {
        // Update local ticket state
        setLocalTicket(data.ticket);
        alert(`Ticket ${status} successfully`);
      } else {
        alert('Failed to update ticket');
      }
    } catch (error) {
      console.error('Failed to update ticket:', error);
      alert('Failed to update ticket');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRatingSubmitted = async (rating: number, comment: string) => {
    // First close the ticket, then rate
    setUpdatingStatus(true);
    try {
      // Close the ticket
      const closeResponse = await api.put(`/tickets/${localTicket._id}/status`, {
        status: "closed",
      });
      if (!closeResponse.data.success) {
        throw new Error('Failed to close ticket');
      }

      // Update local state
      setLocalTicket(closeResponse.data.ticket);

      // Then rate the ticket
      const rateResponse = await api.post(`/tickets/${localTicket._id}/rate`, {
        rating,
        comment: comment || undefined,
      });
      if (!rateResponse.data.success) {
        throw new Error(rateResponse.data.message || 'Failed to submit rating');
      }

      alert('Ticket closed and rated successfully');
      // Refresh the page or update state
      window.location.reload();
    } catch (error: any) {
      console.error('Failed to close and rate ticket:', error);
      alert(error.message || 'Failed to close and rate ticket');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={onBack}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Ticket Details</h1>
                <p className="text-sm text-gray-500">#{localTicket._id.slice(-6)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={getStatusClasses(localTicket.status)}>
                {getStatusText(localTicket.status)}
              </span>
              <span className={getPriorityClasses(localTicket.classification)}>
                {getPriorityText(localTicket.classification)} Priority
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{localTicket.subject}</h2>

                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{localTicket.description}</p>
                </div>

                {/* Attachments */}
                {localTicket.attachments && localTicket.attachments.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Paperclip className="h-5 w-5 mr-2" />
                      Attachments ({localTicket.attachments.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {localTicket.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Paperclip className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.originalName || file.filename}
                            </p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
          {/* Ticket Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Information</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Created
                </dt>
                <dd className="text-sm text-gray-900 mt-1">{formatDate(localTicket.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Last Updated
                </dt>
                <dd className="text-sm text-gray-900 mt-1">{formatDate(localTicket.updatedAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  User
                </dt>
                <dd className="text-sm text-gray-900 mt-1">{localTicket.createdBy?.firstName} {localTicket.createdBy?.lastName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Priority
                </dt>
                <dd className="text-sm text-gray-900 mt-1">{getPriorityText(localTicket.classification)}</dd>
              </div>
              {(localTicket.rating || localTicket.rating === 0) && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-400" />
                    Customer Rating
                  </dt>
                  <dd className="text-sm text-gray-900 mt-1 flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= (localTicket.rating || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    {localTicket.ratingComment && (
                      <span className="ml-2 text-gray-600 italic text-xs">
                        "{localTicket.ratingComment}"
                      </span>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </div>

            {/* Ticket Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {!isAdmin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Change Status</label>
                      <select
                        onChange={(e) => handleUpdateStatus(e.target.value as Ticket["status"], localTicket.priority, localTicket.classification)}
                        disabled={updatingStatus}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        value={localTicket.status}
                      >
  <option value="open">Open</option>
  <option value="in-progress">In Progress</option>
  <option value="resolved">Resolved</option>
  <option value="closed">Closed</option>
</select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Change Priority</label>
                      <select
                        onChange={(e) => handleUpdateStatus(localTicket.status, undefined, e.target.value as Ticket["classification"])}
                        disabled={updatingStatus}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        defaultValue={localTicket.classification}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </>
                )}
                {isAdmin && localTicket.status === "closed" && (
                  <button
                    onClick={() => handleUpdateStatus("open")}
                    disabled={updatingStatus}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {updatingStatus ? "Reopening..." : "Reopen Ticket"}
                  </button>
                )}
              </div>
            </div>

      {/* Chat Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Communication</h3>
      <button
        onClick={() => setShowChat(true)}
        className="relative w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        <MessageCircle className="h-5 w-5 mr-2" />
        Open Chat
        {(unreadMessages[localTicket._id] || 0) > 0 && (
          <span className="absolute top-1 right-3 inline-flex items-center justify-center px-3 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full animate-pulse">
            {unreadMessages[localTicket._id] || 0}
          </span>
        )}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Chat with our support team for real-time assistance
      </p>
    </div>
          </div>
        </div>
      </div>

      <TicketChatModal
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        ticketId={localTicket._id}
        ticketSubject={localTicket.subject}
      />

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        ticketId={localTicket._id}
        ticketSubject={localTicket.subject}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </div>
  );
};

export default TicketDetails;