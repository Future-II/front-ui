import React from "react";
import { useTranslation } from "react-i18next";

const ManualPropertyExtraction: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        {t("mekyas.manual.title") || "Manual Property Extraction"}
      </h2>
      <p className="text-gray-600">
        {t("mekyas.manual.description") ||
          "Here you can manually extract property reports."}
      </p>

      {/* ✅ Add your manual property extraction UI logic here */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <p className="text-gray-700">Manual extraction form goes here.</p>
      </div>
    </div>
  );
};

export default ManualPropertyExtraction;
