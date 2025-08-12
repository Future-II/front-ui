// components/TicketTable.tsx
import React from 'react';
import { Edit } from 'lucide-react';

const formatDateTime = (date: string) => new Date(date).toLocaleString();

interface TicketMessage {
  id: number;
  ticketId: number;
  sender: string;
  senderRole: 'user' | 'support';
  senderAvatar?: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

interface SupportTicket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  company: string;
  assignedTo?: string;
  messages?: TicketMessage[];
}

export interface TicketTableProps {
  filteredTickets: SupportTicket[];
  setViewingTicket: (id: number | null) => void;
  setShowModal: (modalName: string) => void;
}

const TicketTable: React.FC<TicketTableProps> = ({ filteredTickets, setViewingTicket, setShowModal }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم التذكرة</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموضوع</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الشركة</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الأولوية</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المسؤول</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">آخر تحديث</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد الردود</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredTickets.map(ticket => (
            <tr key={ticket.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">#{ticket.id}</div></td>
              <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{ticket.subject}</div></td>
              <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{ticket.company}</div></td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${ticket.priority === 'عالي' ? 'bg-red-100 text-red-800' : ticket.priority === 'متوسط' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>{ticket.priority}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${ticket.status === 'مفتوح' ? 'bg-blue-100 text-blue-800' : ticket.status === 'قيد المعالجة' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>{ticket.status}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{ticket.assignedTo || 'غير معين'}</div></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(ticket.updatedAt)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{ticket.messages ? ticket.messages.length : 0}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <button className="text-blue-600 hover:text-blue-900" onClick={() => setViewingTicket(ticket.id)}>عرض</button>
                  <button className="text-amber-600 hover:text-amber-900" onClick={() => setShowModal(`edit-ticket-${ticket.id}`)}><Edit className="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;