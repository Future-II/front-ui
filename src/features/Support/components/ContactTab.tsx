import React from "react";
import {
  MessageSquare,
  Phone,
  Mail,
  Paperclip,
  HelpCircle,
} from "lucide-react";


interface NewTicketForm {
  subject: string;
  priority: string;
  description: string;
}

interface ContactTabProps {
  setActiveTab: (tab: "contact" | "tickets" | "faq") => void;
  newTicketForm: NewTicketForm;
  setNewTicketForm: React.Dispatch<React.SetStateAction<NewTicketForm>>;
  handleNewTicketSubmit: (e: React.FormEvent) => void;
}
const ContactTab: React.FC<ContactTabProps> = ({
  setActiveTab,
  newTicketForm,
  setNewTicketForm,
  handleNewTicketSubmit,
}) => (
  <div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">المحادثة المباشرة</h3>
        <p className="text-gray-600 mb-6">
          تواصل مع فريق الدعم الفني مباشرة عبر المحادثة خلال ساعات العمل من 8 صباحاً حتى 5 مساءً
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full">
          بدء محادثة
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Phone className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">الاتصال الهاتفي</h3>
        <p className="text-gray-600 mb-6">
          اتصل بفريق الدعم الفني على الرقم المخصص خلال ساعات العمل من 8 صباحاً حتى 5 مساءً
        </p>
        <a
          href="tel:+966123456789"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full block"
        >
          920001234
        </a>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-amber-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">البريد الإلكتروني</h3>
        <p className="text-gray-600 mb-6">
          راسلنا عبر البريد الإلكتروني وسنرد عليك في خلال 24 ساعة عمل
        </p>
        <a
          href="mailto:support@example.com"
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors w-full block"
        >
          إرسال بريد إلكتروني
        </a>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">إنشاء تذكرة دعم فني جديدة</h2>
      <form onSubmit={handleNewTicketSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              عنوان التذكرة
            </label>
            <input
              type="text"
              id="subject"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل عنوان موجز للمشكلة"
              value={newTicketForm.subject}
              onChange={(e) =>
                setNewTicketForm((prev) => ({ ...prev, subject: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              الأولوية
            </label>
            <select
              id="priority"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newTicketForm.priority}
              onChange={(e) =>
                setNewTicketForm((prev) => ({ ...prev, priority: e.target.value }))
              }
            >
              <option value="منخفض">منخفضة</option>
              <option value="متوسط">متوسطة</option>
              <option value="عالي">عالية</option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              وصف المشكلة
            </label>
            <textarea
              id="description"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="اشرح المشكلة بالتفصيل وأضف أي معلومات قد تساعد فريق الدعم الفني"
              value={newTicketForm.description}
              onChange={(e) =>
                setNewTicketForm((prev) => ({ ...prev, description: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المرفقات (اختياري)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <Paperclip className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">اسحب الملفات هنا أو اضغط لاختيارها</p>
              <p className="text-sm text-gray-500">يمكنك إرفاق ملفات بصيغة JPG أو PNG أو PDF بحجم أقصى 10MB</p>
              <input type="file" className="hidden" multiple accept=".jpg,.jpeg,.png,.pdf" />
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                اختيار ملفات
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              إرسال التذكرة
            </button>
          </div>
        </div>
      </form>
    </div>

    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
      <div className="flex">
        <div className="ml-4">
          <HelpCircle className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">هل تحتاج إلى مساعدة فورية؟</h3>
          <p className="text-gray-600 mb-4">
            تصفح قسم الأسئلة الشائعة للحصول على إجابات سريعة للأسئلة المتكررة، أو استخدم المحادثة المباشرة للتواصل الفوري مع فريق الدعم الفني.
          </p>
          <button
            onClick={() => setActiveTab("faq")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            الانتقال إلى الأسئلة الشائعة
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ContactTab;
