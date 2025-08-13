import React from "react";
import { useTranslation } from "react-i18next";
import { HelpCircle, Search } from "lucide-react";
import { FaqItem as FaqItemType } from "../types";
import FaqItem from "./FaqItem";

interface FaqTabProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  faqCategories: string[];
  activeFaqCategory: string;
  setActiveFaqCategory: React.Dispatch<React.SetStateAction<string>>;
  filteredFaqs: FaqItemType[];
  showFaqAnswer: number | null;
  setShowFaqAnswer: React.Dispatch<React.SetStateAction<number | null>>;
  setActiveTab: (tab: "contact" | "tickets" | "faq") => void;
}

const FaqTab: React.FC<FaqTabProps> = ({
  searchTerm,
  setSearchTerm,
  faqCategories,
  activeFaqCategory,
  setActiveFaqCategory,
  filteredFaqs,
  showFaqAnswer,
  setShowFaqAnswer,
  setActiveTab,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      {/* FAQ Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{t("faq.title")}</h2>
          <p className="text-gray-600 mt-1">{t("faq.subtitle")}</p>
        </div>

        {/* Search and Categories */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={t("faq.searchPlaceholder")}
                className="w-full md:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex overflow-x-auto pb-2 gap-2">
              {faqCategories.map((categoryKey) => (
                <button
                  key={categoryKey}
                  onClick={() => setActiveFaqCategory(categoryKey)}
                  className={`px-3 py-1 whitespace-nowrap rounded-full text-sm ${
                    activeFaqCategory === categoryKey
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t(categoryKey)}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <FaqItem
                  key={faq.id}
                  faq={faq}
                  isOpen={showFaqAnswer === faq.id}
                  toggleOpen={() =>
                    setShowFaqAnswer(showFaqAnswer === faq.id ? null : faq.id)
                  }
                />
              ))
            ) : (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {t("faq.noResults.title")}
                </h3>
                <p className="text-gray-600">{t("faq.noResults.subtitle")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Need Help Section */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("faq.needHelp.title")}
        </h3>
        <p className="text-gray-600 mb-4">{t("faq.needHelp.subtitle")}</p>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("contact")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("faq.needHelp.newTicket")}
          </button>
          <button className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            {t("faq.needHelp.liveChat")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqTab;
