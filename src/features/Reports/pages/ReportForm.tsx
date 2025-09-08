import React, { useState } from "react";
import Stepper from "../components/ReportStepper";
import ReportInfo from "../components/ReportInfo";
import ClientInfo from "../components/ClientInfo";
import ValuerInfo from "../components/ValuerInfo";
import { createHalfReport } from "../api";

const ReportForm = () => {
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
    valuers: [{ name: "", share: 100 }], // <--- initialize here
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createHalfReport(form);
      console.log(response);

    } catch (error) {
      console.log(error);
    }
  }



  return (
    <form
      className="max-w-7xl mx-auto space-y-6 p-6 bg-gray-50"
    >
      <Stepper />
      <ReportInfo form={form} setForm={setForm} />
      <ClientInfo form={form} setForm={setForm} />
      <ValuerInfo form={form} setForm={setForm} />

      {/* Buttons */}
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
          onClick={handleSubmit}
        >
          Save & Continue
        </button>
      </div>
    </form>
  );
};

export default ReportForm;
