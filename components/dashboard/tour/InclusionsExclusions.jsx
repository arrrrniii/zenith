import React from 'react';
import { Check, X, Plus, AlertCircle, ShieldCheck, Shield, Package, Backpack } from 'lucide-react';
import FormSection from './FormSection';
import { FormInput } from './FormFields';
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

const ListItem = ({ value, onChange, onRemove, error, placeholder }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1">
      <FormInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        error={error}
      />
    </div>
    <Button 
      onClick={onRemove}
      type="button"
      variant="ghost"
      size="icon"
      className="flex-shrink-0"
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);

const ListSection = ({ 
  title, 
  items = [],
  onAdd, 
  onUpdate, 
  onRemove, 
  error,
  icon: Icon,
  placeholder,
  addButtonText
}) => {
  const safeItems = Array.isArray(items) ? items : [];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <h4 className="font-medium">{title}</h4>
        </div>
        {error && typeof error === 'string' && (
          <span className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {error}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {safeItems.map((item, index) => (
          <ListItem
            key={index}
            value={item}
            onChange={(value) => onUpdate(index, value)}
            onRemove={() => onRemove(index)}
            placeholder={placeholder}
            error={typeof error === 'object' ? error[index] : undefined}
          />
        ))}
        
        <Button
          type="button"
          onClick={onAdd}
          variant="ghost"
          className="text-primary hover:text-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          {addButtonText}
        </Button>
      </div>
    </div>
  );
};

const InclusionsExclusions = ({ 
  formData = {},
  updateFormData,
  errors = {}
}) => {
  const {
    included = [],
    notIncluded = [],
    providedEquipment = [],
    requiredEquipment = []
  } = formData;

  // List management functions
  const addListItem = (field, defaultItem = '') => {
    const currentItems = formData[field] || [];
    updateFormData(field, [...currentItems, defaultItem]);
  };

  const updateListItem = (field, index, value) => {
    const currentItems = formData[field] || [];
    const updatedItems = [...currentItems];
    updatedItems[index] = value;
    updateFormData(field, updatedItems);
  };

  const removeListItem = (field, index) => {
    const currentItems = formData[field] || [];
    const filteredItems = currentItems.filter((_, i) => i !== index);
    updateFormData(field, filteredItems);
  };

  return (
    <FormSection 
      title="Inclusions and Exclusions"
      description="Specify what's included in the tour package and what guests need to bring."
      infoTooltip="Clear inclusions and exclusions help set proper expectations for your guests."
    >
      <div className="space-y-8">
        {/* Inclusions */}
        <div className="bg-primary/5 p-6 rounded-lg border">
          <ListSection
            title="What's Included"
            items={included}
            onAdd={() => addListItem('included')}
            onUpdate={(index, value) => updateListItem('included', index, value)}
            onRemove={(index) => removeListItem('included', index)}
            error={errors?.included}
            icon={ShieldCheck}
            placeholder="e.g., Professional guide, Transportation"
            addButtonText="Add Inclusion"
          />
        </div>

        {/* Exclusions */}
        <div className="bg-destructive/5 p-6 rounded-lg border">
          <ListSection
            title="What's Not Included"
            items={notIncluded}
            onAdd={() => addListItem('notIncluded')}
            onUpdate={(index, value) => updateListItem('notIncluded', index, value)}
            onRemove={(index) => removeListItem('notIncluded', index)}
            error={errors?.notIncluded}
            icon={Shield}
            placeholder="e.g., Personal expenses, Tips"
            addButtonText="Add Exclusion"
          />
        </div>

        {/* Equipment Provided */}
        <div className="bg-blue-500/5 p-6 rounded-lg border">
          <ListSection
            title="Equipment Provided"
            items={providedEquipment}
            onAdd={() => addListItem('providedEquipment')}
            onUpdate={(index, value) => updateListItem('providedEquipment', index, value)}
            onRemove={(index) => removeListItem('providedEquipment', index)}
            error={errors?.providedEquipment}
            icon={Package}
            placeholder="e.g., Safety gear, Camping equipment"
            addButtonText="Add Equipment"
          />
        </div>

        {/* Required Equipment */}
        <div className="bg-yellow-500/5 p-6 rounded-lg border">
          <ListSection
            title="Required Equipment (Guest to Bring)"
            items={requiredEquipment}
            onAdd={() => addListItem('requiredEquipment')}
            onUpdate={(index, value) => updateListItem('requiredEquipment', index, value)}
            onRemove={(index) => removeListItem('requiredEquipment', index)}
            error={errors?.requiredEquipment}
            icon={Backpack}
            placeholder="e.g., Comfortable shoes, Water bottle"
            addButtonText="Add Required Item"
          />
        </div>

        {/* Recommendations Section */}
        <Alert>
          <AlertDescription>
            <h4 className="font-medium mb-3">Recommendations for Clear Information:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Be specific about included meals, drinks, and snacks</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Clearly state transportation arrangements and pickup/drop-off details</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Mention any special equipment or clothing requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>List any additional costs guests should expect</span>
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </FormSection>
  );
};

export default InclusionsExclusions;