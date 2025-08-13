import React from "react";
import { User, Save } from "lucide-react";

const ProfileTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        الملف الشخصي
      </h2>
      <div className="mb-6 flex items-center">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <User className="h-10 w-10 text-gray-500" />
        </div>
        <div className="ml-4 mr-4">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            تغيير الصورة
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الاسم الأول
          </label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="أحمد" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الاسم الأخير
          </label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="الراشد" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="ahmed.alrashid@company.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رقم الهاتف
          </label>
          <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="+966501234567" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الشركة
          </label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="شركة الرياض العقارية" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المنصب
          </label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="مدير التقارير" />
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          العنوان
        </label>
        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="الرياض، المملكة العربية السعودية" rows={3} />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الموقع الإلكتروني
        </label>
        <input type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="https://ahmed-alrashid.com" />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نبذة شخصية
        </label>
        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="خبير في مجال التقارير العقارية مع أكثر من 10 سنوات من الخبرة" rows={5} />
      </div>
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Save className="h-4 w-4 ml-2" />
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;
