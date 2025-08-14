import { Dispatch, SetStateAction } from "react";
import { Search, Filter, ChevronDown, Plus } from "lucide-react";

interface SupportTicketsHeaderProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  showTicketFilter: boolean;
  setShowTicketFilter: Dispatch<SetStateAction<boolean>>;
  setShowModal: Dispatch<SetStateAction<string | null>>;
}

export default function SupportTicketsHeader({
  searchTerm,
  setSearchTerm,
  showTicketFilter,
  setShowTicketFilter,
  setShowModal,
}: SupportTicketsHeaderProps) {
  return (
    <div className="p-6 flex ml-8 flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 gap-4">
      <h2 className="text-lg font-medium text-gray-900">إدارة تذاكر الدعم</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="البحث في التذاكر..."
            className="w-full md:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <FilterDropdown
          showTicketFilter={showTicketFilter}
          setShowTicketFilter={setShowTicketFilter}
        />
      </div>
    </div>
  );
}

interface FilterDropdownProps {
  showTicketFilter: boolean;
  setShowTicketFilter: Dispatch<SetStateAction<boolean>>;
}

function FilterDropdown({ showTicketFilter, setShowTicketFilter }: FilterDropdownProps) {
  return (
    <div className="relative">
      <button
        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
        onClick={() => setShowTicketFilter(!showTicketFilter)}
      >
        <Filter className="h-4 w-4 ml-2" />
        تصفية
        <ChevronDown className="h-4 w-4 mr-2" />
      </button>

      {showTicketFilter && (
        <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <FilterSection title="الحالة" options={["مفتوح", "قيد المعالجة", "مغلق"]} />
            <FilterSection title="الأولوية" options={["عالي", "متوسط", "منخفض"]} />
            <div className="border-t border-gray-100 mt-2 pt-2 px-4 py-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                تطبيق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  options: string[];
}

function FilterSection({ title, options }: FilterSectionProps) {
  return (
    <div className="px-4 py-2 text-sm text-gray-700">
      <div className="mb-2 font-medium">{title}</div>
      <div className="space-y-1">
        {options.map((option) => (
          <label key={option} className="flex items-center">
            <input type="checkbox" className="ml-2" />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
