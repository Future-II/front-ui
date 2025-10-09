import React from "react";
import { User, Bell, Shield, Package, Users } from "lucide-react"; // Import Users icon
import { useTranslation } from "react-i18next";

interface SidebarProps {
  // Update the type to include 'users'
  activeTab: "profile" | "notifications" | "security" | "subscription" | "users";
  setActiveTab: (tab: "profile" | "notifications" | "security" | "subscription" | "users") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isCompanyUser = user?.type === 'company';

  const tabs = [
    { id: "profile", label: t("settings.profile") || "الملف الشخصي", icon: User },
    { id: "notifications", label: t("settings.notifications") || "الإشعارات", icon: Bell },
    { id: "security", label: t("settings.security") || "الأمان", icon: Shield },
    { id: "subscription", label: t("settings.subscription") || "الاشتراك", icon: Package },
    ...(isCompanyUser ? [{ id: "users", label: t("settings.users") || "المستخدمون", icon: Users }] : []), // Only show users tab for company users
  ];

  return (
    <nav className="flex gap-2 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === (tab.id as any);
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "profile" | "notifications" | "security" | "subscription" | "users")}
            className={`group relative inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2 text-sm transition-all ${
              isActive
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow"
                : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${
              isActive ? "bg-white/20" : "bg-blue-100 group-hover:bg-blue-200"
            }`}>
              <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-blue-600"}`} />
            </span>
            <span className="font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Sidebar;
