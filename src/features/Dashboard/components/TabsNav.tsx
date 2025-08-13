import React from "react";
import { useTranslation } from "react-i18next";

interface TabsNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsNav: React.FC<TabsNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: "overview", label: t("dashboard.overview.title") },
    { id: "companies", label: t("dashboard.recentCompanies.title") },
    { id: "packages", label: t("dashboard.packages.title") },
    { id: "support", label: t("dashboard.support.title") },
  ];

  return (
    <nav className="flex -mb-px overflow-x-auto">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          className={`py-4 px-6 text-center border-b-2 text-sm font-medium whitespace-nowrap ${activeTab === id
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          onClick={() => setActiveTab(id)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
};

export default TabsNav;
