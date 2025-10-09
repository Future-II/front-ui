import React, { useState, useEffect } from 'react';
import { Edit, Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../../hooks/useLanguage';
import { getCompanyById, updateCompany } from '../../../Dashboard/components/companies/api';

interface CompanyInfoSectionProps {
  companyId: string;
  currentUser: any;
}

const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({ companyId, currentUser }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: '',
    licenseNumber: '',
    city: ''
  });

  useEffect(() => {
    fetchCompany();
  }, [companyId]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const response = await getCompanyById(companyId);
      if (response.success) {
        setCompany(response.company);
        setFormData({
          companyName: response.company.companyName,
          companyType: response.company.companyType,
          licenseNumber: response.company.licenseNumber,
          city: response.company.city
        });
      }
    } catch (error) {
      console.error('Failed to fetch company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await updateCompany(companyId, formData);
      if (response.success) {
        setCompany({ ...company, ...formData });
        setEditing(false);
      }
    } catch (error) {
      console.error('Failed to update company:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      companyName: company.companyName,
      companyType: company.companyType,
      licenseNumber: company.licenseNumber,
      city: company.city
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">{t('common.noData')}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-full">
            <Building className="h-7 w-7 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('dashboard.companiesUser.title') || 'Company Information'}
          </h2>
        </div>
        {!editing && currentUser && company && currentUser.role === 'manager' && (
          <button
            onClick={handleEdit}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Edit className="h-5 w-5" />
            <span className="font-medium">{t('common.edit')}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>{t('logintranslator.register.company.name')}</span>
          </label>
          {editing ? (
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              placeholder="Enter company name"
            />
          ) : (
            <p className="text-gray-800 font-medium text-lg bg-gray-50 px-4 py-3 rounded-xl border-l-4 border-blue-500">{company.companyName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>{t('logintranslator.register.company.type.title')}</span>
          </label>
          {editing ? (
            <select
              value={formData.companyType}
              onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            >
              <option value="">{t('common.select')} {t('logintranslator.register.company.type.title')}</option>
              <option value="real-estate">{t('logintranslator.register.company.type.b')}</option>
              <option value="construction">{t('logintranslator.register.company.type.c')}</option>
              <option value="property-management">{t('logintranslator.register.company.type.d')}</option>
            </select>
          ) : (
            <p className="text-gray-800 font-medium text-lg bg-gray-50 px-4 py-3 rounded-xl border-l-4 border-green-500">
              {company.companyType === 'real-estate' && t('logintranslator.register.company.type.b')}
              {company.companyType === 'construction' && t('logintranslator.register.company.type.c')}
              {company.companyType === 'property-management' && t('logintranslator.register.company.type.d')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span>{t('logintranslator.register.company.license')}</span>
          </label>
          {editing ? (
            <input
              type="text"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              placeholder="Enter license number"
            />
          ) : (
            <p className="text-gray-800 font-medium text-lg bg-gray-50 px-4 py-3 rounded-xl border-l-4 border-purple-500">{company.licenseNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            <span>{t('logintranslator.register.company.city.title')}</span>
          </label>
          {editing ? (
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            >
              <option value="">{t('common.select')} {t('logintranslator.register.company.city.title')}</option>
              <option value="riyadh">{t('logintranslator.register.company.city.b')}</option>
              <option value="jeddah">{t('logintranslator.register.company.city.c')}</option>
              <option value="dammam">{t('logintranslator.register.company.city.d')}</option>
              <option value="mecca">{t('logintranslator.register.company.city.e')}</option>
              <option value="medina">{t('logintranslator.register.company.city.f')}</option>
            </select>
          ) : (
            <p className="text-gray-800 font-medium text-lg bg-gray-50 px-4 py-3 rounded-xl border-l-4 border-orange-500">
              {company.city === 'riyadh' && t('logintranslator.register.company.city.b')}
              {company.city === 'jeddah' && t('logintranslator.register.company.city.c')}
              {company.city === 'dammam' && t('logintranslator.register.company.city.d')}
              {company.city === 'mecca' && t('logintranslator.register.company.city.e')}
              {company.city === 'medina' && t('logintranslator.register.company.city.f')}
            </p>
          )}
        </div>
      </div>

      {editing && (
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {t('common.save')}
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyInfoSection;
