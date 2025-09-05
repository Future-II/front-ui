import React from "react";
import { t } from "i18next";
import type { WorkflowStep } from "../components/types";
import { CheckCircle, FileText, Upload, Clock, Loader } from "lucide-react";

const Stepper: React.FC<{ current: WorkflowStep; loading?: boolean }> = ({ 
  current, 
  loading = false 
}) => {
  const steps: Array<{ key: WorkflowStep; label: string; icon: React.ReactNode }> = [
    { 
      key: "verify", 
      label: t("mekyas.stepper2.dataVerification") || "Data Verification", 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      key: "prepare", 
      label: t("mekyas.stepper2.preparingForms") || "Preparing Forms", 
      icon: <Clock className="h-5 w-5" /> 
    },
    { 
      key: "upload", 
      label: t("mekyas.stepper2.uploadingData") || "Uploading Data", 
      icon: loading ? <Loader className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" /> 
    },
    { 
      key: "completed", 
      label: t("mekyas.stepper2.completed") || "Completed", 
      icon: <CheckCircle className="h-5 w-5" /> 
    },
  ];

  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <div className="mb-6">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
        <div className="flex items-center">
          {steps.map((s, i) => {
            const isActive = i === currentIndex;
            const isDone = i < currentIndex;

            return (
              <React.Fragment key={s.key}>
                <div className="flex flex-col items-center min-w-[140px]">
                  <div
                    className={[
                      "flex items-center justify-center h-9 w-9 rounded-full",
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : isDone
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200",
                    ].join(" ")}
                  >
                    {s.icon}
                  </div>
                  <div
                    className={[
                      "mt-2 text-sm text-center",
                      isActive ? "text-blue-700 font-medium" : "text-gray-600",
                    ].join(" ")}
                  >
                    {s.label}
                  </div>
                </div>

                {i < steps.length - 1 && (
                  <div
                    className={[
                      "flex-1 h-[2px] mx-3",
                      i < currentIndex ? "bg-blue-200" : "bg-gray-200",
                    ].join(" ")}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stepper;