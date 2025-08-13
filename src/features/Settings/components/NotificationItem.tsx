import React from 'react';
import { useTranslation } from 'react-i18next';
import ToggleSwitch from './ToggleSwitch'; // import your reusable toggle
import { useLanguage } from '../../../hooks/useLanguage';

interface NotificationItemProps {
  id: string;
  titleKey: string;
  descriptionKey: string;
  defaultChecked?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  titleKey,
  descriptionKey,
  defaultChecked = true,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">
            {t(titleKey) || 'عنوان الإشعار'}
          </h3>
          <p className="text-sm text-gray-500">
            {t(descriptionKey) || 'وصف الإشعار'}
          </p>
        </div>
        <ToggleSwitch id={id} defaultChecked={defaultChecked} />
      </div>
    </div>
  );
};

export default NotificationItem;
