import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Importing useTranslation hook

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  defaultCompany?: string;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onClose,
  defaultCompany,
}) => {
  // Using the useTranslation hook to get the 't' function
  // Assuming 'dashboard' is your namespace; adjust if different.
  const { t } = useTranslation();

  const [selectedCompany, setSelectedCompany] = useState(defaultCompany || "");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-bold text-right">{t('modals.addNewUser')}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        {/* Removed 'text-right' from here to allow labels to naturally align to 'start' */}
        <div className="flex flex-col gap-4">
          {/* الشركة */}
          <div>
            {/* Labels are 'block' by default, and will align to the 'start' (right in RTL) */}
            <label className="block mb-1">{t('common.company')}</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">{t('modals.selectCompany')}</option>
              {defaultCompany && (
                <option value={defaultCompany}>
                  {t('dashboard.defaultCompanyName', { defaultValue: defaultCompany })} {/* Use defaultValue option for fallback */}
                </option>
              )}
              <option value="company1">Arabic Company</option>
              <option value="company2">English Company</option>
            </select>
          </div>

          {/* الاسم الكامل */}
          <div>
            <label className="block mb-1">{t('common.fullName')}</label>
            <input
              type="text"
              placeholder={`${t('common.enter')} ${t('common.fullName')}`} 
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="block mb-1">{t('common.email')}</label>
            <input
              type="email"
              placeholder={`${t('common.enter')} ${t('common.email')}`}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* كلمة المرور */}
          <div>
            <label className="block mb-1">{t('common.password')}</label>
            <input
              type="password"
              placeholder={`${t('common.enter')} ${t('common.password')}`}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* الدور */}
          <div>
            <label className="block mb-1">{t('common.role')}</label>
            <select className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300">
              <option value="">{t('common.select')} {t('common.role')}</option>
              <option value="admin">{t('dashboard.modals.admin')}</option>
              <option value="user">{t('dashboard.modals.user')}</option>
            </select>
          </div>

          {/* الصلاحيات */}
          <div>
            <label className="block mb-2">{t('permissions.title')}</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> {t('permissions.viewReports')}
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> {t('permissions.manageReports')}
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> {t('permissions.manageUsers')}
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> {t('permissions.manageSubscription')}
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 border-t pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
          >
            {t('common.cancel')}
          </button>
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            {t('modals.addNewUser')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
