import React from "react";
import { Search, Plus } from "lucide-react";

interface TicketsTabProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setActiveTab: (tab: "contact" | "tickets" | "faq") => void;
}


const TicketsTab: React.FC<TicketsTabProps> = ({
  searchTerm,
  setSearchTerm,
  setActiveTab,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-bold text-gray-900">تذاكر الدعم الفني</h2>
      <p className="text-gray-600 mt-1">تابع حالة تذاكر الدعم الفني الخاصة بك وتفاعل مع فريق الدعم</p>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
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
        <button
          onClick={() => setActiveTab("contact")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 ml-2" />
          تذكرة جديدة
        </button>
      </div>
      <div className="space-y-4">
        {[ // Dummy tickets (replace with your data or props)
          {
            id: 1,
            title: "مشكلة في سحب التقارير التلقائي",
            ticketNumber: "#1",
            date: "22/11/2023",
            status: "مفتوح",
            statusColor: "blue",
            priority: "عالي",
            priorityColor: "red",
            lastUpdate: "منذ 2 ساعة",
          },
          {
            id: 2,
            title: "استفسار عن ترقية الباقة",
            ticketNumber: "#2",
            date: "21/11/2023",
            status: "قيد المعالجة",
            statusColor: "amber",
            priority: "متوسط",
            priorityColor: "amber",
            lastUpdate: "منذ يوم واحد",
          },
          {
            id: 3,
            title: "طلب إضافة مستخدمين جدد",
            ticketNumber: "#3",
            date: "20/11/2023",
            status: "مغلق",
            statusColor: "green",
            priority: "منخفض",
            priorityColor: "green",
            lastUpdate: "منذ 2 أيام",
          },
        ].map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <span className="ml-2">رقم التذكرة: {ticket.ticketNumber}</span>
                  <span className="ml-2">{ticket.date}</span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full bg-${ticket.statusColor}-100 text-${ticket.statusColor}-800 mx-2`}
                  >
                    {ticket.status}
                  </span>
                </div>
              </div>
              <span
                className={`px-2 py-1 h-fit text-xs font-medium rounded-full bg-${ticket.priorityColor}-100 text-${ticket.priorityColor}-800`}
              >
                {ticket.priority}
              </span>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">آخر تحديث: {ticket.lastUpdate}</div>
              <button className="text-blue-600 hover:text-blue-800">عرض التفاصيل</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button className="text-blue-600 hover:text-blue-800 font-medium">عرض المزيد من التذاكر</button>
      </div>
    </div>
  </div>
);

export default TicketsTab;
