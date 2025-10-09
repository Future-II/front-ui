import React, { useState, useMemo, useRef, useEffect } from 'react';
import UploadBlock from '../components/UploadBlock';
import ReportForm from '../components/ReportForm';
import * as XLSX from "xlsx-js-style";
import LoginModal from '../components/EquipmentTaqeemLogin';
import { User } from "lucide-react";

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

// Validation functions for form
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

const validateDate = (date: string, fieldName: string): string | null => {
  if (!date) return `${fieldName} is required`;
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate > today) return `${fieldName} must be today or before`;
  return null;
};

// Excel Validation Functions
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

  // Only check the first two sheets (asset sheets)
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;

    // For both asset sheets, check all data rows up to maxCols
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
  // Check both asset sheets (sheet 0 and 1)
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
  // Check both asset sheets (sheet 0 and 1)
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
  // Check both asset sheets (sheet 0 and 1)
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

  // Only validate the first two sheets (asset sheets)
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;

    // For both asset sheets, check all data rows
    const maxCols = Math.max(...sheet.map(row => rowLength(row)));

    for (let i = 1; i < sheet.length; i++) {
      const row = sheet[i];
      const rowLen = rowLength(row);

      for (let j = 0; j < maxCols; j++) {
        const cell = j < rowLen ? row[j] : undefined;
        const headerName = (sheet[0][j] ?? "").toString().trim().toLowerCase();

        // empty
        if (cell === undefined || cell === "") {
          errors.push({
            sheetIdx,
            row: i,
            col: j,
            message: "يوجد حقل فارغ، من فضلك املأ الحقل بقيمة صحيحة"
          });
          continue;
        }

        // final_value integer
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

        // purpose_id
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

        // value_premise_id
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

        // date validations
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

  // Add final value mismatch error if applicable
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
  // Sum from both asset sheets (sheet 0 and 1)
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

// Add this function to check if total asset value matches form final value
const hasMismatchedFinalValue = (sheets: any[][][], formFinalValue: string): boolean => {
  const totalAssetValue = getFinalValueSum(sheets);
  const formValue = parseFloat(formFinalValue);

  // Only validate if both values are valid numbers
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
      sheetIdx: 0, // This is a general error, not tied to a specific sheet
      row: 0,
      col: 0,
      message: `إجمالي قيمة الأصول (${totalAssetValue.toLocaleString()}) لا يساوي القيمة النهائية في النموذج (${formValue.toLocaleString()})`
    };
  }

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
  const [excelDataSheets, setExcelDataSheets] = useState<any[][][]>([]);
  const [excelError, setExcelError] = useState<string>("");
  const [excelErrors, setExcelErrors] = useState<{ sheetIdx: number; row: number; col: number; message: string }[]>([]);
  const [showValidationSuccess, setShowValidationSuccess] = useState(false);
  const [showTables, setShowTables] = useState(false);
  const [errorsModalOpen, setErrorsModalOpen] = useState(false);

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

  // Excel file handling
  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setExcelFile(files[0]);
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

  // PDF file handling
  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setPdfFiles(Array.from(files));
    }
  };

  // Excel validation
  const finalValueSum = useMemo(() => getFinalValueSum(excelDataSheets), [excelDataSheets]);

  const isExcelValid =
    excelDataSheets.length > 0 &&
    !hasEmptyFields(excelDataSheets).hasEmpty &&
    !hasFractionInFinalValue(excelDataSheets) &&
    !hasInvalidPurposeId(excelDataSheets) &&
    !hasInvalidValuePremiseId(excelDataSheets) &&
    !hasMismatchedFinalValue(excelDataSheets, formData.final_value);

  // Update excel errors when data changes
  // Update excel errors when data changes
  useEffect(() => {
    if (!excelDataSheets || excelDataSheets.length === 0) {
      setExcelErrors([]);
      return;
    }
    const exErrors = getExcelErrors(excelDataSheets, formData.final_value);
    setExcelErrors(exErrors);
    setShowValidationSuccess(exErrors.length === 0 && excelDataSheets.length > 0);

    if (exErrors.length > 0) {
      setErrorsModalOpen(true);
    }
  }, [excelDataSheets, formData.final_value]); // Add formData.final_value as dependency

  // Download corrected Excel
// Add this helper function
const hasOnlyFinalValueMismatch = useMemo(() => {
  if (excelErrors.length === 0) return false;
  
  // Check if all errors are final value mismatch errors
  return excelErrors.every(error => 
    error.sheetIdx === 0 && error.row === 0 && error.col === 0
  );
}, [excelErrors]);

// Download corrected Excel - exclude final value mismatch errors
const downloadCorrectedExcel = () => {
  if (isExcelValid) return;
  if (!excelDataSheets.length) return;

  const workbook = XLSX.utils.book_new();
  
  // Filter out final value mismatch errors (sheetIdx: 0, row: 0, col: 0)
  const correctableErrors = excelErrors.filter(error => 
    !(error.sheetIdx === 0 && error.row === 0 && error.col === 0)
  );

  // If there are no correctable errors (only final value mismatch), don't download
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

  // Form validation
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

          {/* Excel Validation Summary */}
          {excelDataSheets.length > 0 && (
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

                {showValidationSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="font-semibold text-green-700">File is Valid</p>
                        <p className="text-sm text-gray-600">No errors found, ready to submit</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tables Display */}
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

          {/* Error Message */}
          {excelError && (
            <div className="mt-3 text-center text-red-600 font-semibold">
              {excelError}
            </div>
          )}

          {/* Action Buttons */}
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
  className={`px-5 py-3 rounded-lg font-semibold transition-colors ${
    excelFile && !isExcelValid && !hasOnlyFinalValueMismatch
      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
      : "bg-gray-100 text-gray-400 cursor-not-allowed"
  }`}
>
  Download Corrected File
</button>

              <button
                type="button"
                disabled={!excelFile || !pdfs.length || excelErrors.length > 0 || isLoading}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${excelFile && pdfs.length && excelErrors.length === 0
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {isLoading ? 'Submitting...' : 'Submit Report'}
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
  className={`px-5 py-3 rounded-lg font-semibold transition-colors ${
    excelFile && !isExcelValid && !hasOnlyFinalValueMismatch
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
      return <LoginModal isOpen={true} onClose={() => { /* do nothing */ }} setIsLoggedIn={setLoggedIn} />;
    }
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