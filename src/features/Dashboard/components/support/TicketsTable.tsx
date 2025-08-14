import { Dispatch, SetStateAction } from "react";
import { Edit, CheckSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TicketsTableProps {
  filteredTickets: SupportTicket[];
  setViewingTicket: Dispatch<SetStateAction<number | null>>;
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
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">#{ticket.id}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-900">
                    {ticket.subject}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 truncate max-w-sm">
                    {ticket.messages && ticket.messages.length > 0
                      ? ticket.messages[0].message
                      : t("common.noData", "لا يوجد وصف")}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-900">
                    {ticket.company}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {ticket.messages && ticket.messages.length > 0
                      ? ticket.messages[0].sender
                      : t("common.notAssigned", "غير محدد")}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${ticket.priority === t("support.newTicket.priorityHigh", "عالي")
                      ? "bg-red-100 text-red-800"
                      : ticket.priority === t("support.newTicket.priorityMedium", "متوسط")
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-800"
                    }`}
                >
                  {ticket.priority}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${ticket.status === t("dashboard.ticketStatus.open", "مفتوح")
                      ? "bg-blue-100 text-blue-800"
                      : ticket.status === t("dashboard.ticketStatus.inProgress", "قيد المعالجة")
                        ? "bg-amber-100 text-amber-800"
                        : ticket.status === t("dashboard.ticketStatus.closed", "مغلق")
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {ticket.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">
                  {ticket.assignedTo || t("common.notAssigned", "غير معين")}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDateTime(ticket.createdAt)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDateTime(ticket.updatedAt)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 text-center">
                {ticket.messages ? ticket.messages.length : 0}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <button
                    className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
                    onClick={() => setViewingTicket(ticket.id)}
                  >
                    {t("support.recentTickets.viewDetails", "عرض التفاصيل")}
                  </button>
                  {ticket.status === t("dashboard.ticketStatus.closed", "مغلق") && (
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
