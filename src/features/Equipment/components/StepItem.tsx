import React from "react";

type StepItemProps = {
  number: number;
  label: string;
  active?: boolean;
};

const StepItem: React.FC<StepItemProps> = ({ number, label, active }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex font-semibold text-sm items-center justify-center w-8 h-8 rounded-full border-1
          ${active ? "bg-blue-600 text-white border-blue-600" : "bg-gray-200 text-gray-500 border-gray-300"}
        `}
      >
        {number}
      </div>
      <span
        className={`mt-2 text-sm whitespace-nowrap 
          ${active ? "text-blue-600 font-medium" : "text-gray-500"}
        `}
      >
        {label}
      </span>
    </div>
  );
};

export default StepItem;
