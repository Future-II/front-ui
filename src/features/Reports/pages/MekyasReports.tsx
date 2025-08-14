import React, { useState } from "react";
import TabButton from "../components/TabButton";
import AutomaticPropertyExtraction from "../sections/AutomaticPropertyExtraction";
import SinglePropertyReport from "../sections/PullPropertyReport";
import ManualPropertyExtraction from "../sections/ManualPropertyExtraction";

type TabKey = "automatic" | "single" | "manual";

const MekyasReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("automatic");

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Real Estate Reports</h1>
        <p className="text-gray-600">Manage the withdrawal and submission of real estate system reports</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <TabButton active={activeTab === "automatic"} onClick={() => setActiveTab("automatic")}>
              Automatic property report extraction
            </TabButton>
            <TabButton active={activeTab === "single"} onClick={() => setActiveTab("single")}>
              Pull one property report
            </TabButton>
            <TabButton active={activeTab === "manual"} onClick={() => setActiveTab("manual")}>
              Manual property report extraction
            </TabButton>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "automatic" && <AutomaticPropertyExtraction />}
          {activeTab === "single" && <SinglePropertyReport />}
          {activeTab === "manual" && <ManualPropertyExtraction />}
        </div>
      </div>
    </div>
  );
};

export default MekyasReports;
