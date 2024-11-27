// components/checkout/elements/ProcessingOverlay.js
import { motion, AnimatePresence } from 'framer-motion';

const ProcessingOverlay = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full mx-4"
          >
            <div className="text-center">
              <div className="relative mx-auto w-16 h-16 mb-4">
                {/* Outer spinning circle */}
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                {/* Inner pulsing circle */}
                <div className="absolute inset-2 rounded-full bg-blue-100 animate-pulse" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Processing your payment
              </h3>
              <p className="text-gray-600 mb-4">
                Please don't close this window...
              </p>
              
              {/* Processing steps */}
              <div className="space-y-2 text-sm text-left mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-600">Verifying your details</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-gray-900 font-medium">Processing payment</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  <span className="text-gray-600">Confirming your booking</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProcessingOverlay;
