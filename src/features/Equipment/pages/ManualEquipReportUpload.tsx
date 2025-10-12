import React, { useState, useMemo, useEffect } from 'react';
import UploadBlock from '../components/UploadBlock';
import ReportForm from '../components/ReportForm';
import * as XLSX from "xlsx-js-style";
import LoginModal from '../components/EquipmentTaqeemLogin';
import { withFormUploadHalfReportToDB } from '../api';
import { useNavigate } from 'react-router-dom';

interface Client {
  client_name: string;
  telephone_number: string;
  email_address: string;
}

interface FormData {
  title: string;
  purpose_id: string;
  value_premise_id: string;
  report_type: string;
  valued_at: string;
  submitted_at: string;
  assumptions: string;
  special_assumptions: string;
  value: string;
  client_name: string;
  owner_name: string;
  telephone: string;
  email: string;
  valuation_currency: string;
  clients: Client[];
  has_other_users: boolean;
  report_users: string[];
}

const SuccessToast: React.FC<{ onClose: () => void; onContinue: () => void }> = ({ onClose, onContinue }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
          <p className="text-gray-600 mb-6">Report has been saved successfully</p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onContinue}
              className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) return 'Phone number is required';
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
  if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
  return null;
};

const validateDate = (date: string, fieldName: string): string | null => {
  if (!date) return `${fieldName} is required`;

  const selectedDate = new Date(date);
  const today = new Date();
  
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (selectedDate > today) return `${fieldName} must be today or before`;
  return null;
};

const validateDateRelationship = (valuedAt: string, submittedAt: string): string | null => {
  if (!valuedAt || !submittedAt) return null;
  
  const valuedDate = new Date(valuedAt);
  const submittedDate = new Date(submittedAt);
  
  valuedDate.setHours(0, 0, 0, 0);
  submittedDate.setHours(0, 0, 0, 0);
  
  if (submittedDate < valuedDate) {
    return 'Submission date must be the same date or after valuation date';
  }
  
  return null;
};

// Excel Validation Functions
const allowedPurposeIds = [1, 2, 5, 6, 8, 9, 10, 12, 14];
const allowedValuePremiseIds = [1, 2, 3, 4, 5];

function rowLength(row: any[]) {
  if (!row) return 0;
  return row.length;
}

function validateExcelDate(dateVal: any): boolean {
  let day, month, year;
  if (dateVal instanceof Date) {
    day = dateVal.getDate();
    month = dateVal.getMonth() + 1;
    year = dateVal.getFullYear();
  } else if (typeof dateVal === 'string') {
    const parts = dateVal.split('/');
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    year = parseInt(parts[2], 10);
  } else if (typeof dateVal === 'number') {
    const date = new Date((dateVal - 25569) * 86400 * 1000);
    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
  } else {
    return false;
  }
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  return true;
}

function formatCellValue(val: any, headerName: string): string {
  if (headerName === "valued_at" || headerName === "submitted_at" || headerName === "inspection_date") {
    if (val instanceof Date) {
      return val.toLocaleDateString('en-GB');
    } else if (typeof val === 'number') {
      const date = new Date((val - 25569) * 86400 * 1000);
      return date.toLocaleDateString('en-GB');
    } else if (typeof val === 'string') {
      return val;
    }
  }
  return String(val);
}

interface EmptyFieldInfo {
  sheetIndex: number;
  rowIndex: number;
  colIndex: number;
  columnName?: string;
}

const hasEmptyFields = (sheets: any[][][]): { hasEmpty: boolean; emptyFields: EmptyFieldInfo[] } => {
  const emptyFields: EmptyFieldInfo[] = [];

  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;

    const maxCols = Math.max(...sheet.map(row => rowLength(row)));

    for (let i = 1; i < sheet.length; i++) {
      const row = sheet[i];
      const rowLen = rowLength(row);

      for (let j = 0; j < maxCols; j++) {
        const value = j < rowLen ? row[j] : undefined;

        if (value === undefined || value === "") {
          emptyFields.push({
            sheetIndex: sheetIdx + 1,
            rowIndex: i + 1,
            colIndex: j + 1,
            columnName: sheet[0][j] || `Column ${j + 1}`,
          });
        }
      }
    }
  }

  return {
    hasEmpty: emptyFields.length > 0,
    emptyFields,
  };
};

