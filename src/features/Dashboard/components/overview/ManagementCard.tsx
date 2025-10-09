import { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ManagementCardProps {
  icon: LucideIcon;
  titleKey: string; // translation key
  value: number | string;
  iconColor: string;
  iconBgColor: string;
  change?: string;
}

export default function ManagementCard({ icon: Icon, titleKey, value, iconColor, iconBgColor, change }: ManagementCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{t(titleKey)}</p>
          <h3 className="text-2xl font-semibold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor} bg-gradient-to-br from-blue-50 to-indigo-100`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      {change && (
        <div className="mt-4">
          <span className="text-sm text-green-600 font-medium">{change}</span>
          <span className="text-sm text-gray-500 mr-1">{t("dashboard.overview.fromLastMonth")}</span>
        </div>
      )}
    </div>
  );
}
