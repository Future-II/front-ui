import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../hooks/useLanguage";

interface RecentCompaniesTableProps {
  companies: Company[];
}

export default function RecentCompaniesTable({ companies }: RecentCompaniesTableProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className={`text-lg font-medium text-gray-900 mb-4 ${isRTL ? "text-right" : "text-left"}`}>
        {t("dashboard.recentCompanies.title")}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                {t("dashboard.recentCompanies.company")}
              </th>
              <th
                scope="col"
                className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                {t("dashboard.recentCompanies.users")}
              </th>
              <th
                scope="col"
                className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                {t("dashboard.recentCompanies.package")}
              </th>
              <th
                scope="col"
                className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                {t("dashboard.recentCompanies.status")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.slice(0, 5).map((company) => (
              <tr key={company.id} className="hover:bg-gray-50">
                <td className={`py-4 ${isRTL ? "pr-6 pl-0 text-right" : "pl-6 pr-0 text-left"}`}>
                  <div className={`flex items-center ${isRTL ? "text-right" : ""}`}>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {company.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {company.contactEmail}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>
                  {company.users}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>
                  {company.package}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${isRTL ? "text-right" : "text-left"}`}>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${company.status === t("dashboard.status.active")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {company.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`mt-4 flex ${isRTL ? "justify-end" : "justify-start"}`}>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          {t("dashboard.recentCompanies.viewAll")}
        </button>
      </div>
    </div>
  );
}