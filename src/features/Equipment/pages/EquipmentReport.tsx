import React from "react";
import { useTranslation } from "react-i18next";

import StepList from "../components/StepList";
import UploadBlock from "../components/UploadBlock";

const EquipmentReport: React.FC = () => {
    const { t } = useTranslation();

    const steps = [
        { number: 1, label: `${t('equipment.steps.1.label')}` },
        { number: 2, label: `${t('equipment.steps.2.label')}` },
        { number: 3, label: `${t('equipment.steps.3.label')}` },
        { number: 4, label: `${t('equipment.steps.4.label')}` },
    ];

    return (
        <div>
            <StepList steps={steps} activeStep={1} />
            <UploadBlock
                labelKey="equipment.upload.excel.label"
                buttonTextKey="equipment.upload.excel.button"
                subLabelKey="equipment.upload.excel.subLabel"
                accept=".xlsx,.xls"
                inputId="excel-upload"
            />

            <UploadBlock
                labelKey="equipment.upload.pdf.label"
                buttonTextKey="equipment.upload.pdf.button"
                subLabelKey="equipment.upload.pdf.subLabel"
                accept=".pdf"
                inputId="pdf-upload"
                buttonColor="bg-green-600 text-white"
            />

            <div className="flex justify-end mt-4">
            <button className="
                px-8 py-2 border 
                border-blue-600 text-blue-600 
                rounded-sm transition-colors font-semibold
                hover:bg-blue-600 hover:text-white"
            >
                {t('equipment.button')}
            </button>
            </div>

        </div>
    )
};

export default EquipmentReport;