import React, { useState } from "react";

import TabsNav from "../components/TabsNav";
import { useLanguage } from "../../../hooks/useLanguage";
import { companies, packages, supportTickets } from "../dummy";

import OverviewTab from "../components/tabs/OverviewTab";
import CompaniesTab from "../components/tabs/CompaniesTab";
import PackagesTab from "../components/tabs/PackagesTab";
import SupportTab from "../components/tabs/SupportTab";
import { useTranslation } from "react-i18next";

const ManagementDashboard: React.FC = () => {
  const {t} = useTranslation();
  const { isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState<string>("overview");

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
          {activeTab === "overview" && (
            <OverviewTab
              companies={companies}
              supportTickets={supportTickets}
              formatDateTime={formatDateTime}
              onViewAllTickets={() => setActiveTab("support")}
            />
          )}
          {activeTab === "companies" && (
            <CompaniesTab companies={companies} formatDateTime={formatDateTime} />
          )}
          {activeTab === "packages" && <PackagesTab packages={packages} />}
          {activeTab === "support" && (
            <SupportTab supportTickets={supportTickets} formatDateTime={formatDateTime} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;
