import React from "react";

export default function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
        active ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
