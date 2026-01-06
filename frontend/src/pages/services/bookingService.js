import API from './api';

export const createBooking = async (bookingData) => {
  const response = await API.post('/bookings', bookingData);
  return response;
};

export const getBookingsByUser = async (userEmail) => {
  const response = await API.get(`/bookings/user/${userEmail}`);
  return response;
};

export const cancelBooking = async (bookingId) => {
  const response = await API.delete(`/bookings/${bookingId}`);
  return response;
};

export const getAllBookings = async () => {
  const response = await API.get('/bookings');
  return response;
};