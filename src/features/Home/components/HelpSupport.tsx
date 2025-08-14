import { Link } from "react-router-dom";
import { Headset } from "lucide-react";
import { useTranslation } from "react-i18next";

const HelpSupport = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white">
          <div className="inline-flex items-center justify-center bg-white/10 w-16 h-16 rounded-full mb-4 ring-1 ring-white/20">
            <Headset className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold">{t("home.support.title")}</h2>
          <p className="text-white/90 mt-2">{t("home.support.subtitle")}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/help"
              className="px-6 py-3 rounded-lg bg-white text-blue-700 font-semibold hover:bg-blue-50"
            >
              {t("home.support.helpCenter")}
            </Link>
            <Link
              to="/help"
              className="px-6 py-3 rounded-lg bg-blue-900/70 text-white font-semibold hover:bg-blue-900"
            >
              {t("home.support.contactSupport")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpSupport;
