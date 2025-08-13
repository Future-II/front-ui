import React from "react";

type TabId = "contact" | "tickets" | "faq";

interface TabsProps {
  tabs: { id: TabId; label: string }[];
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
    <div className="border-b border-gray-200">
      <nav className="flex gap-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-1 ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } font-medium text-sm`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  </div>
);



export default Tabs;
