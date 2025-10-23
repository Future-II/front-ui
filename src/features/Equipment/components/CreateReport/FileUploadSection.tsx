import React from 'react';
import UploadBlock from '../UploadBlock';

interface FileUploadSectionProps {
  onExcelChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPdfChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  excelFile: File | null;
  pdfFile: File | null;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  onExcelChange,
  onPdfChange,
  excelFile,
  pdfFile
}) => {
  return (
    <div className="space-y-6">
      <UploadBlock
        label="رفع ملف Excel"
        accept=".xlsx,.xls"
        inputId="excel-upload"
        type="excel"
        onFileChange={onExcelChange}
      />
      {excelFile && (
        <p className="text-sm text-gray-600 text-center">
          الملف المختار: <span className="font-medium text-blue-700">{excelFile.name}</span>
        </p>
      )}

      <UploadBlock
        label="رفع ملف PDF"
        accept=".pdf"
        inputId="pdf-upload"
        type="pdf"
        onFileChange={onPdfChange}
      />
      {pdfFile && (
        <p className="text-sm text-gray-600 text-center">
          الملف المختار: <span className="font-medium text-green-700">{pdfFile.name}</span>
        </p>
      )}
    </div>
  );
};

export default FileUploadSection;