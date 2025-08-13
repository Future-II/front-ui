import React from "react";
import { useTranslation } from "react-i18next";
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
}) => {
  const { t } = useTranslation();

  // Tickets with translated strings
  const tickets = [
    {
      id: 1,
      title: t("support.ticketsData.ticket1.title"),
      ticketNumber: "#1",
      date: "22/11/2023",
      status: t("support.ticketsData.ticket1.status"),
      statusColor: "blue",
      priority: t("support.ticketsData.ticket1.priority"),
      priorityColor: "red",
      lastUpdate: t("support.ticketsData.ticket1.lastUpdate"),
    },
    {
      id: 2,
      title: t("support.ticketsData.ticket2.title"),
      ticketNumber: "#2",
      date: "21/11/2023",
      status: t("support.ticketsData.ticket2.status"),
      statusColor: "amber",
      priority: t("support.ticketsData.ticket2.priority"),
      priorityColor: "amber",
      lastUpdate: t("support.ticketsData.ticket2.lastUpdate"),
    },
    {
      id: 3,
      title: t("support.ticketsData.ticket3.title"),
      ticketNumber: "#3",
      date: "20/11/2023",
      status: t("support.ticketsData.ticket3.status"),
      statusColor: "green",
      priority: t("support.ticketsData.ticket3.priority"),
      priorityColor: "green",
      lastUpdate: t("support.ticketsData.ticket3.lastUpdate"),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{t("support.ticketsTab.title")}</h2>
        <p className="text-gray-600 mt-1">{t("support.ticketsTab.subtitle")}</p>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t("support.ticketsTab.searchPlaceholder")}
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
            {t("support.ticketsTab.newTicket")}
          </button>
        </div>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <span className="ml-2">
                      {t("support.ticketsTab.ticketNumber")}: {ticket.ticketNumber}
                    </span>
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
                <div className="text-sm text-gray-600">
                  {t("support.ticketsTab.lastUpdate")}: {ticket.lastUpdate}
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  {t("support.ticketsTab.viewDetails")}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            {t("support.ticketsTab.viewMore")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketsTab;
