import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import ProfileTab from "../components/Profile/ProfileTab";
import NotificationsTab from "../components/Notification/NotificationsTab";
import SecurityTab from "../components/Security/SecurityTab";
import SubscriptionTab from "../components/Subscription/SubscriptionTab";
import UsersTab from "../components/Users/UsersTab";

import { useLanguage } from "../../../hooks/useLanguage";
import { useTranslation } from "react-i18next";

type ActiveTab = "profile" | "notifications" | "security" | "subscription" | "users";

const UserSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");

  const {t} = useTranslation();
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile": return <ProfileTab />;
      case "notifications": return <NotificationsTab />;
      case "security": return <SecurityTab />;
      case "subscription": return <SubscriptionTab />;
      case "users":
        return (
          <UsersTab
            formatDateTime={formatDateTime}
          />
        );
      default: return null;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("settings.title")}</h1>
        <p className="text-gray-600">{t("settings.description")}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default UserSettings;
