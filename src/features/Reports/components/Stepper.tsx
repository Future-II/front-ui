import React from "react";
import type { WorkflowStep } from "../components/types";

const Stepper: React.FC<{ current: WorkflowStep }> = ({ current }) => {
  const steps: Array<{ key: WorkflowStep; label: string; n: number }> = [
    { key: "select", label: "Select reports", n: 1 },
    { key: "verify", label: "Data verification", n: 2 },
    { key: "send", label: "Send reports", n: 3 },
    { key: "result", label: "The result", n: 4 },
  ];
  const idx = steps.findIndex((s) => s.key === current);

  return (
    <div className="mb-6">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
        <div className="flex items-center">
          {steps.map((s, i) => {
            const isActive = i === idx;
            const isDone = i < idx;
            return (
              <React.Fragment key={s.key}>
                <div className="flex flex-col items-center min-w-[140px]">
                  <div
                    className={[
                      "flex items-center justify-center h-9 w-9 rounded-full text-sm font-semibold",
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : isDone
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200",
                    ].join(" ")}
                  >
                    {s.n}
                  </div>
                  <div className={["mt-2 text-sm", isActive ? "text-blue-700 font-medium" : "text-gray-600"].join(" ")}>
                    {s.label}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className={["flex-1 h-[2px] mx-3", i < idx ? "bg-blue-200" : "bg-gray-200"].join(" ")} />
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
