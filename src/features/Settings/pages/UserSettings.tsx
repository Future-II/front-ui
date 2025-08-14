import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import ProfileTab from "../components/Profile/ProfileTab";
import NotificationsTab from "../components/Notification/NotificationsTab";
import SecurityTab from "../components/Security/SecurityTab";
import SubscriptionTab from "../components/Subscription/SubscriptionTab";
import UsersTab from "../components/Users/UsersTab";

import { useLanguage } from "../../../hooks/useLanguage";
import { users } from "../dummy";

// Update the type to include 'users'
type ActiveTab = "profile" | "notifications" | "security" | "subscription" | "users";

const UserSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
  const [searchTerm, setSearchTerm] = useState('');

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
  
  // Create a filtered list of users based on the search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile": return <ProfileTab />;
      case "notifications": return <NotificationsTab />;
      case "security": return <SecurityTab />;
      case "subscription": return <SubscriptionTab />;
      case "users":
        return (
          <UsersTab
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredUsers={filteredUsers}
            formatDateTime={formatDateTime}
          />
        );
      default: return null;
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
          <div className={`md:w-64 border-b md:border-b-0 ${isRTL ? "md:border-l" : "md:border-r"} border-gray-200`}>
            {/* The Sidebar component will also need to be updated to include 'users' */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="flex-1 p-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
