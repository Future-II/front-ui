import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { User } from "../../types";
import EditUserModal from "./EditUserModal";

interface IndividualUsersTableProps {
  users: User[];
  formatDateTime: (dateString: string) => string | null;
}

export default function IndividualUsersTable({ users, formatDateTime }: IndividualUsersTableProps) {
  const { t } = useTranslation();
  const [editUserModal, setEditUserModal] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });

  const handleEdit = (user: User) => {
    setEditUserModal({ open: true, user });
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm(t("users.confirmDelete"))) {
      try {
        // Call delete API
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          alert(t("users.deletedSuccessfully"));
          // Refresh data - you might need to pass a callback from parent
          window.location.reload();
        } else {
          alert(t("users.deleteFailed"));
        }
      } catch (error) {
        console.error('Delete user error:', error);
        alert(t("users.deleteFailed"));
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                    user.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status === "active" ? t("common.active") : t("common.inactive")}
                </span>
                <p className="text-xs text-gray-500 mt-1">{formatDateTime(user.lastActive)}</p>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-blue-600 hover:text-blue-900"
                  title={t("common.edit")}
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:text-red-900"
                  title={t("common.delete")}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">{t("users.noUsersFound")}</p>
        )}
      </div>

      {editUserModal.open && editUserModal.user && (
        <EditUserModal
          open={editUserModal.open}
          onClose={() => setEditUserModal({ open: false, user: null })}
          user={editUserModal.user}
        />
      )}
    </>
  );
}
