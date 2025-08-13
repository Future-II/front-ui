import React from 'react';
import NotificationItem from './NotificationItem';

const NotificationsTab: React.FC = () => {
  const items = [
    {
      id: 'email-notifications',
      title: 'إشعارات البريد الإلكتروني',
      description: 'استلام الإشعارات عبر البريد الإلكتروني',
    },
    {
      id: 'system-notifications',
      title: 'إشعارات النظام',
      description: 'استلام الإشعارات داخل النظام',
    },
    {
      id: 'report-alerts',
      title: 'تنبيهات التقارير',
      description: 'الإشعار عند اكتمال عملية سحب أو إرسال التقارير',
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">الإشعارات</h2>
      <div className="space-y-6">
        {items.map((item) => (
          <NotificationItem
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationsTab;
