import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Bell, LogOut, Settings } from 'lucide-react';
interface NavbarProps {
  onMenuToggle: () => void;
}
const Navbar: React.FC<NavbarProps> = ({
  onMenuToggle
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  return <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden" onClick={onMenuToggle}>
              <span className="sr-only">فتح القائمة</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-blue-600 text-xl font-bold">
                نظام العقارات
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Bell className="h-5 w-5" />
            </button>
            <div className="relative">
              <button className="flex items-center text-sm focus:outline-none" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="h-5 w-5" />
                </div>
              </button>
              {userDropdownOpen && <div className="origin-top-right absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <Link to="/settings" className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserDropdownOpen(false)}>
                    <Settings className="h-4 w-4 ml-2" />
                    <span>إعدادات المستخدم</span>
                  </Link>
                  <button className="flex w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserDropdownOpen(false)}>
                    <LogOut className="h-4 w-4 ml-2" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;