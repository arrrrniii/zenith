import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useForm } from '../../../hooks/useForm';

export const FormBlock = ({ content, serviceId }) => {
  const { toast } = useToast();
  const recaptchaRef = React.useRef(null);
  const [successData, setSuccessData] = useState(null);

  const {
    formData,
    isSubmitting,
    submitError,
    submitSuccess,
    submitForm,
    handleFieldChange,
    resetForm,
    setSubmitSuccess
  } = useForm({
    formType: content.formType || 'contact',
    serviceId,
    onSuccess: (data) => {
      console.log('Form submitted successfully:', data);
      setSuccessData(data);
      setSubmitSuccess(true);
    },
    onError: (error) => {
      console.error('Form submission failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit form. Please try again.",
        duration: 5000,
      });
    },
    resetOnSuccess: true
  });

  const {
    formId = `form-${Date.now()}`,
    title = 'Contact Us',
    description = 'Get in touch with us',
    submitButtonText = 'Send Message',
    fields = [],
    styles = {
      backgroundColor: 'transparent',
      borderRadius: '0.5rem',
      padding: '2rem',
      maxWidth: '2xl'
    },
    validation = {
      emailPattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      phonePattern: '^\\+?[\\d\\s-]{8,}$',
      minMessageLength: 10,
      maxMessageLength: 1000
    }
  } = content;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Always try to get reCAPTCHA token
      let recaptchaToken = null;
      try {
        recaptchaToken = await recaptchaRef.current?.executeAsync();
        if (!recaptchaToken) {
          throw new Error('Please complete the verification to submit the form.');
        }
      } catch (error) {
        console.error('reCAPTCHA error:', error);
        toast({
          variant: "destructive",
          title: "Verification Required",
          description: "Please complete the security verification and try again.",
          duration: 5000,
        });
        return;
      }

      // Prepare form data
      const formSubmission = {
        fields: fields.filter(field => field.enabled !== false),
        formType: content.formType || 'contact',
        serviceId,
        formData,
        content,
        recaptchaToken,
        extraData: {
          formId,
          source: window.location.pathname,
          timestamp: new Date().toISOString()
        }
      };

      await submitForm(formSubmission);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Calculate width class based on field configuration
  const getWidthClass = (width) => {
    switch (width) {
      case 'half': return 'md:w-1/2';
      case 'third': return 'md:w-1/3';
      case 'two-thirds': return 'md:w-2/3';
      default: return 'w-full';
    }
  };

  // Render success message
  if (submitSuccess && successData) {
    const { message, title, successTitle, successMessage } = successData;
    return (
      <div
        style={{
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius,
          padding: styles.padding
        }}
        className={cn(
          "border rounded-lg p-6",
          `max-w-${styles.maxWidth || '2xl'} mx-auto`
        )}
      >
        <div className="text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
          <h3 className="text-xl font-semibold text-green-700">
            {successTitle || title}
          </h3>
          <p className="text-gray-600">
            {successMessage || message}
          </p>
          {successData.showResetButton !== false && (
            <Button
              variant="outline"
              onClick={() => {
                setSubmitSuccess(false);
                setSuccessData(null);
                resetForm();
              }}
            >
              Send another message
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Render form
  return (
    <div
      style={{
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        padding: styles.padding
      }}
      className={cn(
        "border rounded-lg",
        `max-w-${styles.maxWidth || '2xl'} mx-auto`
      )}
    >
      <div className="space-y-4">
        {title && (
          <h2 className="text-2xl font-bold">
            {title}
          </h2>
        )}
        
        {description && (
          <p className="text-gray-600">
            {description}
          </p>
        )}

        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {submitError}
            </AlertDescription>
          </Alert>
        )}

        <form 
          onSubmit={handleSubmit} 
          className="space-y-4"
        >
          <div className="flex flex-wrap gap-4">
            {fields
              .filter(field => field.enabled !== false)
              .map((field) => (
                <div 
                  key={field.id} 
                  className={cn(
                    "space-y-2",
                    getWidthClass(field.width)
                  )}
                >
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                    )}
                  </Label>

                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      required={field.required}
                      disabled={isSubmitting}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      value={formData[field.id] || ''}
                      className="min-h-[100px]"
                      rows={field.rows || 4}
                      maxLength={validation.maxMessageLength}
                      minLength={validation.minMessageLength}
                    />
                  ) : field.type === 'select' ? (
                    <Select
                      disabled={isSubmitting}
                      onValueChange={(value) => handleFieldChange(field.id, value)}
                      value={formData[field.id] || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      disabled={isSubmitting}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      value={formData[field.id] || ''}
                      className={cn(
                        field.type === 'email' && 'lowercase',
                        field.type === 'tel' && 'font-mono'
                      )}
                      pattern={
                        field.type === 'email' 
                          ? validation.emailPattern 
                          : field.type === 'tel' 
                            ? validation.phonePattern 
                            : undefined
                      }
                    />
                  )}

                  {field.helpText && (
                    <p className="text-sm text-muted-foreground">
                      {field.helpText}
                    </p>
                  )}
                </div>
            ))}
          </div>

          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          />

          <Button 
            type="submit" 
            className={cn(
              "w-full",
              "transition-all duration-200",
              isSubmitting && "opacity-80"
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </span>
            ) : submitButtonText}
          </Button>

          {fields.some(field => field.required) && (
            <p className="text-sm text-gray-500 text-center">
              <span className="text-red-500">*</span> Required fields
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormBlock;