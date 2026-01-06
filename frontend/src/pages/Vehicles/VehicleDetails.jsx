import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVehicles } from '../hooks/useVehicles';
import { useBookings } from '../hooks/useBookings';
import { useTheme } from '../../context/ThemeContext'; 
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme(); 
  const { getVehicleById } = useVehicles();
  const { createBooking } = useBookings();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const bgGradient = isDark 
    ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
    : 'bg-gradient-to-br from-gray-50 to-blue-50';
  
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-300' : 'text-gray-600';
  const textLight = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const sectionBg = isDark ? 'bg-gray-700/50' : 'bg-gray-50';

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        console.log('Fetching vehicle with ID:', id);
        const vehicleData = await getVehicleById(id);
        console.log('Vehicle data received:', vehicleData);
        setVehicle(vehicleData);
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        toast.error('Vehicle not found');
        navigate('/vehicles');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicle();
    } else {
      toast.error('Invalid vehicle ID');
      navigate('/vehicles');
    }
  }, [id, getVehicleById, navigate]);

  const handleBookNow = async () => {
    if (!user) {
      toast.error('Please login to book this vehicle');
      navigate('/login');
      return;
    }

    if (!vehicle || vehicle.availability !== 'Available') {
      toast.error('This vehicle is currently not available');
      return;
    }

    try {
      setBookingLoading(true);
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);

      const bookingData = {
        vehicleId: vehicle._id,
        userEmail: user.email,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        notes: 'Booking from Vehicle Details page',
        totalPrice: vehicle.pricePerDay,
        status: 'confirmed'
      };

      console.log('Creating booking with data:', bookingData);
      await createBooking(bookingData);
      toast.success('Vehicle booked successfully!');
      
      const updatedVehicle = await getVehicleById(id);
      setVehicle(updatedVehicle);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to book vehicle');
    } finally {
      setBookingLoading(false);
    }
  };

  const imageUrls = vehicle ? [
    vehicle.coverImage || vehicle.imageURL || '/default-vehicle.jpg',
    vehicle.coverImage || vehicle.imageURL || '/default-vehicle.jpg',
    vehicle.coverImage || vehicle.imageURL || '/default-vehicle.jpg'
  ] : [];

  if (loading) {
    return (
      <div className={`min-h-screen ${bgGradient} flex items-center justify-center transition-colors duration-300`}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className={`min-h-screen ${bgGradient} flex items-center justify-center transition-colors duration-300`}>
        <div className={`text-center ${cardBg} p-8 rounded-2xl shadow-lg transition-colors duration-300`}>
          <div className={`w-24 h-24 ${isDark ? 'bg-red-900/50' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300`}>
            <svg className={`w-12 h-12 ${isDark ? 'text-red-400' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className={`text-2xl font-bold ${textColor} mb-4 transition-colors duration-300`}>Vehicle Not Found</h2>
          <p className={`${textMuted} mb-6 transition-colors duration-300`}>The vehicle you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/vehicles" 
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Vehicles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgGradient} py-8 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link to="/" className={`hover:text-blue-600 transition-colors flex items-center ${textLight}`}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <svg className={`w-4 h-4 mx-2 ${textLight}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link to="/vehicles" className={`hover:text-blue-600 transition-colors ${textLight}`}>All Vehicles</Link>
              </li>
              <li className="flex items-center">
                <svg className={`w-4 h-4 mx-2 ${textLight}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className={`${textColor} font-medium truncate max-w-[200px] transition-colors duration-300`}>
                  {vehicle.vehicleName || vehicle.name}
                </span>
              </li>
            </ol>
          </nav>

          <div className={`${cardBg} rounded-2xl shadow-xl overflow-hidden transition-colors duration-300`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              <div className="space-y-4">
                <div className={`relative rounded-xl overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors duration-300`}>
                  <img
                    src={imageUrls[activeImage]}
                    alt={vehicle.vehicleName || vehicle.name}
                    className="w-full h-80 lg:h-96 object-cover transition-all duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/default-vehicle.jpg';
                    }}
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                    vehicle.availability === 'Available' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {vehicle.availability}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        activeImage === index 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : `${isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'}`
                      }`}
                    >
                      <img
                        src={url}
                        alt={`${vehicle.vehicleName || vehicle.name} ${index + 1}`}
                        className="w-full h-20 object-cover"
                        onError={(e) => {
                          e.target.src = '/default-vehicle.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h1 className={`text-3xl lg:text-4xl font-bold ${textColor} mb-2 transition-colors duration-300`}>
                      {vehicle.vehicleName || vehicle.name}
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                      } transition-colors duration-300`}>
                        {vehicle.category}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800'
                      } transition-colors duration-300`}>
                        {vehicle.fuelType || 'Flex Fuel'}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800'
                      } transition-colors duration-300`}>
                        {vehicle.seats || 4} Seats
                      </span>
                    </div>
                    <div className={`flex items-center ${textMuted} transition-colors duration-300`}>
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">{vehicle.location}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-3xl font-bold text-blue-600">${vehicle.pricePerDay}</div>
                    <div className={`text-sm ${textLight} transition-colors duration-300`}>per day</div>
                  </div>
                </div>

                <div className={`${sectionBg} rounded-xl p-6 transition-colors duration-300`}>
                  <h3 className={`text-lg font-semibold ${textColor} mb-4 transition-colors duration-300`}>Vehicle Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`flex items-center justify-between py-2 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                      <span className={textMuted}>Category</span>
                      <span className={`font-semibold ${textColor} transition-colors duration-300`}>{vehicle.category}</span>
                    </div>
                    <div className={`flex items-center justify-between py-2 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                      <span className={textMuted}>Fuel Type</span>
                      <span className={`font-semibold ${textColor} transition-colors duration-300`}>{vehicle.fuelType || 'N/A'}</span>
                    </div>
                    <div className={`flex items-center justify-between py-2 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                      <span className={textMuted}>Seating Capacity</span>
                      <span className={`font-semibold ${textColor} transition-colors duration-300`}>{vehicle.seats || 'N/A'} people</span>
                    </div>
                    <div className={`flex items-center justify-between py-2 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                      <span className={textMuted}>Year</span>
                      <span className={`font-semibold ${textColor} transition-colors duration-300`}>{vehicle.year || 'N/A'}</span>
                    </div>
                    <div className={`flex items-center justify-between py-2 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                      <span className={textMuted}>Location</span>
                      <span className={`font-semibold ${textColor} transition-colors duration-300`}>{vehicle.location}</span>
                    </div>
                    <div className={`flex items-center justify-between py-2 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                      <span className={textMuted}>Owner</span>
                      <span className={`font-semibold ${textColor} transition-colors duration-300`}>{vehicle.owner || 'TravelEase'}</span>
                    </div>
                  </div>
                </div>

                <div className={`${cardBg} border ${borderColor} rounded-xl p-6 transition-colors duration-300`}>
                  <h3 className={`text-lg font-semibold ${textColor} mb-3 flex items-center transition-colors duration-300`}>
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Vehicle Description
                  </h3>
                  <p className={`${textMuted} leading-relaxed text-lg transition-colors duration-300`}>
                    {vehicle.description || 'This premium vehicle offers exceptional comfort and performance for your travel needs. Perfect for both city commuting and long-distance journeys, it comes equipped with modern amenities to ensure a smooth and enjoyable ride.'}
                  </p>
                </div>

                <div className={`${cardBg} border ${borderColor} rounded-xl p-6 transition-colors duration-300`}>
                  <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center transition-colors duration-300`}>
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Features & Amenities
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Air Conditioning',
                      'Bluetooth Connectivity',
                      'GPS Navigation',
                      'Backup Camera',
                      'Leather Seats',
                      'Sunroof',
                      'Premium Sound System',
                      'Keyless Entry'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={`${textMuted} text-sm transition-colors duration-300`}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`bg-gradient-to-r ${isDark ? 'from-blue-900/30 to-indigo-900/30' : 'from-blue-50 to-indigo-50'} rounded-xl p-6 border ${isDark ? 'border-blue-700/50' : 'border-blue-200'} transition-colors duration-300`}>
                  <div className="text-center mb-4">
                    <h3 className={`text-xl font-semibold ${textColor} mb-2 transition-colors duration-300`}>Ready to Book?</h3>
                    <p className={`${textMuted} transition-colors duration-300`}>Secure this vehicle for your next adventure</p>
                  </div>

                  {vehicle.availability === 'Available' ? (
                    <div className="space-y-4">
                      <button
                        onClick={handleBookNow}
                        disabled={bookingLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3 text-lg"
                      >
                        {bookingLoading ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing Booking...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Book Now - ${vehicle.pricePerDay}/day</span>
                          </>
                        )}
                      </button>
                      
                      <div className={`flex justify-between items-center text-sm ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'} rounded-lg p-3 transition-colors duration-300`}>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Instant Confirmation</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Free Cancellation</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className={`w-full ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'} py-4 rounded-xl font-semibold text-center text-lg mb-3 transition-colors duration-300`}>
                        <div className="flex items-center justify-center space-x-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span>Currently Booked</span>
                        </div>
                      </div>
                      <p className={`${textLight} text-sm transition-colors duration-300`}>This vehicle is currently unavailable. Check back later or browse other available vehicles.</p>
                    </div>
                  )}
                  
                  {!user && vehicle.availability === 'Available' && (
                    <div className="mt-3 text-center">
                      <p className={`${textMuted} text-sm transition-colors duration-300`}>
                        Please{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                          login
                        </Link>{' '}
                        to book this vehicle
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-8 ${cardBg} rounded-2xl shadow-lg p-6 transition-colors duration-300`}>
            <h3 className={`text-xl font-semibold ${textColor} mb-4 text-center transition-colors duration-300`}>Safety & Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`w-12 h-12 ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'} rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-300`}>
                  <svg className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className={`font-semibold ${textColor} mb-2 transition-colors duration-300`}>Verified Vehicles</h4>
                <p className={`${textMuted} text-sm transition-colors duration-300`}>All vehicles undergo thorough inspection and maintenance checks</p>
              </div>
              <div className="text-center">
                <div className={`w-12 h-12 ${isDark ? 'bg-green-900/50' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-300`}>
                  <svg className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className={`font-semibold ${textColor} mb-2 transition-colors duration-300`}>Secure Booking</h4>
                <p className={`${textMuted} text-sm transition-colors duration-300`}>Your personal and payment information is always protected</p>
              </div>
              <div className="text-center">
                <div className={`w-12 h-12 ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-300`}>
                  <svg className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className={`font-semibold ${textColor} mb-2 transition-colors duration-300`}>24/7 Support</h4>
                <p className={`${textMuted} text-sm transition-colors duration-300`}>Our support team is available round the clock to assist you</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;