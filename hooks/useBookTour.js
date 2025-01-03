// hooks/useBookTour.js
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { CREATE_BOOKING, ADD_BOOKING_ADDONS } from '@/graphql/bookings';

export const useBookTour = (tourData) => {
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [createBooking] = useMutation(CREATE_BOOKING);
  const [addBookingAddons] = useMutation(ADD_BOOKING_ADDONS);

  const calculateTotal = (formData) => {
    const basePrice = tourData?.tour_pricing?.price_per_person || 0;
    const quantity = formData.participants || 1;
    const addOnsTotal = (formData.selectedAddOns || [])
      .reduce((sum, addon) => sum + addon.price, 0);

    let total = basePrice * quantity + addOnsTotal;

    if (tourData?.tour_pricing?.early_bird_discount_percentage) {
      total = total * (1 - tourData.tour_pricing.early_bird_discount_percentage / 100);
    }

    return parseFloat(total.toFixed(2));
  };

  const validateFormData = (formData) => {
    const errors = [];
    if (!formData.firstName?.trim()) errors.push('First name is required');
    if (!formData.lastName?.trim()) errors.push('Last name is required');
    if (!formData.email?.trim()) errors.push('Email is required');
    if (!formData.phone?.trim()) errors.push('Phone number is required');
    if (!formData.acceptedTerms) errors.push('Please accept the terms and conditions');
    if (!formData.acceptedPrivacy) errors.push('Please accept the privacy policy');
    if (!formData.selectedDate) errors.push('Selected date is required');
    if (!formData.tourId) errors.push('Tour ID is required');
    if (!formData.participants) errors.push('Number of participants is required');

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  };

  const generateBookingReference = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `BK-${timestamp}-${random}`;
  };

  const handleBooking = async (formData) => {
    setIsProcessing(true);
    setError(null);

    try {
      validateFormData(formData);
      const totalAmount = calculateTotal(formData);
      const bookingReference = generateBookingReference();
      const customerName = `${formData.firstName} ${formData.lastName}`;

      // Create the main booking with the date as is (no need for additional formatting)
      const { data: bookingData } = await createBooking({
        variables: {
          booking: {
            tour_id: formData.tourId,
            booking_reference: bookingReference,
            customer_name: customerName,
            customer_email: formData.email,
            customer_phone: formData.phone,
            selected_date: formData.selectedDate,
            number_of_participants: parseInt(formData.participants),
            special_requirements: formData.specialRequests || null,
            total_amount: totalAmount,
            booking_status: 'pending',
            payment_status: 'pending'
          }
        }
      });

      // Handle add-ons if present
      if (formData.selectedAddOns?.length > 0) {
        await addBookingAddons({
          variables: {
            objects: formData.selectedAddOns.map(addon => ({
              booking_id: bookingData.insert_bookings_one.id,
              add_on_id: addon.id,
              quantity: 1,
              price: addon.price
            }))
          }
        });
      }

      return {
        bookingReference: bookingData.insert_bookings_one.booking_reference,
        bookingId: bookingData.insert_bookings_one.id,
        customerName,
        totalAmount
      };
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.message || 'Failed to process booking');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleBooking,
    calculateTotal,
    error,
    isProcessing
  };
};