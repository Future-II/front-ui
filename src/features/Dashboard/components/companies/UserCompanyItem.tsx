import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UserCompanyItemProps {
  company: Company;
  formatDateTime: (dateString: string) => string | null;
}

export default function UserCompanyItem({ company }: UserCompanyItemProps) {
  const { t } = useTranslation();

  // Map company.status to internal language-independent values
  const statusValue = company.status.toLowerCase().includes("نشط") || company.status.toLowerCase() === "active"
    ? "active"
    : "inactive";

  return (
    <div className="flex flex-wrap md:flex-nowrap items-center justify-between bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm hover:shadow transition-shadow">
      
      <div className="flex flex-col min-w-[200px] mb-2 md:mb-0">
        <span className="text-base font-semibold text-gray-900">
          {company.name}
        </span>

        <div className="flex flex-wrap gap-4 mt-2 items-center text-sm text-gray-700">
          <span className="text-gray-500">{company.contactEmail}</span>
          <span>
            {company.users} {t("dashboard.recentCompanies.users")}
          </span>
          <span>{company.package}</span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              statusValue === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {statusValue === "active"
              ? t("dashboard.status.active")
              : t("dashboard.status.inactive")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm justify-end min-w-[160px]">
        <span className="text-green-600 hover:text-green-800 cursor-pointer">
          {t("users.addUser")}
        </span>
        <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
          {t("dashboard.recentCompanies.addCompany")}
        </span>
        <ChevronDown size={16} className="text-gray-500 cursor-pointer" />
      </div>
    </div>
  );
}
