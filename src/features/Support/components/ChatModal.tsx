import React, { useState, useRef, useEffect } from "react";
import { X, Send, Paperclip, Smile, User, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ChatMessage, ChatUser } from "../types";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: {
        id: "support-1",
        name: "Support Agent",
        avatarUrl: "",
        isSupport: true,
      },
      content: "Hello! How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUser: ChatUser = {
    id: "customer-1",
    name: "You",
    avatarUrl: "",
    isSupport: false,
  };

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, scrollToBottom, onClose]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: currentUser,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate support response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const supportMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        user: {
          id: "support-1",
          name: "Support Agent",
          avatarUrl: "",
          isSupport: true,
        },
        content: "Thank you for your message. I'll be happy to help you with that!",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, supportMessage]);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div
        className="bg-white w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-labelledby="chat-modal-title"
        aria-describedby="chat-modal-description"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Live Support Chat</h2>
              <p className="text-blue-100 text-sm">We're here to help you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-10"
            aria-label="Close chat modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-300 ${
                message.user.isSupport ? "" : "flex-row-reverse space-x-reverse"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {message.user.avatarUrl ? (
                  <img
                    src={message.user.avatarUrl}
                    alt={message.user.name}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                      message.user.isSupport
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                  message.user.isSupport
                    ? "bg-white text-gray-800 rounded-tl-sm"
                    : "bg-blue-600 text-white rounded-tr-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.user.isSupport ? "text-gray-500" : "text-blue-100"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <User className="h-5 w-5" />
                </div>
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-end space-x-3">
            {/* Attachment Button */}
            <button
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            {/* Message Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Type your message"
              />

              {/* Emoji Button */}
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Add emoji"
              >
                <Smile className="h-5 w-5" />
              </button>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
