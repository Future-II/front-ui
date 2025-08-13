import { Phone, Smartphone, CreditCard, Building2 } from "lucide-react";

export default function HelpChoosing() {
  return (
    <div className="bg-white rounded-xl ring-1 ring-gray-100 p-6">
      <h4 className="text-lg font-semibold text-gray-900">تحتاج مساعدة في الاختيار؟</h4>
      <p className="text-gray-600 mt-1">تواصل مع فريق المبيعات المتخصص</p>

      <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-600" /> جدولة مكالمة</div>
        <div className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-blue-600" /> دعم واتساب</div>
        <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-blue-600" /> طلب عرض توضيحي</div>
        <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-blue-600" /> حجز موعد</div>
      </div>

      <button className="mt-6 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100">
        تواصل مع فريق المبيعات
      </button>
    </div>
  );
}
