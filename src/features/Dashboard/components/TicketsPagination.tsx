interface TicketsPaginationProps {
  filteredTicketsCount: number;
  totalTicketsCount: number;
}

export default function TicketsPagination({ filteredTicketsCount, totalTicketsCount }: TicketsPaginationProps) {
  return (
    <div className="px-6 ml-8 py-4 border-t border-gray-200 bg-gray-50">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          عرض {filteredTicketsCount} من أصل {totalTicketsCount} تذكرة
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <button className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            السابق
          </button>
          <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</span>
          <button className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            التالي
          </button>
        </div>
      </div>
    </div>
  );
}
