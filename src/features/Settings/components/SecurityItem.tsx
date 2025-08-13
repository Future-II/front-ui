import React from 'react';

interface SecurityItemProps {
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
}

const SecurityItem: React.FC<SecurityItemProps> = ({
  title,
  description,
  buttonText,
  onClick,
}) => (
  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
    <div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      {buttonText}
    </button>
  </div>
);

export default SecurityItem;
