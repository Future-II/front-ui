import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

interface ToggleSwitchProps {
  id: string;
  defaultChecked?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, defaultChecked = false }) => {
  const { isRTL } = useLanguage();

  const toggleClass = isRTL
    ? 'right-1 peer-checked:-translate-x-5'
    : 'left-1 peer-checked:translate-x-5';

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        id={id}
        defaultChecked={defaultChecked}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${toggleClass}`}></span>
    </label>
  );
};

export default ToggleSwitch;