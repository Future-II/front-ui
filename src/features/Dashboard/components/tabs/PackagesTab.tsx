import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import PackageCard from "../packages/PackageCard";
import AddPackageModal from "../packages/AddPackageModal";

interface PackagesTabProps {
  packages: PackageType[];
}

const PackagesTab: React.FC<PackagesTabProps> = ({ packages }) => {
  const { t } = useTranslation();
  const [openAddPackageModal, setOpenAddPackageModal] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          {t("packages.availablePackages")}
        </h3>
        <button onClick={() => setOpenAddPackageModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 ml-2" />
          {t("packages.addPackage")}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
      <AddPackageModal open={openAddPackageModal} onClose={() => setOpenAddPackageModal(false)} />
    </div>
  );
};

export default PackagesTab;
