import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, FileText, Settings, Home, ChevronRight, ChevronDown, HelpCircle } from 'lucide-react';
interface SidebarProps {
  isOpen: boolean;
}
interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  subItems?: {
    name: string;
    path: string;
  }[];
}
const Sidebar: React.FC<SidebarProps> = ({
  isOpen
}) => {
  const location = useLocation();
  // Track which menus are expanded
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    '/reports': true // Default expanded for reports menu
  });
  const menuItems: MenuItem[] = [{
    name: 'الرئيسية',
    path: '/',
    icon: <Home className="h-5 w-5" />
  }, {
    name: 'تقارير المعدات',
    path: '/reports',
    icon: <FileText className="h-5 w-5" />,
    subItems: [{
      name: 'تقارير مقياس',
      path: '/reports/mekyas'
    }, {
      name: 'عرض التقارير',
      path: '/reports/view'
    }, {
      name: 'تقارير نقرة',
      path: '/reports/noqra'
    }]
  }, {
    name: 'لوحة الإدارة',
    path: '/dashboard',
    icon: <BarChart className="h-5 w-5" />
  }, {
    name: 'إعدادات المستخدم',
    path: '/settings',
    icon: <Settings className="h-5 w-5" />
  }, {
    name: 'المساعدة والدعم',
    path: '/support',
    icon: <HelpCircle className="h-5 w-5" />
  }];
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const isSubActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  const toggleMenu = (path: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };
  return <aside className={`${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} fixed md:relative top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-l border-gray-200 transition-transform duration-300 ease-in-out z-10`}>
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item, index) => <li key={index}>
              {item.subItems ? <div className="space-y-2">
                  <div className={`flex items-center p-2 text-gray-700 rounded-lg cursor-pointer ${isSubActive(item.path) ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`} onClick={() => toggleMenu(item.path)}>
                    <span className="ml-3">{item.icon}</span>
                    <span className="flex-1 mr-3 whitespace-nowrap">
                      {item.name}
                    </span>
                    {expandedMenus[item.path] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>
                  {expandedMenus[item.path] && <ul className="mr-6 space-y-1 border-r border-gray-200 pr-3">
                      {item.subItems.map((subItem, subIndex) => <li key={subIndex}>
                          <Link to={subItem.path} className={`flex items-center p-2 text-gray-700 rounded-lg ${isActive(subItem.path) ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}>
                            <span className="flex-1 whitespace-nowrap">
                              {subItem.name}
                            </span>
                          </Link>
                        </li>)}
                    </ul>}
                </div> : <Link to={item.path} className={`flex items-center p-2 text-gray-700 rounded-lg ${isActive(item.path) ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}>
                  <span className="ml-3">{item.icon}</span>
                  <span className="flex-1 mr-3 whitespace-nowrap">
                    {item.name}
                  </span>
                </Link>}
            </li>)}
        </ul>
      </div>
    </aside>;
};
export default Sidebar;