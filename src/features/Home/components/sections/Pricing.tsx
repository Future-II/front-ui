import {
  Building2,
  BarChart2,
  CreditCard,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Line = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2 text-sm text-gray-700 leading-7">
    <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-600" />
    <span>{children}</span>
  </li>
);

export default function Pricing() {
  const { t } = useTranslation();

  const plans = t("home.pricing.plans", { returnObjects: true }) as {
    name: string;
    desc: string;
    price: string;
    priceUnit: string;
    discount?: string;
    features: string[];
    button: string;
    tag?: string;
  }[];

  const offer = t("home.pricing.offer", { returnObjects: true }) as {
    badge: string;
    title: string;
    desc: string;
  };

  return (
    <section id="pricing" className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Badge */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
            {t("home.pricing.badge")}
          </span>
        </div>

        <h3 className="mt-4 text-2xl font-bold text-center text-gray-900">
          {t("home.pricing.title")}
        </h3>
        <p className="text-center text-gray-600 mt-2 leading-7">
          {t("home.pricing.description")}
        </p>

        {/* Plans */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Basic */}
          <div className="group bg-white rounded-2xl shadow-md ring-1 ring-gray-200 p-8 transition hover:shadow-xl hover:ring-blue-500 hover:scale-[1.02] h-full">
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 grid place-items-center">
                  <CreditCard className="h-4 w-4" />
                </div>
                {plans[0].name}
              </div>

              <p className="mt-1 text-gray-500 text-sm leading-7">{plans[0].desc}</p>

              <div className="mt-4 flex-1">
                <div className="text-4xl font-bold text-gray-900 leading-tight">
                  {plans[0].price}{" "}
                  <span className="text-base font-normal text-gray-500">
                    {plans[0].priceUnit}
                  </span>
                </div>

                <ul className="mt-4 space-y-2.5">
                  {plans[0].features.map((f, i) => (
                    <Line key={i}>{f}</Line>
                  ))}
                </ul>
              </div>

              <button className="mt-auto px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-blue-700">
                {plans[0].button}
              </button>
            </div>
          </div>

          {/* Professional */}
          <div className="group relative bg-white rounded-2xl shadow-lg ring-2 ring-indigo-200 p-8 transition hover:shadow-2xl hover:ring-blue-500 hover:scale-[1.04] h-full">
            {plans[1].tag && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded-full bg-indigo-600 text-white flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                {plans[1].tag}
              </span>
            )}

            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <div className="w-8 h-8 rounded-full bg-violet-50 text-violet-600 grid place-items-center">
                  <BarChart2 className="h-4 w-4" />
                </div>
                {plans[1].name}
              </div>

              <p className="mt-1 text-gray-500 text-sm leading-7">{plans[1].desc}</p>

              <div className="mt-4 flex-1">
                <div className="text-4xl font-bold text-gray-900 leading-tight">
                  {plans[1].price}{" "}
                  <span className="text-base font-normal text-gray-500">
                    {plans[1].priceUnit}
                  </span>
                </div>
                {plans[1].discount && (
                  <div className="text-xs text-green-600 font-medium mt-1 leading-6">
                    {plans[1].discount}
                  </div>
                )}

                <ul className="mt-4 space-y-2.5">
                  {plans[1].features.map((f, i) => (
                    <Line key={i}>{f}</Line>
                  ))}
                </ul>
              </div>

              <button className="mt-auto px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold group-hover:bg-indigo-700">
                {plans[1].button}
              </button>
            </div>
          </div>

          {/* Enterprise */}
          <div className="group bg-white rounded-2xl shadow-md ring-1 ring-gray-200 p-8 transition hover:shadow-xl hover:ring-blue-500 hover:scale-[1.02] h-full">
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 grid place-items-center">
                  <Building2 className="h-4 w-4" />
                </div>
                {plans[2].name}
              </div>

              <p className="mt-1 text-gray-500 text-sm leading-7">{plans[2].desc}</p>

              <div className="mt-4 flex-1">
                <div className="text-4xl font-bold text-gray-900 leading-tight">
                  {plans[2].price}{" "}
                  <span className="text-base font-normal text-gray-500">
                    {plans[2].priceUnit}
                  </span>
                </div>
                {plans[2].discount && (
                  <div className="text-xs text-green-600 font-medium mt-1 leading-6">
                    {plans[2].discount}
                  </div>
                )}

                <ul className="mt-4 space-y-2.5">
                  {plans[2].features.map((f, i) => (
                    <Line key={i}>{f}</Line>
                  ))}
                </ul>
              </div>

              <button className="mt-auto px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold group-hover:bg-indigo-700">
                {plans[2].button}
              </button>
            </div>
          </div>
        </div>

        {/* Offer Bar */}
        <div className="mt-8 rounded-2xl p-6 text-center text-white bg-gradient-to-r from-emerald-500 to-blue-600">
          <div className="inline-flex items-center gap-2 text-xs mb-2 px-2 py-1 rounded-full bg-white/15 ring-1 ring-white/20">
            {offer.badge}
          </div>
          <div className="font-semibold text-lg">{offer.title}</div>
          <p className="text-white/90 text-sm leading-7">{offer.desc}</p>
        </div>
      </div>
    </section>
  );
}
