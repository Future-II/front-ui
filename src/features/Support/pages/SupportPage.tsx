import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, ChevronDown, Search, Plus, FileText, Send, Paperclip, HelpCircle, AlertTriangle, CheckCircle } from 'lucide-react';
interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}
const SupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contact' | 'tickets' | 'faq'>('contact');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTicketForm, setNewTicketForm] = useState({
    subject: '',
    description: '',
    priority: 'متوسط'
  });
  const [showFaqAnswer, setShowFaqAnswer] = useState<number | null>(null);
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('all');
  // Sample FAQs
  const faqs: FAQ[] = [{
    id: 1,
    question: 'كيف يمكنني إضافة مستخدمين جدد إلى حسابي؟',
    answer: 'يمكنك إضافة مستخدمين جدد من خلال الذهاب إلى لوحة الإدارة، ثم اختيار "إدارة المستخدمين" والنقر على زر "إضافة مستخدم" في الأعلى. قم بملء النموذج بالمعلومات المطلوبة وتحديد الصلاحيات المناسبة ثم اضغط على "إضافة".',
    category: 'المستخدمين'
  }, {
    id: 2,
    question: 'كيف يمكنني ترقية باقتي الحالية؟',
    answer: 'لترقية باقتك الحالية، انتقل إلى صفحة "الاشتراكات" من القائمة الجانبية، ثم اختر الباقة التي ترغب في الترقية إليها واضغط على "ترقية". سيتم توجيهك إلى صفحة الدفع لإكمال عملية الترقية.',
    category: 'الاشتراكات'
  }, {
    id: 3,
    question: 'ماذا أفعل إذا فشلت عملية سحب التقارير؟',
    answer: 'في حالة فشل عملية سحب التقارير، يرجى التحقق من اتصالك بالإنترنت أولاً، ثم تأكد من صحة المعلومات المدخلة. إذا استمرت المشكلة، يمكنك إنشاء تذكرة دعم فني مع وصف المشكلة وإرفاق لقطة شاشة للخطأ إن وجد.',
    category: 'التقارير'
  }, {
    id: 4,
    question: 'كيف يمكنني تغيير بيانات شركتي؟',
    answer: 'لتغيير بيانات شركتك، انتقل إلى "إعدادات الحساب" من القائمة الجانبية، ثم اختر "بيانات الشركة". يمكنك تعديل المعلومات المطلوبة والضغط على "حفظ التغييرات" لتطبيق التعديلات.',
    category: 'الحساب'
  }, {
    id: 5,
    question: 'كيف يمكنني تغيير كلمة المرور الخاصة بي؟',
    answer: 'لتغيير كلمة المرور، انتقل إلى "إعدادات الحساب" من القائمة الجانبية، ثم اختر "الأمان". أدخل كلمة المرور الحالية ثم أدخل كلمة المرور الجديدة وتأكيدها، واضغط على "تحديث كلمة المرور".',
    category: 'الحساب'
  }, {
    id: 6,
    question: 'كيف يمكنني إضافة عقار جديد إلى النظام؟',
    answer: 'لإضافة عقار جديد، انتقل إلى صفحة "العقارات" من القائمة الجانبية، ثم اضغط على زر "إضافة عقار جديد". قم بملء النموذج بالمعلومات المطلوبة وإرفاق الصور والمستندات المطلوبة ثم اضغط على "حفظ".',
    category: 'العقارات'
  }, {
    id: 7,
    question: 'هل يمكنني تصدير التقارير بصيغ مختلفة؟',
    answer: 'نعم، يمكنك تصدير التقارير بعدة صيغ مثل PDF و Excel و CSV. عند عرض أي تقرير، ستجد زر "تصدير" في الأعلى، اضغط عليه واختر الصيغة المطلوبة.',
    category: 'التقارير'
  }, {
    id: 8,
    question: 'كيف يمكنني إلغاء اشتراكي؟',
    answer: 'لإلغاء اشتراكك، انتقل إلى "الاشتراكات" من القائمة الجانبية، ثم اضغط على "إدارة الاشتراك" واختر "إلغاء الاشتراك". سيطلب منك تأكيد الإلغاء وسبب الإلغاء قبل إتمام العملية.',
    category: 'الاشتراكات'
  }];
  // Get unique FAQ categories
  const faqCategories = ['all', ...new Set(faqs.map(faq => faq.category))];
  // Filter FAQs based on search term and category
  const filteredFaqs = faqs.filter(faq => (activeFaqCategory === 'all' || faq.category === activeFaqCategory) && (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase())));
  // Handle form submission for new ticket
  const handleNewTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the new ticket data to your backend
    alert('تم إرسال التذكرة بنجاح!');
    setNewTicketForm({
      subject: '',
      description: '',
      priority: 'متوسط'
    });
  };
  return <div className="w-full min-h-[calc(100vh-4rem)] bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            مركز الدعم الفني
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            فريق الدعم الفني متاح لمساعدتك في جميع استفساراتك وطلباتك
          </p>
        </div>
      </div>
      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 space-x-reverse" aria-label="Tabs">
            <button onClick={() => setActiveTab('contact')} className={`py-4 px-1 ${activeTab === 'contact' ? 'border-b-2 border-blue-500 text-blue-600' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} font-medium text-sm`}>
              التواصل مع الدعم
            </button>
            <button onClick={() => setActiveTab('tickets')} className={`py-4 px-1 ${activeTab === 'tickets' ? 'border-b-2 border-blue-500 text-blue-600' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} font-medium text-sm`}>
              تذاكر الدعم الفني
            </button>
            <button onClick={() => setActiveTab('faq')} className={`py-4 px-1 ${activeTab === 'faq' ? 'border-b-2 border-blue-500 text-blue-600' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} font-medium text-sm`}>
              الأسئلة الشائعة
            </button>
          </nav>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeTab === 'contact' && <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  المحادثة المباشرة
                </h3>
                <p className="text-gray-600 mb-6">
                  تواصل مع فريق الدعم الفني مباشرة عبر المحادثة خلال ساعات العمل
                  من 8 صباحاً حتى 5 مساءً
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full">
                  بدء محادثة
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  الاتصال الهاتفي
                </h3>
                <p className="text-gray-600 mb-6">
                  اتصل بفريق الدعم الفني على الرقم المخصص خلال ساعات العمل من 8
                  صباحاً حتى 5 مساءً
                </p>
                <a href="tel:+966123456789" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full block">
                  920001234
                </a>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  البريد الإلكتروني
                </h3>
                <p className="text-gray-600 mb-6">
                  راسلنا عبر البريد الإلكتروني وسنرد عليك في خلال 24 ساعة عمل
                </p>
                <a href="mailto:support@example.com" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors w-full block">
                  إرسال بريد إلكتروني
                </a>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                إنشاء تذكرة دعم فني جديدة
              </h2>
              <form onSubmit={handleNewTicketSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      عنوان التذكرة
                    </label>
                    <input type="text" id="subject" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="أدخل عنوان موجز للمشكلة" value={newTicketForm.subject} onChange={e => setNewTicketForm({
                  ...newTicketForm,
                  subject: e.target.value
                })} required />
                  </div>
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      الأولوية
                    </label>
                    <select id="priority" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={newTicketForm.priority} onChange={e => setNewTicketForm({
                  ...newTicketForm,
                  priority: e.target.value
                })}>
                      <option value="منخفض">منخفضة</option>
                      <option value="متوسط">متوسطة</option>
                      <option value="عالي">عالية</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      وصف المشكلة
                    </label>
                    <textarea id="description" rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="اشرح المشكلة بالتفصيل وأضف أي معلومات قد تساعد فريق الدعم الفني" value={newTicketForm.description} onChange={e => setNewTicketForm({
                  ...newTicketForm,
                  description: e.target.value
                })} required></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المرفقات (اختياري)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <Paperclip className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-2">
                        اسحب الملفات هنا أو اضغط لاختيارها
                      </p>
                      <p className="text-sm text-gray-500">
                        يمكنك إرفاق ملفات بصيغة JPG أو PNG أو PDF بحجم أقصى 10MB
                      </p>
                      <input type="file" className="hidden" multiple accept=".jpg,.jpeg,.png,.pdf" />
                      <button type="button" className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        اختيار ملفات
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    هل تحتاج إلى مساعدة فورية؟
                  </h3>
                  <p className="text-gray-600 mb-4">
                    تصفح قسم الأسئلة الشائعة للحصول على إجابات سريعة للأسئلة
                    المتكررة، أو استخدم المحادثة المباشرة للتواصل الفوري مع فريق
                    الدعم الفني.
                  </p>
                  <button onClick={() => setActiveTab('faq')} className="text-blue-600 hover:text-blue-800 font-medium">
                    الانتقال إلى الأسئلة الشائعة
                  </button>
                </div>
              </div>
            </div>
          </div>}
        {activeTab === 'tickets' && <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                تذاكر الدعم الفني
              </h2>
              <p className="text-gray-600 mt-1">
                تابع حالة تذاكر الدعم الفني الخاصة بك وتفاعل مع فريق الدعم
              </p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input type="text" placeholder="البحث في التذاكر..." className="w-full md:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <button onClick={() => setActiveTab('contact')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <Plus className="h-4 w-4 ml-2" />
                  تذكرة جديدة
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        مشكلة في سحب التقارير التلقائي
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span className="ml-2">رقم التذكرة: #1</span>
                        <span className="ml-2">22/11/2023</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mr-2">
                          مفتوح
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-1 h-fit text-xs font-medium rounded-full bg-red-100 text-red-800">
                      عالي
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      آخر تحديث: منذ 2 ساعة
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        استفسار عن ترقية الباقة
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span className="ml-2">رقم التذكرة: #2</span>
                        <span className="ml-2">21/11/2023</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 mr-2">
                          قيد المعالجة
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-1 h-fit text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                      متوسط
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      آخر تحديث: منذ يوم واحد
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        طلب إضافة مستخدمين جدد
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span className="ml-2">رقم التذكرة: #3</span>
                        <span className="ml-2">20/11/2023</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mr-2">
                          مغلق
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-1 h-fit text-xs font-medium rounded-full bg-green-100 text-green-800">
                      منخفض
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      آخر تحديث: منذ 2 أيام
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  عرض المزيد من التذاكر
                </button>
              </div>
            </div>
          </div>}
        {activeTab === 'faq' && <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  الأسئلة الشائعة
                </h2>
                <p className="text-gray-600 mt-1">
                  إجابات للأسئلة الأكثر شيوعاً حول استخدام النظام
                </p>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input type="text" placeholder="البحث في الأسئلة الشائعة..." className="w-full md:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="flex overflow-x-auto pb-2 gap-2">
                    {faqCategories.map(category => <button key={category} onClick={() => setActiveFaqCategory(category)} className={`px-3 py-1 whitespace-nowrap rounded-full text-sm ${activeFaqCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        {category === 'all' ? 'الكل' : category}
                      </button>)}
                  </div>
                </div>
                <div className="space-y-4">
                  {filteredFaqs.length > 0 ? filteredFaqs.map(faq => <div key={faq.id} className="bg-white rounded-lg border border-gray-200">
                        <button className="w-full text-right p-4 flex justify-between items-center" onClick={() => setShowFaqAnswer(showFaqAnswer === faq.id ? null : faq.id)}>
                          <span className="font-medium text-gray-900">
                            {faq.question}
                          </span>
                          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${showFaqAnswer === faq.id ? 'transform rotate-180' : ''}`} />
                        </button>
                        {showFaqAnswer === faq.id && <div className="p-4 pt-0 border-t border-gray-100">
                            <p className="text-gray-600">{faq.answer}</p>
                            <div className="mt-2 flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                القسم: {faq.category}
                              </span>
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                                  <CheckCircle className="h-4 w-4 ml-1" />
                                  مفيد
                                </button>
                                <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                                  <AlertTriangle className="h-4 w-4 ml-1" />
                                  غير مفيد
                                </button>
                              </div>
                            </div>
                          </div>}
                      </div>) : <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        لم يتم العثور على نتائج
                      </h3>
                      <p className="text-gray-600">
                        جرب استخدام كلمات مفتاحية مختلفة أو تواصل مع الدعم الفني
                      </p>
                    </div>}
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex">
                <div className="ml-4">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    لم تجد إجابة لسؤالك؟
                  </h3>
                  <p className="text-gray-600 mb-4">
                    يمكنك التواصل مباشرة مع فريق الدعم الفني عبر المحادثة
                    المباشرة أو إنشاء تذكرة دعم فني جديدة.
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => setActiveTab('contact')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      إنشاء تذكرة جديدة
                    </button>
                    <button className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      بدء محادثة مباشرة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};
export default SupportPage;