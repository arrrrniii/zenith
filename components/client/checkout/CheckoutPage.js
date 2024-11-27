// components/client/checkout/CheckoutPage.js
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import GuestDetails from './sections/GuestDetails';
import PaymentSection from './sections/PaymentSection';
import OrderSummary from './sections/OrderSummary';
import ProgressSteps from './elements/ProgressSteps';
// import TrustBadges from './elements/TrustBadges';
import ProcessingOverlay from './elements/ProcessingOverlay';
import HelpSection from './elements/HelpSection';
import { AlertCircle } from 'lucide-react';

const INITIAL_FORM_STATE = ({ quantity }) => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  participants: quantity,
  specialRequests: '',
  selectedAddOns: [],
  acceptedTerms: false,
  acceptedPrivacy: false
});

const CheckoutPage = ({ 
  tour, 
  onSubmit, 
  isProcessing, 
  error: bookingError,
  calculateTotal
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE({ quantity: tour.quantity }));
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        return false;
      }
    }

    if (currentStep === 2) {
      if (!selectedPaymentMethod) return false;
      if (!formData.acceptedTerms || !formData.acceptedPrivacy) return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      return;
    }

    if (step < 2) {
      setStep(step + 1);
      return;
    }

    try {
      await onSubmit({
        ...formData,
        paymentMethod: selectedPaymentMethod
      });
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 backdrop-blur-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ProgressSteps currentStep={step} />
            
            {/* Error Alert */}
            {bookingError && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">{bookingError}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {step === 1 && (
                <GuestDetails 
                  formData={formData}
                  onChange={handleFormChange}
                  tour={tour}
                  quantity={tour.quantity}
                />
              )}

              {step === 2 && (
                <PaymentSection
                  formData={formData}
                  setFormData={setFormData}
                  selectedPaymentMethod={selectedPaymentMethod}
                  setSelectedPaymentMethod={setSelectedPaymentMethod}
                  total={calculateTotal(formData)}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`
                    px-8 py-3 rounded-xl font-medium text-white
                    transition-all duration-300 transform
                    ${isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02]'
                    }
                  `}
                >
                  {isProcessing 
                    ? 'Processing...' 
                    : step === 2 
                      ? 'Complete Booking' 
                      : 'Continue'
                  }
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-6 space-y-6">
              <OrderSummary 
                tour={tour}
                formData={formData}
                totalAmount={calculateTotal(formData)}
              />
              {/* <TrustBadges /> */}
              <HelpSection />
            </div>
          </div>
        </div>

        {/* Processing Overlay */}
        <ProcessingOverlay isVisible={isProcessing} />
      </div>
    </div>
  );
};

export default CheckoutPage;