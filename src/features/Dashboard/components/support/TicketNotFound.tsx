interface TicketNotFoundProps {
  setViewingTicket: (ticketId: string | null) => void;
}

const TicketNotFound: React.FC<TicketNotFoundProps> = ({ setViewingTicket }) => {
  return (
    <div className="p-8 text-center">
      <p className="text-gray-500">التذكرة غير موجودة</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        onClick={() => setViewingTicket(null)}
      >
        العودة إلى قائمة التذاكر
      </button>
    </div>
  );
};

export default TicketNotFound;