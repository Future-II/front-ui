import { LucideIcon } from "lucide-react";

interface ManagementCardProps {
  icon: LucideIcon;
  title: string;
  iconColor: string;
  iconBgColor: string;
}

export default function ManagementCard({ icon: Icon, title, iconColor, iconBgColor }: ManagementCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-900 mt-1">
            2
          </h3>
        </div>
        <div className={`p-2 rounded-lg ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm text-green-600 font-medium">15%+</span>
        <span className="text-sm text-gray-500 mr-1">
          من الشهر الماضي
        </span>
      </div>
    </div>
  );
}