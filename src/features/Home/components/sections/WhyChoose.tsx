import { Zap, Shield, Globe, Clock } from "lucide-react";

const Card = ({
  icon,
  bg,
  title,
  desc,
}: {
  icon: React.ReactNode;
  bg: string; // e.g. "bg-blue-100 text-blue-600"
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
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
          لماذا تختار نظامنا؟
        </h2>
        <p className="text-center text-gray-600 mt-2 max-w-3xl mx-auto">
          نوفر لك أفضل الحلول التقنية لإدارة تقارير العقارات بكفاءة واحترافية.
        </p>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            icon={<Zap className="h-6 w-6" />}
            bg="bg-blue-100 text-blue-600"
            title="سرعة فائقة ⚡"
            desc="سحب وإرسال التقارير في ثوانٍ باستخدام تقنيات متقدمة توفر لك ساعات من العمل."
          />

          <Card
            icon={<Shield className="h-6 w-6" />}
            bg="bg-green-100 text-green-600"
            title="أمان عالي 🔒"
            desc="حماية متقدمة لبياناتك مع تشفير بمستوى عسكري والالتزام بالمعايير الدولية."
          />

          <Card
            icon={<Globe className="h-6 w-6" />}
            bg="bg-purple-100 text-purple-600"
            title="تكامل شامل 🌐"
            desc="التكامل مع جميع أنظمة العقارات الرئيسية في المملكة باستخدام واجهات برمجة متقدمة."
          />

          <Card
            icon={<Clock className="h-6 w-6" />}
            bg="bg-orange-100 text-orange-600"
            title="متاح 24/7 ⏰"
            desc="خدمة مستمرة على مدار الساعة مع دعم فني متخصص لضمان استمرار عملك."
          />
        </div>
      </div>
    </section>
  );
}
