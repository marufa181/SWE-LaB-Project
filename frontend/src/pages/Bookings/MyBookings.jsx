import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const MyBookings = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { getMyBookings, cancelBooking, loading, error, clearError } = useBookings();
  const [bookings, setBookings] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const bgGradient = isDark 
    ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
    : 'bg-gradient-to-br from-gray-50 to-blue-50';
  
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-800';
  const textMuted = isDark ? 'text-gray-300' : 'text-gray-600';
  const textLight = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50';

  const fetchBookingsData = useCallback(async (isRetry = false) => {
    const now = Date.now();
    if (now - lastFetchTime < 2000 && !isRetry) {
      console.log('⏳ Too soon since last fetch, skipping...');
      return;
    }

    if (user && user.email) {
      try {
        console.log('🔄 Fetching bookings for user:', user.email);
        setLastFetchTime(now);
        
        if (!isRetry) {
          setFetchError(null);
          clearError();
        }
        
        const response = await getMyBookings(user.email);
        console.log('📦 Bookings API response:', response);
        
        let bookingsData = [];
        if (response && typeof response === 'object') {
          if (Array.isArray(response.data)) {
            bookingsData = response.data;
          } else if (Array.isArray(response)) {
            bookingsData = response;
          } else if (response.data && typeof response.data === 'object') {
            bookingsData = [response.data];
          } else if (response.success && Array.isArray(response.data)) {
            bookingsData = response.data;
          }
        }
        
        console.log('✅ Processed bookings data:', bookingsData);
        setBookings(bookingsData);
        setRetryCount(0);
        
      } catch (error) {
        console.error('❌ Error fetching bookings:', error);
        const errorMsg = error.message || 'Failed to load bookings';
        setFetchError(errorMsg);
        
        if (error.message.includes('429') || error.message.includes('Too many requests')) {
          toast.error('Please wait a moment before trying again');
        } else if (error.message.includes('404')) {
          toast.error('Bookings not found');
          setBookings([]); 
        } else if (error.message.includes('Network error')) {
          toast.error('Network connection failed');
        } else {
          toast.error(errorMsg);
        }
        
        if (!isRetry) {
          setBookings([]);
        }
      }
    }
  }, [user, getMyBookings, clearError, lastFetchTime]);

  useEffect(() => {
    fetchBookingsData();
  }, [fetchBookingsData]);

  const handleRetry = () => {
    if (retryCount >= 3) {
      toast.error('Too many retries. Please refresh the page.');
      return;
    }
    setRetryCount(prev => prev + 1);
    fetchBookingsData(true);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      console.log('🔄 Starting cancellation for booking:', bookingId);
      
      await cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      
    } catch (error) {
      console.error('❌ Cancel booking error:', error);
      
      if (error.message.includes('429') || error.message.includes('Too many requests')) {
        toast.error('Please wait a moment before trying again');
      } else if (error.message.includes('404')) {
        toast.error('Booking not found or already cancelled');
        setBookings(prev => prev.filter(booking => booking._id !== bookingId));
      } else if (error.message.includes('Network error')) {
        toast.error('Network error: Please check your connection');
      } else {
        toast.error(error.message || 'Failed to cancel booking');
      }
      
      fetchBookingsData(true);
    } finally {
      setCancellingId(null);
    }
  };

  const getVehicleData = (booking) => {
    const vehicle = booking.vehicleId || booking.vehicle || {};
    return {
      name: vehicle.vehicleName || 'Unknown Vehicle',
      image: vehicle.coverImage || '/default-vehicle.jpg',
      owner: vehicle.owner || 'Unknown Owner',
      category: vehicle.category || 'Unknown Category',
      location: vehicle.location || 'Unknown Location',
      pricePerDay: vehicle.pricePerDay || 0
    };
  };

  const getBookingDates = (booking) => {
    try {
      const startDate = booking.startDate ? new Date(booking.startDate) : new Date();
      const endDate = booking.endDate ? new Date(booking.endDate) : new Date();
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
      
      return {
        start: startDate.toLocaleDateString(),
        end: endDate.toLocaleDateString(),
        days: days
      };
    } catch (error) {
      console.error('Error parsing dates:', error);
      return {
        start: 'Invalid Date',
        end: 'Invalid Date',
        days: 1
      };
    }
  };

  const canCancelBooking = (booking) => {
    if (booking.status === 'cancelled') return false;
    
    const startDate = booking.startDate ? new Date(booking.startDate) : new Date();
    const now = new Date();
    
    return startDate.getTime() - now.getTime() > 24 * 60 * 60 * 1000;
  };

  if (loading && bookings.length === 0 && !fetchError) {
    return (
      <div className={`min-h-screen ${bgGradient} flex items-center justify-center transition-colors duration-300`}>
        <LoadingSpinner />
      </div>
    );
  }

  if (fetchError && (fetchError.includes('429') || fetchError.includes('Too many requests'))) {
    return (
      <div className={`min-h-screen ${bgGradient} flex items-center justify-center transition-colors duration-300`}>
        <div className={`${cardBg} rounded-2xl shadow-lg p-8 max-w-md mx-4 transition-colors duration-300`}>
          <div className={`w-16 h-16 ${isDark ? 'bg-orange-900/50' : 'bg-orange-100'} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300`}>
            <svg className={`w-8 h-8 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className={`text-xl font-bold ${textColor} mb-2 transition-colors duration-300`}>Too Many Requests</h3>
          <p className={`${textMuted} mb-4 transition-colors duration-300`}>Please wait a moment before trying again.</p>
          <p className={`text-sm ${textLight} mb-6 transition-colors duration-300`}>
            {retryCount >= 3 ? 'Maximum retries reached. Please refresh the page.' : 'This helps prevent overloading the server.'}
          </p>
          <button 
            onClick={handleRetry}
            disabled={retryCount >= 3}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            {retryCount >= 3 ? 'Too many retries' : 'Try Again'}
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors w-full"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (fetchError && !fetchError.includes('429') && !fetchError.includes('Too many requests')) {
    return (
      <div className={`min-h-screen ${bgGradient} flex items-center justify-center transition-colors duration-300`}>
        <div className={`${cardBg} rounded-2xl shadow-lg p-8 max-w-md mx-4 transition-colors duration-300`}>
          <div className={`w-16 h-16 ${isDark ? 'bg-red-900/50' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300`}>
            <svg className={`w-8 h-8 ${isDark ? 'text-red-400' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className={`text-xl font-bold ${textColor} mb-2 transition-colors duration-300`}>Error Loading Bookings</h3>
          <p className={`${textMuted} mb-4 transition-colors duration-300`}>{fetchError}</p>
          <div className="flex space-x-3">
            <button 
              onClick={handleRetry}
              disabled={retryCount >= 3}
              className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {retryCount >= 3 ? 'Too many retries' : 'Try Again'}
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen ${bgGradient} flex items-center justify-center transition-colors duration-300`}>
        <div className={`${cardBg} rounded-2xl shadow-lg p-8 max-w-md mx-4 transition-colors duration-300`}>
          <div className={`w-16 h-16 ${isDark ? 'bg-red-900/50' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300`}>
            <svg className={`w-8 h-8 ${isDark ? 'text-red-400' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className={`text-xl font-bold ${textColor} mb-2 transition-colors duration-300`}>Authentication Required</h3>
          <p className={`${textMuted} mb-6 transition-colors duration-300`}>Please login to view your bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgGradient} py-8 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
              My Bookings
            </h1>
            <p className={`${textMuted} text-lg transition-colors duration-300`}>
              Manage and track all your vehicle reservations in one place
            </p>
          </div>

          <div className={`${cardBg} rounded-2xl shadow-lg p-6 mb-8 transition-colors duration-300`}>
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="flex items-center space-x-6 mb-4 lg:mb-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
                  <div className={`text-sm ${textLight} transition-colors duration-300`}>Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </div>
                  <div className={`text-sm ${textLight} transition-colors duration-300`}>Confirmed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {bookings.filter(b => b.status === 'cancelled').length}
                  </div>
                  <div className={`text-sm ${textLight} transition-colors duration-300`}>Cancelled</div>
                </div>
              </div>
              
              <div className={`text-sm ${textLight} ${isDark ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-2 rounded-lg transition-colors duration-300`}>
                Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className={`${cardBg} rounded-2xl shadow-lg p-12 text-center transition-colors duration-300`}>
              <div className={`w-24 h-24 ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'} rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300`}>
                <svg className={`w-12 h-12 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold ${textColor} mb-3 transition-colors duration-300`}>No Bookings Yet</h3>
              <p className={`${textMuted} mb-8 max-w-md mx-auto transition-colors duration-300`}>
                {fetchError ? 'Unable to load bookings. Please try again.' : 'You haven\'t made any bookings yet. Start by exploring our vehicles and book your perfect ride.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/vehicles"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
                >
                  Browse Vehicles
                </a>
                <a 
                  href="/"
                  className={`inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl ${isDark ? 'hover:bg-blue-900/30' : 'hover:bg-blue-50'} transition-all duration-200 font-medium`}
                >
                  Go Home
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const vehicle = getVehicleData(booking);
                const dates = getBookingDates(booking);
                const canCancel = canCancelBooking(booking);
                
                return (
                  <div key={booking._id} className={`${cardBg} rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border ${borderColor} ${hoverBg}`}>
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4 mb-4">
                          <img 
                            src={vehicle.image} 
                            alt={vehicle.name}
                            className="w-20 h-20 object-cover rounded-xl flex-shrink-0 border border-gray-200 dark:border-gray-600"
                            onError={(e) => {
                              e.target.src = '/default-vehicle.jpg';
                            }}
                          />
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold ${textColor} mb-2 transition-colors duration-300`}>
                              {vehicle.name}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <p className={textMuted}>
                                <span className="font-medium">Owner:</span> {vehicle.owner}
                              </p>
                              <p className={textMuted}>
                                <span className="font-medium">Category:</span> {vehicle.category}
                              </p>
                              <p className={textMuted}>
                                <span className="font-medium">Location:</span> {vehicle.location}
                              </p>
                              <p className={textMuted}>
                                <span className="font-medium">Price per day:</span> ${vehicle.pricePerDay}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl transition-colors duration-300`}>
                          <div>
                            <span className={`font-medium ${textColor} block mb-1 transition-colors duration-300`}>Booking Dates</span>
                            <p className={`${textMuted} text-sm transition-colors duration-300`}>
                              {dates.start} - {dates.end}
                            </p>
                            <p className={`${textLight} text-xs transition-colors duration-300`}>
                              {dates.days} day{dates.days !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div>
                            <span className={`font-medium ${textColor} block mb-1 transition-colors duration-300`}>Total Price</span>
                            <p className="text-blue-600 font-semibold text-lg">
                              ${booking.totalPrice || (dates.days * vehicle.pricePerDay)}
                            </p>
                          </div>
                          <div>
                            <span className={`font-medium ${textColor} block mb-1 transition-colors duration-300`}>Status</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              booking.status === 'confirmed' 
                                ? isDark 
                                  ? 'bg-green-900/50 text-green-300 border-green-700/50' 
                                  : 'bg-green-100 text-green-800 border-green-200'
                                : booking.status === 'cancelled'
                                ? isDark
                                  ? 'bg-red-900/50 text-red-300 border-red-700/50'
                                  : 'bg-red-100 text-red-800 border-red-200'
                                : isDark
                                  ? 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50'
                                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            } transition-colors duration-300`}>
                              {booking.status || 'pending'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className={`font-medium ${textColor} transition-colors duration-300`}>Booking ID:</span>
                            <p className={`${textMuted} font-mono text-xs mt-1 transition-colors duration-300`}>{booking._id}</p>
                          </div>
                          <div>
                            <span className={`font-medium ${textColor} transition-colors duration-300`}>Booked on:</span>
                            <p className={`${textMuted} mt-1 transition-colors duration-300`}>
                              {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Unknown date'}
                            </p>
                          </div>
                        </div>
                        
                        {booking.notes && (
                          <div className="mt-4">
                            <span className={`font-medium ${textColor} transition-colors duration-300`}>Notes:</span>
                            <p className={`${textMuted} mt-1 text-sm transition-colors duration-300`}>{booking.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 lg:mt-0 lg:ml-6 lg:self-start flex flex-col space-y-3">
                        {booking.status === 'confirmed' && canCancel && (
                          <button 
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 min-w-[140px]"
                          >
                            {cancellingId === booking._id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Cancelling...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Cancel Booking</span>
                              </>
                            )}
                          </button>
                        )}

                        {booking.status === 'confirmed' && !canCancel && (
                          <div className={`text-xs ${isDark ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-50'} px-3 py-2 rounded-lg text-center border ${isDark ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                            Cannot cancel within 24 hours of start date
                          </div>
                        )}
                        
                        {new Date(booking.startDate) > new Date() && (
                          <div className={`text-xs ${isDark ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-50'} px-3 py-1 rounded-lg text-center border ${isDark ? 'border-green-700/50' : 'border-green-200'} transition-colors duration-300`}>
                            🟢 Upcoming
                          </div>
                        )}
                        {new Date(booking.startDate) <= new Date() && new Date(booking.endDate) >= new Date() && (
                          <div className={`text-xs ${isDark ? 'text-blue-400 bg-blue-900/30' : 'text-blue-600 bg-blue-50'} px-3 py-1 rounded-lg text-center border ${isDark ? 'border-blue-700/50' : 'border-blue-200'} transition-colors duration-300`}>
                            🔵 Active
                          </div>
                        )}
                        {new Date(booking.endDate) < new Date() && (
                          <div className={`text-xs ${isDark ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-50'} px-3 py-1 rounded-lg text-center border ${isDark ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                            ⚫ Completed
                          </div>
                        )}
                        
                        {booking.status === 'cancelled' && (
                          <div className={`text-xs ${isDark ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-50'} px-3 py-2 rounded-lg text-center border ${isDark ? 'border-red-700/50' : 'border-red-200'} transition-colors duration-300`}>
                            ❌ Cancelled
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {bookings.length > 0 && (
            <div className={`mt-12 ${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} rounded-2xl p-6 border transition-colors duration-300`}>
              <div className="flex items-start space-x-4">
                <div className={`w-8 h-8 ${isDark ? 'bg-blue-800' : 'bg-blue-100'} rounded-full flex items-center justify-center flex-shrink-0 mt-1 transition-colors duration-300`}>
                  <svg className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-blue-300' : 'text-blue-800'} mb-2 transition-colors duration-300`}>Need Help?</h3>
                  <p className={`${isDark ? 'text-blue-200' : 'text-blue-700'} text-sm transition-colors duration-300`}>
                    If you have any questions about your bookings or need to make changes, 
                    please contact our support team. We're here to help!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;