import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";

const HelpSupport: React.FC = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center bg-blue-100 w-16 h-16 rounded-full mb-6">
          <HelpCircle className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          هل تحتاج للمساعدة؟
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          فريق الدعم الفني متاح لمساعدتك على مدار الساعة
        </p>
        <Link
          to="/help"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          تواصل مع الدعم الفني
        </Link>
      </div>
    </div>
  );
};

export default HelpSupport;
