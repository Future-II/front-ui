import React, { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';
import { X, Send, MessageCircle, User } from "lucide-react";
import { api } from "../../../shared/utils/api";
import { useUnreadMessages } from "../context/UnreadMessagesContext";
import { TicketMessage } from "../types";

interface TicketChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  ticketSubject: string;
}



const TicketChatModal: React.FC<TicketChatModalProps> = ({
  isOpen,
  onClose,
  ticketId,
  ticketSubject
}) => {
  const [chatMessages, setChatMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { unreadMessages, incrementUnread, clearUnread, setOpenChatTicketId, openChatTicketId } = useUnreadMessages();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.email === "admin.tickets@gmail.com";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setOpenChatTicketId(ticketId);
      clearUnread(ticketId);
      inputRef.current?.focus();

      // Fetch messages
      const fetchMessages = async () => {
        setLoadingMessages(true);
        setFetchError(null);
        try {
          const { data } = await api.get(`/messages/${ticketId}`);
          if (data.success) {
            const messages: TicketMessage[] = data.messages.map((msg: any) => ({
              sender: msg.sender,
              message: msg.message,
              timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp
            }));
            setChatMessages(messages);
            // Auto-scroll after loading
            setTimeout(scrollToBottom, 100);
          } else {
            setFetchError('Failed to load messages');
          }
        } catch (error) {
          console.error('Failed to fetch messages:', error);
          setFetchError('Failed to load messages. Please try again.');
        } finally {
          setLoadingMessages(false);
        }
      };
      fetchMessages();
    }
  }, [isOpen, ticketId]);

  useEffect(() => {
    if (isOpen && !socket) {
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        newSocket.emit('join_ticket', ticketId);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Disconnected from chat server:', reason);
      });

      newSocket.on('receive_message', (data) => {
        setChatMessages(prev => {
          const exists = prev.some(m =>
            m.message === data.message &&
            m.sender === data.sender &&
            Math.abs(new Date(m.timestamp).getTime() - new Date(data.timestamp).getTime()) < 1000
          );
          if (!exists) {
            if (openChatTicketId !== ticketId) {
              incrementUnread(ticketId);
            }
            return [...prev, { sender: data.sender, message: data.message, timestamp: data.timestamp }];
          }
          return prev;
        });
        // Auto-scroll on new message
        setTimeout(scrollToBottom, 100);
      });

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [isOpen, ticketId, socket]);

  // Auto-scroll when messages change
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isOpen]);

  const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!newMessage.trim()) return;
    const sender: "support" | "customer" = isAdmin ? 'support' : 'customer';
    const messageObj: TicketMessage = {
      sender,
      message: newMessage.trim(),
      timestamp: new Date().toISOString()
    };
    // Add locally
    setChatMessages(prev => [...prev, messageObj]);
    setNewMessage("");
    try {
      await api.post(`/messages/${ticketId}`, { message: newMessage.trim() });
      // Emit socket
      if (socket) {
        socket.emit('send_message', { ticketId, message: messageObj });
      }
    } catch (error) {
      // Remove on failure
      setChatMessages(prev => prev.filter(m => !(m.message === messageObj.message && m.timestamp === messageObj.timestamp)));
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Support Chat</h3>
              <p className="text-sm text-blue-100">Ticket #{ticketId.slice(-6)} - {ticketSubject}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-blue-100 rounded-lg hover:bg-white hover:bg-opacity-10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {loadingMessages ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading messages...</p>
            </div>
          ) : fetchError ? (
            <div className="text-center py-4 text-red-600">{fetchError}</div>
          ) : chatMessages.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-300 ${
                  msg.sender === 'customer' ? 'justify-end' : 'justify-start'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.sender === 'customer'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    <User className="h-4 w-4" />
                  </div>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    msg.sender === 'customer'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white text-gray-900 rounded-tl-sm border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p
                    className={`text-xs mt-2 ${
                      msg.sender === 'customer' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatDate(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="px-4 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketChatModal;
