import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link,} from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import UploadBlock from "../components/UploadBlock";
import Stepper from "../components/Stepper";
import type { WorkflowStep } from "../components/types";

const ManualPropertyExtraction: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep] = useState<WorkflowStep>("select");

  return (
    <div className="w-full">
      {/* Top bar: title + back button */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {"Manually submit a report"}
          </h1>
          <p className="text-gray-600">
            {
              "Manually upload and send property reports to the Authority’s system"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* If you prefer router back: onClick={() => navigate(-1)} */}
          <Link
            to="/reports/mekyas"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("Back to Scale Reports") || "Back to Scale Reports"}
          </Link>
        </div>
      </div>

      {/* Card wrapper like screenshot */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <div className="mb-6 flex justify-center">
        <Stepper current={currentStep} />
      </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            {t("mekyas.manual.title") || "Manually submit a report"}
          </h3>
          <p className="text-gray-600">
            {t("mekyas.manual.subtitle") ||
              "Upload the property report files from your device to send them to the Authority’s system."}
          </p>

          {/* Upload blocks */}
          <div className="mt-6 space-y-5">
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-4">
              <UploadBlock
                label={
                  t("mekyas.manual.uploadExcel") ||
                  "Drag or click to upload an Excel file."
                }
                accept=".xlsx,.xls"
                inputId="excel-upload"
              />
            </div>

            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-4">
              <UploadBlock
                label={
                  t("mekyas.manual.uploadPdf") ||
                  "Drag or click to upload linked PDF files."
                }
                accept=".pdf"
                inputId="pdf-upload"
                multiple
              />
            </div>
          </div>

          {/* Footer actions */}
          {/* <div className="mt-6 flex justify-end">
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled
            >
              {t("mekyas.manual.start") || "Start"}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ManualPropertyExtraction;
