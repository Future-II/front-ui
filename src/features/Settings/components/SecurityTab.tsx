import React from 'react';
import SecurityItem from './SecurityItem';

const SecurityTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">الأمان</h2>
      <div className="space-y-4">
        <SecurityItem
          title="كلمة المرور"
          description="تغيير كلمة مرور حسابك"
          buttonText="تغيير"
          onClick={() => {
            // Add your change password logic here
          }}
        />
        <SecurityItem
          title="المصادقة الثنائية"
          description="إضافة طبقة أمان إضافية لحسابك"
          buttonText="تفعيل"
          onClick={() => {
            // Add your enable 2FA logic here
          }}
        />
      </div>
    </div>
  );
};

export default SecurityTab;
