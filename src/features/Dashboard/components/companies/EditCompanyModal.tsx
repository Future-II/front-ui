import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // Importing useTranslation hook

interface EditCompanyModalProps {
  open: boolean;
  onClose: () => void;
  defaultCompany?: {
    name: string;
    email: string;
    phone: string;
    manager: string;
    package: string;
  };
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
  open,
  onClose,
  defaultCompany,
}) => {
  const { t } = useTranslation(); // Assuming your i18next setup handles multiple namespaces

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    manager: "",
    package: "",
  });

  // Prefill when editing
  useEffect(() => {
    if (defaultCompany) {
      setFormData(defaultCompany);
    }
  }, [defaultCompany]);

  if (!open) return null;

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    console.log("Company saved:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6"> 
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-bold text-start"> 
            {defaultCompany ? t('modals.editCompany') : t('modals.addNewCompany')}
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
            <label className="block mb-1 text-start">{t('common.name')}</label> {/* Added 'text-start' for explicit alignment */}
            <input
              type="text"
              placeholder={`${t('common.enter')} ${t('common.name')}`}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 text-start">{t('common.contact')} {t('common.email')}</label> {/* Added 'text-start' */}
            <input
              type="email"
              placeholder={`${t('common.enter')} ${t('common.email')}`}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 text-start">{t('common.phoneNumber')}</label> {/* Added 'text-start' */}
            <input
              type="tel"
              placeholder={`${t('common.enter')} ${t('common.phoneNumber')}`}
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 text-start">{t('packages.package')}</label> {/* Added 'text-start' */}
            <select
              value={formData.package}
              onChange={(e) => handleChange("package", e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">{t('packages.selectPackage')}</option>
              <option value="basic">{t('packages.basic')}</option>
              <option value="standard">{t('packages.advanced')}</option>
              <option value="premium">{t('packages.professional')}</option>
            </select>
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
            {defaultCompany ? t('common.save') : t('modals.addNewCompany')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyModal;
