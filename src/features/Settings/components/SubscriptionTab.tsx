import React from 'react';
import { Package } from 'lucide-react';

const SubscriptionTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">الاشتراك</h2>
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">الباقة الحالية</h3>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
            نشط
          </span>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center ml-4 mr-4">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">الباقة المتقدمة</h4>
              <p className="text-sm text-gray-600">تاريخ التجديد: 15/12/2023</p>
            </div>
          </div>
        </div>
        <h4 className="font-medium text-gray-900 mb-3">ميزات الباقة</h4>
        <ul className="space-y-2 mb-6">
          <li className="flex items-center text-sm text-gray-600">
            <svg
              className="h-5 w-5 text-green-500 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            سحب وإرسال التقارير بشكل تلقائي
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <svg
              className="h-5 w-5 text-green-500 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            إدارة حتى 10 مستخدمين
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <svg
              className="h-5 w-5 text-green-500 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            تخزين التقارير لمدة سنة كاملة
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <svg
              className="h-5 w-5 text-green-500 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            دعم فني على مدار الساعة
          </li>
        </ul>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            ترقية الباقة
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">سجل الفواتير</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  رقم الفاتورة
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  التاريخ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  المبلغ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الحالة
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">INV-2023-001</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/11/2023</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5,000 ر.س</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    مدفوعة
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900">تحميل</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">INV-2023-002</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/10/2023</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5,000 ر.س</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    مدفوعة
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900">تحميل</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab;