const hasFractionInFinalValue = (sheets: any[][][]) => {
  for (let sheetIdx = 0; sheetIdx <= 1; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const finalValueIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "final_value");
    if (finalValueIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i][finalValueIdx];
      if (val !== undefined && val !== "" && !Number.isInteger(Number(val))) {
        return true;
      }
    }
  }
  return false;
};

const hasInvalidPurposeId = (sheets: any[][][]) => {
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const purposeIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "purpose_id");
    if (purposeIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i][purposeIdx];
      if (val !== undefined && val !== "" && !allowedPurposeIds.includes(Number(val))) {
        return true;
      }
    }
  }
  return false;
};

const hasInvalidValuePremiseId = (sheets: any[][][]) => {
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const premiseIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "value_premise_id");
    if (premiseIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i][premiseIdx];
      if (val !== undefined && val !== "" && !allowedValuePremiseIds.includes(Number(val))) {
        return true;
      }
    }
  }
  return false;
};

const getExcelErrors = (sheets: any[][][], formFinalValue: string = '') => {
  const errors: { sheetIdx: number; row: number; col: number; message: string }[] = [];

  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;

    const maxCols = Math.max(...sheet.map(row => rowLength(row)));

    for (let i = 1; i < sheet.length; i++) {
      const row = sheet[i];
      const rowLen = rowLength(row);

      for (let j = 0; j < maxCols; j++) {
        const cell = j < rowLen ? row[j] : undefined;
        const headerName = (sheet[0][j] ?? "").toString().trim().toLowerCase();

        if (cell === undefined || cell === "") {
          errors.push({
            sheetIdx,
            row: i,
            col: j,
            message: "يوجد حقل فارغ، من فضلك املأ الحقل بقيمة صحيحة"
          });
          continue;
        }

        if (headerName === "final_value") {
          if (!Number.isInteger(Number(cell))) {
            errors.push({
              sheetIdx,
              row: i,
              col: j,
              message: "القيمة النهائية يجب أن تكون عددًا صحيحًا (بدون كسور)"
            });
          }
        }

        if (headerName === "purpose_id") {
          if (!allowedPurposeIds.includes(Number(cell))) {
            errors.push({
              sheetIdx,
              row: i,
              col: j,
              message: `قيمة غير مسموح بها في عمود الغرض (مسموح: ${allowedPurposeIds.join(",")})`
            });
          }
        }

        if (headerName === "value_premise_id") {
          if (!allowedValuePremiseIds.includes(Number(cell))) {
            errors.push({
              sheetIdx,
              row: i,
              col: j,
              message: `قيمة غير مسموح بها في أساس القيمة (مسموح: ${allowedValuePremiseIds.join(",")})`
            });
          }
        }

        if (headerName === "valued_at" || headerName === "submitted_at" || headerName === "inspection_date") {
          if (!validateExcelDate(cell)) {
            errors.push({
              sheetIdx,
              row: i,
              col: j,
              message: `تاريخ غير صحيح في حقل ${headerName}، يجب أن يكون بتنسيق DD/MM/YYYY مع قيم صحيحة`
            });
          }
        }
      }
    }
  }

  if (formFinalValue.trim()) {
    const mismatchError = getFinalValueMismatchError(sheets, formFinalValue);
    if (mismatchError) {
      errors.push(mismatchError);
    }
  }

  return errors;
};

function getFinalValueSum(sheets: any[][][]) {
  let sum = 0;
  for (let sheetIdx = 0; sheetIdx <= 1; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const finalValueIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "final_value");
    if (finalValueIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i][finalValueIdx];
      if (val !== undefined && val !== "" && !isNaN(Number(val))) {
        sum += Number(val);
      }
    }
  }
  return sum;
}

const hasMismatchedFinalValue = (sheets: any[][][], formFinalValue: string): boolean => {
  const totalAssetValue = getFinalValueSum(sheets);
  const formValue = parseFloat(formFinalValue);

  if (isNaN(totalAssetValue) || isNaN(formValue)) {
    return false;
  }

  return totalAssetValue !== formValue;
};

