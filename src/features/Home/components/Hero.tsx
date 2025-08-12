import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        نظام إدارة تقارير العقارات
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
        منصة متكاملة لإدارة وسحب وإرسال تقارير العقارات بين الأنظمة المختلفة بكفاءة عالية
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/reports/mekyas"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          ابدأ باستخدام النظام
        </Link>
        <Link
          to="/help"
          className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
        >
          تعلم المزيد
        </Link>
      </div>
    </div>
  );
};

export default Hero;
