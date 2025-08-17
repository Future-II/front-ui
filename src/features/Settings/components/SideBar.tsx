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

  const tabs = [
    { id: "profile", label: t("settings.profile") || "الملف الشخصي", icon: User },
    { id: "notifications", label: t("settings.notifications") || "الإشعارات", icon: Bell },
    { id: "security", label: t("settings.security") || "الأمان", icon: Shield },
    { id: "subscription", label: t("settings.subscription") || "الاشتراك", icon: Package },
    { id: "users", label: t("settings.users") || "المستخدمون", icon: Users }, // Added Users tab
  ];

  return (
    <nav className="p-4 space-y-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-2 w-full text-right rounded-lg ${
              activeTab === tab.id ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
            }`}

            onClick={() => setActiveTab(tab.id as "profile" | "notifications" | "security" | "subscription" | "users")}
          >
            <Icon className="h-5 w-5 mx-2" /> 
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};

export default Sidebar;
