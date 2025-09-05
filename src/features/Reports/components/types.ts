export type WorkflowStep = 'verify' | 'prepare' | 'upload' | 'completed';
export type ProgressStage = 'withdraw' | 'verify' | 'send';

export interface Report {
  site: any;
  name: any;
  condition: string;
  propertyType: string;
  reference: any;
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
