import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface DownloadExcelProps {
  filename: string; // e.g., "Test.xlsx"
}

const DownloadExcel: React.FC<DownloadExcelProps> = ({ filename }) => {
  const handleDownload = async (): Promise<void> => {
    try {
      const response = await fetch(filename);

      if (!response.ok) {
        throw new Error(`File not found or inaccessible: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      // Read the workbook
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      // Convert workbook to binary array for download
      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      const blob = new Blob([wbout], { type: "application/octet-stream" });
      saveAs(blob, filename); // Save using the same filename
    } catch (err: any) {
      console.error("Error processing Excel file:", err);
      alert(`Something went wrong: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center p-5 border rounded-2xl shadow-lg w-full max-w-md mx-auto bg-white">
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
      >
        Example File
      </button>
    </div>
  );
};

export default DownloadExcel;
