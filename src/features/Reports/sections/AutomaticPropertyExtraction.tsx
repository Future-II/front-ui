import React, { useState } from "react";
import { columns, reportData } from "../components/data";
import SelectStep from "../components/SelectStep";
import VerifyStep from "../components/VerifyStep";
import SendStep from "../components/SendStep";
import ResultStep from "../components/ResultStep";
import Stepper from "../components/Stepper";            
import type { ProgressStage, WorkflowStep } from "../components/types";

const AutomaticPropertyExtraction: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [progressStage, setProgressStage] = useState<ProgressStage>("withdraw");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("select");
  const [processingResult, setProcessingResult] = useState<"success" | "error" | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<Record<number, boolean>>({});

  const handleRowSelect = (rowId: number) => {
    setSelectedRows((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows((prev) =>
      prev.length === reportData.length ? [] : reportData.map((_, index) => index)
    );
  };

  const startProcess = () => {
    setCurrentStep("verify");
    const initial: Record<number, boolean> = {};
    selectedRows.forEach((rowIndex) => (initial[rowIndex] = true));
    setVerificationStatus(initial);
  };

  const startSendingProcess = () => {
    setCurrentStep("send");
    setIsProcessing(true);
    setProgressStage("withdraw");
    setProgressPercentage(0);

    const withdraw = setInterval(() => {
      setProgressPercentage((p) => {
        if (p >= 100) {
          clearInterval(withdraw);
          setProgressStage("verify");
          setProgressPercentage(0);

          const verify = setInterval(() => {
            setProgressPercentage((p2) => {
              if (p2 >= 100) {
                clearInterval(verify);
                setProgressStage("send");
                setProgressPercentage(0);

                const send = setInterval(() => {
                  setProgressPercentage((p3) => {
                    if (p3 >= 100) {
                      clearInterval(send);
                      setIsProcessing(false);
                      setCurrentStep("result");
                      setProcessingResult(Math.random() > 0.2 ? "success" : "error");
                      return 100;
                    }
                    return p3 + 5;
                  });
                }, 200);

                return 100;
              }
              return p2 + 5;
            });
          }, 150);

          return 100;
        }
        return p + 2;
      });
    }, 100);
  };

  const cancelProcess = () => {
    setIsProcessing(false);
    setCurrentStep("select");
  };

  const resetWorkflow = () => {
    setCurrentStep("select");
    setSelectedRows([]);
    setProcessingResult(null);
    setProgressPercentage(0);
    setIsProcessing(false);
  };

  const toggleVerificationStatus = (rowIndex: number) => {
    setVerificationStatus((prev) => ({ ...prev, [rowIndex]: !prev[rowIndex] }));
  };

  return (
    <>
      <Stepper current={currentStep} />

      {(() => {
        switch (currentStep) {
          case "select":
            return (
              <SelectStep
                columns={columns}
                data={reportData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedRows={selectedRows}
                onRowSelect={handleRowSelect}
                onSelectAll={handleSelectAll}
                onContinue={startProcess}
              />
            );
          case "verify":
            return (
              <VerifyStep
                reportData={reportData}
                selectedRows={selectedRows}
                verificationStatus={verificationStatus}
                toggleVerificationStatus={toggleVerificationStatus}
                setCurrentStep={setCurrentStep}
                startSendingProcess={startSendingProcess}
              />
            );
          case "send":
            return (
              <SendStep
                progressPercentage={progressPercentage}
                progressStage={progressStage}
                cancelProcess={cancelProcess}
              />
            );
          case "result":
            return (
              <ResultStep
                processingResult={processingResult}
                selectedCount={selectedRows.length}
                resetWorkflow={resetWorkflow}
              />
            );
          default:
            return null;
        }
      })()}
    </>
  );
};

export default AutomaticPropertyExtraction;
