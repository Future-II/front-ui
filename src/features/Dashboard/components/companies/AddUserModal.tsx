import React from "react";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-bold text-right">إضافة مستخدم جديد</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ×
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4 text-right">
          {/* الشركة */}
          <div>
            <label className="block mb-1">الشركة</label>
            <select className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300">
              <option>اختر الشركة</option>
              <option value="company1">الشركة الأولى</option>
              <option value="company2">الشركة الثانية</option>
            </select>
          </div>

          {/* الاسم الكامل */}
          <div>
            <label className="block mb-1">الاسم الكامل</label>
            <input
              type="text"
              placeholder="أدخل الاسم الكامل"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="block mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              placeholder="أدخل البريد الإلكتروني"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* كلمة المرور */}
          <div>
            <label className="block mb-1">كلمة المرور</label>
            <input
              type="password"
              placeholder="أدخل كلمة المرور"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* الدور */}
          <div>
            <label className="block mb-1">الدور</label>
            <select className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300">
              <option>اختر الدور</option>
              <option value="admin">مسؤول</option>
              <option value="user">مستخدم</option>
            </select>
          </div>

          {/* الصلاحيات */}
          <div>
            <label className="block mb-2">الصلاحيات</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> عرض التقارير
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> إدارة التقارير
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> إدارة المستخدمين
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> إدارة الاشتراك
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6 border-t pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
          >
            إلغاء
          </button>
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            إضافة المستخدم
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
