// components/dashboard/tour/create/PricingDetails.jsx
import React from 'react';
import { DollarSign, Users, AlertCircle, Info, Percent } from 'lucide-react';
import FormSection from './FormSection';
import { FormTextarea } from './FormFields';
import { Alert, AlertDescription } from "@/components/ui/alert";

const PricingDetails = ({ 
  formData = {}, 
  updateFormData = () => {}, 
  errors = {} 
}) => {
  const {
    pricePerPerson = '',
    maxCapacity = '',
    earlyBirdDiscount = 0,
    groupDiscount = 0,
    paymentDetails = '',
    refundPolicy = '',
    depositRequirements = ''
  } = formData || {};

  const handlePriceChange = (e) => {
    const value = e.target.value;
    updateFormData('pricePerPerson', value === '' ? '' : parseFloat(value));
  };

  const handleCapacityChange = (e) => {
    const value = e.target.value;
    updateFormData('maxCapacity', value === '' ? '' : parseInt(value, 10));
  };

  const handleEarlyBirdChange = (e) => {
    const value = e.target.value;
    updateFormData('earlyBirdDiscount', value === '' ? 0 : parseFloat(value));
  };

  const handleGroupDiscountChange = (e) => {
    const value = e.target.value;
    updateFormData('groupDiscount', value === '' ? 0 : parseFloat(value));
  };

  const handlePaymentDetailsChange = (e) => {
    updateFormData('paymentDetails', e.target.value || '');
  };

  const handleRefundPolicyChange = (e) => {
    updateFormData('refundPolicy', e.target.value || '');
  };

  const displayValue = (value) => {
    if (value === null || value === undefined || value === '') return '';
    return value.toString();
  };

  return (
    <FormSection 
      title="Price & Capacity"
      description="Set your tour pricing and group capacity."
      infoTooltip="Define pricing per person, group capacity, discounts, and payment/refund details."
    >
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price Per Person */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="pricePerPerson">
              Price per Person *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="pricePerPerson"
                type="number"
                min="0"
                step="0.01"
                value={displayValue(pricePerPerson)}
                onChange={handlePriceChange}
                className={`block w-full pl-10 rounded-md shadow-sm
                  ${errors?.['pricePerPerson'] 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                placeholder="0.00"
                required
              />
            </div>
            {errors?.['pricePerPerson'] && (
              <p className="text-sm text-red-600">{errors['pricePerPerson']}</p>
            )}
          </div>

          {/* Maximum Capacity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="maxCapacity">
              Maximum Capacity per Date *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="maxCapacity"
                type="number"
                min="1"
                value={displayValue(maxCapacity)}
                onChange={handleCapacityChange}
                className={`block w-full pl-10 rounded-md shadow-sm
                  ${errors?.['maxCapacity'] 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                placeholder="Enter group size"
                required
              />
            </div>
            {errors?.['maxCapacity'] && (
              <p className="text-sm text-red-600">{errors['maxCapacity']}</p>
            )}
          </div>
        </div>

        {Number(maxCapacity) > 50 && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Large group sizes may require additional coordination and resources.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Early Bird Discount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="earlyBirdDiscount">
              Early Bird Discount (%)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Percent className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="earlyBirdDiscount"
                type="number"
                min="0"
                max="100"
                step="1"
                value={displayValue(earlyBirdDiscount)}
                onChange={handleEarlyBirdChange}
                className={`block w-full pl-10 rounded-md shadow-sm
                  ${errors?.['earlyBirdDiscount'] 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                placeholder="0"
              />
            </div>
            {errors?.['earlyBirdDiscount'] && (
              <p className="text-sm text-red-600">{errors['earlyBirdDiscount']}</p>
            )}
          </div>

          {/* Group Discount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="groupDiscount">
              Group Discount (%)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Percent className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="groupDiscount"
                type="number"
                min="0"
                max="100"
                step="1"
                value={displayValue(groupDiscount)}
                onChange={handleGroupDiscountChange}
                className={`block w-full pl-10 rounded-md shadow-sm
                  ${errors?.['groupDiscount'] 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                placeholder="0"
              />
            </div>
            {errors?.['groupDiscount'] && (
              <p className="text-sm text-red-600">{errors['groupDiscount']}</p>
            )}
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Payment Details
            </label>
          </div>
          <FormTextarea
            value={paymentDetails || ''}
            onChange={handlePaymentDetailsChange}
            error={errors?.['paymentDetails']}
            placeholder="Specify payment methods and requirements"
            rows={3}
          />
        </div>

        {/* Refund Policy */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Refund Policy
            </label>
          </div>
          <FormTextarea
            value={refundPolicy || ''}
            onChange={handleRefundPolicyChange}
            error={errors?.['refundPolicy']}
            placeholder="Detail your cancellation and refund policies"
            rows={3}
          />
        </div>

        <Alert>
          <AlertDescription className="flex items-start gap-2">
            <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Pricing & Capacity Guidelines:</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Price per Person: Set the cost each participant will pay</li>
                <li>• Maximum Capacity: Limit applies to each tour date</li>
                <li>• Early Bird & Group Discounts: Set percentage discounts (0-100%)</li>
                <li>• Provide detailed Payment Details and Refund Policy</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </FormSection>
  );
};

export default PricingDetails;
