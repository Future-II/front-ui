import React, { useState, useMemo, useRef } from 'react';
import { Plus, User } from 'lucide-react';
import UploadBlock from '../components/UploadBlock';
import { addEquipmentReport } from '../api';
import LoginModal from '../components/EquipmentTaqeemLogin';

interface Client {
  client_name: string;
  telephone_number: string;
  email_address: string;
}

interface Valuer {
  valuer_name: string;
  contribution_percentage: number;
}

interface FormData {
  // Report Information
  report_title: string;
  valuation_purpose: string;
  value_premise: string;
  report_type: string;
  valuation_date: string;
  report_issuing_date: string;
  assumptions: string;
  special_assumptions: string;
  final_value: string;
  valuation_currency: string;

  // Client Data
  clients: Client[];

  // Other Users Report
  has_other_users: boolean;
  report_users: string[];

  // Valuer Data
  valuers: Valuer[];
}

// Success Toast Component (copied from EquipmentReport)
const SuccessToast: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
      Report saved successfully
      <button
        onClick={onClose}
        className="ml-3 text-sm underline hover:text-gray-200"
      >
        Close
      </button>
    </div>
  );
};

// Progress Bar Component (copied from EquipmentReport)
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="flex items-center mt-6">
      <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {/* Circling loader */}
      {progress < 100 && (
        <div className="ml-2 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      )}
    </div>
  );
};

