import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import Tabs from "../components/Tabs";
import ContactTab from "../components/ContactTab";
import TicketsTab from "../components/TicketsTab";
import FaqTab from "../components/FaqTab";

type TabId = "contact" | "tickets" | "faq";

const tabs: { id: TabId; labelKey: string }[] = [
  { id: "contact", labelKey: "faq.tabs.contact" },
  { id: "tickets", labelKey: "All Tickets" },
  { id: "faq", labelKey: "faq.tabs.faq" },
];

const SupportPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>("contact");
  const [searchTerm, setSearchTerm] = useState("");
  const [newTicketForm, setNewTicketForm] = useState({
    subject: "",
    priority: "low",
    description: "",
  });
  const faqCategories: string[] = [
    "faq.all",
    "faq.categories.registration",
    "faq.categories.subscription",
    "faq.categories.technical",
  ];

  const [activeFaqCategory, setActiveFaqCategory] = useState("all");
  const [showFaqAnswer, setShowFaqAnswer] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: t("faq.questions.registration1.question"),
      answer: t("faq.questions.registration1.answer"),
      category: "registration",
    },
    {
      id: 2,
      question: t("faq.questions.subscription1.question"),
      answer: t("faq.questions.subscription1.answer"),
      category: "subscription",
    },
    {
      id: 3,
      question: t("faq.questions.technical1.question"),
      answer: t("faq.questions.technical1.answer"),
      category: "technical",
    }
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeFaqCategory === "all" || faq.category === activeFaqCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handleNewTicketSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert(`${t("support.newTicket.submitButton")}: ${newTicketForm.subject}`);
    setNewTicketForm({ subject: "", priority: "low", description: "" });
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-white">
      <Header />
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

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
          <TicketsTab
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setActiveTab={setActiveTab}
          />
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
