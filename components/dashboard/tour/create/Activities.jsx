//components/dashboard/tour/create/Activities.jsx
import React from 'react';
import { Plus, GripVertical, Clock, X } from 'lucide-react';
import FormSection from './FormSection';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const TimeInput = ({ value, onChange, error }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Clock className="h-4 w-4 text-muted-foreground" />
    </div>
    <Input
      type="time"
      value={value}
      onChange={onChange}
      className={cn(
        "pl-10 w-[120px]",
        error && "border-destructive focus-visible:ring-destructive"
      )}
    />
  </div>
);

const ActivityItem = ({ 
  activity, 
  index, 
  onUpdate, 
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  errors = {}
}) => (
  <div className="flex gap-4 items-start p-4 rounded-lg border bg-card">
    {/* Drag Handle & Order Controls */}
    <div className="flex flex-col items-center gap-1">
      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
      <div className="flex flex-col gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onMoveUp}
          disabled={isFirst}
        >
          ↑
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onMoveDown}
          disabled={isLast}
        >
          ↓
        </Button>
      </div>
    </div>

    {/* Activity Details */}
    <div className="flex-1 space-y-4">
      {/* Title & Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Title *</Label>
          <Input
            value={activity.title}
            onChange={(e) => onUpdate(index, { title: e.target.value })}
            placeholder="E.g., City Walking Tour"
            className={cn(errors?.title && "border-destructive focus-visible:ring-destructive")}
          />
          {errors?.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Duration</Label>
          <div className="flex items-center gap-2">
            <TimeInput
              value={activity.duration}
              onChange={(e) => onUpdate(index, { duration: e.target.value })}
              error={errors?.duration}
            />
            <span className="text-sm text-muted-foreground">HH:mm</span>
          </div>
          {errors?.duration && (
            <p className="text-sm text-destructive">{errors.duration}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={activity.description}
          onChange={(e) => onUpdate(index, { description: e.target.value })}
          placeholder="Describe what participants will do and see during this activity..."
          className="resize-none"
          rows={3}
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          value={activity.location}
          onChange={(e) => onUpdate(index, { location: e.target.value })}
          placeholder="E.g., Central Park Main Entrance"
        />
      </div>
    </div>

    {/* Remove Button */}
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => onRemove(index)}
      className="h-9 w-9 p-0"
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);

const Activities = ({
  formData = {},
  updateFormData = () => {},
  errors = {}
}) => {
  const activities = formData.activities || [];

  const addActivity = () => {
    const newActivity = {
      title: '',
      duration: '01:00',
      description: '',
      location: '',
    };
    
    updateFormData('activities', [...activities, newActivity]);
  };

  const updateActivity = (index, updates) => {
    const updatedActivities = activities.map((activity, i) => 
      i === index ? { ...activity, ...updates } : activity
    );
    updateFormData('activities', updatedActivities);
  };

  const removeActivity = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    updateFormData('activities', updatedActivities);
  };

  const moveActivity = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= activities.length) return;

    const updatedActivities = [...activities];
    [updatedActivities[index], updatedActivities[newIndex]] = 
    [updatedActivities[newIndex], updatedActivities[index]];
    
    updateFormData('activities', updatedActivities);
  };

  return (
    <FormSection
      title="Activities"
      description="Add and organize the activities included in your tour."
    >
      <div className="space-y-6">
        {/* Activity List */}
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <ActivityItem
              key={index}
              activity={activity}
              index={index}
              onUpdate={updateActivity}
              onRemove={removeActivity}
              onMoveUp={() => moveActivity(index, -1)}
              onMoveDown={() => moveActivity(index, 1)}
              isFirst={index === 0}
              isLast={index === activities.length - 1}
              errors={errors?.activities?.[index]}
            />
          ))}
        </div>

        {/* Add Activity Button */}
        <Button
          type="button"
          variant="outline"
          onClick={addActivity}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Activity
        </Button>

        {/* No Activities Message */}
        {activities.length === 0 && (
          <Alert>
            <AlertDescription>
              No activities added yet. Click the button above to add your first activity.
            </AlertDescription>
          </Alert>
        )}

        {/* Total Duration Summary */}
        {activities.length > 0 && (
          <Alert>
            <AlertDescription>
              Total Activities: {activities.length}
              <br />
              Remember to organize activities in chronological order using the arrows.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </FormSection>
  );
};

export default Activities;