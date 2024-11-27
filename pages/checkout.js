import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { 
  User, Mail, Phone, Calendar, 
  Clock, Users, AlertCircle, Shield,
  CreditCard, PaypalIcon, Info,
  ChevronRight, ChevronDown, Star
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const PaymentGateways = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  GOOGLEPAY: 'googlepay',
  APPLEPAY: 'applepay'
};

const CheckoutPage = ({
  tour = {},
  selectedDate = null,
  onSubmit = () => {},
}) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    // Customer Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Add-ons & Preferences
    participants: 1,
    specialRequests: '',
    selectedAddOns: [],
    // Terms
    acceptedTerms: false,
    acceptedPrivacy: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const PaymentMethodCard = ({ 
    method, 
    title, 
    icon, 
    description,
    isAvailable = true 
  }) => (
    <button
      disabled={!isAvailable}
      onClick={() => setSelectedPaymentMethod(method)}
      className={`
        w-full p-4 rounded-2xl border transition-all duration-300
        ${selectedPaymentMethod === method 
          ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500 ring-opacity-50' 
          : 'border-gray-200 hover:border-gray-300'
        }
        ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm">
          {icon}
        </div>
        <div className="flex-1 text-left">
          <div className="font-medium">{title}</div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>
        {isAvailable && (
          <div className={`
            w-5 h-5 rounded-full border-2 
            ${selectedPaymentMethod === method 
              ? 'border-blue-500 bg-blue-500' 
              : 'border-gray-300'
            }
          `}>
            {selectedPaymentMethod === method && (
              <div className="w-full h-full rounded-full bg-white scale-[0.4]" />
            )}
          </div>
        )}
      </div>
    </button>
  );

  const OrderSummaryCard = () => (
    <Card className="overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Trip Summary</h3>
        
        <div className="space-y-6">
          {/* Tour Image and Basic Info */}
          <div className="flex gap-4">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={tour.image}
                alt={tour.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">{tour.title}</h4>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                <span>{tour.rating}</span>
                <span>·</span>
                <span>{tour.reviewCount} reviews</span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{tour.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-gray-600">Tour Price</span>
              <span className="font-medium">${tour.price}</span>
            </div>
            {formData.selectedAddOns.map(addon => (
              <div key={addon.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{addon.name}</span>
                <span>${addon.price}</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold pt-3 border-t">
              <span>Total</span>
              <span>${tour.price + formData.selectedAddOns.reduce((acc, curr) => acc + curr.price, 0)}</span>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="p-4 bg-gray-50 rounded-xl text-sm space-y-2">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium text-gray-900">Free cancellation</span>
                <p className="text-gray-600">Cancel up to 24 hours before your trip for a full refund</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Guest Details</h2>
              <Card className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Available Add-ons</h2>
              <div className="space-y-4">
                {tour.addOns?.map(addon => (
                  <Card key={addon.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        id={`addon-${addon.id}`}
                        checked={formData.selectedAddOns.includes(addon)}
                        onChange={() => {
                          setFormData(prev => ({
                            ...prev,
                            selectedAddOns: prev.selectedAddOns.includes(addon)
                              ? prev.selectedAddOns.filter(a => a.id !== addon.id)
                              : [...prev.selectedAddOns, addon]
                          }));
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor={`addon-${addon.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {addon.name}
                        </label>
                        <p className="text-sm text-gray-600 mt-1">{addon.description}</p>
                        <p className="text-sm font-medium text-gray-900 mt-2">
                          ${addon.price}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              <div className="space-y-4">
                <PaymentMethodCard
                  method={PaymentGateways.STRIPE}
                  title="Credit or Debit Card"
                  description="Pay securely with your card"
                  icon={<CreditCard className="w-6 h-6" />}
                />
                <PaymentMethodCard
                  method={PaymentGateways.PAYPAL}
                  title="PayPal"
                  description="Pay with your PayPal account"
                  icon={<Image src="/paypal-icon.svg" width={24} height={24} alt="PayPal" />}
                />
                <PaymentMethodCard
                  method={PaymentGateways.GOOGLEPAY}
                  title="Google Pay"
                  description="Pay with Google Pay"
                  icon={<Image src="/gpay-icon.svg" width={24} height={24} alt="Google Pay" />}
                  isAvailable={false}
                />
                <PaymentMethodCard
                  method={PaymentGateways.APPLEPAY}
                  title="Apple Pay"
                  description="Quick and secure checkout"
                  icon={<Image src="/apple-pay-icon.svg" width={24} height={24} alt="Apple Pay" />}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <label htmlFor="privacy" className="text-sm text-gray-600">
                  I agree to the <a href="#" className="text-blue-600">Privacy Policy</a> and consent to receiving booking-related communications
                </label>
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Handle different payment methods
      switch (selectedPaymentMethod) {
        case PaymentGateways.STRIPE:
          // Redirect to Stripe checkout
          break;
        case PaymentGateways.PAYPAL:
          // Redirect to PayPal
          break;
        case PaymentGateways.APPLEPAY:
          // Handle Apple Pay
          break;
        default:
          throw new Error('Please select a payment method');
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 backdrop-blur-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {['Guest Details', 'Payment'].map((label, index) => (
                  <div
                    key={label}
                    className="flex items-center"
                  >
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full
                      ${step > index 
                        ? 'bg-green-500 text-white' 
                        : step === index + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }
                    `}>
                      {step > index ? '✓' : index + 1}
                    </div>
                    <span className={`
                      ml-2 text-sm font-medium
                      ${step === index + 1? 'text-blue-600'
                        : 'text-gray-600'
                      }`}>
                        {label}
                      </span>
                      {index < 1 && (
                        <div className="mx-4 h-0.5 w-20 bg-gray-200">
                          <div className={`h-full bg-blue-500 transition-all duration-500 ${
                            step > index + 1 ? 'w-full' : 'w-0'
                          }`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {renderStep()}
  
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
                    type={step === 2 ? 'submit' : 'button'}
                    onClick={() => step < 2 && setStep(step + 1)}
                    disabled={isProcessing || (step === 2 && !selectedPaymentMethod)}
                    className={`
                      px-8 py-3 rounded-xl font-medium text-white
                      transition-all duration-300 transform
                      ${isProcessing || (step === 2 && !selectedPaymentMethod)
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
  
            {/* Order Summary Sidebar */}
            <div>
              <div className="sticky top-6">
                <OrderSummaryCard />
                
                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div className="text-sm">
                        <p className="font-medium">Secure Booking</p>
                        <p className="text-gray-600">SSL encryption</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div className="text-sm">
                        <p className="font-medium">Instant Confirmation</p>
                        <p className="text-gray-600">Quick & easy</p>
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* Need Help Section */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Need help?</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Our travel experts are here to assist you.
                      </p>
                      <div className="mt-3 space-y-2">
                        <a 
                          href="tel:+1234567890" 
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Phone className="w-4 h-4" />
                          +1 (234) 567-890
                        </a>
                        <a 
                          href="mailto:support@example.com" 
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Mail className="w-4 h-4" />
                          support@example.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Payment Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto" />
                <p className="mt-4 text-lg font-medium">Processing your payment</p>
                <p className="mt-2 text-gray-600">Please dont close this window...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default CheckoutPage;