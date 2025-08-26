import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { api } from "../../../utils/api";

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form data state - ensure all fields are completely empty
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companyType: "",
    licenseNumber: "",
    city: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    newsletter: false
  });

  // Clear form when component mounts
  useEffect(() => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      companyType: "",
      licenseNumber: "",
      city: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
      newsletter: false
    });
    setError(null);
    setSuccessMessage(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      if (!formData.termsAccepted) {
        throw new Error("You must accept the terms and conditions");
      }

      // Register user
      const { data } = await api.post("/users/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        companyType: formData.companyType,
        licenseNumber: formData.licenseNumber,
        city: formData.city,
        password: formData.password,
        newsletter: formData.newsletter,
        termsAccepted: formData.termsAccepted
      });

      if (data.success) {
        // DO NOT store the token - just show success message
        setSuccessMessage("Account created successfully! Redirecting to login...");
        
        // Reset form completely
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          companyName: "",
          companyType: "",
          licenseNumber: "",
          city: "",
          password: "",
          confirmPassword: "",
          termsAccepted: false,
          newsletter: false
        });

        // Switch to login tab after 2 seconds
        setTimeout(() => {
          if (onSwitchToLogin) {
            onSwitchToLogin();
          }
        }, 2000);
      }

    } catch (error: any) {
      setError(error?.response?.data?.message || error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Create a new account
      </h2>
      <p className="text-gray-600 mb-6">
        Join us and start managing your reports
      </p>

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

      {/* Personal Information Section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <User className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            Personal information
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First name
            </label>
            <input 
              type="text" 
              id="firstName" 
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last name
            </label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone number
          </label>
          <div className="relative">
            <input 
              type="tel" 
              id="phone" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="05xxxxxxxx"
              required
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Company Information Section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="h-5 w-5 bg-green-100 rounded mr-2 flex items-center justify-center">
            <div className="h-3 w-3 bg-green-600 rounded"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Company information
          </h3>
        </div>

        <div className="mb-4">
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
            Company name
          </label>
          <input 
            type="text" 
            id="companyName" 
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Enter company name"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 mb-2">
              Company type
            </label>
            <select 
              id="companyType"
              name="companyType"
              value={formData.companyType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Choose company type</option>
              <option value="real-estate">Real estate company</option>
              <option value="construction">Construction company</option>
              <option value="property-management">Property management</option>
            </select>
          </div>
          <div>
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
              License number
            </label>
            <input 
              type="text" 
              id="licenseNumber" 
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              placeholder="License number"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <select 
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Choose a city</option>
            <option value="riyadh">Riyadh</option>
            <option value="jeddah">Jeddah</option>
            <option value="dammam">Dammam</option>
            <option value="mecca">Mecca</option>
            <option value="medina">Medina</option>
          </select>
        </div>
      </div>

      {/* Account Information Section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="h-5 w-5 bg-purple-100 rounded mr-2 flex items-center justify-center">
            <Lock className="h-3 w-3 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Account information
          </h3>
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              minLength={6}
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm password
          </label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-enter your password"
              required
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Terms and Newsletter */}
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
          <label htmlFor="termsAccepted" className="ml-2 text-sm text-gray-700">
            I agree to{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">Terms & Conditions</a> and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
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
          <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
            I want to receive the newsletter and updates
          </label>
        </div>
      </div>

      {/* Submit */}
      <button 
        type="submit"
        disabled={loading || successMessage !== null}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
      >
        {loading ? "Creating account..." : successMessage ? "Account Created!" : "Create account"}
      </button>
    </form>
  );
};

export default RegisterForm;