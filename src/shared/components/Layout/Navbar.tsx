import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Bell, LogOut, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../Common/LanguageToggle';
import { useLanguage } from '../../../hooks/useLanguage';

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onMenuToggle
}) => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Add default values and null checks
  const currentLanguage = language || 'ar';
  const currentIsRTL = isRTL !== undefined ? isRTL : true;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden" 
              onClick={onMenuToggle}
            >
              <span className="sr-only">{t('navbar.openMenu')}</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-blue-600 text-xl font-bold">
                {t('navbar.realEstateSystem')}
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <LanguageToggle />
            
            {/* Current Language Display (for debugging) */}
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {currentLanguage.toUpperCase()} ({currentIsRTL ? 'RTL' : 'LTR'})
            </div>
            
            {/* Sidebar Position Indicator */}
            <div className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded">
              Sidebar: {currentIsRTL ? 'Right' : 'Left'}
            </div>
            
            {/* Notifications */}
            <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
              <Bell className="h-5 w-5" />
            </button>
            
            {/* User Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center text-sm focus:outline-none transition-colors duration-200" 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors duration-200">
                  <User className="h-5 w-5" />
                </div>
              </button>
              
              {userDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <Link 
                    to="/settings" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200" 
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <Settings className="h-4 w-4 ml-2" />
                    <span>{t('navbar.userSettings')}</span>
                  </Link>
                  <button 
                    className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200" 
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <LogOut className="h-4 w-4 ml-2" />
                    <span>{t('navbar.logout')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;