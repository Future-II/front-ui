import React from "react";
import { User, Bell, Shield, Package } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: "profile" | "notifications" | "security" | "subscription") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "profile", label: "الملف الشخصي", icon: User },
    { id: "notifications", label: "الإشعارات", icon: Bell },
    { id: "security", label: "الأمان", icon: Shield },
    { id: "subscription", label: "الاشتراك", icon: Package },
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
            onClick={() => setActiveTab(tab.id as any)}
          >
            <Icon className="h-5 w-5 ml-2" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};

export default Sidebar;
