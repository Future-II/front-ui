import React, { useState, useMemo, useRef } from 'react';
import UploadBlock from '../components/UploadBlock';
import ReportForm from '../components/ReportForm';

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
  clients: Client[];
  has_other_users: boolean;
  report_users: string[];
  valuers: Valuer[];
}

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

// Validation functions
const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) return 'Phone number is required';
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
  return null;
};

const validateClientName = (name: string): string | null => {
  if (!name.trim()) return 'Client name is required';
  if (name.trim().length < 9) return 'Client name must be at least 9 characters';
  return null;
};

const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value.trim()) return `${fieldName} is required`;
  return null;
};

const validateDate = (date: string, fieldName: string): string | null => {
  if (!date) return `${fieldName} is required`;
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate > today) return `${fieldName} must be today or before`;
  return null;
};

const ReportsManagementSystem = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfs, setPdfFiles] = useState<File[] | []>([]);

  const requestRef = useRef<Promise<any> | null>(null);

  const [formData, setFormData] = useState<FormData>({
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
    clients: [{ client_name: '', telephone_number: '', email_address: '' }],
    has_other_users: false,
    report_users: [],
    valuers: [{ valuer_name: '', contribution_percentage: 100 }]
  });

  const validateStep1 = (formData: FormData): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};

    // Report Information validations
    if (!formData.report_title.trim()) {
      errors.report_title = 'Report title is required';
    }
    
    if (!formData.valuation_purpose.trim() || formData.valuation_purpose === 'to set') {
      errors.valuation_purpose = 'Purpose of assessment is required';
    }
    
    if (!formData.value_premise.trim() || formData.value_premise === 'to set') {
      errors.value_premise = 'Value hypothesis is required';
    }
    
    if (!formData.final_value.trim()) {
      errors.final_value = 'Final opinion on value is required';
    }

    // Date validations
    const dateErrors = validateDate(formData.valuation_date, 'Evaluation date');
    if (dateErrors) errors.valuation_date = dateErrors;

    const releaseDateErrors = validateDate(formData.report_issuing_date, 'Report release date');
    if (releaseDateErrors) errors.report_issuing_date = releaseDateErrors;

    // Validate report dates order
    if (formData.valuation_date && formData.report_issuing_date && !errors.valuation_date && !errors.report_issuing_date) {
      const evalDate = new Date(formData.valuation_date);
      const relDate = new Date(formData.report_issuing_date);
      if (relDate < evalDate) {
        errors.report_issuing_date = 'Report release date must be on or after evaluation date';
      }
    }

    // Client validations
    formData.clients.forEach((client, index) => {
      const nameError = validateClientName(client.client_name);
      if (nameError) {
        errors[`client_${index}_client_name`] = nameError;
      }

      const phoneError = validatePhone(client.telephone_number);
      if (phoneError) {
        errors[`client_${index}_telephone_number`] = phoneError;
      }

      const emailError = validateEmail(client.email_address);
      if (emailError) {
        errors[`client_${index}_email_address`] = emailError;
      }
    });

    // Valuer validations
    formData.valuers.forEach((valuer, index) => {
      if (!valuer.valuer_name.trim()) {
        errors[`valuer_${index}_valuer_name`] = 'Valuer name is required';
      }
    });

    // Other users validations
    if (formData.has_other_users) {
      formData.report_users.forEach((user, index) => {
        if (!user.trim()) {
          errors[`user_${index}_username`] = 'Report username is required';
        }
      });
    }

    return errors;
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

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

  const updateClient = (index: number, field: keyof Client, value: string) => {
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

  const addUser = () => {
    updateFormData({
      report_users: [...formData.report_users, '']
    });
  };

  const deleteUser = (index: number) => {
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

  const addValuer = () => {
    updateFormData({
      valuers: [...formData.valuers, { valuer_name: '', contribution_percentage: 100 }]
    });
  };

  const deleteValuer = (index: number) => {
    if (formData.valuers.length > 1) {
      const newValuers = formData.valuers.filter((_, i) => i !== index);
      updateFormData({ valuers: newValuers });

      const newErrors = { ...errors };
      delete newErrors[`valuer_${index}_valuer_name`];
      setErrors(newErrors);
    }
  };

  const updateValuer = (index: number, field: keyof Valuer, value: string | number) => {
    const newValuers = formData.valuers.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    );
    updateFormData({ valuers: newValuers });

    const errorKey = `valuer_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const updateField = (field: keyof FormData, value: any) => {
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
    const validationErrors = validateStep1(formData);
    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep(2);
      console.log('Consolidated Form Data:', formData);
    } else {
      setErrors(validationErrors);
      const firstErrorElement = document.querySelector('.border-red-400');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setExcelFile(file);
    }
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
    <ReportForm 
      formData={formData}
      errors={errors}
      onFormDataChange={updateFormData}
      onFieldChange={updateField}
      onClientAdd={addClient}
      onClientDelete={deleteClient}
      onClientUpdate={updateClient}
      onUserAdd={addUser}
      onUserDelete={deleteUser}
      onUserUpdate={updateUser}
      onValuerAdd={addValuer}
      onValuerDelete={deleteValuer}
      onValuerUpdate={updateValuer}
      onSaveAndContinue={handleSaveAndContinue}
    />
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
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {StepIndicator}

        {currentStep === 1 && renderStep1}
        {currentStep === 2 && renderStep2()}
      </div>

      {showSuccess && <SuccessToast onClose={() => setShowSuccess(false)} />}

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