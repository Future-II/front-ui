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

export interface Client {
  client_name: string;
  telephone_number: string;
  email_address: string;
}

export interface Asset {
    _id: string;
    final_value: string;
    asset_name: string;
    asset_type: string;
    owner_name: string;
    submitState: number;
}

export interface Report {
    _id: string;
    title: string;
    asset_data: Asset[];
    value: string;
    createdAt?: string;
    owner_name: string;
    report_id: string;
    startSubmitTime?: string;
    endSubmitTime?: string;
}

export interface ProgressData {
    step?: number;
    total_steps?: number;
    total?: number;
    current?: number;
    percentage?: number;
    macro_id?: number;
    form_id?: string;
    error?: string;
}

export interface ProgressState {
    status: string;
    message: string;
    progress: number;
    paused: boolean;
    stopped: boolean;
    actionType?: "submit" | "retry" | "check";
    data?: ProgressData;
}

export type ReportStatus = "green" | "yellow" | "orange";

export interface FormData {
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

export interface ReportsManagementExcelError {
  sheetIdx: number;
  row: number;
  col: number;
  message: string;
}

export interface ReportsManagementEmptyFieldInfo {
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