import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface User {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  company: string;
  status: string;
  lastActive: string;
  avatar?: string;
}

interface UsersTableProps {
  users: User[];
  formatDateTime: (dateString: string) => string;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export default function UsersTable({ users, formatDateTime, onEditUser, onDeleteUser }: UsersTableProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-full max-w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-gray-100">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                {t("users.user")}
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                {t("users.role")}
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                {t("users.company")}
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                {t("users.status")}
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                {t("users.lastActive")}
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                {t("users.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-200">
                <td className="px-6 py-5 whitespace-normal break-words">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {(user.firstName || user.name || 'U')[0].toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name}
                      </div>
                      <div className="text-sm text-gray-500 break-words">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-gray-600 text-center">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-gray-600 text-center break-words">
                  {user.company}
                </td>
                <td className="px-6 py-5 text-center">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      user.status === t("users.active")
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-gray-600 text-center">
                  {formatDateTime(user.lastActive)}
                </td>
                <td className="px-6 py-5 text-right text-sm font-medium flex flex-col items-end gap-3">
                  <button
                    onClick={() => onEditUser(user)}
                    className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    <Pencil size={16} />
                    {t("users.edit")}
                  </button>
                  <button
                    onClick={() => onDeleteUser(user.id)}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    <Trash2 size={16} />
                    {t("users.delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
