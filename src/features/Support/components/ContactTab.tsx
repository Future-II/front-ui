import React from "react";
import { MessageSquare, Phone, Mail, Paperclip, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

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
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Live Chat */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t("support.liveChat.title")}</h3>
          <p className="text-gray-600 mb-6">{t("support.liveChat.description")}</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full">
            {t("support.liveChat.button")}
          </button>
        </div>

        {/* Phone */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Phone className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t("support.phone.title")}</h3>
          <p className="text-gray-600 mb-6">{t("support.phone.description")}</p>
          <a
            href="tel:+966123456789"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full block"
          >
            {t("support.phone.number")}
          </a>
        </div>

        {/* Email */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t("support.email.title")}</h3>
          <p className="text-gray-600 mb-6">{t("support.email.description")}</p>
          <a
            href="mailto:support@example.com"
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors w-full block"
          >
            {t("support.email.button")}
          </a>
        </div>
      </div>

      {/* New Ticket Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{t("support.newTicket.title")}</h2>
        <form onSubmit={handleNewTicketSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                {t("support.newTicket.subjectLabel")}
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("support.newTicket.subjectPlaceholder")}
                value={newTicketForm.subject}
                onChange={(e) =>
                  setNewTicketForm((prev) => ({ ...prev, subject: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                {t("support.newTicket.priorityLabel")}
              </label>
              <select
                id="priority"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTicketForm.priority}
                onChange={(e) =>
                  setNewTicketForm((prev) => ({ ...prev, priority: e.target.value }))
                }
              >
                <option value="low">{t("support.newTicket.priorityLow")}</option>
                <option value="medium">{t("support.newTicket.priorityMedium")}</option>
                <option value="high">{t("support.newTicket.priorityHigh")}</option>
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                {t("support.newTicket.descriptionLabel")}
              </label>
              <textarea
                id="description"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("support.newTicket.descriptionPlaceholder")}
                value={newTicketForm.description}
                onChange={(e) =>
                  setNewTicketForm((prev) => ({ ...prev, description: e.target.value }))
                }
                required
              />
            </div>
            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("support.newTicket.attachmentsLabel")}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Paperclip className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2">{t("support.newTicket.attachmentsText")}</p>
                <p className="text-sm text-gray-500">{t("support.newTicket.attachmentsInfo")}</p>
                <input type="file" className="hidden" multiple accept=".jpg,.jpeg,.png,.pdf" />
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {t("support.newTicket.attachmentsButton")}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t("support.newTicket.submitButton")}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* FAQ Prompt */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <div className="flex">
          <div className="ml-4">
            <HelpCircle className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t("support.faqPrompt.title")}</h3>
            <p className="text-gray-600 mb-4">{t("support.faqPrompt.description")}</p>
            <button
              onClick={() => setActiveTab("faq")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {t("support.faqPrompt.button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactTab;
