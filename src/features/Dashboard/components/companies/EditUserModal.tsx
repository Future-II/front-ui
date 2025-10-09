import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { User } from "../../types";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onClose,
  user,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    isActive: true,
  });

  // Prefill when editing
  useEffect(() => {
    if (user) {
      const nameParts = user.name.split(' ');
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(' ') || "",
        email: user.email,
        phone: "", // Not in User type, assume empty
        role: user.role,
        isActive: user.status === "active",
      });
    }
  }, [user]);

  if (!open) return null;

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          isActive: formData.isActive,
        }),
      });
      if (response.ok) {
        alert(t("users.updatedSuccessfully"));
        onClose();
        window.location.reload();
      } else {
        alert(t("users.updateFailed"));
      }
    } catch (error) {
      console.error('Update user error:', error);
      alert(t("users.updateFailed"));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-bold text-start">
            {t('users.editUser')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-start">{t('common.firstName')}</label>
            <input
              type="text"
              placeholder={`${t('common.enter')} ${t('common.firstName')}`}
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 text-start">{t('common.lastName')}</label>
            <input
              type="text"
              placeholder={`${t('common.enter')} ${t('common.lastName')}`}
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 text-start">{t('common.email')}</label>
            <input
              type="email"
              placeholder={`${t('common.enter')} ${t('common.email')}`}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 text-start">{t('common.phoneNumber')}</label>
            <input
              type="tel"
              placeholder={`${t('common.enter')} ${t('common.phoneNumber')}`}
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 text-start">{t('common.role')}</label>
            <select
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">{t('common.select')} {t('common.role')}</option>
              <option value="manager">Manager</option>
              <option value="valuater">Valuater</option>
              <option value="data entry">Data Entry</option>
              <option value="inspector">Inspector</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-start">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
              />
              {t('common.active')}
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6 border-t pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
