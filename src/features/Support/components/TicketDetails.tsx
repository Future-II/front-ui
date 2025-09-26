import React, { useState } from "react";
import { ArrowLeft, Calendar, Clock, User, Paperclip, MessageCircle, Send, X } from "lucide-react";

interface Ticket {
  _id: string;
  subject: string;
  classification: "low" | "medium" | "high";
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: number;
  attachments?: Array<{
    filename: string;
    originalName: string;
    path: string;
    mimetype: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface TicketDetailsViewProps {
  ticket: Ticket;
  onBack: () => void;
}

interface ChatMessage {
  id: number;
  sender: "support" | "customer";
  message: string;
  timestamp: string;
}

const TicketDetails: React.FC<TicketDetailsViewProps> = ({ ticket, onBack }) => {
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "support",
      message: "Thank you for reporting this issue. We're currently investigating the login problems.",
      timestamp: "2024-09-20T11:00:00Z"
    },
    {
      id: 2,
      sender: "customer", 
      message: "Any updates on the fix? This is affecting our daily operations.",
      timestamp: "2024-09-25T09:15:00Z"
    },
    {
      id: 3,
      sender: "support",
      message: "We've identified the issue and deployed a fix. Please try logging in now and let us know if you still experience problems.",
      timestamp: "2024-09-25T14:20:00Z"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

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

  const handleSendMessage = (): void => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: chatMessages.length + 1,
        sender: "customer",
        message: newMessage.trim(),
        timestamp: new Date().toISOString()
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage("");
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSendMessage();
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
                <p className="text-sm text-gray-500">#{ticket._id.slice(-6)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full bg-${getStatusColor(ticket.status)}-100 text-${getStatusColor(ticket.status)}-800`}>
                {getStatusText(ticket.status)}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full bg-${getPriorityColor(ticket.classification)}-100 text-${getPriorityColor(ticket.classification)}-800`}>
                {getPriorityText(ticket.classification)} Priority
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{ticket.subject}</h2>
                
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
                </div>

                {/* Attachments */}
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Paperclip className="h-5 w-5 mr-2" />
                      Attachments ({ticket.attachments.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {ticket.attachments.map((file, index) => (
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
                  <dd className="text-sm text-gray-900 mt-1">{formatDate(ticket.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Last Updated
                  </dt>
                  <dd className="text-sm text-gray-900 mt-1">{formatDate(ticket.updatedAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Priority
                  </dt>
                  <dd className="text-sm text-gray-900 mt-1">{getPriorityText(ticket.classification)}</dd>
                </div>
              </dl>
            </div>

            {/* Chat Button */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Communication</h3>
              <button
                onClick={() => setShowChat(true)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Open Chat
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Chat with our support team for real-time assistance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Support Chat</h3>
                <p className="text-sm text-gray-600">Ticket #{ticket._id.slice(-6)}</p>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'customer'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === 'customer' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {formatDate(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;