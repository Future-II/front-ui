import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface User {
  id: number;
  name: string;
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
}

export default function UsersTable({ users, formatDateTime }: UsersTableProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("users.user")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("users.role")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("users.company")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("users.status")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("users.lastActive")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("users.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-normal break-words">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 break-words">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 text-center">
                  {user.role}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 text-center break-words">
                  {user.company}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === t("users.active")
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 text-center">
                  {formatDateTime(user.lastActive)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium flex flex-col items-end gap-2">
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-900">
                    <Pencil size={16} />
                    {t("users.edit")}
                  </button>
                  <button className="flex items-center gap-1 text-red-600 hover:text-red-900">
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
