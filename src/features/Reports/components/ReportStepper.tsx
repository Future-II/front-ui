const Stepper = () => {
  const steps = ["بيانات التقرير", "رفع تقرير Excel", "نتيجة إرسال التقارير"];
  return (
    <div className="flex justify-center items-center gap-10 mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex flex-col items-center">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
              i === 0
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 text-gray-500"
            }`}
          >
            {i + 1}
          </div>
          <span
            className={`mt-2 text-sm ${
              i === 0 ? "text-blue-600 font-semibold" : "text-gray-500"
            }`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
