import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import ProfileTab from "../components/ProfileTab";
import NotificationsTab from "../components/NotificationsTab";
import SecurityTab from "../components/SecurityTab";
import SubscriptionTab from "../components/SubscriptionTab";

const UserSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security" | "subscription">("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile": return <ProfileTab />;
      case "notifications": return <NotificationsTab />;
      case "security": return <SecurityTab />;
      case "subscription": return <SubscriptionTab />;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إعدادات المستخدم</h1>
        <p className="text-gray-600">إدارة ملفك الشخصي وإعدادات الحساب</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-64 border-b md:border-b-0 md:border-l border-gray-200">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="flex-1 p-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
