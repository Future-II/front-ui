import { Globe, Settings, MousePointer, Cog } from "lucide-react";
import { useTranslation } from "react-i18next";

const PartnerCard = ({
  icon,
  bg,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  bg: string;
  title: string;
  subtitle: string;
}) => (
  <div
    className="
      bg-white rounded-2xl shadow-md ring-1 ring-black/5
      p-6 flex flex-col items-center text-center
      hover:shadow-lg transition-shadow
    "
  >
    <div
      className={`w-14 h-14 rounded-full grid place-items-center mb-4 ${bg}`}
    >
      {icon}
    </div>
    <h4 className="text-base font-semibold text-gray-900">{title}</h4>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </div>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="text-2xl font-bold text-blue-600">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

export default function PartnersAndStats() {
  const { t } = useTranslation();

  const partners = [
    {
      icon: <Globe className="h-6 w-6 text-blue-600" />,
      bg: "bg-blue-100",
      title: t("home.features.partners.cards.gauge.title"),
      subtitle: t("home.features.partners.cards.gauge.subtitle"),
    },
    {
      icon: <MousePointer className="h-6 w-6 text-green-600" />,
      bg: "bg-green-100",
      title: t("home.features.partners.cards.click.title"),
      subtitle: t("home.features.partners.cards.click.subtitle"),
    },
    {
      icon: <Settings className="h-6 w-6 text-purple-600" />,
      bg: "bg-purple-100",
      title: t("home.features.partners.cards.other.title"),
      subtitle: t("home.features.partners.cards.other.subtitle"),
    },
    {
      icon: <Cog className="h-6 w-6 text-orange-600" />,
      bg: "bg-orange-100",
      title: t("home.features.partners.cards.custom.title"),
      subtitle: t("home.features.partners.cards.custom.subtitle"),
    },
  ];

  const stats = [
    { value: "1000+", label: t("home.features.partners.stats.users") },
    { value: "50K+", label: t("home.features.partners.stats.reports") },
    { value: "99.9%", label: t("home.features.partners.stats.uptime") },
    { value: "24/7", label: t("home.features.partners.stats.support") },
  ];

  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Heading */}
        <h3 className="text-center text-2xl font-bold text-gray-900">
          {t("home.features.partners.title")}
        </h3>
        <p className="text-center text-gray-600 mt-2">
          {t("home.features.partners.subtitle")}
        </p>

        {/* Partner Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((p, idx) => (
            <PartnerCard key={idx} {...p} />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s, idx) => (
            <Stat key={idx} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
