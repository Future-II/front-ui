import { useTranslation } from "react-i18next";

interface RecentTicketsListProps {
  supportTickets: SupportTicket[];
  formatDateTime: (dateString: string) => string;
  onViewAllTickets: () => void;
}

export default function RecentTicketsList({
  supportTickets,
  formatDateTime,
  onViewAllTickets,
}: RecentTicketsListProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Section Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        {t("dashboard.recentTickets.title")}
      </h3>

      {/* Tickets List */}
      <div className="space-y-3">
        {supportTickets.slice(0, 3).map((ticket) => (
          <div
            key={ticket.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            {/* Subject & Status */}
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-900">{ticket.subject}</h4>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  ticket.status === t("dashboard.tickets.status.open")
                    ? "bg-blue-100 text-blue-800"
                    : ticket.status === t("dashboard.tickets.status.inProgress")
                    ? "bg-amber-100 text-amber-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {ticket.status}
              </span>
            </div>

            {/* Company Name */}
            <p className="text-xs text-gray-500 mt-1">{ticket.company}</p>

            {/* Date & Action */}
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-500">
                {formatDateTime(ticket.createdAt)}
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                {t("dashboard.recentTickets.viewDetails")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-5 flex justify-center">
        <button
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={onViewAllTickets}
        >
          {t("dashboard.recentTickets.viewAll")}
        </button>
      </div>
    </div>
  );
}
