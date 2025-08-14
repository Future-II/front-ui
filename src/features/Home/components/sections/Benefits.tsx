import { Star, TrendingUp, Users2, FileBarChart } from "lucide-react";
import { useTranslation } from "react-i18next";

const Point = ({
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
  <div className="flex items-start gap-4">
    <div className={`w-10 h-10 rounded-full grid place-items-center ${bg}`}>
      {icon}
    </div>
    <div>
      <div className="font-semibold text-gray-900">{title}</div>
      <div className="text-sm text-gray-600 leading-relaxed">{desc}</div>
    </div>
  </div>
);

export default function Benefits() {
  const { t } = useTranslation();

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto rounded-2xl bg-gradient-to-b from-indigo-50 to-white shadow-sm ring-1 ring-black/5 p-8 sm:p-12">
        {/* Title & description */}
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
          {t("home.features.benefits.title")}
        </h3>
        <p className="text-center text-gray-600 mt-4 mb-10 leading-relaxed">
          {t("home.features.benefits.subtitle")}
        </p>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left column */}
          <div className="space-y-8">
            <Point
              icon={<TrendingUp className="h-5 w-5" />}
              bg="bg-green-100 text-green-600"
              title={t("home.features.benefits.points.0.title")}
              desc={t("home.features.benefits.points.0.desc")}
            />
            <Point
              icon={<Users2 className="h-5 w-5" />}
              bg="bg-blue-100 text-blue-600"
              title={t("home.features.benefits.points.1.title")}
              desc={t("home.features.benefits.points.1.desc")}
            />
            <Point
              icon={<FileBarChart className="h-5 w-5" />}
              bg="bg-purple-100 text-purple-600"
              title={t("home.features.benefits.points.2.title")}
              desc={t("home.features.benefits.points.2.desc")}
            />
          </div>

          {/* Right column */}
          <div className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-10 sm:p-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-white">
              <Star className="h-7 w-7" />
            </div>

            <div className="mt-3 text-lg sm:text-xl font-extrabold text-gray-900">
              {t("home.features.benefits.cta.title")}
            </div>
            <div className="mt-1 text-sm text-gray-600 leading-relaxed">
              {t("home.features.benefits.cta.desc")}
            </div>

            <button className="mt-8 w-fit px-7 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:opacity-95 transition">
              {t("home.features.benefits.cta.button")} →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
