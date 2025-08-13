import React from 'react';

interface ToggleSwitchProps {
  id: string;
  defaultChecked?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, defaultChecked = false }) => (
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
);

export default ToggleSwitch;
