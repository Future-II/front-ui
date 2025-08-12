import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>;
};
export default Layout;