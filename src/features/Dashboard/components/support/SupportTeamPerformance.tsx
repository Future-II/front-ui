import React from "react";
import { useTranslation } from "react-i18next";

interface SupportMemberPerformanceProps {
  name: string;
  role: string;
  avatarLetter: string;
  tickets: number;
  avgResponseHours: number;
  avatarColor?: string;
}

const SupportMemberPerformance: React.FC<SupportMemberPerformanceProps> = ({
  name,
  role,
  avatarLetter,
  tickets,
  avgResponseHours,
  avatarColor = "bg-gray-200",
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-2">
      <div className="flex items-center space-x-3 space-x-reverse">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${avatarColor} text-white font-medium`}
        >
          {avatarLetter}
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-gray-400">{role}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium">
          {tickets} {t("support.teamPerformance.ticketLabel")}
        </div>
        <div className="text-xs text-gray-400">
          {t("support.teamPerformance.avgResponse")} {avgResponseHours} {t("support.teamPerformance.hoursLabel")}
        </div>
      </div>
    </div>
  );
};

interface SupportTeamPerformanceProps {
  title: string;
  members: SupportMemberPerformanceProps[];
  className?: string;
}

const SupportTeamPerformance: React.FC<SupportTeamPerformanceProps> = ({
  title,
  members,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-full ${className}`}
    >
      <h2 className="text-start text-lg font-medium mb-4">{t('support.teamPerformance.title')}</h2>
      {members.map((member, index) => (
        <SupportMemberPerformance key={index} {...member} />
      ))}
    </div>
  );
};

export default SupportTeamPerformance;
