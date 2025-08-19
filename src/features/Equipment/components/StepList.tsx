import React from "react";
import StepItem from "./StepItem";

type StepListProps = {
    steps: { number: number; label: string }[];
    activeStep: number;
};

const StepList: React.FC<StepListProps> = ({ steps, activeStep }) => {
    return (
        <div className="
        flex items-center 
        justify-center w-full 
        bg-white p-4 rounded-lg 
        border border-gray-200"
        >
            <div className="flex items-center w-full max-w-4xl">
                {steps.map((step, idx) => (
                    <React.Fragment key={step.number}>
                        <StepItem
                            number={step.number}
                            label={step.label}
                            active={activeStep === step.number}
                        />
                        {idx < steps.length - 1 && (
                            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default StepList;
