import { useState } from "react";

import ReportInfo from "../components/ReportInfo";
import ClientInfo from "../components/ClientInfo";
import ValuerInfo from "../components/ValuerInfo";

const ManualEquipmentReportUpload = () => {
  const [form, setForm] = useState<any>({
    reportTitle: "",
    purpose: "",
    reportType: "",
    issueDate: "",
    valueDate: "",
    currency: "",
    assumptions: "",
    finalOpinion: "",
    file: null,
    clients: [{ name: "", phone: "", email: "" }],
    valuers: [{ name: "", share: 100 }], 
  });

  return (
    <form
      className="max-w-7xl mx-auto space-y-6 p-6 bg-gray-50"
    >

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Save & Close
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save & Continue
        </button>
      </div>
    </form>
  );
};

export default ManualEquipmentReportUpload;
