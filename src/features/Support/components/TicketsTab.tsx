import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus, RefreshCw, AlertCircle, Bell, Star } from "lucide-react";
import { api } from "../../../shared/utils/api";
import TicketDetails from "../components/TicketDetails";
import TicketChatModal from "./TicketChatModal";
import { useUnreadMessages } from "../context/UnreadMessagesContext";
import { Ticket } from "../types";

interface TicketsTabProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setActiveTab: (tab: "contact" | "tickets" | "faq") => void;
}

const TicketsTab: React.FC<TicketsTabProps> = ({
  searchTerm,
  setSearchTerm,
  setActiveTab,
}) => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null); // Add state for selected ticket
  const [chatModalTicketId, setChatModalTicketId] = useState<string | null>(null);
  const [chatModalTicketSubject, setChatModalTicketSubject] = useState<string>("");

  const { unreadMessages, clearUnread, joinTickets, checkForNewMessages } = useUnreadMessages();

  // Debug: Log unread messages state
  useEffect(() => {
    console.log("Unread messages state:", unreadMessages);
  }, [unreadMessages]);

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // Clear unread count when ticket is opened
  useEffect(() => {
    if (selectedTicket) {
      clearUnread(selectedTicket._id);
    }
  }, [selectedTicket, clearUnread]);

  // Clear unread count when chat modal is opened
  useEffect(() => {
    if (chatModalTicketId) {
      clearUnread(chatModalTicketId);
    }
  }, [chatModalTicketId, clearUnread]);

  // Fetch tickets function
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/tickets');
      if (data.success) {
        setTickets(data.tickets);
        // Check for new messages to update unread counts
        checkForNewMessages(data.tickets);
        // Join tickets for socket
        joinTickets(data.tickets.map((t: Ticket) => t._id));
      } else {
        setError('Failed to load tickets');
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
  };

  // Filtered tickets based on search
  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Utility functions
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const formatLastUpdate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return formatDate(dateString);
    }
  };

  // Static class mappings for Tailwind colors to avoid dynamic class names
  const statusColorClasses: Record<Ticket["status"], { bg: string; text: string }> = {
    open: { bg: "bg-blue-100", text: "text-blue-800" },
    "in-progress": { bg: "bg-amber-100", text: "text-amber-800" },
    resolved: { bg: "bg-green-100", text: "text-green-800" },
    closed: { bg: "bg-gray-100", text: "text-gray-800" },
  };

  const statusTextMap: Record<Ticket["status"], string> = {
    open: "Open",
    "in-progress": "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  };

  const priorityColorClasses: Record<Ticket["classification"], { bg: string; text: string }> = {
    low: { bg: "bg-green-100", text: "text-green-800" },
    medium: { bg: "bg-amber-100", text: "text-amber-800" },
    high: { bg: "bg-red-100", text: "text-red-800" },
  };

  const priorityTextMap: Record<Ticket["classification"], string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  const handleOpenFile = (ticketId: string, file: any) => {
    // Open file in new tab or download
    const fileUrl = `${api.defaults.baseURL}/tickets/${ticketId}/attachments/${file.filename}`;
    window.open(fileUrl, '_blank');
  };

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleOpenChat = (ticket: Ticket) => {
    setChatModalTicketId(ticket._id);
    setChatModalTicketSubject(ticket.subject);
  };

  const handleCloseChatModal = () => {
    setChatModalTicketId(null);
    setChatModalTicketSubject("");
  };

  if (selectedTicket) {
    return <TicketDetails ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">My Tickets</h2>
          <p className="text-gray-600 mt-1">View and manage your tickets</p>
        </div>
        <div className="p-12 text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">My Tickets</h2>
        <p className="text-gray-600 mt-1">View and manage your tickets</p>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full md:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors"
              title="Refresh tickets"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
          <button
            onClick={() => setActiveTab("contact")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <p className="text-red-800 font-medium">Error loading tickets</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="ml-auto px-3 py-1 text-red-600 hover:text-red-800 text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {!error && filteredTickets.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "No tickets match your search criteria." : "You haven't created any tickets yet."}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setActiveTab("contact")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create your first ticket
              </button>
            )}
          </div>
        )}

        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">{ticket.subject}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {ticket.description}
                  </p>
                  <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500">
                    <span>#{ticket._id.slice(-6)}</span>
                    <span>•</span>
                    <span>{formatDate(ticket.createdAt)}</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorClasses[ticket.status]?.bg} ${statusColorClasses[ticket.status]?.text}`}
                    >
                      {statusTextMap[ticket.status]}
                    </span>

                    {/* Customer Rating */}
                    {typeof ticket.rating === 'number' && (
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const rating = ticket.rating as number;
                          return (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          );
                        })}
                      </div>
                    )}

                    {/* 🔹 Files inline with better styling */}
                    {ticket.attachments && ticket.attachments.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        {ticket.attachments.map((file, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent ticket card click
                              handleOpenFile(ticket._id, file);
                            }}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                          >
                            📎 {file.originalName || file.filename}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="relative">
                    <div className={`p-2 rounded-full transition-all duration-300 ${unreadMessages[ticket._id] > 0 ? 'bg-red-100 animate-pulse' : 'bg-gray-100'}`}>
                      <Bell className={`h-5 w-5 transition-colors duration-300 ${unreadMessages[ticket._id] > 0 ? 'text-red-500' : 'text-gray-500'}`} />
                    </div>
                    {unreadMessages[ticket._id] > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[20px] h-[20px] animate-bounce">
                        {unreadMessages[ticket._id]}
                      </span>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColorClasses[ticket.classification]?.bg} ${priorityColorClasses[ticket.classification]?.text}`}
                  >
                    {priorityTextMap[ticket.classification]}
                  </span>
                </div>
              </div>

              {/* 🔹 Bottom actions */}
              <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  Last updated: {formatLastUpdate(ticket.updatedAt)}
                </div>
                <div className="flex gap-4">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      handleOpenChat(ticket);
                    }}
                  >
                    Open Chat
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      handleViewDetails(ticket);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTickets.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Showing {filteredTickets.length} of {tickets.length} ticket
              {tickets.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {chatModalTicketId && (
        <TicketChatModal
          isOpen={!!chatModalTicketId}
          onClose={handleCloseChatModal}
          ticketId={chatModalTicketId as string}
          ticketSubject={chatModalTicketSubject}
        />
      )}
    </div>
  );
};

export default TicketsTab;
