// components/dashboard/tour/create/Accessibility.jsx
import React from 'react';
import { AlertCircle, Users, Heart, Info } from 'lucide-react';
import FormSection from './FormSection';
import { FormInput, FormSelect } from './FormFields';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner - Easy and accessible for most people' },
  { value: 'intermediate', label: 'Intermediate - Moderate physical activity required' },
  { value: 'advanced', label: 'Advanced - Challenging, good fitness required' },
  { value: 'expert', label: 'Expert - Very demanding, experienced participants only' }
];

const fitnessLevels = [
  { value: 'low', label: 'Low - Light walking, minimal physical activity' },
  { value: 'moderate', label: 'Moderate - Some hiking, stairs, or extended walking' },
  { value: 'high', label: 'High - Strenuous activity, long distances' },
  { value: 'extreme', label: 'Extreme - Very challenging physical demands' }
];

const AccessibilityFeature = ({ id, label, checked, onChange, icon: Icon }) => (
  <div className="flex items-center space-x-3">
    <Checkbox 
      id={id}
      checked={checked}
      onCheckedChange={(checked) => onChange(id, checked)}
    />
    <Label htmlFor={id} className="flex items-center gap-2 cursor-pointer text-sm">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      {label}
    </Label>
  </div>
);

const Accessibility = ({ formData = {}, updateFormData = () => {}, errors = {} }) => {
  const handleFeatureChange = (feature, value) => {
    updateFormData(feature, value);
  };

  return (
    <FormSection 
      title="Accessibility and Requirements"
      description="Specify accessibility features, difficulty level, and participant requirements."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Minimum Age"
            type="number"
            value={formData.minimumAge || ''}
            onChange={(e) => updateFormData('minimumAge', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
            error={errors?.minimumAge}
            min={0}
            placeholder="Leave empty if no minimum age"
          />

          <FormSelect
            label="Difficulty Level"
            value={formData.difficultyLevel}
            onChange={(value) => updateFormData('difficultyLevel', value)}
            options={difficultyLevels}
            error={errors?.difficultyLevel}
            required
            placeholder="Select difficulty level"
          />

          <FormSelect
            label="Fitness Level Required"
            value={formData.fitnessLevel}
            onChange={(value) => updateFormData('fitnessLevel', value)}
            options={fitnessLevels}
            error={errors?.fitnessLevel}
            placeholder="Select fitness level"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-base">Accessibility Features Available</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AccessibilityFeature
              id="wheelchairAccessible"
              label="Wheelchair Accessible"
              checked={formData.wheelchairAccessible}
              onChange={handleFeatureChange}
              icon={Users}
            />
            <AccessibilityFeature
              id="mobilityAid"
              label="Mobility Assistance"
              checked={formData.mobilityAid}
              onChange={handleFeatureChange}
              icon={Heart}
            />
            <AccessibilityFeature
              id="visualAid"
              label="Visual Assistance"
              checked={formData.visualAid}
              onChange={handleFeatureChange}
              icon={Info}
            />
            <AccessibilityFeature
              id="hearingAid"
              label="Hearing Assistance"
              checked={formData.hearingAid}
              onChange={handleFeatureChange}
              icon={Info}
            />
            <AccessibilityFeature
              id="serviceAnimals"
              label="Service Animals Welcome"
              checked={formData.serviceAnimals}
              onChange={handleFeatureChange}
              icon={Heart}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base">Additional Accessibility Notes</Label>
            {errors?.notes && (
              <span className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.notes}
              </span>
            )}
          </div>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => updateFormData('notes', e.target.value)}
            className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
            placeholder="Provide any additional accessibility information..."
          />
        </div>

        <Alert>
          <AlertDescription className="space-y-2">
            <p className="font-medium">Important Guidelines:</p>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li>Clearly indicate if any parts of the tour are not accessible</li>
              <li>Specify any assistance that can be provided</li>
              <li>Include information about restroom accessibility</li>
              <li>Mention if alternative arrangements can be made</li>
            </ul>
          </AlertDescription>
        </Alert>

        {(formData.fitnessLevel === 'high' || formData.fitnessLevel === 'extreme' ||
          formData.difficultyLevel === 'advanced' || formData.difficultyLevel === 'expert') && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              High difficulty or fitness requirements may limit accessibility. Consider offering alternatives or modifications.
            </AlertDescription>
          </Alert>
        )}

        {formData.difficultyLevel && (
          <Alert>
            <AlertDescription>
              <p className="font-medium mb-2">Recommendations for {formData.difficultyLevel} difficulty:</p>
              {formData.difficultyLevel === 'beginner' && (
                <p>Ensure clear path marking and frequent rest stops. Provide detailed briefing for first-time participants.</p>
              )}
              {formData.difficultyLevel === 'intermediate' && (
                <p>Consider providing basic training tips before the tour. Include info about terrain and potential challenges.</p>
              )}
              {formData.difficultyLevel === 'advanced' && (
                <p>Specify required experience level and necessary certifications. Include detailed equipment requirements.</p>
              )}
              {formData.difficultyLevel === 'expert' && (
                <p>Outline prerequisite skills and experience. Consider requiring proof of expertise or prior experience.</p>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </FormSection>
  );
};

export default Accessibility;
