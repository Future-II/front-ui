import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import TicketsTab from "../components/TicketsTab";

const AllTicketsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.email === "admin.tickets@gmail.com";

  if (!isAdmin) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] bg-white">
        <Header />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h2>
            <p className="text-gray-600">You do not have permission to view all tickets.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-white">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <TicketsTab
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setActiveTab={() => {}}
        />
      </div>
    </div>
  );
};

export default AllTicketsPage;