import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const FormInput = ({ 
  label, 
  error, 
  className, 
  value = '', // Add default empty string
  type = 'text',
  required,
  leftIcon: LeftIcon,
  ...props 
}) => (
  <div className="space-y-2">
    {label && (
      <Label htmlFor={props.id || props.name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
    )}
    <div className="relative">
      {LeftIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LeftIcon className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      <Input 
        {...props}
        type={type}
        value={value ?? ''} // Ensure value is never null/undefined
        className={cn(
          LeftIcon && "pl-10",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        aria-invalid={!!error}
        required={required}
      />
    </div>
    {error && (
      <p className="text-sm font-medium text-destructive">{error}</p>
    )}
  </div>
);

export const FormTextarea = ({ 
  label, 
  error, 
  className, 
  value = '', // Add default empty string
  required,
  rows = 3,
  ...props 
}) => (
  <div className="space-y-2">
    {label && (
      <Label htmlFor={props.id || props.name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
    )}
    <Textarea 
      {...props}
      value={value ?? ''} // Ensure value is never null/undefined
      className={cn(
        error && "border-destructive focus-visible:ring-destructive",
        className
      )}
      aria-invalid={!!error}
      required={required}
      rows={rows}
    />
    {error && (
      <p className="text-sm font-medium text-destructive">{error}</p>
    )}
  </div>
);

export const FormSelect = ({
  label,
  error,
  options = [], // Add default empty array
  value = '', // Add default empty string
  onChange,
  placeholder = "Select an option",
  className,
  required,
  ...props
}) => (
  <div className="space-y-2">
    {label && (
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
    )}
    <Select
      value={value ?? ''} // Ensure value is never null/undefined
      onValueChange={onChange}
      {...props}
    >
      <SelectTrigger 
        className={cn(
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && (
      <p className="text-sm font-medium text-destructive">{error}</p>
    )}
  </div>
);

export const FormNumberInput = ({
  label,
  error,
  leftIcon: LeftIcon,
  className,
  value = '', // Add default empty string
  onChange,
  required,
  min,
  max,
  step,
  ...props
}) => {
  // Handler for numeric inputs
  const handleChange = (e) => {
    const newValue = e.target.value;
    // Allow empty string or valid numbers within range
    if (
      newValue === '' || 
      (!isNaN(newValue) && 
        (min === undefined || Number(newValue) >= min) &&
        (max === undefined || Number(newValue) <= max)
      )
    ) {
      onChange?.(e);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id || props.name}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <Input
          type="number"
          value={value ?? ''} // Ensure value is never null/undefined
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          {...props}
          className={cn(
            LeftIcon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          aria-invalid={!!error}
          required={required}
        />
      </div>
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
};

export const FormInlineInput = ({
  label,
  error,
  className,
  value = '', // Add default empty string
  required,
  leftIcon: LeftIcon,
  ...props
}) => (
  <div className="flex items-center gap-4">
    {label && (
      <Label
        htmlFor={props.id || props.name}
        className="flex-shrink-0 min-w-[120px]"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
    )}
    <div className="flex-1 relative">
      {LeftIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LeftIcon className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      <Input 
        {...props}
        value={value ?? ''} // Ensure value is never null/undefined
        className={cn(
          LeftIcon && "pl-10",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        aria-invalid={!!error}
        required={required}
      />
      {error && (
        <p className="mt-1 text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  </div>
);