import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Testimonials() {
  const { t } = useTranslation();

  const items = t("home.testimonials.items", { returnObjects: true }) as {
    name: string;
    role: string;
    text: string;
  }[];

  const palettes = [
    { card: "from-indigo-50 to-white ring-indigo-100", avatar: "bg-blue-600" },
    { card: "from-emerald-50 to-white ring-emerald-100", avatar: "bg-emerald-600" },
    { card: "from-violet-50 to-white ring-violet-100", avatar: "bg-violet-600" },
  ] as const;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h3 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900">
        {t("home.testimonials.title")}
      </h3>
      <p className="text-center text-gray-600 mt-2">{t("home.testimonials.subtitle")}</p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((tItem, i) => {
          const p = palettes[i % palettes.length];
          const initial = (tItem.name || "").trim().charAt(0) || "م";

          return (
            <div
              key={i}
              className={`text-left rounded-2xl ring-1 bg-gradient-to-br ${p.card} p-6 shadow-[0_10px_30px_rgba(16,24,40,0.06)]`}
            >
              <div className="flex justify-start items-center gap-1 text-yellow-500 mb-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-yellow-500" />
                ))}
              </div>

              <p className="text-gray-700 leading-7" dir="auto">
                {tItem.text}
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full ${p.avatar} text-white flex items-center justify-center font-semibold`}
                >
                  {initial}
                </div>
                <div className="leading-tight">
                  <div className="font-semibold text-gray-900">{tItem.name}</div>
                  <div className="text-sm text-gray-500">{tItem.role}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
