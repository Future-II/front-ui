export default function Steps() {
  const steps = [
    {
      n: "1",
      t: "اختر الباقة",
      d: "اختر الباقة التي تناسب احتياجاتك وحجم نشاطك.",
      bg: "from-blue-100 to-blue-50 text-blue-700",
    },
    {
      n: "2",
      t: "أنشئ حسابك",
      d: "سجّل بياناتك الأساسية وبيانات المنشأة بسهولة.",
      bg: "from-green-100 to-green-50 text-green-700",
    },
    {
      n: "3",
      t: "ادفع بأمان",
      d: "اختر وسيلة الدفع المناسبة وأكمل عملية الدفع الآمنة.",
      bg: "from-purple-100 to-purple-50 text-purple-700",
    },
    {
      n: "4",
      t: "ابدأ الاستخدام",
      d: "استمتع بكل المميزات فورًا واحصل على تدريب مجاني.",
      bg: "from-orange-100 to-orange-50 text-orange-700",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
        خطوات اشتراك سهلة
      </h3>
      <p className="text-center text-gray-600 mt-2">
        ابدأ رحلتك معنا في 4 خطوات بسيطة
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
          ابدأ الاشتراك الآن →
        </a>
      </div>
    </section>
  );
}
