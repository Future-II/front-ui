import { 
  EquipmentExcelError, 
  EquipmentEmptyFieldInfo, 
  equipmentRequiredHeadings, 
  equipmentAllowedPurposeIds, 
  equipmentAllowedValuePremiseIds 
} from '../types';
import { rowLength, validateDate } from './excelValidation';

export function hasMissingRequiredHeadings(sheet: any[][]): string[] {
  if (!sheet || sheet.length === 0) return equipmentRequiredHeadings;
  
  const headers = sheet[0] || [];
  const headerNames = headers.map((h: any) => h?.toString().trim().toLowerCase());
  
  const missingHeadings: string[] = [];
  
  equipmentRequiredHeadings.forEach(requiredHeading => {
    if (!headerNames.includes(requiredHeading.toLowerCase())) {
      missingHeadings.push(requiredHeading);
    }
  });
  
  return missingHeadings;
}

export function hasEmptyFields(sheets: any[][][]): { hasEmpty: boolean; emptyFields: EquipmentEmptyFieldInfo[] } {
  const emptyFields: EquipmentEmptyFieldInfo[] = [];

  // Only check the first two sheets (asset sheets)
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
  // Check both asset sheets (sheet 0 and 1)
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
  // Check both asset sheets (sheet 0 and 1)
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const purposeIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "purpose_id");
    if (purposeIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i]?.[purposeIdx];
      if (val !== undefined && val !== "" && !equipmentAllowedPurposeIds.includes(Number(val))) {
        return true;
      }
    }
  }
  return false;
}

export function hasInvalidValuePremiseId(sheets: any[][][]): boolean {
  // Check both asset sheets (sheet 0 and 1)
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const premiseIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "value_premise_id");
    if (premiseIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i]?.[premiseIdx];
      if (val !== undefined && val !== "" && !equipmentAllowedValuePremiseIds.includes(Number(val))) {
        return true;
      }
    }
  }
  return false;
}

export function getEquipmentExcelErrors(sheets: any[][][]): EquipmentExcelError[] {
  const errors: EquipmentExcelError[] = [];

  // First, check for missing required headings in both sheets
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length === 0) continue;
    
    const missingHeadings = hasMissingRequiredHeadings(sheet);
    if (missingHeadings.length > 0) {
      errors.push({
        sheetIdx,
        row: 0,
        col: 0,
        message: `العنوانات المطلوبة مفقودة: ${missingHeadings.join(', ')}`
      });
    }
  }

  // Only validate the first two sheets (asset sheets)
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
          if (!equipmentAllowedPurposeIds.includes(Number(cell))) {
            errors.push({
              sheetIdx,
              row: i,
              col: j,
              message: `قيمة غير مسموح بها في عمود الغرض (مسموح: ${equipmentAllowedPurposeIds.join(",")})`
            });
          }
        }

        // value_premise_id
        if (headerName === "value_premise_id") {
          if (!equipmentAllowedValuePremiseIds.includes(Number(cell))) {
            errors.push({
              sheetIdx,
              row: i,
              col: j,
              message: `قيمة غير مسموح بها في أساس القيمة (مسموح: ${equipmentAllowedValuePremiseIds.join(",")})`
            });
          }
        }

        // date validations
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

  return errors;
}

export function hasAllRequiredHeadings(sheets: any[][][]): boolean {
  if (sheets.length < 2) return false;
  
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const missingHeadings = hasMissingRequiredHeadings(sheets[sheetIdx]);
    if (missingHeadings.length > 0) {
      return false;
    }
  }
  return true;
}

export function isEquipmentExcelValid(sheets: any[][][]): boolean {
  return sheets.length > 0 &&
    hasAllRequiredHeadings(sheets) &&
    !hasEmptyFields(sheets).hasEmpty &&
    !hasFractionInFinalValue(sheets) &&
    !hasInvalidPurposeId(sheets) &&
    !hasInvalidValuePremiseId(sheets);
}