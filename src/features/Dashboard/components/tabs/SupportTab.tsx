import React, { useState } from "react";
import {
  MessageSquare,
  UserX,
  Check,
} from "lucide-react";
import TicketNotFound from "../support/TicketNotFound";
import SupportOverviewList from "../support/SupportOverviewList";
import SupportTicketsHeader from "../support/SupportTicketsHeader";
import SupportTeamPerformance from "../support/SupportTeamPerformance";
import TicketsTable from "../support/TicketsTable";
import ChatHeader from "../support/ChatHeader";
import TicketsPagination from "../support/TicketsPagination";
import SupportStatsCard from "../support/SupportStatsCard";
import { useTranslation } from "react-i18next";
import ChatList from "../support/ChatList";
import { SupportTicket } from "../../types";

interface SupportTabProps {
  supportTickets: SupportTicket[];
  formatDateTime: (date: string) => string;
}

const SupportTab: React.FC<SupportTabProps> = ({ supportTickets, formatDateTime }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showTicketFilter, setShowTicketFilter] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [viewingTicket, setViewingTicket] = useState<string | null>(null);

  const filteredTickets = supportTickets.filter(
    (ticket) =>
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.createdBy?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.createdBy?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(showModal);

  if (viewingTicket !== null) {
    const ticket = supportTickets.find((t) => t.id === viewingTicket);
    if (!ticket) {
      return <TicketNotFound setViewingTicket={setViewingTicket} />;
    }
    return (
      <div className="flex flex-col w-full h-full">
        <ChatHeader ticket={ticket} onBack={() => setViewingTicket(null)} />
        <ChatList ticketId={ticket.id} assignedTo="admin.tickets@gmail.com" />
      </div>);
  }

  const supportOverviewData = [
    {
      title: t("dashboard.stats.pendingTickets"),
      count: supportTickets.length,
      type: "total",
      icon: <MessageSquare size={20} />,
    },
    {
      title: t("support.ticketStatus.highPriority"),
      count: supportTickets.filter((t) => t.priority === "high").length,
      type: "high",
      icon: <div className="w-3 h-3 rounded-full bg-red-500" />,
    },
    {
      title: t("support.ticketStatus.pending"),
      count: supportTickets.filter((t) => t.status === "open").length,
      type: "pending",
      icon: <Check size={18} />,
    },
    {
      title: t("support.ticketStatus.inProgress"),
      count: supportTickets.filter((t) => t.status === "in-progress").length,
      type: "inProgress",
      icon: <div className="w-3 h-3 rounded-full bg-amber-500" />,
    },
    {
      title: t("support.ticketStatus.open"),
      count: supportTickets.filter((t) => t.status === "open").length,
      type: "open",
      icon: <div className="w-3 h-3 rounded-full bg-blue-500" />,
    },
    {
      title: t("support.ticketStatus.unassigned"),
      count: supportTickets.filter((t) => !t.assignedTo).length,
      type: "unassigned",
      icon: <UserX size={20} />,
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-6">
        <SupportOverviewList cards={supportOverviewData} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <SupportTicketsHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showTicketFilter={showTicketFilter}
          setShowTicketFilter={setShowTicketFilter}
          setShowModal={setShowModal}
        />

        <div className="w-full overflow-x-auto">
          <TicketsTable
            filteredTickets={filteredTickets}
            setViewingTicket={setViewingTicket}
            setShowModal={setShowModal}
            formatDateTime={formatDateTime}
          />
        </div>

        <TicketsPagination
          filteredTicketsCount={filteredTickets.length}
          totalTicketsCount={supportTickets.length}
        />
      </div>

      <div className="w-full flex gap-4">
        <SupportTeamPerformance
          title="أداء فريق الدعم"
          members={[
            {
              name: "Admin",
              role: "مدير النظام",
              avatarLetter: "A",
              tickets: supportTickets.length,
              avgResponseHours: 1.0,
              avatarColor: "bg-blue-500",
            },
          ]}
          className="flex-1 w-full"
        />

        <SupportStatsCard />
      </div>
    </div>
  );
};

export default SupportTab;
