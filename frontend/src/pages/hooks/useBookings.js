import { useState, useRef } from 'react';
import { 
  createBooking as createBookingService, 
  getBookingsByUser,
  cancelBooking as cancelBookingService
} from '../services/bookingService'; 

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const lastRequestTime = useRef(0);
  const REQUEST_DELAY = 1000; 

  const throttleRequest = () => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime.current;
    
    if (timeSinceLastRequest < REQUEST_DELAY) {
      const waitTime = REQUEST_DELAY - timeSinceLastRequest;
      console.log(`⏳ Throttling request: waiting ${waitTime}ms`);
      return new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    lastRequestTime.current = now;
    return Promise.resolve();
  };

  const createBooking = async (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      await throttleRequest();
      console.log('Sending booking data:', bookingData);
      const response = await createBookingService(bookingData);
      console.log('Booking response:', response);
      return response.data;
    } catch (error) {
      console.error("Failed to create booking:", error);
      let errorMessage = 'Failed to create booking';
      
      if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMyBookings = async (userEmail) => {
    setLoading(true);
    setError(null);
    try {
      await throttleRequest();
      console.log('Fetching bookings for:', userEmail);
      const response = await getBookingsByUser(userEmail);
      console.log('Bookings response:', response);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      let errorMessage = 'Failed to fetch bookings';
      
      if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      await throttleRequest();
      const response = await cancelBookingService(bookingId);
      return response.data;
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      let errorMessage = 'Failed to cancel booking';
      
      if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    createBooking,
    getMyBookings,
    cancelBooking,
    loading,
    error,
    clearError
  };
};