// components/checkout/sections/PaymentSection.js
import { Card } from '@/components/ui/card';
import { CreditCard, PaypalIcon } from 'lucide-react';
import Image from 'next/image';

const PaymentGateways = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  GOOGLEPAY: 'googlepay',
  APPLEPAY: 'applepay'
};

const PaymentMethodCard = ({ 
  method, 
  title, 
  icon: Icon, 
  description,
  isAvailable = true,
  isSelected,
  onSelect 
}) => (
  <button
    disabled={!isAvailable}
    onClick={() => onSelect(method)}
    className={`
      w-full p-4 rounded-2xl border transition-all duration-300
      ${isSelected 
        ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500 ring-opacity-50' 
        : 'border-gray-200 hover:border-gray-300'
      }
      ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
    `}
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm">
        {typeof Icon === 'string' ? (
          <Image src={Icon} width={24} height={24} alt={title} />
        ) : (
          <Icon className="w-6 h-6" />
        )}
      </div>
      <div className="flex-1 text-left">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      {isAvailable && (
        <div className={`
          w-5 h-5 rounded-full border-2 
          ${isSelected 
            ? 'border-blue-500 bg-blue-500' 
            : 'border-gray-300'
          }
        `}>
          {isSelected && (
            <div className="w-full h-full rounded-full bg-white scale-[0.4]" />
          )}
        </div>
      )}
    </div>
  </button>
);

const PaymentSection = ({ formData, setFormData, selectedPaymentMethod, setSelectedPaymentMethod }) => {
  const handleTermsChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Payment Method</h2>
        <div className="space-y-4">
          <PaymentMethodCard
            method={PaymentGateways.STRIPE}
            title="Credit or Debit Card"
            description="Pay securely with your card"
            icon={CreditCard}
            isSelected={selectedPaymentMethod === PaymentGateways.STRIPE}
            onSelect={setSelectedPaymentMethod}
          />
          <PaymentMethodCard
            method={PaymentGateways.PAYPAL}
            title="PayPal"
            description="Pay with your PayPal account"
            icon="/paypal-icon.svg"
            isSelected={selectedPaymentMethod === PaymentGateways.PAYPAL}
            onSelect={setSelectedPaymentMethod}
          />
          <PaymentMethodCard
            method={PaymentGateways.GOOGLEPAY}
            title="Google Pay"
            description="Pay with Google Pay"
            icon="/gpay-icon.svg"
            isSelected={selectedPaymentMethod === PaymentGateways.GOOGLEPAY}
            onSelect={setSelectedPaymentMethod}
            isAvailable={false}
          />
          <PaymentMethodCard
            method={PaymentGateways.APPLEPAY}
            title="Apple Pay"
            description="Quick and secure checkout"
            icon="/apple-pay-icon.svg"
            isSelected={selectedPaymentMethod === PaymentGateways.APPLEPAY}
            onSelect={setSelectedPaymentMethod}
          />
        </div>
      </div>

      {/* Terms and Privacy Policy */}
      <Card className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            name="acceptedTerms"
            checked={formData.acceptedTerms}
            onChange={handleTermsChange}
            className="mt-1"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the <a href="#" className="text-blue-600">Terms & Conditions</a> and acknowledge that my booking is subject to the cancellation policy
          </label>
        </div>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="privacy"
            name="acceptedPrivacy"
            checked={formData.acceptedPrivacy}
            onChange={handleTermsChange}
            className="mt-1"
          />
          <label htmlFor="privacy" className="text-sm text-gray-600">
            I agree to the <a href="#" className="text-blue-600">Privacy Policy</a> and consent to receiving booking-related communications
          </label>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSection;
