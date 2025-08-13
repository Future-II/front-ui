import { Star } from "lucide-react";

export default function Testimonials() {
  const items = [
    {
      name: "محمد القاضي",
      role: "مدير عقارات",
      text: "تكامل ممتاز مع أنظمتنا الحالية. حلّ كثيراً من المشكلات اليومية.",
    },
    {
      name: "فاطمة الزهراني",
      role: "مطورة عقارية",
      text: "الدعم الفني ممتاز والنظام يعمل بكفاءة عالية. أنصح به بشدة.",
    },
    {
      name: "أحمد المالكي",
      role: "مسؤول عقاري",
      text: "نظام رائع وفّر علينا ساعات من العمل اليدوي. السرعة والدقة مذهلتان.",
    },
  ];

  // exact pastel look: indigo / green / purple
  const palettes = [
    { card: "from-indigo-50 to-white ring-indigo-100", avatar: "bg-blue-600" },
    { card: "from-emerald-50 to-white ring-emerald-100", avatar: "bg-emerald-600" },
    { card: "from-violet-50 to-white ring-violet-100", avatar: "bg-violet-600" },
  ] as const;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h3 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900">
        ماذا يقول عملاؤنا
      </h3>
      <p className="text-center text-gray-600 mt-2">آراء حقيقية من عملاء سعداء</p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((t, i) => {
          const p = palettes[i % palettes.length];
          const initial = (t.name || "").trim().charAt(0) || "م";

          return (
            <div
              key={i}
              // force left alignment inside the card so stars/text don't inherit text-center
              className={`text-left rounded-2xl ring-1 bg-gradient-to-br ${p.card} p-6 shadow-[0_10px_30px_rgba(16,24,40,0.06)]`}
            >
              {/* Stars (left/top) */}
              <div className="flex justify-start items-center gap-1 text-yellow-500 mb-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-yellow-500" />
                ))}
              </div>

              {/* Review text – no extra decorative quotes to avoid weird spacing */}
              <p className="text-gray-700 leading-7" dir="auto">
                {t.text}
              </p>

              {/* Person */}
              <div className="mt-5 flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full ${p.avatar} text-white flex items-center justify-center font-semibold`}
                >
                  {initial}
                </div>
                <div className="leading-tight">
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
