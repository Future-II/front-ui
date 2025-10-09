import React, { useState, useEffect } from "react";

import TabsNav from "../components/TabsNav";
import { useLanguage } from "../../../hooks/useLanguage";


import OverviewTab from "../components/tabs/OverviewTab";
import CompaniesTab from "../components/tabs/CompaniesTab";
import PackagesTab from "../components/tabs/PackagesTab";
import SupportTab from "../components/tabs/SupportTab";
import { useTranslation } from "react-i18next";
import { getCompanies, getAllUsers, getAllTickets } from "../components/companies/api";
import { Company, User, SupportTicket } from "../types";

const packages = [
  {
    id: 1,
    name: "packages.basic",
    price: 1999,
    period: "packages.monthly",
    features: [
      "packages.features.autoReports",
      "packages.features.manageUsers5",
      "packages.features.storage3Months",
      "packages.features.emailSupport"
    ],
    usersLimit: 5,
    reportsLimit: 100,
    storageLimit: "5GB",
    status: "packages.active"
  },
  {
    id: 2,
    name: "packages.advanced",
    price: 4999,
    period: "packages.monthly",
    features: [
      "packages.features.autoReports",
      "packages.features.manageUsers10",
      "packages.features.storage1Year",
      "packages.features.support24",
      "packages.features.advancedReports"
    ],
    usersLimit: 10,
    reportsLimit: 500,
    storageLimit: "20GB",
    status: "packages.active",
    popularChoice: true
  },
  {
    id: 3,
    name: "packages.professional",
    price: 9999,
    period: "packages.monthly",
    features: [
      "packages.features.autoReports",
      "packages.features.manageUsersUnlimited",
      "packages.features.storage3Years",
      "packages.features.support24",
      "packages.features.advancedReports",
      "packages.features.api",
      "packages.features.fullCustomization"
    ],
    usersLimit: 999,
    reportsLimit: 999,
    storageLimit: "100GB",
    status: "packages.active"
  }
];

const ManagementDashboard: React.FC = () => {
  const {t} = useTranslation();
  const { isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isSuperAdmin = user?.email?.toLowerCase() === "super.admin@gmail.com";

  useEffect(() => {
    if (isSuperAdmin) {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching dashboard data...');

      const [companiesRes, usersRes, ticketsRes] = await Promise.all([
        getCompanies(),
        getAllUsers(),
        getAllTickets()
      ]);

      console.log('API responses:', { companiesRes, usersRes, ticketsRes });

      if (companiesRes.success) {
        // Transform companies data to match interface
        const transformedCompanies: Company[] = (companiesRes.companies || []).map((c: any) => ({
          id: c._id,
          name: c.companyName,
          users: c.users?.length || 0,
          package: c.package || '',
          status: c.isActive ? 'active' : 'inactive',
          logo: c.logo,
          createdAt: c.createdAt,
          contactPerson: c.contactPerson,
          contactEmail: c.contactEmail,
          contactPhone: c.contactPhone,
        }));
        setCompanies(transformedCompanies);
      }
      if (usersRes.success) {
        // Transform users data
        const transformedUsers: User[] = (usersRes.users || []).map((u: any) => ({
          id: u._id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          role: u.role,
          company: u.company?.companyName || '',
          status: u.isActive ? 'active' : 'inactive',
          lastActive: u.updatedAt,
          avatar: u.avatar,
        }));
        setUsers(transformedUsers);
      }
      if (ticketsRes.success) {
        // Transform tickets data
        const transformedTickets: SupportTicket[] = (ticketsRes.tickets || []).map((t: any) => ({
          id: t._id,
          subject: t.subject,
          status: t.status,
          priority: t.classification,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          company: t.createdBy?.company?.companyName || '',
          assignedTo: t.assignedTo,
          messages: t.messages,
          createdBy: t.createdBy ? {
            firstName: t.createdBy.firstName,
            lastName: t.createdBy.lastName,
            email: t.createdBy.email || '',
          } : undefined,
        }));
        setSupportTickets(transformedTickets);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: !isRTL,
    };

    if (isRTL) return date.toLocaleString("ar-SA", options);
    return date.toLocaleString("en-US", options);
  };

  if (!isSuperAdmin) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("access.denied") || "Access Denied"}</h2>
          <p className="text-gray-600">{t("access.denied.message") || "You don't have permission to access this page."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("dashboard.title")}</h1>
        <p className="text-gray-600">{t("dashboard.description")}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <TabsNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-600 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <OverviewTab
                  companies={companies}
                  users={users}
                  supportTickets={supportTickets}
                  formatDateTime={formatDateTime}
                  onViewAllTickets={() => setActiveTab("support")}
                />
              )}
              {activeTab === "companies" && (
                <CompaniesTab companies={companies} users={users} formatDateTime={formatDateTime} onDataChange={fetchData} />
              )}
              {activeTab === "packages" && <PackagesTab packages={packages} />}
              {activeTab === "support" && (
                <SupportTab supportTickets={supportTickets} formatDateTime={formatDateTime} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;
