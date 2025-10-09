import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getCompanies, addUserToCompany } from "./api";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  companyId?: string;
  onDataChange?: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onClose,
  companyId,
  onDataChange,
}) => {
  // Using the useTranslation hook to get the 't' function
  // Assuming 'dashboard' is your namespace; adjust if different.
  const { t } = useTranslation();

  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(companyId || "");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    type: "individual", // Fixed to individual
    role: "",
    termsAccepted: false,
    newsletter: false,
  });

  useEffect(() => {
    if (open) {
      fetchCompanies();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        type: "individual", // Fixed to individual
        role: "",
        termsAccepted: false,
        newsletter: false,
      });
      setError(null);
      setSuccessMessage(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [open]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await getCompanies();
      if (response.success) {
        setCompanies(response.companies);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (
      !selectedCompany ||
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim() ||
      !formData.role
    ) {
      setError(t("common.fillAllFields") || "Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        type: "company",
        role: formData.role,
        termsAccepted: true,
      };

      const response = await addUserToCompany(selectedCompany, userData);
        if (response.success) {
          setSuccessMessage(t("modals.userAddedSuccessfully") || "User added successfully");
          if (onDataChange) {
            onDataChange();
          }
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          setError(response.message || "Failed to add user");
        }
    } catch (error: any) {
      console.error("Error adding user:", error);
      setError(error?.response?.data?.message || error.message || "An error occurred while adding the user");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl lg:max-w-2xl p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-bold text-right">{t('modals.addNewUser')}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-full px-4 sm:px-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          <div className="max-h-96 overflow-y-auto">
            {/* Company Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("common.company")}
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              disabled={loading}
              required
            >
              <option value="">
                {loading ? t("common.loading") : t("modals.selectCompany")}
              </option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Personal Information */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {t("logintranslator.register.personal.title")}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("logintranslator.register.personal.ist")}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder={t("logintranslator.register.personal.istplace")}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("logintranslator.register.personal.last")}
                </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder={t("logintranslator.register.personal.lastplace")}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("logintranslator.register.personal.email")}
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t("logintranslator.register.personal.emailplace")}
                  required
                  className="w-full pl-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("logintranslator.register.personal.phone")}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t("logintranslator.register.personal.phoneplace")}
                  required
                  className="w-full pl-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="h-5 w-5 bg-purple-100 rounded mr-2 flex items-center justify-center">
                <Lock className="h-3 w-3 text-purple-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {t("logintranslator.register.account.title")}
              </h3>
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("logintranslator.register.account.pass")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t("logintranslator.register.account.passplace")}
                  required
                  minLength={6}
                  className="w-full pl-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("logintranslator.register.account.cpass")}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder={t("logintranslator.register.account.cpassplace")}
                  required
                  className="w-full pl-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="h-5 w-5 bg-orange-100 rounded mr-2 flex items-center justify-center">
                <User className="h-3 w-3 text-orange-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {t("common.role")}
              </h3>
            </div>

            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("common.role")}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Role</option>
                <option value="manager">Manager</option>
                <option value="valuater">Valuater</option>
                <option value="data entry">Data Entry</option>
                <option value="inspector">Inspector</option>
              </select>
            </div>
          </div>

          {/* Terms & Newsletter */}
          <div className="mb-4">
            <div className="flex items-start mb-3">
              <input
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              />
              <label
                htmlFor="termsAccepted"
                className="ml-2 text-xs sm:text-sm text-gray-700"
              >
                I agree to{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Privacy Policy
                </a>
              </label>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              />
              <label
                htmlFor="newsletter"
                className="ml-2 text-xs sm:text-sm text-gray-700"
              >
                {t("logintranslator.register.account.receive")}
              </label>
            </div>
          </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 mt-6 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={
                submitting ||
                !selectedCompany ||
                !formData.firstName.trim() ||
                !formData.email.trim() ||
                !formData.password.trim() ||
                !formData.role
              }
              className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              {submitting
                ? t("common.loading") || "Loading..."
                : t("modals.addNewUser")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
