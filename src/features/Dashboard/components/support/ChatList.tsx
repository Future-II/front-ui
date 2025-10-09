import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../../hooks/useLanguage";
import { api } from "../../../../shared/utils/api";

import ChatItem from "./ChatItem";
import { formatDateTime } from "../../../../shared/utils/formatTime";
import ChatInput from "./ChatInput";

interface ChatListProps {
  ticketId: string;
  assignedTo?: string;
}

interface Msg {
  sender: "customer" | "support";
  message: string;
  timestamp: string | Date;
}

const ChatList = ({ ticketId, assignedTo }: ChatListProps) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/messages/${ticketId}`);
        if (data.success) {
          setMessages(data.messages || []);
        } else {
          setError("Failed to load messages");
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    if (ticketId) fetchMessages();
  }, [ticketId]);

  const createdTime = useMemo(() => {
    return messages.length > 0 ? messages[0].timestamp : null;
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    // optimistic update
    const optimistic: Msg = {
      sender: "support",
      message: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    try {
      await api.post(`/messages/${ticketId}`, { message: text.trim() });
    } catch (e) {
      // revert if failed
      setMessages((prev) => prev.filter((m) => m !== optimistic));
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between text-sm text-gray-500 mb-6">
        <div>
          {t("chat.ticketCreated")}: {createdTime ? formatDateTime(createdTime, isRTL) : "-"}
        </div>
        <div>
          {t("chat.assignedTo")}: <span className="text-black">{assignedTo || "admin.tickets@gmail.com"}</span>
        </div>
      </div>

      {/* Chat messages */}
      <div className="space-y-4 min-h-[200px]">
        {loading && <div className="text-gray-500">{t("common.loading")}</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && messages.length === 0 && (
          <div className="text-gray-500">{t("common.noData")}</div>
        )}
        {!loading && !error &&
          messages.map((msg, idx) => (
            <ChatItem
              key={idx}
              sender={msg.sender === "support" ? "Support" : "Customer"}
              message={msg.message}
              timestamp={new Date(msg.timestamp)}
              isSupport={msg.sender === "support"}
            />
          ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatList;
