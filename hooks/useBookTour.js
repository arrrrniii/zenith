// hooks/useBookTour.js
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CREATE_BOOKING, ADD_BOOKING_ADDONS } from '@/graphql/bookings';

export const useBookTour = (tourData, selectedDate) => {
  const router = useRouter();
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

    // Apply early bird discount if available
    if (tourData?.tour_pricing?.early_bird_discount_percentage) {
      total = total * (1 - tourData.tour_pricing.early_bird_discount_percentage / 100);
    }

    return parseFloat(total.toFixed(2));
  };

  const validateFormData = (formData) => {
    if (!formData.firstName?.trim()) throw new Error('First name is required');
    if (!formData.lastName?.trim()) throw new Error('Last name is required');
    if (!formData.email?.trim()) throw new Error('Email is required');
    if (!formData.phone?.trim()) throw new Error('Phone number is required');
    if (!formData.acceptedTerms) throw new Error('Please accept the terms and conditions');
    if (!formData.acceptedPrivacy) throw new Error('Please accept the privacy policy');
  };

  const handleBooking = async (formData) => {
    setIsProcessing(true);
    setError(null);

    try {
      validateFormData(formData);

      const bookingReference = `BK-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const totalAmount = calculateTotal(formData);

      // Create the main booking
      const { data: bookingData } = await createBooking({
        variables: {
          booking: {
            tour_id: tourData.id,
            booking_reference: bookingReference,
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_email: formData.email,
            customer_phone: formData.phone,
            selected_date: selectedDate,
            number_of_participants: formData.participants || 1,
            special_requirements: formData.specialRequests,
            total_amount: totalAmount,
            booking_status: 'pending',
            payment_status: 'pending'
          }
        }
      });

      // If there are add-ons, create them in a separate mutation
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

      // Redirect to payment page
      if (bookingData?.insert_bookings_one?.booking_reference) {
        router.push(`/payment/${bookingData.insert_bookings_one.booking_reference}`);
      } else {
        throw new Error('Failed to create booking');
      }

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