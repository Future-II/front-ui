import React, { useState, useEffect } from 'react';
import { Plus, Search, Shield, Trash2 } from 'lucide-react';
import UsersTable from './UsersTable';
import CompanyInfoSection from './CompanyInfoSection';
import { useLanguage } from '../../../../hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import { getUsersByCompany, addUserToCompany, updateUser, deleteUser } from '../../../Dashboard/components/companies/api';

interface UsersTabProps {
  formatDateTime: (dateString: string) => string;
}

const UsersTab: React.FC<UsersTabProps> = ({ formatDateTime }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [companyUsers, setCompanyUsers] = useState<any[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [addUserForm, setAddUserForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  });
  const [editUserForm, setEditUserForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    if (user.company) {
      fetchCompanyUsers(user.company);
    }
  }, []);

  const fetchCompanyUsers = async (companyId: string) => {
    try {
      const response = await getUsersByCompany(companyId);
      if (response.success) {
        setCompanyUsers(response.users);
      }
    } catch (error) {
      console.error('Failed to fetch company users:', error);
    }
  };

  const filteredUsers = companyUsers.filter(user =>
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    if (!currentUser?.company) return;

    if (!addUserForm.firstName.trim() || !addUserForm.lastName.trim() || !addUserForm.email.trim() || !addUserForm.password.trim() || !addUserForm.role) {
      alert(t('common.fillAllFields') || 'Please fill all required fields');
      return;
    }

    try {
      const userData = {
        firstName: addUserForm.firstName,
        lastName: addUserForm.lastName,
        email: addUserForm.email,
        password: addUserForm.password,
        role: addUserForm.role,
        type: 'individual',
        phone: '', // Add phone if needed
        termsAccepted: true
      };

      const response = await addUserToCompany(currentUser.company, userData);
      if (response.success) {
        setShowAddUserModal(false);
        setAddUserForm({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          role: ''
        });
        fetchCompanyUsers(currentUser.company);
        alert(t('modals.userAddedSuccessfully') || 'User added successfully');
      } else {
        alert(response.message || 'Failed to add user');
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      alert('An error occurred while adding the user');
    }
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditUserForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      role: user.role || ''
    });
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const userData = {
        firstName: editUserForm.firstName,
        lastName: editUserForm.lastName,
        email: editUserForm.email,
        role: editUserForm.role
      };

      const response = await updateUser(selectedUser.id, userData);
      if (response.success) {
        setShowEditUserModal(false);
        setSelectedUser(null);
        fetchCompanyUsers(currentUser.company);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = (userId: string) => {
    const user = companyUsers.find(u => u.id === userId);
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await deleteUser(selectedUser.id);
      if (response.success) {
        setShowDeleteConfirm(false);
        setSelectedUser(null);
        fetchCompanyUsers(currentUser.company);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentUser.role !== 'manager') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t('common.accessDenied') || 'Access Denied'}
          </h2>
          <p className="text-gray-600">
            Only managers can access this section.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Information Section */}
      {currentUser.company && (
        <CompanyInfoSection companyId={currentUser.company} currentUser={currentUser} />
      )}

      {/* Users Management Section */}
      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-lg border border-indigo-100 p-8 hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Shield className="h-7 w-7 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t('users.user') || 'Users Management'}
            </h2>
          </div>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">{t("users.addUser")}</span>
          </button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <Search className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5`} />
            <input
              type="text"
              placeholder={t("users.searchPlaceholder")}
              className={`w-full md:w-80 ${isRTL ? 'pr-12 pl-4' : 'pl-4 pr-12'} py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <UsersTable
          users={filteredUsers}
          formatDateTime={formatDateTime}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-bold">{t('modals.addNewUser')}</h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-1">{t('common.fullName')}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('register.personal.ist')}
                    value={addUserForm.firstName}
                    onChange={(e) => setAddUserForm({ ...addUserForm, firstName: e.target.value })}
                    className="flex-1 border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <input
                    type="text"
                    placeholder={t('register.personal.last')}
                    value={addUserForm.lastName}
                    onChange={(e) => setAddUserForm({ ...addUserForm, lastName: e.target.value })}
                    className="flex-1 border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">{t('common.email')}</label>
                <input
                  type="email"
                  value={addUserForm.email}
                  onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                  placeholder={`${t('common.enter')} ${t('common.email')}`}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block mb-1">{t('common.password')}</label>
                <input
                  type="password"
                  value={addUserForm.password}
                  onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })}
                  placeholder={`${t('common.enter')} ${t('common.password')}`}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block mb-1">{t('common.role')}</label>
                <select
                  value={addUserForm.role}
                  onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value })}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
                >
                  <option value="">{t('common.select')} {t('common.role')}</option>
                  <option value="manager">Manager</option>
                  <option value="valuater">Valuater</option>
                  <option value="data entry">Data Entry</option>
                  <option value="inspector">Inspector</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 border-t pt-4">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                {t('modals.addNewUser')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-bold">{t('modals.editUser')}</h2>
              <button
                onClick={() => setShowEditUserModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-1">{t('common.fullName')}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('register.personal.ist')}
                    value={editUserForm.firstName}
                    onChange={(e) => setEditUserForm({ ...editUserForm, firstName: e.target.value })}
                    className="flex-1 border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <input
                    type="text"
                    placeholder={t('register.personal.last')}
                    value={editUserForm.lastName}
                    onChange={(e) => setEditUserForm({ ...editUserForm, lastName: e.target.value })}
                    className="flex-1 border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">{t('common.email')}</label>
                <input
                  type="email"
                  value={editUserForm.email}
                  onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                  placeholder={`${t('common.enter')} ${t('common.email')}`}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block mb-1">{t('common.role')}</label>
                <select
                  value={editUserForm.role}
                  onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
                >
                  <option value="">{t('common.select')} {t('common.role')}</option>
                  <option value="manager">Manager</option>
                  <option value="valuater">Valuater</option>
                  <option value="data entry">Data Entry</option>
                  <option value="inspector">Inspector</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 border-t pt-4">
              <button
                onClick={() => setShowEditUserModal(false)}
                className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('modals.confirmDelete')}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {t('modals.deleteUserConfirm', { name: selectedUser?.firstName + ' ' + selectedUser?.lastName })}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  {t('common.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;
