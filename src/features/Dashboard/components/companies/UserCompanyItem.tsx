import { Edit, Trash2, ChevronDown, ChevronUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

import EditCompanyModal from "./EditCompanyModal";
import EditUserModal from "./EditUserModal";
import { Company, User } from "../../types";

interface UserCompanyItemProps {
  company: Company;
  formatDateTime: (dateString: string) => string | null;
}

export default function UserCompanyItem({ company, formatDateTime }: UserCompanyItemProps) {
  const { t } = useTranslation();
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [companyUsers, setCompanyUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [editUserModal, setEditUserModal] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });

  const statusValue = company.users > 0 ? "active" : "inactive";

  const fetchCompanyUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(`/api/companies/${company.id}/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const formattedUsers: User[] = data.users.map((u: any) => ({
          id: String(u.id),
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          role: u.role,
          company: u.company ? u.company.companyName : '',
          status: u.status,
          lastActive: u.lastActive,
        }));
        setCompanyUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Fetch company users error:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchCompanyUsers();
  }, []);

  const handleEditUser = (user: User) => {
    setEditUserModal({ open: true, user });
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm(t("users.confirmDelete"))) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          alert(t("users.deletedSuccessfully"));
          // Refresh users
          setCompanyUsers(companyUsers.filter(u => u.id !== userId));
        } else {
          alert(t("users.deleteFailed"));
        }
      } catch (error) {
        console.error('Delete user error:', error);
        alert(t("users.deleteFailed"));
      }
    }
  };

  const handleDeleteCompany = async () => {
    if (window.confirm(t("companies.confirmDelete"))) {
      try {
        const response = await fetch(`/api/companies/${company.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          alert(t("companies.deletedSuccessfully"));
          window.location.reload();
        } else {
          alert(t("companies.deleteFailed"));
        }
      } catch (error) {
        console.error('Delete company error:', error);
        alert(t("companies.deleteFailed"));
      }
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex flex-col min-w-[200px] mb-4 md:mb-0">
            <span className="text-lg font-semibold text-gray-900">
              {company.name}
            </span>

            <div className="flex flex-wrap gap-6 mt-3 items-center text-sm text-gray-700">
              <span className="text-blue-600 font-medium">{company.package}</span>
              <span>
                {company.users} {t("dashboard.recentCompanies.users")}
              </span>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
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

          <div className="flex items-center gap-4 text-sm justify-end min-w-[160px]">
            <button
              onClick={() => setOpenEditModal(true)}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
              title={t("dashboard.recentCompanies.editCompany")}
            >
              <Edit size={16} />
              {t("dashboard.recentCompanies.editCompany")}
            </button>
            <button
              onClick={() => {
                setShowUsers(!showUsers);
                if (!showUsers && companyUsers.length === 0) {
                  fetchCompanyUsers();
                }
              }}
              className="text-green-600 hover:text-green-800 font-semibold flex items-center gap-2"
              title={showUsers ? t("common.hide") : t("common.show")}
            >
              <Users size={16} />
              {showUsers ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {t("users.companyUsers")}
            </button>
          </div>
        </div>
      </div>

      {/* Users List - Collapsible with Animation */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showUsers ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-gray-50 rounded-2xl p-6 shadow-inner border border-gray-200">
          {loadingUsers ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600"></div>
            </div>
          ) : companyUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companyUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <span className="font-semibold text-gray-900">{user.name}</span>
                    <span className="text-sm text-gray-500 ml-3">({user.email})</span>
                    <span className="text-xs text-gray-400 ml-3">{user.role}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900"
                      title={t("common.edit")}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                      title={t("common.delete")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">{t("users.noUsersInCompany")}</p>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditCompanyModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        defaultCompany={{
          name: company.name,
          email: "",
          phone: "",
          manager: "",
          package: company.package ?? "",
        }}
      />
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
