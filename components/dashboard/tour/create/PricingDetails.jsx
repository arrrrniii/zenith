import React from 'react';
import { DollarSign, Users, AlertCircle, Info } from 'lucide-react';
import FormSection from './FormSection';
import { FormInput, FormTextarea } from './FormFields';
import { Alert, AlertDescription } from "@/components/ui/alert";

const PricingDetails = ({ 
  formData = {}, 
  updateFormData = () => {}, 
  errors = {} 
}) => {
  // Initialize form values with defaults
  const {
    pricePerPerson = '',
    maxCapacity = '',
    paymentDetails = '',
    refundPolicy = ''
  } = formData;

  // Handler for numeric inputs to ensure valid numbers
  const handleNumericInput = (field, value) => {
    if (value === '' || (!isNaN(value) && Number(value) >= 0)) {
      updateFormData(field, value);
    }
  };

  return (
    <FormSection 
      title="Price & Capacity"
      description="Set your tour pricing and group capacity."
      infoTooltip="Define pricing per person and maximum number of participants."
    >
      <div className="grid gap-6">
        {/* Price and Capacity Grid */}
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
                value={pricePerPerson}
                onChange={(e) => handleNumericInput('pricePerPerson', e.target.value)}
                className={`block w-full pl-10 rounded-md shadow-sm
                  ${errors?.pricePerPerson 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                placeholder="0.00"
                required
              />
            </div>
            {errors?.pricePerPerson && (
              <p className="text-sm text-red-600">{errors.pricePerPerson}</p>
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
                value={maxCapacity}
                onChange={(e) => handleNumericInput('maxCapacity', e.target.value)}
                className={`block w-full pl-10 rounded-md shadow-sm
                  ${errors?.maxCapacity 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                placeholder="Enter group size"
                required
              />
            </div>
            {errors?.maxCapacity && (
              <p className="text-sm text-red-600">{errors.maxCapacity}</p>
            )}
          </div>
        </div>

        {/* Capacity Warning */}
        {Number(maxCapacity) > 50 && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Large group sizes may require additional coordination and resources.
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Details */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Payment Details
            </label>
          </div>
          <FormTextarea
            value={paymentDetails}
            onChange={(e) => updateFormData('paymentDetails', e.target.value)}
            error={errors?.paymentDetails}
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
            value={refundPolicy}
            onChange={(e) => updateFormData('refundPolicy', e.target.value)}
            error={errors?.refundPolicy}
            placeholder="Detail your cancellation and refund policies"
            rows={3}
          />
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertDescription className="flex items-start gap-2">
            <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Pricing & Capacity Guidelines:</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Price per Person: Set the cost each participant will pay</li>
                <li>• Maximum Capacity: This limit applies to each tour date</li>
                <li>• Consider logistics and guide availability when setting capacity</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </FormSection>
  );
};

export default PricingDetails;