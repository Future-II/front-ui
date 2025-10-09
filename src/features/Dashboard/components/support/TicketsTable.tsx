import { Dispatch, SetStateAction } from "react";
import { Edit, CheckSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SupportTicket } from "../../types";

interface TicketsTableProps {
  filteredTickets: SupportTicket[];
  setViewingTicket: Dispatch<SetStateAction<string | null>>;
  setShowModal: Dispatch<SetStateAction<string | null>>;
  formatDateTime: (date: string) => string;
}

export default function TicketsTable({
  filteredTickets,
  setViewingTicket,
  setShowModal,
  formatDateTime,
}: TicketsTableProps) {
  const { t } = useTranslation();

  const getPriorityClass = (classification: string) => {
    switch (classification) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-amber-100 text-amber-800";
      case "low":
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-amber-100 text-amber-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto min-w-0 divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {[
              t("support.ticketsTab.ticketNumber"),
              t("support.ticketsTab.subjectDescription", "الموضوع والوصف"),
              t("dashboard.recentCompanies.title"),
              t("common.priority", "الأولوية"),
              t("common.status"),
              t("common.assignedTo", "المسؤول"),
              t("common.createdAt", "تاريخ الإنشاء"),
              t("common.updatedAt", "آخر تحديث"),
              t("common.replies", "عدد الردود"),
              t("common.actions"),
            ].map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredTickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-gray-50">
              {/* Ticket ID */}
              <td className="px-6 py-4 text-sm text-gray-500">#{ticket.id.slice(-6)}</td>

              {/* Subject & First Message */}
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                  <div className="text-xs text-gray-400 mt-1 truncate max-w-sm">
                    {ticket.description || t("common.noData", "لا يوجد وصف")}
                  </div>
                </div>
              </td>

              {/* Company & Sender */}
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-900">
                    {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {ticket.createdBy?.email}
                  </div>
                </div>
              </td>

              {/* Priority */}
              <td className="px-6 py-4">
                <span
                  className={`inline-flex justify-center whitespace-nowrap px-3 py-0.5 text-xs rounded-full ${getPriorityClass(
                    (ticket as any).priority || (ticket as any).classification
                  )}`}
                >
                  {t(`ticket.priority.${(ticket as any).priority || (ticket as any).classification || 'low'}`)}
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <span
                  className={`inline-flex justify-center whitespace-nowrap px-3 py-0.5 text-xs rounded-full ${getStatusClass(
                    ticket.status
                  )}`}
                >
                  {ticket.status === 'in-progress' ? t('ticket.status.inProgress') : ticket.status === 'resolved' ? t('ticket.status.resolved') : ticket.status === 'closed' ? t('support.ticketStatus.closed') : t('ticket.status.open')}
                </span>
              </td>

              {/* Assigned To */}
              <td className="px-6 py-4 text-sm text-gray-500">
                {ticket.assignedTo || 'admin.tickets@gmail.com'}
              </td>

              {/* Created At */}
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDateTime(ticket.createdAt)}
              </td>

              {/* Updated At */}
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDateTime(ticket.updatedAt)}
              </td>

              {/* Replies Count */}
              <td className="px-6 py-4 text-sm text-gray-500 text-center">
                {ticket.messages?.length ?? 0}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <button
                    className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
                    onClick={() => setViewingTicket(ticket.id)}
                  >
                    {t("support.ticketsTab.viewChat", "View Chat")}
                  </button>
                  {ticket.status === "closed" && (
                    <CheckSquare size={20} className="mr-1 text-green-600" />
                  )}
                  <button
                    className="text-amber-600 hover:text-amber-900"
                    onClick={() => setShowModal(`edit-ticket-${ticket.id}`)}
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
