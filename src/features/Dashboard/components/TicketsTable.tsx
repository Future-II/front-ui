import { Dispatch, SetStateAction } from "react";
import { Edit } from "lucide-react";

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
  return (
    <div className="overflow-x-auto max-w-[calc(100%-50px)]">
      <table className="table-fixed min-w-[800px] divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {[
              "رقم التذكرة",
              "الموضوع",
              "الشركة",
              "الأولوية",
              "الحالة",
              "المسؤول",
              "آخر تحديث",
              "عدد الردود",
              "الإجراءات",
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
                <div className="text-sm font-medium text-gray-900">
                  {ticket.subject}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">{ticket.company}</div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    ticket.priority === "عالي"
                      ? "bg-red-100 text-red-800"
                      : ticket.priority === "متوسط"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {ticket.priority}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    ticket.status === "مفتوح"
                      ? "bg-blue-100 text-blue-800"
                      : ticket.status === "قيد المعالجة"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {ticket.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">
                  {ticket.assignedTo || "غير معين"}
                </div>
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
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => setViewingTicket(ticket.id)}
                  >
                    عرض
                  </button>
                  <button
                    className="text-amber-600 hover:text-amber-900"
                    onClick={() => setShowModal(`edit-ticket-${ticket.id}`)}
                  >
                    <Edit className="h-4 w-4" />
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
