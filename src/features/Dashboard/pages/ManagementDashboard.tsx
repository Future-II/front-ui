import React, { useState } from 'react';
import { Plus, Search, Mail, Users, Package, Building } from 'lucide-react';
import { useTranslation } from "react-i18next";

import ManagementCard from '../components/ManagementCard';
import PackageCard from '../components/PackageCard';

import RecentCompaniesTable from '../components/RecentCompaniesTable';
import RecentTicketsList from '../components/RecentTicketList';

import CompaniesTable from '../components/CompaniesTable';
import TicketNotFound from '../components/TicketNotFound';

import TicketTable from '../components/TicketTable';
import TicketListHeader from '../components/TicketListHeader';
import ContactOptions from '../components/ContactOptions';
import SupportTicketsHeader from '../components/SupportTicketsHeader';
import SupportContactMethods from '../components/SupportContactMethod';
import TicketsTable from '../components/TicketsTable';
import TicketsPagination from '../components/TicketsPagination';

import { useLanguage } from '../../../hooks/useLanguage';

import TabsNav from '../components/TabsNav';

import { companies, packages, supportTickets } from '../dummy';

const ManagementDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTicketFilter, setShowTicketFilter] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [viewingTicket, setViewingTicket] = useState<number | null>(null);

  console.log("showModal", showModal);

  const { isRTL } = useLanguage();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: !isRTL
    };

    if (isRTL) return date.toLocaleString("ar-SA", options);
    return date.toLocaleString("en-US", options);
  };


  const filteredTickets = supportTickets.filter(ticket => ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) || ticket.company.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredCompanies = companies.filter(company => company.name.toLowerCase().includes(searchTerm.toLowerCase()) || company.package.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderOverviewTab = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ManagementCard icon={Building} titleKey="dashboard.overview.totalCompanies" iconColor="text-blue-600" iconBgColor="bg-blue-100" />
          <ManagementCard icon={Users} titleKey="dashboard.overview.totalUsers" iconColor="text-green-600" iconBgColor="bg-green-100" />
          <ManagementCard icon={Package} titleKey="dashboard.overview.totalSubscriptions" iconColor="text-amber-600" iconBgColor="bg-amber-100" />
          <ManagementCard icon={Mail} titleKey="dashboard.overview.pendingTickets" iconColor="text-red-600" iconBgColor="bg-red-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <RecentCompaniesTable companies={companies} />
          <RecentTicketsList
            supportTickets={supportTickets}
            formatDateTime={formatDateTime}
            onViewAllTickets={() => setActiveTab('support')}
          />
        </div>
      </div>
    );
  };

  const renderCompaniesTab = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="البحث في الشركات..."
              className="w-full md:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 ml-2" />
            إضافة شركة
          </button>
        </div>
        <CompaniesTable companies={filteredCompanies} formatDateTime={formatDateTime} />
      </div>
    );
  };

  const renderPackagesTab = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {t("packages.availablePackages")}
          </h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 ml-2" />
            {t("packages.addPackage")}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    );
  };


  const renderSupportTab = () => {
    if (viewingTicket !== null) {
      const ticket = supportTickets.find(t => t.id === viewingTicket);
      if (!ticket) {
        return <TicketNotFound setViewingTicket={setViewingTicket} />;
      }
      return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <TicketListHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showTicketFilter={showTicketFilter}
              setShowTicketFilter={setShowTicketFilter}
              setShowModal={setShowModal}
            />

            <div className="overflow-x-auto w-full max-w-full">
              <TicketTable
                filteredTickets={filteredTickets}
                setViewingTicket={setViewingTicket}
                setShowModal={setShowModal}
              />
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  عرض {filteredTickets.length} من أصل {supportTickets.length} تذكرة
                </div>
                <div className="flex items-center space-x-2 space-x-reverse"></div>
              </div>
            </div>
          </div>

          <ContactOptions />
        </div>


      );
    }
    return (
      <div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">

          <SupportTicketsHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showTicketFilter={showTicketFilter}
            setShowTicketFilter={setShowTicketFilter}
            setShowModal={setShowModal}
          />

          <div className="overflow-x-auto">
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

        <SupportContactMethods />
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">لوحة الإدارة</h1>
        <p className="text-gray-600">إدارة النظام والمستخدمين والتقارير</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <TabsNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="p-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'companies' && renderCompaniesTab()}
          {activeTab === 'packages' && renderPackagesTab()}
          {activeTab === 'support' && renderSupportTab()}
        </div>

      </div>
    </div>
  )
};

export default ManagementDashboard;