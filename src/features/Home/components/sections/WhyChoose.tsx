import { Zap, Shield, Globe, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const Card = ({
  icon,
  bg,
  title,
  desc,
}: {
  icon: React.ReactNode;
  bg: string;
  title: string;
  desc: string;
}) => (
  <div
    className="
      bg-white rounded-2xl
      shadow-lg ring-1 ring-black/5
      hover:shadow-xl transition-shadow
      p-6 sm:p-7
    "
  >
    <div
      className={`w-12 h-12 rounded-xl grid place-items-center mb-4 ${bg}`}
    >
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-gray-600 leading-6 text-sm">{desc}</p>
  </div>
);

export default function WhyChoose() {
  const { t } = useTranslation();

  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
          {t("home.features.whychoose.heading")}
        </h2>
        <p className="text-center text-gray-600 mt-2 max-w-3xl mx-auto">
          {t("home.features.whychoose.subheading")}
        </p>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            icon={<Zap className="h-6 w-6" />}
            bg="bg-blue-100 text-blue-600"
            title={t("home.features.whychoose.cards.0.title")}
            desc={t("home.features.whychoose.cards.0.desc")}
          />

          <Card
            icon={<Shield className="h-6 w-6" />}
            bg="bg-green-100 text-green-600"
            title={t("home.features.whychoose.cards.1.title")}
            desc={t("home.features.whychoose.cards.1.desc")}
          />

          <Card
            icon={<Globe className="h-6 w-6" />}
            bg="bg-purple-100 text-purple-600"
            title={t("home.features.whychoose.cards.2.title")}
            desc={t("home.features.whychoose.cards.2.desc")}
          />

          <Card
            icon={<Clock className="h-6 w-6" />}
            bg="bg-orange-100 text-orange-600"
            title={t("home.features.whychoose.cards.3.title")}
            desc={t("home.features.whychoose.cards.3.desc")}
          />
        </div>
      </div>
    </section>
  );
}
