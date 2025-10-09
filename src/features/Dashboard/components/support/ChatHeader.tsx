import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowDownLeft, Check, Edit3, MoreHorizontal } from "lucide-react";
import { SupportTicket } from "../../types";

interface ChatHeaderProps {
    ticket: SupportTicket;
    onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ ticket, onBack }) => {
    const { t } = useTranslation();

    console.log("ticket: ", ticket)

    const priorityLabel = ticket.priority === "high"
        ? t("ticket.priority.high")
        : ticket.priority === "medium"
            ? t("ticket.priority.medium")
            : t("ticket.priority.low");

    const statusLabel = ticket.status === "open"
        ? t("ticket.status.open")
        : ticket.status === "in-progress"
            ? t("ticket.status.inProgress")
            : ticket.status === "resolved"
                ? t("ticket.status.resolved")
                : t("ticket.status.unknown");

    return (
        <div className="flex items-center justify-between px-4 py-3 border border-gray-200 bg-white rounded-md">
            <div className="flex items-start gap-2 text-start">
                <button
                    onClick={onBack}
                    className="p-1 hover:bg-blue-50 rounded-full transition mt-1"
                >
                    <ArrowDownLeft size={16} className="text-blue-600" />
                </button>

                <div className="flex flex-col">
                    <span className="text-gray-800 text-lg">{ticket.subject}</span>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                        <span>
                            {t("ticket.idPrefix")} #{ticket.id} • {ticket.company ?? t("ticket.companyUnknown")}
                        </span>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs ${ticket.priority === "high"
                                ? "bg-red-100 text-red-600"
                                : ticket.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            {priorityLabel}
                        </span>

                        <span
                            className={`px-2 py-0.5 rounded-full text-xs ${ticket.status === "open"
                                ? "bg-blue-100 text-blue-600"
                                : ticket.status === "in-progress"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : ticket.status === "resolved"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            {statusLabel}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 flex items-center gap-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
                    <Edit3 size={14} />
                    {t("ticket.actions.edit")}
                </button>
                <button className="px-3 py-1.5 flex items-center gap-1 rounded-md bg-green-600 text-white text-sm hover:bg-green-700">
                    <Check size={14} />
                    {t("ticket.actions.close")}
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                    <MoreHorizontal size={18} className="text-gray-500" />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
