import {
  CreditCard,
  Landmark,
  Smartphone,
  Receipt,
  Phone,
  Mail,
  CalendarDays,
} from "lucide-react";

const Chip = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => (
  <div className={`w-12 h-12 rounded-full grid place-items-center text-white ${className}`}>
    {children}
  </div>
);

const Tile = ({
  icon,
  title,
  note,
  grad,
}: {
  icon: React.ReactNode;
  title: string;
  note: string;
  grad: string;
}) => (
  <div className="rounded-xl bg-gray-50 ring-1 ring-black/5 px-6 py-5 text-center w-full">
    <div className={`mx-auto mb-3 w-10 h-10 rounded-full grid place-items-center text-white bg-gradient-to-br ${grad}`}>
      {icon}
    </div>
    <div className="text-sm font-semibold text-gray-900">{title}</div>
    <div className="text-xs text-gray-500 leading-5">{note}</div>
  </div>
);

const InfoRow = ({
  icon,
  title,
  note,
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  note: string;
  bg: string;
}) => (
  <div className={`flex items-center gap-3 rounded-lg ${bg} ring-1 ring-black/5 px-4 py-3 w-full`}>
    <div className="w-8 h-8 rounded-full grid place-items-center bg-white text-blue-600 ring-1 ring-black/5">
      {icon}
    </div>
    <div>
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <div className="text-xs text-gray-500 leading-5">{note}</div>
    </div>
  </div>
);

export default function PaymentMethods() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* بطاقتان متساويتان ومتمركزَتان */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center items-stretch">
        {/* اليسار: طرق الدفع المتاحة */}
        <div className="w-full max-w-[520px] bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-6 sm:p-8 h-full flex flex-col">
          <div className="flex flex-col items-center text-center">
            <Chip className="bg-gradient-to-br from-emerald-500 to-green-500">
              <CreditCard className="h-5 w-5" />
            </Chip>
            <h4 className="mt-3 text-lg sm:text-xl font-extrabold text-gray-900">
              طرق الدفع المتاحة
            </h4>
            <p className="text-gray-600 text-sm">ادفع بالطريقة التي تُفضّلها</p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Tile
              icon={<CreditCard className="h-4 w-4" />}
              title="البطاقات البنكية"
              note="Visa · Mastercard"
              grad="from-blue-500 to-indigo-500"
            />
            <Tile
              icon={<Landmark className="h-4 w-4" />}
              title="تحويل بنكي"
              note="جميع البنوك السعودية"
              grad="from-green-500 to-emerald-500"
            />
            <Tile
              icon={<Smartphone className="h-4 w-4" />}
              title="STC Pay"
              note="دفع سريع وآمن"
              grad="from-purple-500 to-violet-500"
            />
            <Tile
              icon={<Receipt className="h-4 w-4" />}
              title="سداد الفواتير"
              note="للشركات والمؤسسات"
              grad="from-orange-500 to-amber-500"
            />
          </div>
        </div>

        {/* اليمين: هل تحتاج للمساعدة في الاختيار؟ */}
        <div className="w-full max-w-[520px] bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-6 sm:p-8 h-full flex flex-col">
          <div className="flex flex-col items-center text-center">
            <Chip className="bg-gradient-to-br from-blue-500 to-indigo-500">
              <Phone className="h-5 w-5" />
            </Chip>
            <h4 className="mt-3 text-lg sm:text-xl font-extrabold text-gray-900">
              هل تحتاج للمساعدة في الاختيار؟
            </h4>
            <p className="text-gray-600 text-sm">تواصل مع فريق المبيعات المتخصص لدينا</p>
          </div>

          <div className="mt-6 space-y-3">
            <InfoRow
              icon={<Phone className="h-4 w-4" />}
              title="تواصل معنا"
              note="920001234 · الأحد إلى الخميس 9ص – 6م"
              bg="bg-blue-50"
            />
            <InfoRow
              icon={<Mail className="h-4 w-4" />}
              title="تواصل عبر البريد"
              note="sales@reports-system.com · الرد خلال ساعتين"
              bg="bg-green-50"
            />
            <InfoRow
              icon={<CalendarDays className="h-4 w-4" />}
              title="احجز موعدًا"
              note="استشارة مجانية لمدة 30 دقيقة · لتحديد الباقة المناسبة"
              bg="bg-purple-50"
            />
          </div>

          <button className="mt-6 w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
            تواصل مع فريق المبيعات
          </button>
        </div>
      </div>
    </section>
  );
}
