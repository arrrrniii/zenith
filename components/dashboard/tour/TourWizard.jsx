import React from 'react';
import { useRouter } from 'next/router';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

import { steps } from './steps'; 
import { useTourMutations } from './hooks/useTourMutations';
import { useFormValidation } from './hooks/useFormValidation';
import { convertNumberFields } from '@/lib/transformers';

const defaultFormData = {
  id: null,
  title: '',
  description: '',
  tour_type: '',
  duration: '',
  duration_type: '',
  meeting_point: '',
  default_start_time: '',
  status: 'draft',
  mainImage: null,
  videoUrl: null,
  gallery: [],
  tourDates: [],
  activities: [],
  included: [],
  notIncluded: [],
  providedEquipment: [],
  requiredEquipment: [],
  pricing: {
    pricePerPerson: '',
    maxCapacity: '',
    earlyBirdDiscount: 0,
    groupDiscount: 0,
    paymentDetails: '',
    refundPolicy: '',
    depositRequirements: ''
  },
  accessibility: {
    wheelchairAccessible: false,
    mobilityAid: false,
    visualAid: false,
    hearingAid: false,
    serviceAnimals: false,
    minimumAge: null,
    fitnessLevel: '',
    notes: ''
  }
};

const StepIndicator = ({ currentStep, totalSteps, completedSteps }) => (
  <div className="flex items-center justify-between px-4 py-3 border-b">
    <div className="flex space-x-2">
      {steps.map((step, index) => (
        <div key={step.id} className={`flex items-center ${index > 0 ? 'ml-2' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            completedSteps.includes(step.id)
              ? 'bg-green-500 text-white'
              : index === currentStep
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}>
            {completedSteps.includes(step.id) ? <Check className="w-4 h-4" /> : index + 1}
          </div>
          {index < totalSteps - 1 && <div className="w-8 h-0.5 bg-gray-200" />}
        </div>
      ))}
    </div>
    <div className="text-sm text-gray-500">
      Step {currentStep + 1} of {totalSteps}
    </div>
  </div>
);

const TourWizard = ({ initialData = {}, onCancel, onSubmit }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState(() => ({
    ...JSON.parse(JSON.stringify(defaultFormData)),
    ...initialData
  }));

  const [completedSteps, setCompletedSteps] = React.useState([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [validationMessages, setValidationMessages] = React.useState([]);

  const { createTour, updateTourStep } = useTourMutations();
  const { errors, validateStep, validateForm, clearError } = useFormValidation();

  const currentStepConfig = steps[currentStep];
  const StepComponent = currentStepConfig.component;

  const extractStepData = (stepId) => {
    const stepFields = steps.find(s => s.id === stepId).fields;
    const stepData = {};
    stepFields.forEach(field => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (!stepData[parent]) stepData[parent] = {};
        stepData[parent][child] = formData[parent]?.[child];
      } else {
        stepData[field] = formData[field];
      }
    });
    return stepData;
  };

  const validateCurrentStep = () => {
    const stepData = extractStepData(currentStepConfig.id);
    const normalizedStepData = convertNumberFields({ ...stepData });
    const stepValidation = validateStep(currentStepConfig.id, normalizedStepData);
    if (!stepValidation) {
      setValidationMessages(Object.values(errors));
      return false;
    }
    setValidationMessages([]);
    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;
  
    setIsSaving(true);
    try {
      const stepData = extractStepData(currentStepConfig.id);
      const newFormData = { ...formData, ...stepData, status: 'draft' };
      const finalData = convertNumberFields(newFormData);

      // Upsert the tour
      const result = await createTour(finalData);
      if (result?.id) {
        const updatedFormData = { ...newFormData, id: result.id };
        setFormData(updatedFormData);

        // Save step data
        await updateTourStep(result.id, currentStepConfig.id, finalData);
        setCompletedSteps(prev => [...new Set([...prev, currentStepConfig.id])]);
      } else {
        console.error('Failed to create/update tour');
        return;
      }

      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        await handleSubmit();
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
      setValidationMessages([`Error: ${error.message}`]);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setValidationMessages([]);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const finalData = convertNumberFields(formData);
      if (!validateForm(finalData)) {
        const firstErrorStep = steps.findIndex(step => step.fields.some(field => errors[field]));
        if (firstErrorStep !== -1) {
          setCurrentStep(firstErrorStep);
          setValidationMessages(Object.values(errors));
          return;
        }
      }

      await updateTourStep(formData.id, { status: 'published' });
      if (onSubmit) {
        await onSubmit();
      } else {
        router.push('/dashboard/tours');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setValidationMessages(['Failed to submit tour']);
    } finally {
      setIsSaving(false);
    }
  };

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      const stepData = extractStepData(currentStepConfig.id);
      const newFormData = { ...formData, ...stepData, status: 'draft' };
      const finalData = convertNumberFields(newFormData);

      const result = await createTour(finalData);
      if (result?.id) {
        const updatedFormData = { ...newFormData, id: result.id };
        setFormData(updatedFormData);
        await updateTourStep(result.id, currentStepConfig.id, finalData);
        await router.push(`/dashboard/tours/${result.id}`);
      }
    } catch (error) {
      console.error('Save draft error:', error);
      setValidationMessages(['Failed to save draft']);
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormData = (field, value) => {
    clearError(field);
    setValidationMessages([]);
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: { ...prev[parent], [child]: value }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <StepIndicator
        currentStep={currentStep}
        totalSteps={steps.length}
        completedSteps={completedSteps}
      />

      {process.env.NODE_ENV === 'development' && (
        <div className="p-4 bg-gray-100 text-xs">
          <pre>{JSON.stringify({ currentStep, formData }, null, 2)}</pre>
        </div>
      )}

      <div className="p-6">
        {validationMessages.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <ul className="list-disc pl-4">
              {validationMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </Alert>
        )}

        <StepComponent
          formData={currentStepConfig.id === 'accessibility' ? formData.accessibility : formData}
          updateFormData={updateFormData}
          errors={errors}
        />

        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 0 ? onCancel : handlePrevious}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </Button>

          <div className="space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={saveDraft}
              disabled={isSaving}
            >
              Save as Draft
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={isSaving}
            >
              {currentStep === steps.length - 1 ? (
                isSaving ? 'Saving...' : 'Complete'
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourWizard;
