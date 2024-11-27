
// components/checkout/elements/ProgressSteps.js
import { motion } from 'framer-motion';

const steps = [
  { label: 'Guest Details', icon: '1' },
  { label: 'Payment', icon: '2' }
];

const ProgressSteps = ({ currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isComplete = currentStep > index + 1;
          const isCurrent = currentStep === index + 1;

          return (
            <div key={step.label} className="flex items-center">
              <div className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ 
                    scale: isCurrent ? 1 : 0.8,
                    backgroundColor: isComplete 
                      ? '#22C55E'
                      : isCurrent 
                        ? '#3B82F6' 
                        : '#E5E7EB'
                  }}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    text-white font-medium transition-colors duration-300
                  `}
                >
                  {isComplete ? '✓' : step.icon}
                </motion.div>
                <span className={`
                  ml-2 text-sm font-medium
                  ${isCurrent ? 'text-blue-600' : 'text-gray-600'}
                `}>
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="mx-4 h-0.5 w-20 bg-gray-200">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: isComplete ? '100%' : '0%' 
                    }}
                    className="h-full bg-blue-500 transition-all duration-500"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;