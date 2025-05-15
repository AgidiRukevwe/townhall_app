interface ProgressStepsProps {
  steps: number;
  currentStep: number;
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        {Array.from({ length: steps }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full flex-1 mx-0.5 ${
              i < currentStep ? "bg-primary" : "bg-gray-200"
            }`}
          ></div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        {Array.from({ length: steps }).map((_, i) => (
          <div key={i} className="flex-1 text-center">
            Step {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
