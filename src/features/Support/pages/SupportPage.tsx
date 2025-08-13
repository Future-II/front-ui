import React, { useState } from "react";
import Header from "../components/Header";
import Tabs from "../components/Tabs";
import ContactTab from "../components/ContactTab";
import TicketsTab from "../components/TicketsTab";
import FaqTab from "../components/FaqTab";

type TabId = "contact" | "tickets" | "faq";

const tabs = [
  { id: "contact" as TabId, label: "التواصل مع الدعم" },
  { id: "tickets" as TabId, label: "تذاكر الدعم الفني" },
  { id: "faq" as TabId, label: "الأسئلة الشائعة" },
];

const SupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("contact");
  const [searchTerm, setSearchTerm] = useState("");
  const [newTicketForm, setNewTicketForm] = useState({
    subject: "",
    priority: "منخفض",
    description: "",
  });
  const [faqCategories, setFaqCategories] = useState<string[]>([
    "all",
    "التسجيل",
    "الاشتراك",
    "المشاكل التقنية",
  ]);
  const [activeFaqCategory, setActiveFaqCategory] = useState("all");
  const [showFaqAnswer, setShowFaqAnswer] = useState<number | null>(null);

  // Dummy FAQs array example; replace with your actual data
  const faqs = [
    {
      id: 1,
      question: "كيف أسجل حساب جديد؟",
      answer: "يمكنك التسجيل عبر صفحة التسجيل بإدخال بريدك الإلكتروني وكلمة المرور.",
      category: "التسجيل",
    },
    {
      id: 2,
      question: "كيف يمكنني تحديث بيانات الاشتراك؟",
      answer: "اذهب إلى صفحة حسابي ثم اختر الاشتراكات لتحديث بياناتك.",
      category: "الاشتراك",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeFaqCategory === "all" || faq.category === activeFaqCategory;
    const matchesSearch = faq.question.includes(searchTerm) || faq.answer.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  function handleNewTicketSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert(`تم إرسال التذكرة: ${newTicketForm.subject}`);
    setNewTicketForm({ subject: "", priority: "منخفض", description: "" });
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-white">
      <Header />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeTab === "contact" && (
          <ContactTab
            setActiveTab={setActiveTab}
            newTicketForm={newTicketForm}
            setNewTicketForm={setNewTicketForm}
            handleNewTicketSubmit={handleNewTicketSubmit}
          />
        )}
        {activeTab === "tickets" && (
          <TicketsTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} setActiveTab={setActiveTab} />
        )}
        {activeTab === "faq" && (
          <FaqTab
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            faqCategories={faqCategories}
            activeFaqCategory={activeFaqCategory}
            setActiveFaqCategory={setActiveFaqCategory}
            filteredFaqs={filteredFaqs}
            showFaqAnswer={showFaqAnswer}
            setShowFaqAnswer={setShowFaqAnswer}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );
};

export default SupportPage;
