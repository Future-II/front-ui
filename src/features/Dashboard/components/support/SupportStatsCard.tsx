import React from "react";
import { useTranslation } from "react-i18next";

interface SupportStatsCardProps {
  className?: string;
}

const SupportStatsCard: React.FC<SupportStatsCardProps> = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-full flex-1">
      {/* Heading will follow the app's dir */}
      <h2 className="text-lg text-gray-800 mb-4 text-start">
        {t("support.stats.performanceStats")}
      </h2>

      <div className="space-y-2 text-sm text-gray-700">
        {/* Average Response Time */}
        <div className="flex justify-between items-center">
          <div className="text-start">{t("support.stats.avgResponseTime")}</div>
          <div className="text-end">2.1 {t("support.stats.hours")}</div>
        </div>

        {/* Average Resolution Time */}
        <div className="flex justify-between items-center">
          <div className="text-start">{t("support.stats.avgResolutionTime")}</div>
          <div className="text-end">1.5 {t("support.stats.days")}</div>
        </div>

        {/* Satisfaction Rate */}
        <div className="flex justify-between items-center">
          <div className="text-start">{t("support.stats.satisfactionRate")}</div>
          <div className="text-end text-green-500">95%</div>
        </div>

        <div className="h-px bg-gray-200 my-4" />

        {/* Tickets Resolved */}
        <div className="flex justify-between items-center">
          <div className="text-start">{t("support.stats.ticketsResolvedToday")}</div>
          <div className="text-end">3</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-start">{t("support.stats.ticketsResolvedThisWeek")}</div>
          <div className="text-end">12</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-start">{t("support.stats.ticketsResolvedThisMonth")}</div>
          <div className="text-end">45</div>
        </div>

        <div className="h-px bg-gray-200 my-4" />

        {/* Ticket Distribution */}
        <h3 className="text-lg text-gray-800 mb-2 text-start">
          {t("support.stats.ticketDistributionByType")}
        </h3>

        <div className="space-y-1">
          {[
            {
              label: t("support.ticketTypes.technicalIssues"),
              color: "bg-red-500",
              percent: 65,
            },
            {
              label: t("support.ticketTypes.generalInquiries"),
              color: "bg-blue-500",
              percent: 25,
            },
            {
              label: t("support.ticketTypes.upgradeRequests"),
              color: "bg-green-500",
              percent: 15,
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="text-start w-2/3">{item.label}</div>
              <div className="flex items-center w-1/3 ms-2">
                <div className="bg-gray-200 rounded-full h-2 w-full overflow-hidden">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 ms-1">
                  {item.percent}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportStatsCard;
