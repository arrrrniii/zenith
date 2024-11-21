// components/admin/dashboard/service/blocks/components/editors/FormEditor.js
import React, { useCallback, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  GripVertical, 
  Plus, 
  X, 
  Settings2,
  Mail,
  Phone, 
  Type,
  ListCollapse,
  FormInput,
  Sparkle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const FIELD_TYPES = [
  { value: 'text', label: 'Text', icon: Type },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'tel', label: 'Phone', icon: Phone },
  { value: 'textarea', label: 'Text Area', icon: ListCollapse },
  { value: 'select', label: 'Select', icon: FormInput },
];

const FORM_TYPES = [
  { value: 'contact', label: 'Contact Form' },
  { value: 'appointment', label: 'Appointment Form' },
  { value: 'callback', label: 'Callback Form' },
  { value: 'custom', label: 'Custom Form' },
];

const AdvancedFieldSettings = memo(({ field, onChange }) => {
  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="space-y-2">
        <Label>Field ID</Label>
        <Input
          value={field.id}
          onChange={(e) => onChange({ ...field, id: e.target.value })}
          placeholder="Unique field identifier"
          disabled
        />
      </div>

      {field.type === 'select' && (
        <div className="space-y-2">
          <Label>Options (one per line)</Label>
          <Textarea
            value={field.options?.join('\n') || ''}
            onChange={(e) => onChange({ 
              ...field, 
              options: e.target.value.split('\n').filter(Boolean)
            })}
            placeholder="Option 1&#10;Option 2&#10;Option 3"
            rows={4}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Width</Label>
          <Select
            value={field.width || 'full'}
            onValueChange={(value) => onChange({ ...field, width: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Width</SelectItem>
              <SelectItem value="half">Half Width</SelectItem>
              <SelectItem value="third">One Third</SelectItem>
              <SelectItem value="two-thirds">Two Thirds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {field.type === 'textarea' && (
          <div className="space-y-2">
            <Label>Rows</Label>
            <Input
              type="number"
              min="2"
              max="10"
              value={field.rows || 4}
              onChange={(e) => onChange({ ...field, rows: parseInt(e.target.value) })}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id={`${field.id}-required`}
            checked={field.required}
            onCheckedChange={(checked) => onChange({ ...field, required: checked })}
          />
          <Label htmlFor={`${field.id}-required`}>Required Field</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`${field.id}-enabled`}
            checked={field.enabled !== false}
            onCheckedChange={(checked) => onChange({ ...field, enabled: checked })}
          />
          <Label htmlFor={`${field.id}-enabled`}>Enabled</Label>
        </div>
      </div>
    </div>
  );
});

AdvancedFieldSettings.displayName = 'AdvancedFieldSettings';

const FieldEditor = memo(({ field, onChange, onRemove }) => {
  const selectedType = FIELD_TYPES.find(type => type.value === field.type);
  const Icon = selectedType?.icon || FormInput;

  return (
    <Card className="relative">
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <Select
              value={field.type}
              onValueChange={(value) => onChange({ ...field, type: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={field.label}
                onChange={(e) => onChange({ ...field, label: e.target.value })}
                placeholder="Field label"
              />
            </div>

            <div className="space-y-2">
              <Label>Placeholder</Label>
              <Input
                value={field.placeholder}
                onChange={(e) => onChange({ ...field, placeholder: e.target.value })}
                placeholder="Field placeholder"
              />
            </div>

            <div className="space-y-2">
              <Label>Help Text</Label>
              <Input
                value={field.helpText}
                onChange={(e) => onChange({ ...field, helpText: e.target.value })}
                placeholder="Additional information about this field"
              />
            </div>
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedFieldSettings field={field} onChange={onChange} />
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:text-destructive/90"
          >
            <X className="w-4 h-4 mr-2" />
            Remove Field
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

FieldEditor.displayName = 'FieldEditor';

const StyleEditor = memo(({ styles, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Background Color</Label>
        <div className="flex gap-2 mt-1.5">
          <Input
            type="color"
            value={styles.backgroundColor}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
            className="w-12 h-8 p-1"
          />
          <Input
            type="text"
            value={styles.backgroundColor}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
            className="flex-1"
            placeholder="e.g. #ffffff, rgb(255,255,255)"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Border Radius</Label>
          <Input
            type="text"
            value={styles.borderRadius}
            onChange={(e) => onChange({ borderRadius: e.target.value })}
            placeholder="e.g. 0.5rem, 8px"
          />
        </div>

        <div>
          <Label>Padding</Label>
          <Input
            type="text"
            value={styles.padding}
            onChange={(e) => onChange({ padding: e.target.value })}
            placeholder="e.g. 2rem, 32px"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Form Width</Label>
        <Select
          value={styles.maxWidth || '2xl'}
          onValueChange={(value) => onChange({ maxWidth: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select form width" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small (24rem)</SelectItem>
            <SelectItem value="md">Medium (28rem)</SelectItem>
            <SelectItem value="lg">Large (32rem)</SelectItem>
            <SelectItem value="xl">Extra Large (36rem)</SelectItem>
            <SelectItem value="2xl">2X Large (42rem)</SelectItem>
            <SelectItem value="full">Full Width</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

StyleEditor.displayName = 'StyleEditor';

const FormEditor = ({ content, onChange }) => {
  const handleFieldUpdate = useCallback((index, updatedField) => {
    const newFields = [...(content.fields || [])];
    newFields[index] = updatedField;
    onChange({
      ...content,
      fields: newFields
    });
  }, [content, onChange]);

  const handleFieldRemove = useCallback((index) => {
    const newFields = content.fields.filter((_, i) => i !== index);
    onChange({
      ...content,
      fields: newFields
    });
  }, [content, onChange]);

  const handleAddField = useCallback(() => {
    const newField = {
      id: `field-${Date.now()}`,
      type: 'text',
      label: 'New Field',
      placeholder: '',
      required: false,
      enabled: true,
      width: 'full'
    };
    onChange({
      ...content,
      fields: [...(content.fields || []), newField]
    });
  }, [content, onChange]);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const fields = Array.from(content.fields || []);
    const [reorderedField] = fields.splice(result.source.index, 1);
    fields.splice(result.destination.index, 0, reorderedField);

    onChange({
      ...content,
      fields
    });
  }, [content, onChange]);

  const handleStyleChange = useCallback((styles) => {
    onChange({
      ...content,
      styles: {
        ...(content.styles || {}),
        ...styles
      }
    });
  }, [content, onChange]);

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Form Type</Label>
              <Select
                value={content.formType || 'contact'}
                onValueChange={(value) => onChange({ ...content, formType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select form type" />
                </SelectTrigger>
                <SelectContent>
                  {FORM_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Submit Button Text</Label>
              <Input
                value={content.submitButtonText || ''}
                onChange={(e) => onChange({ ...content, submitButtonText: e.target.value })}
                placeholder="Enter button text"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Form Title</Label>
            <Input
              value={content.title || ''}
              onChange={(e) => onChange({ ...content, title: e.target.value })}
              placeholder="Enter form title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.description || ''}
              onChange={(e) => onChange({ ...content, description: e.target.value })}
              placeholder="Enter form description"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Form Fields</h3>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings2 className="w-4 h-4 mr-2" />
                  Appearance
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <StyleEditor 
                  styles={content.styles || {}}
                  onChange={handleStyleChange}
                />
              </PopoverContent>
            </Popover>
            <Button
              onClick={handleAddField}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="fields">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {(content.fields || []).map((field, index) => (
                  <Draggable
                    key={field.id}
                    draggableId={field.id}
                    index={index}
                  >
                {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "relative",
                          snapshot.isDragging && "ring-2 ring-primary"
                        )}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="absolute left-2 top-6 cursor-move"
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="ml-8">
                          <FieldEditor
                            field={field}
                            onChange={(updatedField) => handleFieldUpdate(index, updatedField)}
                            onRemove={() => handleFieldRemove(index)}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {(content.fields || []).length === 0 && (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkle className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">No Fields Added</h3>
                <p className="text-sm text-muted-foreground">
                  Start building your form by adding some fields.
                </p>
              </div>
              <Button
                onClick={handleAddField}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Field
              </Button>
            </div>
          </Card>
        )}

        {(content.fields || []).length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {content.fields.length} field{content.fields.length !== 1 ? 's' : ''} added
            </p>
            <Button
              onClick={handleAddField}
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Field
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Success Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Success Title</Label>
              <Input
                value={content.successTitle || ''}
                onChange={(e) => onChange({ 
                  ...content, 
                  successTitle: e.target.value 
                })}
                placeholder="e.g., Thank you for your message!"
              />
            </div>

            <div className="space-y-2">
              <Label>Success Message</Label>
              <Textarea
                value={content.successMessage || ''}
                onChange={(e) => onChange({ 
                  ...content, 
                  successMessage: e.target.value 
                })}
                placeholder="e.g., We'll get back to you as soon as possible."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-reset-button"
                checked={content.showResetButton !== false}
                onCheckedChange={(checked) => onChange({ 
                  ...content, 
                  showResetButton: checked 
                })}
              />
              <Label htmlFor="show-reset-button">
                Show "Send Another" button after submission
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Form ID</Label>
              <Input
                value={content.formId || `form-${Date.now()}`}
                onChange={(e) => onChange({ 
                  ...content, 
                  formId: e.target.value 
                })}
                placeholder="Unique form identifier"
              />
            </div>

            <div className="space-y-2">
              <Label>Recipient Email</Label>
              <Input
                type="email"
                value={content.recipientEmail || ''}
                onChange={(e) => onChange({ 
                  ...content, 
                  recipientEmail: e.target.value 
                })}
                placeholder="Where to send form submissions"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enable-recaptcha"
                checked={content.enableRecaptcha !== false}
                onCheckedChange={(checked) => onChange({ 
                  ...content, 
                  enableRecaptcha: checked 
                })}
              />
              <Label htmlFor="enable-recaptcha">
                Enable reCAPTCHA protection
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

FormEditor.displayName = 'FormEditor';

export default memo(FormEditor);