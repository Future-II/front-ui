import { Link } from "react-router-dom";
import { Shield, Users, Headset } from "lucide-react";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      <div className="bg-[#0d47a1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center text-white">

          {/* Tagline */}
          <div className="inline-flex items-center text-xs sm:text-sm px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/20 mb-6">
            {t("home.hero.tagline")}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            {t("home.hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-lg text-white/90 max-w-3xl mx-auto">
            {t("home.hero.subtitle")}
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/reports/mekyas"
              className="px-6 py-3 rounded-lg bg-white text-[#0d47a1] font-semibold hover:bg-gray-100 transition"
            >
              {t("home.hero.ctaPrimary")}
            </Link>
            <Link
              to="/help"
              className="px-6 py-3 rounded-lg border border-white font-semibold hover:bg-white/10 transition"
            >
              {t("home.hero.ctaSecondary")}
            </Link>
          </div>

          {/* Feature badges */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-400" />
              {t("home.hero.featureUsers")}
            </span>
            <span className="flex items-center gap-2">
              <Headset className="h-4 w-4 text-green-400" />
              {t("home.hero.featureSupport")}
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-400" />
              {t("home.hero.featureSecurity")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
