import React from "react";

interface SupportOverviewCardProps {
  title: string;
  icon?: React.ReactNode; // Optional custom icon
  count: number;
  type: string; // Keep as plain string to avoid TS fuss
}

const SupportOverviewCard: React.FC<SupportOverviewCardProps> = ({
  title,
  icon,
  count,
  type,
}) => {
  const colorMap: Record<string, { text: string; bg: string; dot: string }> = {
    total: { text: "text-blue-500", bg: "bg-blue-100", dot: "bg-blue-500" },
    high: { text: "text-red-500", bg: "bg-red-100", dot: "bg-red-500" },
    pending: { text: "text-green-500", bg: "bg-green-100", dot: "bg-green-500" },
    inProgress: { text: "text-amber-500", bg: "bg-amber-100", dot: "bg-amber-500" },
    open: { text: "text-blue-500", bg: "bg-blue-100", dot: "bg-blue-500" },
    unassigned: { text: "text-gray-500", bg: "bg-gray-100", dot: "bg-gray-500" },
  };

  const color = colorMap[type] || colorMap.total;

  const renderedIcon = icon ?? (
    <div className={`w-3 h-3 rounded-full ${color.dot}`} />
  );

  return (
    <div className="flex items-center p-4 rounded-lg shadow-sm bg-white border border-gray-200 flex-grow">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full ${color.bg} ${color.text}`}
      >
        {renderedIcon}
      </div>

      <div className="flex flex-col mx-4">
        <span className="text-sm font-medium text-gray-500 mb-1">{title}</span>
        <span
          className={`text-xl font-bold ${
            type === "total" ? "text-gray-900" : color.text
          }`}
        >
          {count}
        </span>
      </div>
    </div>
  );
};

export default SupportOverviewCard;
