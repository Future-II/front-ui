import React from "react";
import { FileText, BarChart, Settings } from "lucide-react";

const Features: React.FC = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
        مميزات النظام
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            إدارة التقارير
          </h3>
          <p className="text-gray-600">
            سحب وإرسال التقارير بين الأنظمة المختلفة بسهولة وكفاءة مع تتبع حالة العملية
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <BarChart className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            لوحة الإدارة
          </h3>
          <p className="text-gray-600">
            تحكم كامل في إدارة الشركات والمستخدمين والاشتراكات مع رؤية شاملة للنظام
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Settings className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            إعدادات المستخدم
          </h3>
          <p className="text-gray-600">
            إدارة الملف الشخصي والإعدادات مع عرض تفاصيل الاشتراك والباقات المتاحة
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
