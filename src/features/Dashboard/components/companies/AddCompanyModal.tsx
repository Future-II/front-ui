import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { createCompany, addUserToCompany } from "./api";

interface AddCompanyModalProps {
  open: boolean;
  onClose: () => void;
  onDataChange?: () => void;
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ open, onClose, onDataChange }) => {
  const { t } = useTranslation();

  const [step, setStep] = useState(1);
  const [createdCompanyId, setCreatedCompanyId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    type: "company", // Fixed to company
    role: "manager",
    // Company fields
    companyName: "",
    companyType: "",
    licenseNumber: "",
    city: "",
    package: "",
    termsAccepted: false,
    newsletter: false,
  });

  useEffect(() => {
    if (open) {
      setStep(1);
      setCreatedCompanyId(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        type: "company", // Fixed to company
        role: "manager",
        // Company fields
        companyName: "",
        companyType: "",
        licenseNumber: "",
        city: "",
        package: "",
        termsAccepted: false,
        newsletter: false,
      });
      setError(null);
      setSuccessMessage(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [open]);

  if (!open) return null;

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
    setLoading(true);

    try {
      if (step === 1) {
        // Validate company fields
        if (!formData.companyName || !formData.companyType || !formData.licenseNumber || !formData.city) {
          throw new Error(t("common.fillRequiredFields"));
        }

        // Create company
        const companyResponse = await createCompany({
          companyName: formData.companyName,
          companyType: formData.companyType,
          licenseNumber: formData.licenseNumber,
          city: formData.city,
        });

        setCreatedCompanyId(companyResponse.company._id);
        setStep(2);
      } else if (step === 2) {
        // Validate user fields
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
          throw new Error(t("common.fillRequiredFields"));
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }
        if (!formData.termsAccepted) {
          throw new Error("You must accept the terms and conditions");
        }

        // Add user to company
        await addUserToCompany(createdCompanyId!, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          type: formData.type,
          role: formData.role,
          termsAccepted: formData.termsAccepted,
          newsletter: formData.newsletter,
        });

        setSuccessMessage(t("companies.companyAddedSuccessfully"));
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message || error.message || t("companies.errorAddingCompany")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg sm:max-w-2xl lg:max-w-4xl p-4 sm:p-6 lg:p-8 text-right">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-bold">
            {step === 1 ? t('modals.addNewCompany') : t('modals.addManager')}
          </h2>
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
            {step === 1 && (
              <>
                {/* Company Information */}
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="h-5 w-5 bg-green-100 rounded mr-2 flex items-center justify-center">
                      <User className="h-3 w-3 text-green-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                      {t("logintranslator.register.company.title")}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                        {t("logintranslator.register.company.name")}
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder={t("logintranslator.register.company.placeholder")}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 mb-2">
                        {t("logintranslator.register.company.type.title")}
                      </label>
                      <select
                        id="companyType"
                        name="companyType"
                        value={formData.companyType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="">{t("logintranslator.register.company.type.a")}</option>
                        <option value="real-estate">{t("logintranslator.register.company.type.b")}</option>
                        <option value="construction">{t("logintranslator.register.company.type.c")}</option>
                        <option value="property-management">{t("logintranslator.register.company.type.d")}</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        {t("logintranslator.register.company.license")}
                      </label>
                      <input
                        type="text"
                        id="licenseNumber"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        placeholder={t("logintranslator.register.company.licplaceholder")}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        {t("logintranslator.register.company.city.title")}
                      </label>
                      <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="">{t("logintranslator.register.company.city.a")}</option>
                        <option value="riyadh">{t("logintranslator.register.company.city.b")}</option>
                        <option value="jeddah">{t("logintranslator.register.company.city.c")}</option>
                        <option value="dammam">{t("logintranslator.register.company.city.d")}</option>
                        <option value="mecca">{t("logintranslator.register.company.city.e")}</option>
                        <option value="medina">{t("logintranslator.register.company.city.f")}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
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
                        required
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
              </>
            )}

          {step === 2 && (
            <>
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
            </>
          )}
          </div>

          {/* Submit */}
          <div className="flex justify-between gap-2 mt-6 border-t pt-4">
            <div>
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
                >
                  Back
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={loading || successMessage !== null}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              >
                {loading
                  ? step === 1 ? "Creating Company..." : "Creating User..."
                  : successMessage
                  ? "Created!"
                  : step === 1 ? "Next: Add Manager" : t("modals.addNewCompany")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyModal;
