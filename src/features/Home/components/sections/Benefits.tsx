import { Star, TrendingUp, Users2, FileBarChart } from "lucide-react";

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
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto rounded-2xl bg-gradient-to-b from-indigo-50 to-white shadow-sm ring-1 ring-black/5 p-8 sm:p-12">
        {/* العنوان والوصف */}
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
          فوائد استخدام النظام
        </h3>
        <p className="text-center text-gray-600 mt-4 mb-10 leading-relaxed">
          اكتشف كيف يمكن لنظامنا أن يغير طريقة عملك.
        </p>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* العمود الأيسر */}
          <div className="space-y-8">
            <Point
              icon={<TrendingUp className="h-5 w-5" />}
              bg="bg-green-100 text-green-600"
              title="زيادة الإنتاجية بنسبة 300%"
              desc="وفر ساعات من العمل اليدوي واستفد من الأتمتة الذكية."
            />
            <Point
              icon={<Users2 className="h-5 w-5" />}
              bg="bg-blue-100 text-blue-600"
              title="تعاون فريق محسن"
              desc="شارك التقارير والبيانات مع فريقك بسهولة وأمان."
            />
            <Point
              icon={<FileBarChart className="h-5 w-5" />}
              bg="bg-purple-100 text-purple-600"
              title="إدارة متقدمة للتقارير"
              desc="قم بتنظيم وأرشفة تقاريرك باستخدام البحث المتقدم وإمكانيات التصفية."
            />
          </div>

          {/* العمود الأيمن — ⭐ فوق النص (مكدّس بشكل صريح) */}
          <div className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-10 sm:p-12 text-center">
            {/* أيقونة في الأعلى */}
            <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-white">
              <Star className="h-7 w-7" />
            </div>

            {/* العنوان والوصف تحت الأيقونة */}
            <div className="mt-3 text-lg sm:text-xl font-extrabold text-gray-900">
              جرب النظام مجانًا
            </div>
            <div className="mt-1 text-sm text-gray-600 leading-relaxed">
              ابدأ رحلتك معنا اليوم واكتشف الفرق.
            </div>

            {/* الزر */}
            <button className="mt-8 w-fit px-7 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:opacity-95 transition">
              ابدأ الآن مجانًا →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
