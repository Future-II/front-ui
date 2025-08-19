import React from "react";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const NoqraReports: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("noqraReports.title")}
        </h1>
        <p className="text-gray-600">{t("noqraReports.subtitle")}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("noqraReports.comingSoonTitle")}
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {t("noqraReports.comingSoonDescription")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoqraReports;
