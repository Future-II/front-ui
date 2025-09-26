import React, { useState, useRef } from "react";
import { MessageSquare, Phone, Mail, Paperclip, HelpCircle, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "../../../shared/utils/api";

interface NewTicketForm {
  subject: string;
  classification: string;
  description: string;
}

interface ContactTabProps {
  setActiveTab: (tab: "contact" | "tickets" | "faq") => void;
  newTicketForm: NewTicketForm;
  setNewTicketForm: React.Dispatch<React.SetStateAction<NewTicketForm>>;
  handleNewTicketSubmit: (e: React.FormEvent, files: File[]) => void;
}

// Reusable InfoCard
const InfoCard = ({
  icon,
  color,
  title,
  description,
  button,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
  button: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
    <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6">{description}</p>
    {button}
  </div>
);

const ContactTab: React.FC<ContactTabProps> = ({
  setActiveTab,
  newTicketForm,
  setNewTicketForm,
  handleNewTicketSubmit,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // API call
  const createTicketAPI = async (ticketData: NewTicketForm, files: File[]) => {
    try {
      const formData = new FormData();
      Object.entries(ticketData).forEach(([k, v]) => formData.append(k, v));
      files.forEach((file) => formData.append("attachments", file));

      const { data } = await api.post("/tickets/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        alert("Ticket created successfully!");
        return data.ticket;
      }
      alert("Failed: " + (data.message || "Unknown error"));
      return null;
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message ||
        "Unknown error";
      alert(`Error: ${msg}`);
      return null;
    }
  };

  const resetForm = () => {
    setNewTicketForm({ subject: "", classification: "low", description: "" });
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleModal = (open: boolean) => {
    resetForm();
    setIsModalOpen(open);
    setIsSubmitting(false);
    document.body.style.overflow = open ? "hidden" : "unset";
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketForm.subject.trim() || !newTicketForm.description.trim())
      return alert("Please fill in all required fields");

    setIsSubmitting(true);
    const ticket = await createTicketAPI(newTicketForm, selectedFiles);
    if (ticket) {
      toggleModal(false);
      handleNewTicketSubmit(e, selectedFiles);
    } else setIsSubmitting(false);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <InfoCard
          icon={<MessageSquare className="h-8 w-8 text-blue-600" />}
          color="bg-blue-100"
          title={t("support.liveChat.title")}
          description={t("support.liveChat.description")}
          button={
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full">
              {t("support.liveChat.button")}
            </button>
          }
        />
        <InfoCard
          icon={<MessageSquare className="h-8 w-8 text-blue-600" />}
          color="bg-blue-100"
          title="Tickets"
          description={t("support.liveChat.description")}
          button={
            <button
              onClick={() => toggleModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full"
            >
              Create Ticket
            </button>
          }
        />
        <InfoCard
          icon={<Phone className="h-8 w-8 text-green-600" />}
          color="bg-green-100"
          title={t("support.phone.title")}
          description={t("support.phone.description")}
          button={
            <a
              href="tel:+966123456789"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full block"
            >
              {t("support.phone.number")}
            </a>
          }
        />
        <InfoCard
          icon={<Mail className="h-8 w-8 text-amber-600" />}
          color="bg-amber-100"
          title={t("support.email.title")}
          description={t("support.email.description")}
          button={
            <a
              href="mailto:support@example.com"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors w-full block"
            >
              {t("support.email.button")}
            </a>
          }
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => toggleModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              disabled={isSubmitting}
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {t("support.newTicket.title")}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {[
                {
                  label: t("support.newTicket.subjectLabel") + " *",
                  type: "text",
                  value: newTicketForm.subject,
                  onChange: (v: string) => setNewTicketForm((p) => ({ ...p, subject: v })),
                  placeholder: t("support.newTicket.subjectPlaceholder"),
                },
              ].map(({ label, type, value, onChange, placeholder }, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                  <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              ))}

              {/* Classification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Classification *</label>
                <select
                  value={newTicketForm.classification}
                  onChange={(e) => setNewTicketForm((p) => ({ ...p, classification: e.target.value }))}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  {["low", "medium", "high"].map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("support.newTicket.descriptionLabel")} *
                </label>
                <textarea
                  rows={6}
                  value={newTicketForm.description}
                  onChange={(e) => setNewTicketForm((p) => ({ ...p, description: e.target.value }))}
                  required
                  disabled={isSubmitting}
                  placeholder={t("support.newTicket.descriptionPlaceholder")}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("support.newTicket.attachmentsLabel")}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">{t("support.newTicket.attachmentsText")}</p>
                  <p className="text-sm text-gray-500 mb-4">{t("support.newTicket.attachmentsInfo")}</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => e.target.files && setSelectedFiles(Array.from(e.target.files))}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {t("support.newTicket.attachmentsButton")}
                  </button>
                  {selectedFiles.length > 0 && (
                    <ul className="mt-4 text-sm text-gray-700 space-y-1">
                      {selectedFiles.map((f, i) => (
                        <li key={i}>📎 {f.name} ({Math.round(f.size / 1024)} KB)</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    t("support.newTicket.submitButton")
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 flex">
        <HelpCircle className="h-6 w-6 text-blue-500 mr-4" />
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("support.faqPrompt.title")}
          </h3>
          <p className="text-gray-600 mb-4">{t("support.faqPrompt.description")}</p>
          <button onClick={() => setActiveTab("faq")} className="text-blue-600 hover:text-blue-800 font-medium">
            {t("support.faqPrompt.button")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactTab;
