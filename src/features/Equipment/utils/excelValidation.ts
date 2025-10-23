import { 
  ExcelError, 
  EmptyFieldInfo, 
  ValidationResult, 
  requiredHeaders, 
  allowedPurposeIds, 
  allowedValuePremiseIds 
} from '../types';

export function rowLength(row: any[]): number {
  if (!row) return 0;
  return row.length;
}

export function validateDate(dateVal: any): boolean {
  let day, month, year;
  console.log("show", dateVal);

  if (dateVal instanceof Date) {
    day = dateVal.getDate();
    month = dateVal.getMonth() + 1;
    year = dateVal.getFullYear();
  } else if (typeof dateVal === 'string') {
    const s = dateVal.trim();

    // ✅ Require strictly MM/DD/YYYY format (two digits for month/day, four for year)
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(s)) {
      console.error(`❌ Date should be in MM/DD/YYYY format: "${s}"`);
      return false;
    }

    const parts = s.split('/');
    month = parseInt(parts[0], 10);
    day = parseInt(parts[1], 10);
    year = parseInt(parts[2], 10);

    // 🔍 Validate logical range for month/day
    if (month < 1 || month > 12) {
      console.error(`❌ Invalid month in date "${s}". Expected MM/DD/YYYY.`);
      return false;
    }

    if (day < 1 || day > 31) {
      console.error(`❌ Invalid day in date "${s}". Expected MM/DD/YYYY.`);
      return false;
    }
  } else if (typeof dateVal === 'number') {
    // Excel date number conversion
    const date = new Date((dateVal - 25569) * 86400 * 1000);
    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
    console.log("date", date);
  } else {
    return false;
  }

  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;

  return true;
}

export function formatCellValue(val: any, headerName: string): string {
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
  return String(val ?? '');
}

export function hasMissingRequiredHeaders(sheet: any[][], sheetIdx: number): string[] {
  if (!sheet || sheet.length === 0) return requiredHeaders[sheetIdx as keyof typeof requiredHeaders] || [];
  
  const headers = sheet[0] || [];
  const headerNames = headers.map((h: any) => h?.toString().trim().toLowerCase());
  
  const missingHeaders: string[] = [];
  const requiredForSheet = requiredHeaders[sheetIdx as keyof typeof requiredHeaders] || [];
  
  requiredForSheet.forEach((requiredHeader: string) => {
    if (!headerNames.includes(requiredHeader.toLowerCase())) {
      missingHeaders.push(requiredHeader);
    }
  });
  
  return missingHeaders;
}

export function hasEmptyFields(sheets: any[][][]): ValidationResult {
  const emptyFields: EmptyFieldInfo[] = [];

  for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;

    if (sheetIdx === 0) {
      const headerLength = rowLength(sheet[0]);
      const row = sheet[1];
      if (!row) continue;
      const rowLen = rowLength(row);

      for (let j = 0; j < headerLength; j++) {
        const value = j < rowLen ? row[j] : undefined;

        if (value === undefined || value === "") {
          emptyFields.push({
            sheetIndex: sheetIdx + 1,
            rowIndex: 2,
            colIndex: j + 1,
            columnName: sheet[0][j] || `Column ${j + 1}`,
          });
        }
      }
    } else {
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
  }

  return {
    hasEmpty: emptyFields.length > 0,
    emptyFields,
  };
}

export function hasFractionInFinalValue(sheets: any[][][]): boolean {
  for (let sheetIdx = 1; sheetIdx <= 2; sheetIdx++) {
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
  for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
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
  for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
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

export function getExcelErrors(sheets: any[][][]): ExcelError[] {
  const errors: ExcelError[] = [];

  // Check for missing required headers in all sheets
  for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length === 0) continue;
    
    const missingHeaders = hasMissingRequiredHeaders(sheet, sheetIdx);
    if (missingHeaders.length > 0) {
      errors.push({
        sheetIdx,
        row: 0,
        col: 0,
        message: `العناوين المطلوبة مفقودة: ${missingHeaders.join(', ')}`
      });
    }
  }

  for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;

    if (sheetIdx === 0) {
      const headerLength = rowLength(sheet[0]);
      const row = sheet[1];
      if (!row) continue;
      const rowLen = rowLength(row);

      for (let j = 0; j < headerLength; j++) {
        const cell = j < rowLen ? row[j] : undefined;
        const headerName = (sheet[0]?.[j] ?? "").toString().trim().toLowerCase();

        if (cell === undefined || cell === "") {
          errors.push({
            sheetIdx,
            row: 1,
            col: j,
            message: "يوجد حقل فارغ، من فضلك املأ الحقل بقيمة صحيحة"
          });
          continue;
        }

        if (headerName === "final_value") {
          if (!Number.isInteger(Number(cell))) {
            errors.push({
              sheetIdx,
              row: 1,
              col: j,
              message: "القيمة النهائية يجب أن تكون عددًا صحيحًا (بدون كسور)"
            });
          }
        }

        if (headerName === "purpose_id") {
          if (!allowedPurposeIds.includes(Number(cell))) {
            errors.push({
              sheetIdx,
              row: 1,
              col: j,
              message: `قيمة غير مسموح بها في عمود الغرض (مسموح: ${allowedPurposeIds.join(",")})`
            });
          }
        }

        if (headerName === "value_premise_id") {
          if (!allowedValuePremiseIds.includes(Number(cell))) {
            errors.push({
              sheetIdx,
              row: 1,
              col: j,
              message: `قيمة غير مسموح بها في أساس القيمة (مسموح: ${allowedValuePremiseIds.join(",")})`
            });
          }
        }

        if (headerName === "valued_at" || headerName === "submitted_at" || headerName === "inspection_date") {
          if (!validateDate(cell)) {
            errors.push({
              sheetIdx,
              row: 1,
              col: j,
              message: `تاريخ غير صحيح في حقل ${headerName}، يجب أن يكون بتنسيق DD/MM/YYYY مع قيم صحيحة`
            });
          }
        }
      }
    } else {
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
  }

  return errors;
}

export function getFinalValueSum(sheets: any[][][]): number {
  let sum = 0;
  for (let sheetIdx = 1; sheetIdx <= 2; sheetIdx++) {
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

export function isReportValueEqualToAssetsSum(sheets: any[][][], assetsSum: number): boolean {
  const sheet1 = sheets[0];
  if (!sheet1 || sheet1.length < 2) return true;
  const valueIdx = sheet1[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "value");
  if (valueIdx === -1) return true;
  const reportValue = sheet1[1]?.[valueIdx];
  if (reportValue === undefined || reportValue === "" || isNaN(Number(reportValue))) return true;
  return Number(reportValue) === assetsSum;
}

export function hasAllRequiredHeaders(sheets: any[][][]): boolean {
  if (sheets.length < 3) return false;
  
  for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
    const missingHeaders = hasMissingRequiredHeaders(sheets[sheetIdx], sheetIdx);
    if (missingHeaders.length > 0) {
      return false;
    }
  }
  return true;
}