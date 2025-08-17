// src/features/reports/data/reportData.ts
export type ReportRow = {
  id: number;

  // left-most column
  reportNumber: string;
  propNumber: string;

  // report details column
  fileName: string;
  fileType: 'PDF' | 'XLSX' | 'CSV' | 'ZIP';
  size: string;         // "2.4 MB"
  summary: string;      // small grey line under file type/size

  // property & location column
  propertyType: 'residential' | 'commercial';
  location: string;     // "Riyadh - Al-Nargis District"
  price: string;        // "850,000 riyals" (text with green accent)

  // required & company column
  requester: string;
  company: string;

  // report status column
  status: 'Complete' | 'Error' | 'Processing';
  uploadedAgo: string;          // "580 days ago"

  // timing & performance column
  processingMinutes?: number;   // 5, 8...
  lastModifiedAgo: string;      // "580 days ago"

  // statistics column
  recordsCount: number;
  downloadsCount: number;

  // tracking column
  readyText: 'Ready to download' | 'Processing' | 'Needs action';
};

export const reportData: ReportRow[] = [
  {
    id: 1,
    reportNumber: "RPT-2024-001",
    propNumber: "PROP-2024-001",
    fileName: "Residential Property Evaluation Report - Riyadh",
    fileType: "PDF",
    size: "2.4 MB",
    summary: "Successfully evaluated according to the specified criteria",
    propertyType: "residential",
    location: "Riyadh - Al-Nargis District",
    price: "850,000 riyals",
    requester: "Ahmed Mohammed Al-Ahmad",
    company: "Al Mostakbal Real Estate Company",
    status: "Complete",
    uploadedAgo: "580 days ago",
    processingMinutes: 5,
    lastModifiedAgo: "580 days ago",
    recordsCount: 1,
    downloadsCount: 3,
    readyText: "Ready to download",
  },
  {
    id: 2,
    reportNumber: "RPT-2024-002",
    propNumber: "PROP-2024-002",
    fileName: "Commercial Real Estate Data - Jeddah",
    fileType: "XLSX",
    size: "4.8 MB",
    summary: "Comprehensive report containing 15 commercial properties",
    propertyType: "commercial",
    location: "Jeddah - Al Rawdah District",
    price: "1,250,000 riyals",
    requester: "Fatima Al-Zahrani",
    company: "Riyadh Real Estate Company",
    status: "Complete",
    uploadedAgo: "581 days ago",
    processingMinutes: 8,
    lastModifiedAgo: "581 days ago",
    recordsCount: 15,
    downloadsCount: 7,
    readyText: "Ready to download",
  },{
    id: 2,
    reportNumber: "RPT-2024-002",
    propNumber: "PROP-2024-002",
    fileName: "Commercial Real Estate Data - Jeddah",
    fileType: "XLSX",
    size: "4.8 MB",
    summary: "Comprehensive report containing 15 commercial properties",
    propertyType: "commercial",
    location: "Jeddah - Al Rawdah District",
    price: "1,250,000 riyals",
    requester: "Fatima Al-Zahrani",
    company: "Riyadh Real Estate Company",
    status: "Complete",
    uploadedAgo: "581 days ago",
    processingMinutes: 8,
    lastModifiedAgo: "581 days ago",
    recordsCount: 15,
    downloadsCount: 7,
    readyText: "Ready to download",
  },{
    id: 2,
    reportNumber: "RPT-2024-002",
    propNumber: "PROP-2024-002",
    fileName: "Commercial Real Estate Data - Jeddah",
    fileType: "XLSX",
    size: "4.8 MB",
    summary: "Comprehensive report containing 15 commercial properties",
    propertyType: "commercial",
    location: "Jeddah - Al Rawdah District",
    price: "1,250,000 riyals",
    requester: "Fatima Al-Zahrani",
    company: "Riyadh Real Estate Company",
    status: "Complete",
    uploadedAgo: "581 days ago",
    processingMinutes: 8,
    lastModifiedAgo: "581 days ago",
    recordsCount: 15,
    downloadsCount: 7,
    readyText: "Ready to download",
  },
  
];