const ReportsManagementSystem = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  
  // Progress bar and success notification states
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfs, setPdfFiles] = useState<File[] | []>([]);

  const requestRef = useRef<Promise<any> | null>(null);

  console.log("pdfFiles", pdfs)

  const [formData, setFormData] = useState<FormData>({
    // Report Information
    report_title: '',
    valuation_purpose: 'to set',
    value_premise: 'to set',
    report_type: 'detailed',
    valuation_date: '',
    report_issuing_date: '',
    assumptions: '',
    special_assumptions: '',
    final_value: '',
    valuation_currency: 'Saudi riyal',

    // Client Data
    clients: [{ client_name: '', telephone_number: '', email_address: '' }],

    // Other Users Report
    has_other_users: false,
    report_users: [],

    // Valuer Data
    valuers: [{ valuer_name: '', contribution_percentage: 100 }]
  });

  // Progress simulation function (copied from EquipmentReport)
  const simulateProgress = () => {
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= 85) {
        current = 85;
        clearInterval(interval);
      }
      setProgress(current);
    }, 100);
  };

  const handleSubmit = async () => {
    if (!excelFile || pdfs.length === 0) {
      alert("Please select both an Excel file and at least one PDF file.");
      return;
    }

    try {
      setIsLoading(true);
      simulateProgress(); // Start progress simulation

      // Send backend request
      requestRef.current = addEquipmentReport(formData, excelFile, pdfs);
      const response = await requestRef.current;
      console.log("Upload successful:", response);

      // Wait for animation to finish (align with fake progression)
      setTimeout(() => {
        setProgress(100);
        setShowSuccess(true);
        setIsLoading(false);
        setTimeout(() => setShowSuccess(false), 3000);
      }, 3500);

    } catch (error) {
      console.error("Error uploading files:", error);
      setIsLoading(false);
      setProgress(0);
      alert("An error occurred while uploading the files. Please try again.");
    }
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.report_title.trim()) {
      newErrors.reportTitle = 'Report title is required';
    }
    if (!formData.valuation_date) {
      newErrors.evaluationDate = 'Evaluation date is required';
    }
    if (!formData.valuation_date) {
      newErrors.valuation_date = 'Report release date is required';
    }
    if (!formData.report_issuing_date.trim()) {
      newErrors.report_issuing_date = 'Final Opinion on Value is required';
    }

    formData.clients.forEach((client) => {
      if (!client.client_name.trim()) {
        console.log("Enter Client Name")
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generic update function for form data
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Client management functions
  // --- Client management ---
  const addClient = () => {
    updateFormData({
      clients: [...formData.clients, { client_name: '', telephone_number: '', email_address: '' }]
    });
  };

  const deleteClient = (index: number) => {
    if (formData.clients.length > 1) {
      const newClients = formData.clients.filter((_, i) => i !== index);
      updateFormData({ clients: newClients });

      const newErrors = { ...errors };
      delete newErrors[`client_${index}_client_name`];
      delete newErrors[`client_${index}_telephone_number`];
      delete newErrors[`client_${index}_email_address`];
      setErrors(newErrors);
    }
  };

  const updateClient = (index: number, field: keyof typeof formData.clients[0], value: string) => {
    const newClients = formData.clients.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    );
    updateFormData({ clients: newClients });

    const errorKey = `client_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // --- Report user management ---
  // --- Report user management (fixed for string[] model) ---
  const addUser = () => {
    updateFormData({
      report_users: [...formData.report_users, '']
    });
  };

  const deleteUser = (index: number) => {
    // match the UI which disables delete when there's only 1 user
    if (formData.report_users.length > 1) {
      const newUsers = formData.report_users.filter((_, i) => i !== index);
      updateFormData({ report_users: newUsers });

      const newErrors = { ...errors };
      delete newErrors[`user_${index}_username`];
      setErrors(newErrors);
    }
  };

  const updateUser = (index: number, value: string) => {
    const newUsers = formData.report_users.map((u, i) => (i === index ? value : u));
    updateFormData({ report_users: newUsers });

    const errorKey = `user_${index}_username`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // --- Valuer management ---
  const addValuer = () => {
    updateFormData({
      valuers: [...formData.valuers, { valuer_name: '', contribution_percentage: 100 }]
    });
  };

  const deleteValuer = (index: number) => {
    if (formData.valuers.length > 1) {
      const newValuers = formData.valuers.filter((_, i) => i !== index);
      updateFormData({ valuers: newValuers });
    }
  };

  const updateValuer = (index: number, field: keyof typeof formData.valuers[0], value: string | number) => {
    const newValuers = formData.valuers.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    );
    updateFormData({ valuers: newValuers });
  };

  // Report data update function
  const updateReportData = (field: keyof FormData, value: string | boolean) => {
    updateFormData({ [field]: value });
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSaveAndContinue = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      console.log('Consolidated Form Data:', formData);
    } else {
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setExcelFile(file);
    }
  };

const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    setPdfFiles(Array.from(files)); // store as array of File
  }
};

  const handleSendReport = async () => {
    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setSubmitMessage('Report sent successfully!');
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Error sending report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      // Report Information
      report_title: '',
      valuation_purpose: 'to set',
      value_premise: 'to set',
      report_type: 'detailed',
      valuation_date: '',
      report_issuing_date: '',
      assumptions: '',
      special_assumptions: '',
      final_value: '',
      valuation_currency: 'Saudi riyal',

      // Client Data
      clients: [{ client_name: '', telephone_number: '', email_address: '' }],

      // Other Users Report
      has_other_users: false,
      report_users: [],

      // Valuer Data
      valuers: [{ valuer_name: '', contribution_percentage: 100 }]
    });

    setErrors({});
    setCurrentStep(1);
    setSubmitStatus('idle');
    setSubmitMessage('');
    setIsLoading(false);
    setProgress(0);
    setShowSuccess(false);
  };

  const StepIndicator = useMemo(() => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          1
        </div>
        <div className="text-sm text-center">
          <div className={currentStep >= 1 ? 'text-blue-500 font-medium' : 'text-gray-500'}>Report data</div>
        </div>

        <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>

        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          2
        </div>
        <div className="text-sm text-center">
          <div className={currentStep >= 2 ? 'text-blue-500 font-medium' : 'text-gray-500'}>Upload Excel report</div>
        </div>

        <div className={`w-16 h-0.5 ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>

        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          3
        </div>
        <div className="text-sm text-center">
          <div className={currentStep >= 3 ? 'text-blue-500 font-medium' : 'text-gray-500'}>Report sending result</div>
        </div>
      </div>
    </div>
  ), [currentStep]);

  const renderStep1 = useMemo(() => (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">New report</h2>

      <div className="bg-white rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-600 mb-4">Report information</h3>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.reportTitle ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.report_title}
              onChange={(e) => updateReportData('report_title', e.target.value)}
            />
            {errors.reportTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.reportTitle}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose of assessment<span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.valuation_purpose}
              onChange={(e) => updateReportData('valuation_purpose', e.target.value)}
            >
              <option></option>
              <option>Selling</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value hypothesis<span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.value_premise}
              onChange={(e) => updateReportData('value_premise', e.target.value)}
            >
              <option>Select</option>
              <option>Current Use</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            {[
              { value: 'detailed', label: 'Detailed report' },
              { value: 'summary', label: 'Report Summary' },
              { value: 'reviewNew', label: 'Review with new value' },
              { value: 'reviewWithout', label: 'Review without new value' }
            ].map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="reportType"
                    value={option.value}
                    checked={formData.report_type === option.value}
                    onChange={(e) => updateReportData('report_type', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 ${formData.report_type === option.value ? 'border-green-500' : 'border-gray-300'} mr-2`}>
                    {formData.report_type === option.value && (
                      <div className="w-2 h-2 bg-green-500 rounded-full m-0.5"></div>
                    )}
                  </div>
                </div>
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evaluation Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.evaluationDate ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.valuation_date}
              onChange={(e) => updateReportData('valuation_date', e.target.value)}
            />
            {errors.evaluationDate && (
              <p className="text-red-500 text-sm mt-1">{errors.evaluationDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report release date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.reportReleaseDate ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.report_issuing_date}
              onChange={(e) => updateReportData('report_issuing_date', e.target.value)}
            />
            {errors.reportReleaseDate && (
              <p className="text-red-500 text-sm mt-1">{errors.reportReleaseDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assumptions
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={1}
              value={formData.assumptions}
              onChange={(e) => updateReportData('assumptions', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special assumptions
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={1}
              value={formData.special_assumptions}
              onChange={(e) => updateReportData('special_assumptions', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Final Opinion on Value<span className="text-red-500">*</span>
            </label>
            <textarea
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.finalOpinionOnValue ? 'border-red-500' : 'border-gray-300'}`}
              rows={1}
              value={formData.final_value}
              onChange={(e) => updateReportData('final_value', e.target.value)}
            />
            {errors.final_value && (
              <p className="text-red-500 text-sm mt-1">{errors.final_value}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evaluation currency<span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.valuation_currency}
              onChange={(e) => updateReportData('valuation_currency', e.target.value)}
            >
              <option>Select</option>
              <option>Saudi Riyal</option>
            </select>
          </div>
        </div>

        <UploadBlock
          label="Upload your asset data file"
          accept=".pdf"
          inputId="pdf-upload"
          type="pdf"
          onFileChange={handlePdfUpload}
          disabled={isLoading}
        />

        {pdfs.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            Selected PDF File: {pdfs[0].name}
          </p>
        )}
      </div>

      {/* Customer Data Section */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-600 mb-4">Customer data</h3>

        {formData.clients.map((client, index) => (
          <div key={index} className="grid grid-cols-4 gap-6 mb-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`client_${index}_client_name`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={client.client_name}
                onChange={(e) => updateClient(index, 'client_name', e.target.value)}
              />
              {errors[`client_${index}_client_name`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`client_${index}_client_name`]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`client_${index}_telephone_number`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={client.telephone_number}
                onChange={(e) => updateClient(index, 'telephone_number', e.target.value)}
              />
              {errors[`client_${index}_telephone_number`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`client_${index}_telephone_number`]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`client_${index}_email_address`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={client.email_address}
                onChange={(e) => updateClient(index, 'email_address', e.target.value)}
              />
              {errors[`client_${index}_email_address`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`client_${index}_email_address`]}</p>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => deleteClient(index)}
                disabled={formData.clients.length === 1}
                className={`px-4 py-3 rounded-lg border ${formData.clients.length === 1
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-red-500 text-red-500 hover:bg-red-50'
                  }`}
              >
                Delete a client
              </button>
            </div>
          </div>
        ))}

        <div className="mb-6">
          <button
            type="button"
            onClick={addClient}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={16} />
            Add a client
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="has_other_users"
            checked={formData.has_other_users}
            onChange={(e) => updateReportData('has_other_users', e.target.checked)}
            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <label htmlFor="has_other_users" className="text-sm text-gray-700">
            Other users report
          </label>
        </div>
        {formData.has_other_users && (
          <div className="mt-4">
            <h4 className="text-md font-medium text-blue-600 mb-4">
              Other users of the report
            </h4>
            {formData.report_users.map((user, index) => (
              <div key={index} className="grid grid-cols-2 gap-6 mb-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`user_${index}_username`]
                      ? 'border-red-500'
                      : 'border-gray-300'
                      }`}
                    value={user}
                    onChange={(e) => updateUser(index, e.target.value)} // pass new value directly
                  />
                  {errors[`user_${index}_username`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`user_${index}_username`]}
                    </p>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => deleteUser(index)}
                    disabled={formData.report_users.length === 1}
                    className={`px-4 py-3 rounded-lg border ${formData.report_users.length === 1
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-red-500 text-red-500 hover:bg-red-50'
                      }`}
                  >
                    Delete user
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addUser}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add a user
            </button>
          </div>
        )}
      </div>

      {/* Resident Data Section */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-600 mb-4">Resident data</h3>

        {formData.valuers.map((valuer, index) => (
          <div key={index} className="grid grid-cols-3 gap-6 mb-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valuer Name <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={valuer.valuer_name}
                onChange={(e) => updateValuer(index, 'valuer_name', e.target.value)}
              >
                <option>Select</option>
                <option>4210000352</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contribution Percentage <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={valuer.contribution_percentage}
                onChange={(e) => updateValuer(index, 'contribution_percentage', e.target.value)}
              >
                <option value="100">100%</option>
                <option value="75">75%</option>
                <option value="50">50%</option>
                <option value="25">25%</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={() => deleteValuer(index)}
                disabled={formData.valuers.length === 1}
                className={`px-4 py-3 rounded-lg border ${formData.valuers.length === 1
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-red-500 text-red-500 hover:bg-red-50'
                  }`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        <div>
          <button
            type="button"
            onClick={addValuer}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add a resident
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg"
        >
          حفظ واعادة
        </button>
        <button
          type="button"
          onClick={handleSaveAndContinue}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Save and continue
        </button>
      </div>
    </div>
  ), [formData, errors]);

  const renderStep2 = () => (
    <div className="max-w-4xl mx-auto p-6">
      <UploadBlock
        label="Upload your asset data file"
        accept=".xlsx,.xls"
        inputId="excel-upload"
        type="excel"
        onFileChange={handleExcelUpload}
        disabled={isLoading}
      />

      {excelFile && (
        <p className="mt-2 text-sm text-gray-600">Selected Excel File: {excelFile.name}</p>
      )}

      {/* Progress Bar - shown when loading */}
      {isLoading && <ProgressBar progress={progress} />}

      <div className="flex justify-between items-center mt-8">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          disabled={isLoading}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );

  const Header = useMemo(() => (
    <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-blue-600">Reports Management System</h1>
      </div>
      <div className="flex items-center gap-4">
        <button type="button" className="text-gray-600">AR</button>
        <button type="button" className="bg-blue-500 text-white px-2 py-1 rounded text-sm">EN</button>
        <div className="flex items-center gap-2">
          <User size={20} className="text-gray-600" />
          <span className="text-sm text-gray-600">Reports Company</span>
        </div>
      </div>
    </div>
  ), []);

  if (!loggedIn) {
      return <LoginModal isOpen={true} onClose={() => {}} setIsLoggedIn={setLoggedIn} />;
    }
  return (
    <div className="min-h-screen bg-gray-50">
      {Header}

      <div className="p-6">
        {StepIndicator}

        {currentStep === 1 && renderStep1}
        {currentStep === 2 && renderStep2()}
      </div>

      {/* Success Toast */}
      {showSuccess && <SuccessToast onClose={() => setShowSuccess(false)} />}

      {/* Debug: Show current form data in console */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => console.log('Current Consolidated Form Data:', formData)}
          className="bg-gray-800 text-white px-3 py-2 rounded text-xs hover:bg-gray-700"
        >
          Log Form Data
        </button>
      </div>
    </div>
  );
};

export default ReportsManagementSystem;