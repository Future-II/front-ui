import React from 'react';
import NotificationItem from './NotificationItem';
import { useTranslation } from 'react-i18next';

const NotificationsTab: React.FC = () => {
  const { t } = useTranslation();

  const items = [
    {
      id: 'email-notifications',
      titleKey: 'settings.notificationsTab.email.title',
      descriptionKey: 'settings.notificationsTab.email.description',
    },
    {
      id: 'system-notifications',
      titleKey: 'settings.notificationsTab.system.title',
      descriptionKey: 'settings.notificationsTab.system.description',
    },
    {
      id: 'report-alerts',
      titleKey: 'settings.notificationsTab.reports.title',
      descriptionKey: 'settings.notificationsTab.reports.description',
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        {t('settings.notificationsTab.title')}
      </h2>
      <div className="space-y-6">
        {items.map((item) => (
          <NotificationItem
            key={item.id}
            id={item.id}
            titleKey={item.titleKey}
            descriptionKey={item.descriptionKey}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationsTab;
