import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import EditPackageModal from "./EditPackageModal.tsx";

interface PackageCardProps {
  pkg: PackageType;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);

  return (
    <div
      key={pkg.id}
      className={`bg-white rounded-lg shadow-sm border ${
        pkg.popularChoice ? "border-blue-500" : "border-gray-200"
      } overflow-hidden relative`}
    >
      {pkg.popularChoice && (
        <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 text-xs font-medium">
          {t("packages.popularChoice")}
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t(pkg.name)}
        </h3>

        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
          <span className="text-gray-500 mr-1">
            {t("packages.currency")} / {t(pkg.period)}
          </span>
        </div>

        <ul className="space-y-3 mb-6">
          {pkg.features.map((featureKey, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-5 w-5 text-green-500 ml-2" />
              <span className="text-gray-600">{t(featureKey)}</span>
            </li>
          ))}
        </ul>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">{t("packages.users")}:</span>
            <span className="font-medium text-gray-900">
              {pkg.usersLimit === 999
                ? t("packages.unlimited")
                : pkg.usersLimit}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">{t("packages.reportsMonthly")}:</span>
            <span className="font-medium text-gray-900">
              {pkg.reportsLimit === 999 ? t("packages.unlimited") : pkg.reportsLimit}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t("packages.storage")}:</span>
            <span className="font-medium text-gray-900">{pkg.storageLimit}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setOpenModal(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t("packages.edit")}
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              {t("packages.delete")}
            </button>
          </div>
          <div className="flex items-center">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                t(pkg.status) === t("packages.active")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {t(pkg.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <EditPackageModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
