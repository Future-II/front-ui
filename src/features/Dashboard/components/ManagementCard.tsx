import { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ManagementCardProps {
  icon: LucideIcon;
  titleKey: string; // translation key
  iconColor: string;
  iconBgColor: string;
}

export default function ManagementCard({ icon: Icon, titleKey, iconColor, iconBgColor }: ManagementCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{t(titleKey)}</p>
          <h3 className="text-2xl font-semibold text-gray-900 mt-1">2</h3>
        </div>
        <div className={`p-2 rounded-lg ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm text-green-600 font-medium">15%+</span>
        <span className="text-sm text-gray-500 mr-1">{t("dashboard.overview.fromLastMonth")}</span>
      </div>
    </div>
  );
}
