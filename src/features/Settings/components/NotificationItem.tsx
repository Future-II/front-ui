import React from 'react';

interface NotificationItemProps {
  id: string;
  title: string;
  description: string;
  defaultChecked?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  title,
  description,
  defaultChecked = true,
}) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          defaultChecked={defaultChecked}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></span>
      </label>
    </div>
  </div>
);

export default NotificationItem;
