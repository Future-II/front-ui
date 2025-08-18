import React from "react";
import { useTranslation } from "react-i18next";

interface EditPackageModalProps {
  open: boolean;
  onClose: () => void;
}

const EditPackageModal: React.FC<EditPackageModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">{t('modals.editPackage')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        {/* Scrollable content */}
        <div className="px-6 py-4 overflow-y-auto flex-1 space-y-4">
          
          {/* Grid inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: t('common.name'), type: 'text', value: t('packages.advanced') },
              { label: t('common.price'), type: 'number', value: '4999' },
              { label: t('packages.users'), type: 'number', value: '10' },
              {
                label: t('packages.period'), type: 'select', value: 'monthly', options: [
                  { value: 'monthly', label: t('packages.monthly') },
                  { value: 'yearly', label: t('packages.yearly') },
                ]
              },
              { label: t('packages.reports'), type: 'number', value: '500' },
              { label: t('packages.storage'), type: 'text', value: '20GB' },
            ].map((input, idx) => (
              <div key={idx} className="flex flex-col">
                <label className="mb-1">{input.label}</label>
                {input.type === 'select' ? (
                  <select defaultValue={input.value} className="border rounded-lg px-3 py-2">
                    {input.options!.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input type={input.type} defaultValue={input.value} className="border rounded-lg px-3 py-2" />
                )}
              </div>
            ))}

            {/* Status select spans full width */}
            <div className="flex flex-col md:col-span-2">
              <label className="mb-1">{t('packages.status')}</label>
              <select defaultValue="active" className="border rounded-lg px-3 py-2">
                <option value="active">{t('packages.active')}</option>
                <option value="inactive">{t('packages.inactive')}</option>
              </select>
            </div>
          </div>

          {/* Features list */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">{t('common.features')}</label>
            <ul className="space-y-2">
              {['feature1', 'feature2', 'feature3', 'feature4', 'feature5'].map((f) => (
                <li key={f} className="p-2 border rounded-lg shadow-sm text-gray-700 text-sm">
                  {t(`packages.${f}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" defaultChecked className="w-4 h-4 border rounded" />
            <label>{t('packages.mostPopular')}</label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200">
            {t('common.cancel')}
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPackageModal;
