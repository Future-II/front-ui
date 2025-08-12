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

interface RecentTicketsListProps {
  supportTickets: SupportTicket[];
  formatDateTime: (dateString: string) => string;
  onViewAllTickets: () => void;
}

export default function RecentTicketsList({ supportTickets, formatDateTime, onViewAllTickets }: RecentTicketsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        أحدث التذاكر
      </h3>
      <div className="space-y-4">
        {supportTickets.slice(0, 3).map(ticket => (
          <div key={ticket.id} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <div className="flex justify-between">
              <h4 className="text-sm font-medium text-gray-900">
                {ticket.subject}
              </h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${ticket.status === 'مفتوح' ? 'bg-blue-100 text-blue-800' : ticket.status === 'قيد المعالجة' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                {ticket.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{ticket.company}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {formatDateTime(ticket.createdAt)}
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-xs">
                عرض التفاصيل
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" onClick={onViewAllTickets}>
          عرض جميع التذاكر
        </button>
      </div>
    </div>
  );
}