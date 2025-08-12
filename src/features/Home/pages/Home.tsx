import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, BarChart, Settings, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('home.hero.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          {t('home.hero.subtitle')}
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            to="/reports/mekyas" 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('home.hero.startUsing')}
          </Link>
          <Link 
            to="/help" 
            className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            {t('home.hero.learnMore')}
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {t('home.features.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('home.features.reportsManagement.title')}
            </h3>
            <p className="text-gray-600">
              {t('home.features.reportsManagement.description')}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('home.features.adminDashboard.title')}
            </h3>
            <p className="text-gray-600">
              {t('home.features.adminDashboard.description')}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('home.features.userSettings.title')}
            </h3>
            <p className="text-gray-600">
              {t('home.features.userSettings.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center bg-blue-100 w-16 h-16 rounded-full mb-6">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('home.support.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('home.support.subtitle')}
          </p>
          <Link 
            to="/help" 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('home.support.contactSupport')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;