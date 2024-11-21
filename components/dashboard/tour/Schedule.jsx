import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, X, AlertCircle, Info } from 'lucide-react';
import FormSection from './FormSection';
import { FormInput } from './FormFields';
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { 
  format, 
  isSameDay, 
  parseISO, 
  addDays,
  addHours, 
  startOfTomorrow, 
  isBefore, 
  isToday,
  isWithinInterval 
} from 'date-fns';
import { cn } from "@/lib/utils";

const TimeInput = ({ label, value, onChange, error, required = false }) => (
  <div className="space-y-2">
    <Label>
      {label} {required && <span className="text-destructive">*</span>}
    </Label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Clock className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="time"
        value={value}
        onChange={onChange}
        className={cn(
          "pl-10",
          error && "border-destructive focus-visible:ring-destructive"
        )}
        required={required}
      />
    </div>
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
);

const DateBadge = ({ startDate, endDate, startTime, durationType, onDelete }) => {
  const formattedStartDate = format(parseISO(startDate), 'MMM dd, yyyy');
  const formattedEndDate = durationType === 'hours' 
    ? format(parseISO(startDate), 'MMM dd, yyyy')
    : format(parseISO(endDate), 'MMM dd, yyyy');

  return (
    <div className="group inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg text-sm">
      <span>
        {durationType === 'hours' ? (
          `${formattedStartDate} at ${startTime}`
        ) : (
          `${formattedStartDate} - ${formattedEndDate}`
        )}
      </span>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(startDate);
        }}
        className="h-5 w-5 p-0 opacity-50 group-hover:opacity-100"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

const Schedule = ({ 
  formData = {}, 
  updateFormData = () => {}, 
  errors = {} 
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateError, setDateError] = useState('');

  const isHourlyTour = formData.durationType === 'hours';

  // Calculate end date based on duration and type
  const calculateEndDate = (startDate) => {
    if (!startDate || !formData.duration) return null;
    
    if (isHourlyTour) {
      return startDate; // For hourly tours, end date is same as start date
    } else {
      return addDays(startDate, formData.duration - 1);
    }
  };

  // Function to check if a date is valid for selection
  const isDateValid = (date) => {
    if (!date) return false;
    
    const tomorrow = startOfTomorrow();
    
    if (isBefore(date, tomorrow) || isToday(date)) {
      setDateError("You cannot select past dates or today. Please choose a future date.");
      return false;
    }

    if (!formData.duration) {
      setDateError("Please set tour duration first.");
      return false;
    }

    setDateError('');
    return true;
  };

  // Function to check if a specific day should be disabled
  const isDateDisabled = (date) => {
    return isBefore(date, startOfTomorrow()) || isToday(date);
  };

  // Function to handle adding a new tour date
  const addTourDate = (date) => {
    if (!date || !isDateValid(date)) return;
    
    const endDate = calculateEndDate(date);
    if (!endDate) return;

    const startDateStr = format(date, 'yyyy-MM-dd');
    const endDateStr = format(endDate, 'yyyy-MM-dd');
    
    const existingDates = formData.tourDates || [];
    const newDates = [
      ...existingDates,
      {
        startDate: startDateStr,
        endDate: endDateStr,
        startTime: formData.defaultStartTime || '09:00',
      }
    ].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    updateFormData('tourDates', newDates);
  };

  // Function to remove a tour date
  const removeTourDate = (startDate) => {
    const newDates = (formData.tourDates || [])
      .filter(date => date.startDate !== startDate);
    updateFormData('tourDates', newDates);
  };

  // Function to highlight selected tour dates on the calendar
  const isDaySelected = (date) => {
    return (formData.tourDates || []).some(tourDate => {
      const start = parseISO(tourDate.startDate);
      const end = parseISO(tourDate.endDate);
      return isHourlyTour 
        ? isSameDay(date, start)
        : isWithinInterval(date, { start, end });
    });
  };

  return (
    <FormSection 
      title="Schedule"
      description="Plan your tour dates and meeting details."
    >
      <div className="space-y-6">
        {/* Default Start Time and Meeting Point */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TimeInput
            label="Default Start Time"
            value={formData.defaultStartTime || '09:00'}
            onChange={(e) => updateFormData('defaultStartTime', e.target.value)}
            error={errors?.defaultStartTime}
            required
          />
          
          <div>
            <Label>Meeting Point *</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                value={formData.meetingPoint || ''}
                onChange={(e) => updateFormData('meetingPoint', e.target.value)}
                className={cn(
                  "pl-10",
                  errors?.meetingPoint && "border-destructive focus-visible:ring-destructive"
                )}
                placeholder="Enter meeting location"
                required
              />
            </div>
            {errors?.meetingPoint && (
              <p className="mt-1 text-sm text-destructive">{errors.meetingPoint}</p>
            )}
          </div>
        </div>

        {/* Tour Duration Info */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Tour Duration: {formData.duration} {formData.durationType}
            {formData.duration > 1 ? '' : ''}
          </AlertDescription>
        </Alert>

        {/* Calendar and Selected Dates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label>Select Tour {isHourlyTour ? 'Dates' : 'Start Dates'} *</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                addTourDate(date);
              }}
              disabled={isDateDisabled}
              modifiers={{
                selected: isDaySelected
              }}
              modifiersClassNames={{
                selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                disabled: "text-muted-foreground opacity-50 cursor-not-allowed"
              }}
              className="rounded-md border"
            />
            
            {dateError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{dateError}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-2">
                Selected Tour Dates
                {!(formData.tourDates || []).length && errors?.tourDates && (
                  <span className="text-sm text-destructive">
                    {errors.tourDates}
                  </span>
                )}
              </Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {(formData.tourDates || []).map((tourDate) => (
                  <DateBadge
                    key={tourDate.startDate}
                    startDate={tourDate.startDate}
                    endDate={tourDate.endDate}
                    startTime={tourDate.startTime}
                    durationType={formData.durationType}
                    onDelete={removeTourDate}
                  />
                ))}
                {!(formData.tourDates || []).length && (
                  <span className="text-sm text-muted-foreground">No dates selected</span>
                )}
              </div>
            </div>

            {/* Tour Dates Information */}
            {formData.tourDates?.length > 0 && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">Tour Dates Information:</p>
                    {formData.tourDates.map(date => (
                      <p key={date.startDate} className="text-sm">
                        {isHourlyTour ? (
                          `• ${format(parseISO(date.startDate), 'MMM dd, yyyy')} at ${date.startTime} (${formData.duration} hours)`
                        ) : (
                          `• ${format(parseISO(date.startDate), 'MMM dd, yyyy')} to ${format(parseISO(date.endDate), 'MMM dd, yyyy')} at ${date.startTime}`
                        )}
                      </p>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Guidelines */}
            <Alert>
              <AlertDescription>
                • Select future dates for your tour
                <br />
                {isHourlyTour ? (
                  `• Each date will be a ${formData.duration}-hour tour`
                ) : (
                  `• Each date will create a ${formData.duration}-${formData.durationType} tour`
                )}
                <br />
                • Past dates and today are not available
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default Schedule;