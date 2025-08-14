import { useTranslation } from "react-i18next";

export default function Steps() {
  const { t } = useTranslation();

  const steps = [
    {
      n: "1",
      t: t("home.steps.1.title"),
      d: t("home.steps.1.desc"),
      bg: "from-blue-100 to-blue-50 text-blue-700",
    },
    {
      n: "2",
      t: t("home.steps.2.title"),
      d: t("home.steps.2.desc"),
      bg: "from-green-100 to-green-50 text-green-700",
    },
    {
      n: "3",
      t: t("home.steps.3.title"),
      d: t("home.steps.3.desc"),
      bg: "from-purple-100 to-purple-50 text-purple-700",
    },
    {
      n: "4",
      t: t("home.steps.4.title"),
      d: t("home.steps.4.desc"),
      bg: "from-orange-100 to-orange-50 text-orange-700",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
        {t("home.steps.heading")}
      </h3>
      <p className="text-center text-gray-600 mt-2">
        {t("home.steps.subheading")}
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {steps.map((s) => (
          <div key={s.n} className="flex flex-col items-center">
            <div
              className={`w-16 h-16 rounded-full grid place-items-center shadow-sm ring-1 ring-black/5 bg-gradient-to-b ${s.bg}`}
            >
              <span className="text-lg font-bold">{s.n}</span>
            </div>
            <div className="mt-3 font-semibold text-gray-900">{s.t}</div>
            <p className="mt-1 text-sm text-gray-600 leading-6 max-w-[18rem]">
              {s.d}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href="#pricing"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg
                     bg-gradient-to-r from-indigo-600 to-violet-600
                     text-white font-semibold hover:opacity-95 transition shadow-sm"
        >
          {t("home.steps.cta")} →
        </a>
      </div>
    </section>
  );
}
