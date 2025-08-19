import React, { useState } from "react";
import TabButton from "../components/TabButton";
import AutomaticPropertyExtraction from "../sections/AutomaticPropertyExtraction";
import SinglePropertyReport from "../sections/PullPropertyReport";
import { useTranslation } from "react-i18next";

type TabKey = "automatic" | "single";

const MekyasReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("automatic");
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("mekyas.title")}</h1>
        <p className="text-gray-600">{t("mekyas.subtitle")}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <TabButton
              active={activeTab === "automatic"}
              onClick={() => setActiveTab("automatic")}
            >
              {t("mekyas.automatic")}
            </TabButton>
            <TabButton
              active={activeTab === "single"}
              onClick={() => setActiveTab("single")}
            >
              {t("mekyas.single")}
            </TabButton>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "automatic" && <AutomaticPropertyExtraction />}
          {activeTab === "single" && <SinglePropertyReport />}
        </div>
      </div>
    </div>
  );
};

export default MekyasReports;
