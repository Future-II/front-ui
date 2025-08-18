import React from "react";
import { formatTime, formatDateTime } from "../../../../shared/utils/formatTime";
import { useLanguage } from "../../../../hooks/useLanguage";

interface ChatItemProps {
    sender: string;
    role?: string;
    message: string;
    timestamp: Date;
    isSupport?: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({ sender, message, timestamp, isSupport }) => {
    const { isRTL } = useLanguage();

    return (
        <div className={`flex ${isSupport ? "justify-start" : "justify-end"} mb-4`}>
            <div
                className={`max-w-lg px-4 py-2 rounded-lg border ${isSupport ? "bg-blue-50 border-blue-100" : "bg-gray-50 border-gray-200"
                    }`}
            >
                <div className="mb-1">
                    <span className="font-medium">{sender}</span>
                </div>
                <div className="text-[12px] mb-2 text-gray-500">
                    {formatDateTime(timestamp, isRTL)} • {formatTime(timestamp, isRTL)}
                </div>

                <div className={` text-gray-800 mb-1`}>
                    {message}
                </div>
            </div>
        </div>
    );
};

export default ChatItem;
