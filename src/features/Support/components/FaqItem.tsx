import React from "react";
import { ChevronDown, CheckCircle, AlertTriangle } from "lucide-react";
import { FaqItem as FaqItemType } from "../types";
import { useTranslation } from "react-i18next";

interface Props {
  faq: FaqItemType;
  isOpen: boolean;
  toggleOpen: () => void;
}

const FaqItem: React.FC<Props> = ({ faq, isOpen, toggleOpen }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <button
        className="w-full text-right p-4 flex justify-between items-center"
        onClick={toggleOpen}
      >
        <span className="font-medium text-gray-900">{faq.question}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-gray-100">
          <p className="text-gray-600 mt-4">{faq.answer}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {t("faq.item.category")}: {t(`faq.${faq.category}`)}
            </span>
            <div className="flex items-center space-x-2 space-x-reverse">
              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                <CheckCircle className="h-4 w-4 ml-1" />
                {t("faq.item.useful")}
              </button>
              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                <AlertTriangle className="h-4 w-4 ml-1" />
                {t("faq.item.notUseful")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqItem;
