import { 
  ReportsManagementExcelError, 
  ReportsManagementEmptyFieldInfo,
} from '../types';
import { rowLength, validateDate, getFinalValueSum } from './excelValidation';

export const allowedPurposeIds = [1, 2, 5, 6, 8, 9, 10, 12, 14];
export const allowedValuePremiseIds = [1, 2, 3, 4, 5];

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) return 'Phone number is required';
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
  if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
  return null;
}

export function validateFormDate(date: string, fieldName: string): string | null {
  if (!date) return `${fieldName} is required`;

  const selectedDate = new Date(date);
  const today = new Date();
  
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (selectedDate > today) return `${fieldName} must be today or before`;
  return null;
}

export function validateDateRelationship(valuedAt: string, submittedAt: string): string | null {
  if (!valuedAt || !submittedAt) return null;
  
  const valuedDate = new Date(valuedAt);
  const submittedDate = new Date(submittedAt);
  
  valuedDate.setHours(0, 0, 0, 0);
  submittedDate.setHours(0, 0, 0, 0);
  
  if (submittedDate < valuedDate) {
    return 'Submission date must be the same date or after valuation date';
  }
  
  return null;
}

export function hasEmptyFields(sheets: any[][][]): { hasEmpty: boolean; emptyFields: ReportsManagementEmptyFieldInfo[] } {
  const emptyFields: ReportsManagementEmptyFieldInfo[] = [];

  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;

    const maxCols = Math.max(...sheet.map(row => rowLength(row)));

    for (let i = 1; i < sheet.length; i++) {
      const row = sheet[i];
      if (!row) continue;
      const rowLen = rowLength(row);

      for (let j = 0; j < maxCols; j++) {
        const value = j < rowLen ? row[j] : undefined;

        if (value === undefined || value === "") {
          emptyFields.push({
            sheetIndex: sheetIdx + 1,
            rowIndex: i + 1,
            colIndex: j + 1,
            columnName: sheet[0]?.[j] || `Column ${j + 1}`,
          });
        }
      }
    }
  }

  return {
    hasEmpty: emptyFields.length > 0,
    emptyFields,
  };
}

export function hasFractionInFinalValue(sheets: any[][][]): boolean {
  for (let sheetIdx = 0; sheetIdx <= 1; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const finalValueIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "final_value");
    if (finalValueIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i]?.[finalValueIdx];
      if (val !== undefined && val !== "" && !Number.isInteger(Number(val))) {
        return true;
      }
    }
  }
  return false;
}

export function hasInvalidPurposeId(sheets: any[][][]): boolean {
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const purposeIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "purpose_id");
    if (purposeIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i]?.[purposeIdx];
      if (val !== undefined && val !== "" && !allowedPurposeIds.includes(Number(val))) {
        return true;
      }
    }
  }
  return false;
}

export function hasInvalidValuePremiseId(sheets: any[][][]): boolean {
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const premiseIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "value_premise_id");
    if (premiseIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i]?.[premiseIdx];
      if (val !== undefined && val !== "" && !allowedValuePremiseIds.includes(Number(val))) {
        return true;
      }
    }
  }
  return false;
}

export function hasMismatchedFinalValue(sheets: any[][][], formFinalValue: string): boolean {
  const totalAssetValue = getFinalValueSum(sheets);
  const formValue = parseFloat(formFinalValue);

  if (isNaN(totalAssetValue) || isNaN(formValue)) {
    return false;
  }

  return totalAssetValue !== formValue;
}

export function getFinalValueMismatchError(sheets: any[][][], formFinalValue: string): ReportsManagementExcelError | null {
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
}

export function getExcelErrors(sheets: any[][][], formFinalValue: string = ''): ReportsManagementExcelError[] {
  const errors: ReportsManagementExcelError[] = [];

  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;

    const maxCols = Math.max(...sheet.map(row => rowLength(row)));

    for (let i = 1; i < sheet.length; i++) {
      const row = sheet[i];
      if (!row) continue;
      const rowLen = rowLength(row);

      for (let j = 0; j < maxCols; j++) {
        const cell = j < rowLen ? row[j] : undefined;
        const headerName = (sheet[0]?.[j] ?? "").toString().trim().toLowerCase();

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
          if (!validateDate(cell)) {
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
}

export function isExcelValid(sheets: any[][][], formFinalValue: string): boolean {
  return sheets.length > 0 &&
    !hasEmptyFields(sheets).hasEmpty &&
    !hasFractionInFinalValue(sheets) &&
    !hasInvalidPurposeId(sheets) &&
    !hasInvalidValuePremiseId(sheets) &&
    !hasMismatchedFinalValue(sheets, formFinalValue);
}

export function validateStep1(formData: any): { [key: string]: string } {
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

  const valuedAtErrors = validateFormDate(formData.valued_at, 'Valuation date');
  if (valuedAtErrors) errors.valued_at = valuedAtErrors;

  const submittedAtErrors = validateFormDate(formData.submitted_at, 'Submission date');
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
    formData.report_users.forEach((user: string, index: number) => {
      if (!user.trim()) {
        errors[`user_${index}_username`] = 'Report username is required';
      }
    });
  }

  return errors;
}

export function getReportsManagementFinalValueSum(sheets: any[][][]): number {
  let sum = 0;
  // Specifically for ReportsManagementSystem - check first two sheets (0 and 1)
  for (let sheetIdx = 0; sheetIdx <= 1; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const finalValueIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "final_value");
    if (finalValueIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i]?.[finalValueIdx];
      if (val !== undefined && val !== "" && !isNaN(Number(val))) {
        sum += Number(val);
      }
    }
  }
  return sum;
}

export function validateFinalValueMatch(sheets: any[][][], formValue: string): { isValid: boolean; excelSum: number; formValue: number; error: string | null } {
  const excelSum = getReportsManagementFinalValueSum(sheets);
  const formValueNum = parseFloat(formValue);

  if (isNaN(excelSum) || isNaN(formValueNum)) {
    return {
      isValid: false,
      excelSum: 0,
      formValue: 0,
      error: "Unable to calculate values - please check your data"
    };
  }

  const isValid = excelSum === formValueNum;
  
  return {
    isValid,
    excelSum,
    formValue: formValueNum,
    error: isValid ? null : `Excel total (${excelSum.toLocaleString()}) does not match form value (${formValueNum.toLocaleString()})`
  };
}