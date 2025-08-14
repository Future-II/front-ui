import React from 'react';

const ContactOptions: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
  <div className="p-6 border-b border-gray-200">
    <h2 className="text-lg font-medium text-gray-900 whitespace-nowrap">
      التواصل مع الدعم الفني
    </h2>
  </div>
  <div className="p-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-w-max">
      {/* Live Chat Card */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 flex flex-col items-center min-w-[200px]">
        {/* ... card content */}
      </div>
      {/* Phone Call Card */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200 flex flex-col items-center min-w-[200px]">
        {/* ... card content */}
      </div>
      {/* Email Card */}
      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 flex flex-col items-center min-w-[200px]">
        {/* ... card content */}
      </div>
    </div>
  </div>
</div>

  );
};

export default ContactOptions;