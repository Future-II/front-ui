import React from 'react';
import { Plus, Search } from 'lucide-react';
import UsersTable from './UsersTable';
import { useLanguage } from '../../../hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import UserPermissions from './UserPermissions';

interface UsersTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredUsers: any[];
  formatDateTime: (dateString: string) => string;
}

const UsersTab: React.FC<UsersTabProps> = ({ searchTerm, setSearchTerm, filteredUsers, formatDateTime }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const permissionsData = [
    { name: "أحمد الراشد", actions: [t("permissions.manageUsers"), t("permissions.manageReports"), t("permissions.manageSubscription")] },
    { name: "فاطمه الزهراني", actions: [t("permissions.viewReports")] },
    { name: "عبدالله السعد", actions: [t("permissions.manageReports")] },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5`} />
          <input
            type="text"
            placeholder={t("users.searchPlaceholder")}
            className={`w-full md:w-64 ${isRTL ? 'pr-10 pl-4' : 'pl-4 pr-10'} py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
          {t("users.addUser")}
        </button>
      </div>

      <UsersTable users={filteredUsers} formatDateTime={formatDateTime} />
      <UserPermissions permissions={permissionsData} />
    </div>
  );
};

export default UsersTab;
