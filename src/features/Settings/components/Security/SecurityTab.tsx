import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SecurityTab: React.FC = () => {
  const { t } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    // Add your change password logic here
    console.log({ currentPassword, newPassword, confirmPassword });
  };

  const handleEnable2FA = () => {
    // Add your 2FA logic here
    console.log('Enable 2FA clicked');
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900">
        {t('settings.security')}
      </h1>

      {/* Change Password Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          {t('security.password.title')}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('security.password.current')}
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              placeholder={t('security.password.current')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('security.password.new')}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              placeholder={t('security.password.new')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('security.password.confirm')}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              placeholder={t('security.password.confirm')}
            />
          </div>

          <div className="flex justify-start">
            <button
              onClick={handleChangePassword}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
            >
              {t('security.password.button')}
            </button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          {t('security.twoFactor.title')}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {t('security.twoFactor.description')}
        </p>
        <div className="flex justify-start">
          <button
            onClick={handleEnable2FA}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
          >
            {t('security.twoFactor.button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;