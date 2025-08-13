import React from "react";
import { useTranslation } from "react-i18next";

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("faq.title")}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t("faq.subtitle")}
        </p>
      </div>
    </div>
  );
};

export default Header;
