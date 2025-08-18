import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import UploadBlock from "../components/UploadBlock";
import Stepper from "../components/Stepper";
import type { WorkflowStep } from "../components/types";

const ManualPropertyExtraction: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep] = useState<WorkflowStep>("select");

  return (
    <div>
      <Stepper current={currentStep} />

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("mekyas.manual.title")}
        </h3>
        <p className="text-gray-600">{t("mekyas.manual.subtitle")}</p>

        <div className="space-y-4 mt-4">
          <UploadBlock
            label={t("mekyas.manual.uploadExcel")}
            accept=".xlsx,.xls"
            inputId="excel-upload"
          />
          <UploadBlock
            label={t("mekyas.manual.uploadPdf")}
            accept=".pdf"
            inputId="pdf-upload"
            multiple
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled
        >
          {t("mekyas.manual.start")}
        </button>
      </div>
    </div>
  );
};

export default ManualPropertyExtraction;
