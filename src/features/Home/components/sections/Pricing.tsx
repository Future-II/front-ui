import {
  Building2,
  BarChart2,
  CreditCard,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const Line = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2 text-sm text-gray-700 leading-7">
    <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-600" />
    <span>{children}</span>
  </li>
);

export default function Pricing() {
  return (
    <section id="pricing" className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* شارة أعلى العنوان */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
            اختر الباقة المناسبة لك
          </span>
        </div>

        <h3 className="mt-4 text-2xl font-bold text-center text-gray-900">
          باقات الاشتراك
        </h3>
        <p className="text-center text-gray-600 mt-2 leading-7">
          خطط مرنة تناسب احتياجاتك من الأفراد إلى الشركات الكبرى
        </p>

        {/* الشبكة: تمتد العناصر بنفس الارتفاع */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* الأساسية */}
          <div
            className="group bg-white rounded-2xl shadow-md ring-1 ring-gray-200 p-8
                       transition hover:shadow-xl hover:ring-blue-500 hover:scale-[1.02] h-full"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 grid place-items-center">
                  <CreditCard className="h-4 w-4" />
                </div>
                الباقة الأساسية
              </div>

              <p className="mt-1 text-gray-500 text-sm leading-7">
                مثالية للأفراد والشركات الصغيرة
              </p>

              {/* هذا القسم يتمدّد ليدفع الزر لأسفل */}
              <div className="mt-4 flex-1">
                <div className="text-4xl font-bold text-gray-900 leading-tight">
                  299 <span className="text-base font-normal text-gray-500">ريال/شهريًا</span>
                </div>

                <ul className="mt-4 space-y-2.5">
                  <Line>حتى 100 تقرير شهريًا</Line>
                  <Line>تكامل مع نظام القياس</Line>
                  <Line>دعم فني عبر البريد الإلكتروني</Line>
                  <Line>سعة تخزين 5GB</Line>
                  <Line>مستخدم واحد</Line>
                </ul>
              </div>

              <button className="mt-auto px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-blue-700">
                اختر هذه الباقة
              </button>
            </div>
          </div>

          {/* الاحترافية */}
          <div
            className="group relative bg-white rounded-2xl shadow-lg ring-2 ring-indigo-200 p-8
                       transition hover:shadow-2xl hover:ring-blue-500 hover:scale-[1.04] h-full"
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded-full bg-indigo-600 text-white flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              الأكثر شيوعًا
            </span>

            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <div className="w-8 h-8 rounded-full bg-violet-50 text-violet-600 grid place-items-center">
                  <BarChart2 className="h-4 w-4" />
                </div>
                الباقة الاحترافية
              </div>

              <p className="mt-1 text-gray-500 text-sm leading-7">
                الأفضل للشركات المتوسطة
              </p>

              <div className="mt-4 flex-1">
                <div className="text-4xl font-bold text-gray-900 leading-tight">
                  599 <span className="text-base font-normal text-gray-500">ريال/شهريًا</span>
                </div>
                <div className="text-xs text-green-600 font-medium mt-1 leading-6">
                  وفّر 20% سنويًا
                </div>

                <ul className="mt-4 space-y-2.5">
                  <Line>حتى 500 تقرير شهريًا</Line>
                  <Line>تكامل مع Scale و Click</Line>
                  <Line>دعم فني هاتفي مباشر</Line>
                  <Line>سعة تخزين 25GB</Line>
                  <Line>حتى 5 مستخدمين</Line>
                  <Line>تقارير تحليلية متقدمة</Line>
                </ul>
              </div>

              <button className="mt-auto px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold group-hover:bg-indigo-700">
                اختر هذه الباقة
              </button>
            </div>
          </div>

          {/* المؤسسية */}
          <div
            className="group bg-white rounded-2xl shadow-md ring-1 ring-gray-200 p-8
                       transition hover:shadow-xl hover:ring-blue-500 hover:scale-[1.02] h-full"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 grid place-items-center">
                  <Building2 className="h-4 w-4" />
                </div>
                الباقة المؤسسية
              </div>

              <p className="mt-1 text-gray-500 text-sm leading-7">
                للشركات والمؤسسات الكبيرة
              </p>

              <div className="mt-4 flex-1">
                <div className="text-4xl font-bold text-gray-900 leading-tight">
                  1299 <span className="text-base font-normal text-gray-500">ريال/شهريًا</span>
                </div>
                <div className="text-xs text-green-600 font-medium mt-1 leading-6">
                  وفّر 30% سنويًا
                </div>

                <ul className="mt-4 space-y-2.5">
                  <Line>تقارير غير محدودة</Line>
                  <Line>تكامل مع جميع الأنظمة</Line>
                  <Line>مدير حساب مخصص</Line>
                  <Line>سعة تخزين غير محدودة</Line>
                  <Line>مستخدمون غير محدودين</Line>
                  <Line>واجهات برمجية مخصصة</Line>
                </ul>
              </div>

              <button className="mt-auto px-4 py-2 rounded-lg  bg-indigo-600 text-white font-semibold group-hover:bg-indigo-700">
                تواصل معنا
              </button>
            </div>
          </div>
        </div>

        {/* شريط العرض */}
        <div className="mt-8 rounded-2xl p-6 text-center text-white bg-gradient-to-r from-emerald-500 to-blue-600">
          <div className="inline-flex items-center gap-2 text-xs mb-2 px-2 py-1 rounded-full bg-white/15 ring-1 ring-white/20">
            عرض محدود
          </div>
          <div className="font-semibold text-lg">احصل على شهر إضافي مجانًا!</div>
          <p className="text-white/90 text-sm leading-7">
            عند الاشتراك السنوي في أي باقة · العرض ساري حتى نهاية الشهر
          </p>
        </div>
      </div>
    </section>
  );
}
