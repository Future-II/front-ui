import React from "react";
import { Building, Users, Package, Mail } from "lucide-react";
import ManagementCard from "../overview/ManagementCard";
import RecentCompaniesTable from "../overview/RecentCompaniesTable";
import RecentTicketsList from "../overview/RecentTicketList";
import { Company, SupportTicket } from "../../types";

interface OverviewTabProps {
  companies: Company[];
  users: any[];
  supportTickets: SupportTicket[];
  formatDateTime: (date: string) => string;
  onViewAllTickets: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  companies,
  users,
  supportTickets,
  formatDateTime,
  onViewAllTickets,
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ManagementCard
          icon={Building}
          titleKey="dashboard.overview.totalCompanies"
          value={companies.length}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          change="+12%"
        />
        <ManagementCard
          icon={Users}
          titleKey="dashboard.overview.totalUsers"
          value={users.length}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          change="+8%"
        />
        <ManagementCard
          icon={Package}
          titleKey="dashboard.overview.totalSubscriptions"
          value={25}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100"
          change="+15%"
        />
        <ManagementCard
          icon={Mail}
          titleKey="dashboard.overview.pendingTickets"
          value={supportTickets.filter(t => t.status === 'open' || t.status === 'in-progress').length}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
          change="-5%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <RecentCompaniesTable companies={companies} />
        <RecentTicketsList
          supportTickets={supportTickets}
          formatDateTime={formatDateTime}
          onViewAllTickets={onViewAllTickets}
        />
      </div>
    </div>
  );
};

export default OverviewTab;
