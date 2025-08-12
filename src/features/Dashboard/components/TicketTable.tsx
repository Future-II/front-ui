import React from 'react';
import { Edit } from 'lucide-react';

const formatDateTime = (date: string) => new Date(date).toLocaleString();

export interface TicketTableProps {
  filteredTickets: SupportTicket[];
  setViewingTicket: (id: number | null) => void;
  setShowModal: (modalName: string) => void;
}

const TicketTable: React.FC<TicketTableProps> = ({
  filteredTickets,
  setViewingTicket,
  setShowModal
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
      {/* Scrollable container */}
      <div className="overflow-x-auto max-w-full">
        {/* Table wrapper to allow a horizontal scrollbar */}
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-[900px] w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم التذكرة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموضوع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الشركة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الأولوية</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المسؤول</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">آخر تحديث</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد الردود</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500 text-center whitespace-normal break-words">#{ticket.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-normal break-words">{ticket.subject}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-normal break-words">{ticket.company}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ticket.priority === 'عالي'
                          ? 'bg-red-100 text-red-800'
                          : ticket.priority === 'متوسط'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ticket.status === 'مفتوح'
                          ? 'bg-blue-100 text-blue-800'
                          : ticket.status === 'قيد المعالجة'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center whitespace-normal break-words">
                    {ticket.assignedTo || 'غير معين'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center">
                    {formatDateTime(ticket.updatedAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center">
                    {ticket.messages ? ticket.messages.length : 0}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-center space-x-2 space-x-reverse">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TicketTable;