import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import ReportForm from '../components/ReportForm';
import LoginModal from '../components/EquipmentTaqeemLogin';
import SuccessToast from '../components/ReportsManagement/SuccessToast';
import Step2FileUpload from '../components/ReportsManagement/Step2FileUpload';
import ErrorsModal from '../components/ReportsManagement/ErrorsModal';

// Utils
import { handleExcelFile, downloadCorrectedExcel } from '../utils/excelProcessing';
import { 
  getExcelErrors, 
  isExcelValid, 
  validateStep1,
  getReportsManagementFinalValueSum,
  validateFinalValueMatch
} from '../utils/reportManagementValidation';

// Types
import { FormData, ReportsManagementExcelError, Client } from '../types';

// API
import { withFormUploadHalfReportToDB } from '../api';

const ReportsManagementSystem = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step1Validated, setStep1Validated] = useState(false);
  const [step2Validated, setStep2Validated] = useState(false);

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfs, setPdfFiles] = useState<File[] | []>([]);
  const [excelDataSheets, setExcelDataSheets] = useState<any[][][]>([]);
  const [excelError, setExcelError] = useState<string>("");
  const [excelErrors, setExcelErrors] = useState<ReportsManagementExcelError[]>([]);
  const [showValidationSuccess, setShowValidationSuccess] = useState(false);
  const [showTables, setShowTables] = useState(false);
  const [errorsModalOpen, setErrorsModalOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    purpose_id: 'to set',
    value_premise_id: 'to set',
    report_type: 'detailed',
    valued_at: '',
    submitted_at: '',
    assumptions: '',
    special_assumptions: '',
    value: '',
    client_name: '',
    owner_name: '',
    telephone: '',
    email: '',
    valuation_currency: 'Saudi riyal',
    clients: [{ client_name: '', telephone_number: '', email_address: '' }],
    has_other_users: false,
    report_users: [],
  });

  // Event Handlers
  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setExcelFile(files[0]);
      setStep2Validated(false);
      
      handleExcelFile(
        files[0],
        (sheetsData) => {
          setExcelDataSheets(sheetsData);
          setExcelError("");
          
          // Auto-validate value match when new file is uploaded
          if (formData.value) {
            const validation = validateFinalValueMatch(sheetsData, formData.value);
            if (!validation.isValid) {
              console.log('Value mismatch detected:', validation.error);
            }
          }
        },
        (error) => setExcelError(error)
      );
    }
  };

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setPdfFiles(Array.from(files));
      setStep2Validated(false);
    }
  };

  const handleValidateStep1 = () => {
    const validationErrors = validateStep1(formData);
    console.log("Validation Errors: ", validationErrors);
    
    // Also check value match if we have Excel data
    if (excelDataSheets.length > 0 && formData.value) {
      const valueMatch = validateFinalValueMatch(excelDataSheets, formData.value);
      if (!valueMatch.isValid) {
        validationErrors.value = `Form value (${valueMatch.formValue.toLocaleString()}) does not match Excel total (${valueMatch.excelSum.toLocaleString()})`;
      }
    }
    
    if (Object.keys(validationErrors).length === 0) {
      setStep1Validated(true);
      setErrors({});
      console.log('Step 1 validated successfully:', formData);
    } else {
      setErrors(validationErrors);
      setStep1Validated(false);
      const firstErrorElement = document.querySelector('.border-red-400');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleContinueToStep2 = () => {
    setCurrentStep(2);
  };

  const handleValidateStep2 = () => {
    if (!excelFile || !pdfs.length) {
      alert('Please upload both Excel and PDF files');
      return;
    }

    const exErrors = getExcelErrors(excelDataSheets, formData.value);
    setExcelErrors(exErrors);

    // Additional validation for value match
    if (formData.value) {
      const valueMatch = validateFinalValueMatch(excelDataSheets, formData.value);
      if (!valueMatch.isValid) {
        // Add value mismatch error if not already present
        const hasValueMismatchError = exErrors.some(error => 
          error.message.includes('إجمالي قيمة الأصول') || error.message.includes('Excel total')
        );
        if (!hasValueMismatchError) {
          exErrors.push({
            sheetIdx: 0,
            row: 0,
            col: 0,
            message: `إجمالي قيمة الأصول (${valueMatch.excelSum.toLocaleString()}) لا يساوي القيمة النهائية في النموذج (${valueMatch.formValue.toLocaleString()})`
          });
        }
      }
    }

    setExcelErrors(exErrors);

    if (exErrors.length > 0) {
      setErrorsModalOpen(true);
      setStep2Validated(false);
      setShowValidationSuccess(false);
      return;
    }

    setStep2Validated(true);
    setShowValidationSuccess(true);
  };

  const handleSubmitReport = async () => {
    if (!excelFile || !pdfs.length || excelErrors.length > 0) {
      alert('Please ensure all files are uploaded and validated');
      return;
    }

    // Final validation check before submission
    const finalValidation = validateFinalValueMatch(excelDataSheets, formData.value);
    if (!finalValidation.isValid) {
      alert(`Final validation failed: ${finalValidation.error}`);
      return;
    }

    setIsLoading(true);
    try {
      const result = await withFormUploadHalfReportToDB(formData, excelFile, pdfs);
      
      console.log('Report submitted successfully:', result);
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessContinue = () => {
    navigate('/equipment/viewReports');
  };

  const handleDownloadCorrectedExcel = () => {
    downloadCorrectedExcel(excelDataSheets, excelErrors, isExcelValidValue);
  };

  // Derived values
  const finalValueSum = useMemo(() => getReportsManagementFinalValueSum(excelDataSheets), [excelDataSheets]);
  const isExcelValidValue = isExcelValid(excelDataSheets, formData.value);

  const hasOnlyFinalValueMismatch = useMemo(() => {
    if (excelErrors.length === 0) return false;
    return excelErrors.every(error =>
      error.sheetIdx === 0 && error.row === 0 && error.col === 0
    );
  }, [excelErrors]);

  // Update form data with value match validation
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setStep1Validated(false);
    
    // If value field is updated, check match with Excel data
    if (updates.value !== undefined && excelDataSheets.length > 0) {
      const valueMatch = validateFinalValueMatch(excelDataSheets, updates.value);
      if (!valueMatch.isValid) {
        console.log('Value updated - mismatch detected:', valueMatch.error);
      }
    }
  };

  // ... rest of the form management functions remain the same
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

  // Remove automatic validation
  useEffect(() => {
    if (!excelDataSheets || excelDataSheets.length === 0) {
      setExcelErrors([]);
      setShowValidationSuccess(false);
    }
  }, [excelDataSheets]);

  const renderStep1 = (
    <ReportForm
      formData={formData}
      errors={errors}
      step1Validated={step1Validated}
      onFormDataChange={updateFormData}
      onFieldChange={updateField}
      onClientAdd={addClient}
      onClientDelete={deleteClient}
      onClientUpdate={updateClient}
      onUserAdd={addUser}
      onUserDelete={deleteUser}
      onUserUpdate={updateUser}
      onValidateData={handleValidateStep1}
      onContinue={handleContinueToStep2}
    />
  );

  if (!loggedIn) {
    return <LoginModal isOpen={true} onClose={() => { /* do nothing */ }} setIsLoggedIn={setLoggedIn} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {currentStep === 1 && renderStep1}
        {currentStep === 2 && (
          <Step2FileUpload
            excelFile={excelFile}
            pdfs={pdfs}
            excelDataSheets={excelDataSheets}
            excelError={excelError}
            excelErrors={excelErrors}
            showTables={showTables}
            showValidationSuccess={showValidationSuccess}
            step2Validated={step2Validated}
            finalValueSum={finalValueSum}
            isExcelValid={isExcelValidValue}
            hasOnlyFinalValueMismatch={hasOnlyFinalValueMismatch}
            isLoading={isLoading}
            onExcelUpload={handleExcelUpload}
            onPdfUpload={handlePdfUpload}
            onShowTablesToggle={() => setShowTables(!showTables)}
            onErrorsModalOpen={() => setErrorsModalOpen(true)}
            onDownloadCorrectedExcel={handleDownloadCorrectedExcel}
            onValidateStep2={handleValidateStep2}
            onSubmitReport={handleSubmitReport}
            onBack={() => setCurrentStep(1)}
          />
        )}
      </div>

      {showSuccess && (
        <SuccessToast 
          onClose={() => setShowSuccess(false)} 
          onContinue={handleSuccessContinue}
        />
      )}

      <ErrorsModal
        isOpen={errorsModalOpen}
        onClose={() => setErrorsModalOpen(false)}
        errors={excelErrors}
        onDownloadCorrected={handleDownloadCorrectedExcel}
        excelFile={excelFile}
        isExcelValid={isExcelValidValue}
        hasOnlyFinalValueMismatch={hasOnlyFinalValueMismatch}
      />

      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => {
            const valueMatch = validateFinalValueMatch(excelDataSheets, formData.value);
            console.log('Current Consolidated Form Data:', formData);
            console.log('Value Match Validation:', valueMatch);
            console.log('Excel Sheets Data:', excelDataSheets);
          }}
          className="bg-gray-800 text-white px-3 py-2 rounded text-xs hover:bg-gray-700"
        >
          Log Form Data
        </button>
      </div>
    </div>
  );
};

export default ReportsManagementSystem;