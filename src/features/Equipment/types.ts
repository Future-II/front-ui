export interface ExcelError {
  sheetIdx: number;
  row: number;
  col: number;
  message: string;
}

export interface EmptyFieldInfo {
  sheetIndex: number;
  rowIndex: number;
  colIndex: number;
  columnName?: string;
}

export interface EquipmentExcelError {
  sheetIdx: number;
  row: number;
  col: number;
  message: string;
}

export interface EquipmentEmptyFieldInfo {
  sheetIndex: number;
  rowIndex: number;
  colIndex: number;
  columnName?: string;
}

export const equipmentRequiredHeadings = [
  'asset_name',
  'asset_usage_id', 
  'final_value',
  'inspection_date',
  'owner_name',
  'region',
  'city'
];

export const equipmentAllowedPurposeIds = [1, 2, 5, 6, 8, 9, 10, 12, 14];
export const equipmentAllowedValuePremiseIds = [1, 2, 3, 4, 5];

export interface ValidationResult {
  hasEmpty: boolean;
  emptyFields: EmptyFieldInfo[];
}

export interface RequiredHeaders {
  [key: number]: string[];
}

export const requiredHeaders: RequiredHeaders = {
  0: [ // Sheet 1 - Report data
    'title', 'purpose_id', 'value_premise_id', 'report_type', 'valued_at', 
    'submitted_at', 'inspection_date', 'assumptions', 'special_assumptions', 
    'value', 'client_name', 'owner_name', 'telephone', 'email', 'region', 'city'
  ],
  1: [ // Sheet 2 - Market assets
    'asset_name', 'asset_usage_id', 'final_value'
  ],
  2: [ // Sheet 3 - Cost assets
    'asset_name', 'asset_usage_id', 'final_value'
  ]
};

export const allowedPurposeIds = [1, 2, 5, 6, 8, 9, 10, 12, 14];
export const allowedValuePremiseIds = [1, 2, 3, 4, 5];