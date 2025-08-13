import React from "react";
import { useTranslation } from "react-i18next";

interface Permission {
  name: string;
  actions: string[];
}

interface UserPermissionsProps {
  permissions: Permission[];
}

const UserPermissions: React.FC<UserPermissionsProps> = ({ permissions }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3 mt-4">
      {permissions.map((perm, index) => (
        <div key={index} className="bg-gray-50 p-3 rounded-lg">
          <div className="mb-2 font-medium text-gray-800 text-sm">
            {t("permissions.ofUser", { name: perm.name })}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {perm.actions.map((action, i) => (
              <button
                key={i}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserPermissions;