const getFinalValueMismatchError = (sheets: any[][][], formFinalValue: string): { sheetIdx: number; row: number; col: number; message: string } | null => {
  const totalAssetValue = getFinalValueSum(sheets);
  const formValue = parseFloat(formFinalValue);

  if (isNaN(totalAssetValue) || isNaN(formValue)) {
    return null;
  }

  if (totalAssetValue !== formValue) {
    return {
      sheetIdx: 0,
      row: 0,
      col: 0,
      message: `إجمالي قيمة الأصول (${totalAssetValue.toLocaleString()}) لا يساوي القيمة النهائية في النموذج (${formValue.toLocaleString()})`
    };
  }

  return null;
};

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
  const [excelErrors, setExcelErrors] = useState<{ sheetIdx: number; row: number; col: number; message: string }[]>([]);
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

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setExcelFile(files[0]);
      setStep2Validated(false); // Reset validation when new file is uploaded
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetsData: any[][][] = workbook.SheetNames.map((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            return XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: undefined });
          });
          setExcelDataSheets(sheetsData);
          setExcelError("");
        } catch (err) {
          console.error(err);
          setExcelError("حدث خطأ أثناء قراءة ملف الإكسل. تأكد من أن الملف صالح.");
        }
      };
      reader.readAsArrayBuffer(files[0]);
    }
  };

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setPdfFiles(Array.from(files));
      setStep2Validated(false); // Reset validation when new files are uploaded
    }
  };

  const finalValueSum = useMemo(() => getFinalValueSum(excelDataSheets), [excelDataSheets]);

  const isExcelValid =
    excelDataSheets.length > 0 &&
    !hasEmptyFields(excelDataSheets).hasEmpty &&
    !hasFractionInFinalValue(excelDataSheets) &&
    !hasInvalidPurposeId(excelDataSheets) &&
    !hasInvalidValuePremiseId(excelDataSheets) &&
    !hasMismatchedFinalValue(excelDataSheets, formData.value);

  // Remove automatic validation - only validate when user clicks button
  useEffect(() => {
    if (!excelDataSheets || excelDataSheets.length === 0) {
      setExcelErrors([]);
      setShowValidationSuccess(false);
    }
  }, [excelDataSheets]);

  const hasOnlyFinalValueMismatch = useMemo(() => {
    if (excelErrors.length === 0) return false;
    return excelErrors.every(error =>
      error.sheetIdx === 0 && error.row === 0 && error.col === 0
    );
  }, [excelErrors]);

  const downloadCorrectedExcel = () => {
    if (isExcelValid) return;
    if (!excelDataSheets.length) return;

    const workbook = XLSX.utils.book_new();

    const correctableErrors = excelErrors.filter(error =>
      !(error.sheetIdx === 0 && error.row === 0 && error.col === 0)
    );

    if (correctableErrors.length === 0) {
      setExcelError("Cannot download corrected file - please fix the final value in step 1");
      return;
    }

    excelDataSheets.forEach((sheet, sheetIdx) => {
      if (!sheet || sheet.length === 0) return;

      const newSheetData = sheet.map((r) => (Array.isArray(r) ? [...r] : r));
      const errorsForThisSheet = correctableErrors.filter((e) => e.sheetIdx === sheetIdx);

      errorsForThisSheet.forEach((err) => {
        const r = err.row;
        const c = err.col;
        if (!newSheetData[r]) newSheetData[r] = [];
        const oldVal = newSheetData[r][c] === undefined || newSheetData[r][c] === null ? "" : newSheetData[r][c];
        newSheetData[r][c] = `${oldVal} ⚠ ${err.message}`;
      });

      const ws = XLSX.utils.aoa_to_sheet(newSheetData);

      Object.keys(ws).forEach((cellRef) => {
        if (cellRef[0] === "!") return;
        const cell = ws[cellRef];
        const v = (cell && cell.v) ? cell.v.toString() : "";
        if (v.includes("⚠")) {
          cell.s = {
            fill: { fgColor: { rgb: "FFFF00" } },
            font: { color: { rgb: "FF0000" }, bold: true }
          };
        }
      });

      XLSX.utils.book_append_sheet(workbook, ws, `Sheet${sheetIdx + 1}`);
    });

    XLSX.writeFile(workbook, "corrected_report.xlsx", { bookType: "xlsx" });
  };

  const copyErrorToClipboard = async (err: { sheetIdx: number; row: number; col: number; message: string }) => {
    try {
      await navigator.clipboard.writeText(
        `Sheet:${err.sheetIdx + 1} Row:${err.row + 1} Col:${err.col + 1} - ${err.message}`
      );
    } catch (e) {
      // ignore
    }
  };

  const validateStep1 = (formData: FormData): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      errors.title = 'Report title is required';
    }

    if (!formData.purpose_id.trim() || formData.purpose_id === 'to set') {
      errors.purpose_id = 'Purpose of assessment is required';
    }

    if (!formData.value_premise_id.trim() || formData.value_premise_id === 'to set') {
      errors.value_premise_id = 'Value hypothesis is required';
    }

    if(!formData.valuation_currency.trim() || formData.valuation_currency === 'to set') {
      errors.valuation_currency = 'Valuation currency is required';
    }

    if (!formData.value.trim()) {
      errors.value = 'Final opinion on value is required';
    }

    const valuedAtErrors = validateDate(formData.valued_at, 'Valuation date');
    if (valuedAtErrors) errors.valued_at = valuedAtErrors;

    const submittedAtErrors = validateDate(formData.submitted_at, 'Submission date');
    if (submittedAtErrors) errors.submitted_at = submittedAtErrors;

    if (!errors.valued_at && !errors.submitted_at) {
      const dateRelationshipError = validateDateRelationship(formData.valued_at, formData.submitted_at);
      if (dateRelationshipError) {
        errors.submitted_at = dateRelationshipError;
      }
    }

    if (!formData.client_name.trim()) {
      errors.client_name = 'Client name is required';
    }

    if (!formData.owner_name.trim()) {
      errors.owner_name = 'Owner name is required';
    }

    const phoneError = validatePhone(formData.telephone);
    if (phoneError) {
      errors.telephone = phoneError;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      errors.email = emailError;
    }

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
    setStep1Validated(false); // Reset validation when data changes
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

  const handleValidateStep1 = () => {
    const validationErrors = validateStep1(formData);
    console.log("Validation Errors: ", validationErrors);
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

    // Run validation when button is clicked
    const exErrors = getExcelErrors(excelDataSheets, formData.value);
    setExcelErrors(exErrors);

    if (exErrors.length > 0) {
      setErrorsModalOpen(true);
      setStep2Validated(false);
      setShowValidationSuccess(false);
      return;
    }

    // If no errors, mark as validated
    setStep2Validated(true);
    setShowValidationSuccess(true);
  };

  const handleSubmitReport = async () => {
    if (!excelFile || !pdfs.length || excelErrors.length > 0) {
      alert('Please ensure all files are uploaded and validated');
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

  const renderStep2 = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Upload Asset Data Files</h2>

        <div className="space-y-6">
          <UploadBlock
            label="Upload your asset data Excel file"
            accept=".xlsx,.xls"
            inputId="excel-upload"
            type="excel"
            onFileChange={handleExcelUpload}
            disabled={isLoading}
          />

          {excelFile && (
            <p className="text-sm text-gray-600">Selected Excel File: {excelFile.name}</p>
          )}

          <UploadBlock
            label="Upload PDF files"
            accept=".pdf"
            inputId="pdf-upload"
            type="pdf"
            onFileChange={handlePdfUpload}
            disabled={isLoading}
          />

          {pdfs.length > 0 && (
            <p className="text-sm text-gray-600">Selected PDF Files: {pdfs.map(pdf => pdf.name).join(', ')}</p>
          )}

          {/* Excel Validation Summary - Only show after validation */}
          {excelDataSheets.length > 0 && excelErrors.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">Excel Validation</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTables(!showTables)}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    {showTables ? "Hide Tables" : "Show Tables"}
                  </button>
                  <button
                    onClick={() => setErrorsModalOpen(true)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${excelErrors.length ? "bg-red-50 border-red-200 text-red-700" : "bg-gray-50 text-gray-700"
                      } border transition-colors`}
                  >
                    <span>View Errors ({excelErrors.length})</span>
                  </button>
                </div>
              </div>

              {/* Validation Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {finalValueSum > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700 font-semibold">Total Asset Values</p>
                        <p className="text-lg font-bold text-blue-900">{finalValueSum.toLocaleString()}</p>
                      </div>
                      <div className="text-sm text-gray-500">Sum from asset sheets</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tables Display */}
              {showTables && (
                <div className="mt-6 space-y-6">
                  {excelDataSheets.slice(0, 2).map((sheet, sheetIdx) => {
                    const title = sheetIdx === 0 ? "Market Approach Assets" : "Cost Approach Assets";

                    if (!sheet || sheet.length === 0) return null;
                    const headers: any[] = sheet[0] ?? [];
                    const rows = sheet.slice(1);

                    return (
                      <div key={sheetIdx} className="bg-white border border-gray-200 rounded-lg overflow-auto">
                        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                          <div className="font-semibold text-blue-700">{title}</div>
                          <div className="text-xs text-gray-500">{rows.length} rows</div>
                        </div>

                        <table className="min-w-full text-sm border-collapse border border-gray-300">
                          <thead className="bg-gray-100">
                            <tr>
                              {headers.map((hd: any, idx: number) => (
                                <th key={idx} className="px-3 py-2 text-center font-medium text-gray-800 border border-gray-300">
                                  {hd ?? ""}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.length === 0 ? (
                              <tr>
                                <td className="p-4 text-center text-gray-400 border border-gray-300" colSpan={headers.length}>
                                  No data in this table
                                </td>
                              </tr>
                            ) : (
                              rows.map((row: any[], rIdx: number) => (
                                <tr key={rIdx} className={`${rIdx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}>
                                  {Array(headers.length).fill(0).map((_, cIdx) => {
                                    const val = row[cIdx];
                                    const headerName = (headers[cIdx] ?? "").toString().trim().toLowerCase();
                                    const isEmpty = val === undefined || val === "";
                                    const hasError = excelErrors.some(e => e.sheetIdx === sheetIdx && e.row === rIdx + 1 && e.col === cIdx);
                                    const bgColor = hasError ? "#FDD017" : isEmpty ? "#FEF3C7" : "";

                                    return (
                                      <td
                                        key={cIdx}
                                        className="px-3 py-2 text-center border border-gray-300"
                                        style={{ backgroundColor: bgColor }}
                                      >
                                        {isEmpty ? <span className="text-xs text-red-500 font-medium">Missing</span> : formatCellValue(val, headerName)}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Success badge - only show after validation passes */}
          {step2Validated && showValidationSuccess && (
            <div className="mt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold text-green-700">Files Validated</p>
                    <p className="text-sm text-gray-600">No errors found, ready to submit</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {excelError && (
            <div className="mt-3 text-center text-red-600 font-semibold">
              {excelError}
            </div>
          )}

          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              disabled={isLoading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
            >
              Back
            </button>

            <div className="flex gap-3">
              <button
                onClick={downloadCorrectedExcel}
                disabled={!excelFile || isExcelValid || hasOnlyFinalValueMismatch}
                className={`px-5 py-3 rounded-lg font-semibold transition-colors ${excelFile && !isExcelValid && !hasOnlyFinalValueMismatch
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                Download Corrected File
              </button>

              <button
                onClick={handleValidateStep2}
                disabled={!excelFile || !pdfs.length || isLoading || step2Validated}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${excelFile && pdfs.length && !step2Validated
                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                Validate Data
              </button>

              <button
                onClick={handleSubmitReport}
                disabled={!step2Validated || isLoading}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${step2Validated && !isLoading
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {isLoading ? 'Submitting...' : 'Validate and Store'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Errors Modal */}
      {errorsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setErrorsModalOpen(false)} />
          <div className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">!</span>
                </div>
                <div>
                  <div className="font-semibold text-lg text-gray-800">Excel Validation Errors ({excelErrors.length})</div>
                  <div className="text-xs text-gray-500">Details of row, column and error type</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={downloadCorrectedExcel}
                  disabled={!excelFile || isExcelValid || hasOnlyFinalValueMismatch}
                  className={`px-5 py-3 rounded-lg font-semibold transition-colors ${excelFile && !isExcelValid && !hasOnlyFinalValueMismatch
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  Download Corrected File
                </button>
                <button
                  onClick={() => setErrorsModalOpen(false)}
                  className="px-3 py-1 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="max-h-[60vh] overflow-auto p-6 space-y-4">
              {excelErrors.length === 0 ? (
                <div className="text-center text-gray-500">No errors found</div>
              ) : (
                excelErrors.map((err, idx) => (
                  <div key={idx} className="border rounded-lg p-4 flex justify-between items-start gap-3 hover:shadow-sm transition">
                    <div>
                      <div className="text-sm text-gray-700 font-medium">
                        Sheet {err.sheetIdx + 1} — Row {err.row + 1} — Column {err.col + 1}
                      </div>
                      <div className="text-sm text-red-700 mt-1">{err.message}</div>
                    </div>
                    <button
                      onClick={() => copyErrorToClipboard(err)}
                      className="px-3 py-1 text-xs bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!loggedIn) {
    return <LoginModal isOpen={true} onClose={() => { /* do nothing */ }} setIsLoggedIn={setLoggedIn} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {currentStep === 1 && renderStep1}
        {currentStep === 2 && renderStep2()}
      </div>

      {showSuccess && (
        <SuccessToast 
          onClose={() => setShowSuccess(false)} 
          onContinue={handleSuccessContinue}
        />
      )}

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