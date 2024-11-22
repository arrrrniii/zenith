// components/dashboard/attractions/components/FormComponents.js
import React from 'react';
import { 
  MapPin as MapPinIcon,
  Globe as GlobeIcon, 
  Phone as PhoneIcon, 
  Clock as ClockIcon, 
  DollarSign as DollarSignIcon 
} from 'lucide-react';

export const FormSection = ({ title, children }) => (
  <div className="border rounded-lg bg-white p-6 space-y-4">
    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    {children}
  </div>
);

export const FormField = ({ label, error, required, children, description }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {description && (
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    )}
    {children}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const formatPhoneNumber = (value) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  if (phoneNumber.length < 4) return phoneNumber;
  if (phoneNumber.length < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

const formatTime = (value) => {
  if (!value) return value;
  value = value.replace(/[^\d: ]/g, '');
  const parts = value.split(' ');
  return parts.map(part => {
    if (!part.includes(':') && part.length >= 2) {
      return `${part.slice(0, 2)}:${part.slice(2, 4)}`;
    }
    return part;
  }).join(' ');
};

const formatCurrency = (value) => {
  if (!value) return value;
  value = value.replace(/[^\d$\-]/g, '');
  if (value.startsWith('$')) {
    return value;
  }
  return `$${value}`;
};

export const IconInput = ({ 
  icon: Icon, 
  type = 'text',
  formatter,
  validator,
  placeholder,
  error,
  ...props 
}) => (
  <div className="mt-1 relative rounded-md shadow-sm">
    {Icon && (
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
    )}
    <input
      {...props}
      type={type}
      placeholder={placeholder}
      className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} rounded-md border ${
        error ? 'border-red-500' : 'border-gray-300'
      } focus:border-blue-500 focus:ring-blue-500`}
      onChange={(e) => {
        let value = e.target.value;
        if (formatter) {
          value = formatter(value);
        }
        if (props.onChange) {
          e.target.value = value;
          props.onChange(e);
        }
      }}
      onBlur={(e) => {
        if (validator && props.onChange) {
          const validatedValue = validator(e.target.value);
          if (validatedValue !== e.target.value) {
            e.target.value = validatedValue;
            props.onChange(e);
          }
        }
        if (props.onBlur) {
          props.onBlur(e);
        }
      }}
    />
  </div>
);

export const AddressInput = (props) => (
  <IconInput 
    icon={MapPinIcon}
    placeholder="Enter full address"
    {...props} 
  />
);

export const WebsiteInput = (props) => (
  <IconInput 
    icon={GlobeIcon}
    type="url"
    placeholder="https://example.com"
    validator={(value) => {
      if (value && !value.startsWith('http')) {
        return `https://${value}`;
      }
      return value;
    }}
    {...props}
  />
);

export const PhoneInput = (props) => (
  <IconInput 
    icon={PhoneIcon}
    type="tel"
    placeholder="(555) 000-0000"
    formatter={formatPhoneNumber}
    validator={(value) => {
      if (!value) return value;
      return value.replace(/[^\d()-\s]/g, '');
    }}
    {...props}
  />
);

export const HoursInput = (props) => (
  <IconInput 
    icon={ClockIcon}
    placeholder="09:00 - 17:00"
    formatter={formatTime}
    {...props}
  />
);

export const PriceInput = (props) => (
  <IconInput 
    icon={DollarSignIcon}
    placeholder="$0 - $100"
    formatter={formatCurrency}
    validator={(value) => {
      if (!value) return value;
      return value.replace(/[^\d$\-]/g, '');
    }}
    {...props}
  />
);

export const TimeInput = (props) => (
  <IconInput
    icon={ClockIcon}
    type="time"
    {...props}
  />
);

export const NumericInput = ({ 
  icon, 
  min, 
  max, 
  allowDecimals = false,
  ...props 
}) => (
  <IconInput
    icon={icon}
    type="number"
    min={min}
    max={max}
    step={allowDecimals ? "0.01" : "1"}
    formatter={(value) => {
      if (!value) return value;
      return allowDecimals 
        ? value.replace(/[^\d.]/g, '')
        : value.replace(/[^\d]/g, '');
    }}
    validator={(value) => {
      if (!value) return value;
      let num = parseFloat(value);
      if (min !== undefined) num = Math.max(min, num);
      if (max !== undefined) num = Math.min(max, num);
      return allowDecimals ? num.toFixed(2) : Math.floor(num).toString();
    }}
    {...props}
  />
);