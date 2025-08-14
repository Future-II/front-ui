export type WorkflowStep = 'select' | 'verify' | 'send' | 'result';
export type ProgressStage = 'withdraw' | 'verify' | 'send';

export interface Report {
  id: number;
  reportName: string;
  reportType: 'XLSX' | 'PDF' | 'CSV' | string;
  source: string;
  size: string;           
  date: string;           
  status: string;         
  equipmentType: string;  
  location: string;       
  referenceNo: string;    
  quantity: string | number; 
}
