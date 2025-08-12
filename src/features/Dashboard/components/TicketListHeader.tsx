import React from 'react';
import { Search, Filter, ChevronDown, Plus } from 'lucide-react';

export interface TicketListHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showTicketFilter: boolean;
  setShowTicketFilter: (show: boolean) => void;
  setShowModal: (modalName: string) => void;
}

const TicketListHeader: React.FC<TicketListHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  showTicketFilter,
  setShowTicketFilter,
  setShowModal
}) => {
  return (
<div className="p-6 flex flex-col md:flex-row md:flex-wrap md:justify-between md:items-center border-b border-gray-200 gap-4 max-w-full">
  <h2 className="text-lg font-medium text-gray-900 whitespace-nowrap">
    إدارة تذاكر الدعم
  </h2>
  <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
    {/* Search Input */}
    <div className="relative">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        type="text"
        placeholder="البحث في التذاكر..."
        className="w-full md:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
    </div>
    {/* Filter Dropdown */}
    <div className="relative">
      <button
        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 whitespace-nowrap"
        onClick={() => setShowTicketFilter(!showTicketFilter)}
      >
        <Filter className="h-4 w-4 ml-2" />
        تصفية
        <ChevronDown className="h-4 w-4 mr-2" />
      </button>
      {showTicketFilter && (
        <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          {/* Filter options */}
        </div>
      )}
    </div>
    {/* Add Ticket Button */}
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap"
      onClick={() => setShowModal('add-ticket')}
    >
      <Plus className="h-4 w-4 ml-2" />
      إضافة تذكرة
    </button>
  </div>
</div>



  );
};

export default TicketListHeader;