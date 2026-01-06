import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import VehicleCard from '../../components/common/VehicleCard';
import SearchFilter from '../../components/ui/SearchFilter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useVehicles } from '../hooks/useVehicles'; 
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast'; 

const AllVehicles = () => {
  const navigate = useNavigate();
  const { getAllVehicles, loading } = useVehicles();
  const { createBooking } = useBookings();
  const { user } = useAuth();
  const { isDark } = useTheme(); 
  
  const [vehicles, setVehicles] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('');

  const bgClass = isDark
    ? 'min-h-screen bg-gradient-to-br from-gray-900 to-gray-800'
    : 'min-h-screen bg-gradient-to-br from-gray-50 to-blue-50';
    
  const cardClass = isDark
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';

  const fetchVehicles = useCallback(async (filterParams = {}, sortParam = '') => {
    try {
      const queryParams = {};
      
      if (filterParams.category) queryParams.category = filterParams.category;
      if (filterParams.location) queryParams.location = filterParams.location;
      if (filterParams.availability) queryParams.availability = filterParams.availability;
      
      if (filterParams.priceRange) {
        const [min, max] = filterParams.priceRange.split('-');
        if (min) queryParams.minPrice = min;
        if (max && max !== '+') queryParams.maxPrice = max;
      }
      
      if (sortParam) {
        queryParams.sort = sortParam;
      }

      console.log('🔄 Fetching vehicles with params:', queryParams);
      const allVehicles = await getAllVehicles(queryParams);
      setVehicles(allVehicles || []);
      
    } catch (error) {
      console.error('❌ Error fetching vehicles:', error);
      toast.error(error.message || "Failed to load vehicles.");
      setVehicles([]);
    }
  }, [getAllVehicles]);

  useEffect(() => {
    fetchVehicles(filters, sortBy);
  }, [fetchVehicles, filters, sortBy]);

  const handleFilter = (newFilters) => {
    console.log('🎯 New filters applied:', newFilters);
    setFilters(newFilters);
  };

  const handleSort = (sortOption) => {
    console.log('🎯 New sort applied:', sortOption);
    setSortBy(sortOption);
  };

  const handleClearFilters = () => {
    console.log('🔄 Clearing all filters');
    setFilters({});
    setSortBy('');
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || sortBy !== '';

  const handleBookVehicle = async (vehicleId) => {
    if (!user) {
      toast.error('Please login to book a vehicle');
      navigate('/login');
      return;
    }

    try {
      setBookingLoading(vehicleId);
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 3); 

      const bookingData = {
        vehicleId: vehicleId,
        userEmail: user.email,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        notes: 'Booking from All Vehicles page'
      };

      console.log('📅 Attempting to book with data:', bookingData);
      await createBooking(bookingData);
      toast.success('Vehicle booked successfully! 🎉');
      
      fetchVehicles(filters, sortBy);
      
    } catch (error) {
      console.error('❌ Booking error:', error);
      toast.error(error.message || 'Failed to book vehicle. Please try again.');
    } finally {
      setBookingLoading(null);
    }
  };

  const handleViewDetails = (vehicleId) => {
    navigate(`/vehicle/${vehicleId}`);
  };

  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.availability === 'Available').length;

  if (loading) {
    return (
      <div className={`${bgClass} flex items-center justify-center min-h-screen transition-colors duration-300`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`${bgClass} py-8 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className={`font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full transition-colors duration-300 ${
                isDark ? 'text-blue-300 bg-blue-900/50' : 'text-blue-600 bg-blue-50'
              }`}>
                Premium Fleet
              </span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${textPrimary}`}>
              Explore Our Vehicles
            </h1>
            <p className={`text-lg max-w-2xl mx-auto leading-relaxed transition-colors duration-300 ${textSecondary}`}>
              Discover the perfect vehicle for your journey from our curated collection of premium rides.
            </p>
          </div>

          <div className={`rounded-2xl p-6 mb-8 border transition-colors duration-300 ${cardClass}`}>
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="flex items-center space-x-8 mb-4 lg:mb-0">
                <div className="text-center">
                  <div className={`text-2xl font-bold transition-colors duration-300 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {totalVehicles}
                  </div>
                  <div className={`text-sm transition-colors duration-300 ${textSecondary}`}>Total Vehicles</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold transition-colors duration-300 ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {availableVehicles}
                  </div>
                  <div className={`text-sm transition-colors duration-300 ${textSecondary}`}>Available Now</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold transition-colors duration-300 ${
                    isDark ? 'text-orange-400' : 'text-orange-600'
                  }`}>
                    {totalVehicles - availableVehicles}
                  </div>
                  <div className={`text-sm transition-colors duration-300 ${textSecondary}`}>Currently Booked</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`px-4 py-2 rounded-lg text-sm transition-colors duration-300 ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  Showing {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
                </div>
                
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                      isDark 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Clear Filters</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <SearchFilter 
              onFilter={handleFilter} 
              onSort={handleSort}
              isDark={isDark} 
            />
          </div>

          {vehicles.length === 0 ? (
            <div className={`rounded-2xl p-12 text-center border transition-colors duration-300 ${cardClass}`}>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <svg className={`w-12 h-12 transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${textPrimary}`}>
                No Vehicles Found
              </h3>
              <p className={`mb-8 max-w-md mx-auto transition-colors duration-300 ${textSecondary}`}>
                {hasActiveFilters 
                  ? "We couldn't find any vehicles matching your criteria. Try adjusting your filters or clearing them to see all vehicles."
                  : "There are no vehicles available at the moment. Please check back later."
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className={`inline-block px-8 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isDark
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {vehicles.map(vehicle => (
                <div 
                  key={vehicle._id} 
                  className={`rounded-2xl overflow-hidden border transition-all duration-300 transform hover:-translate-y-2 ${cardClass}`}
                >
                  <VehicleCard vehicle={vehicle} />
                  
                  <div className={`p-6 border-t transition-colors duration-300 ${
                    isDark ? 'border-gray-700' : 'border-gray-100'
                  }`}>
                    <div className="flex flex-col space-y-3">
                      <button
                        onClick={() => handleViewDetails(vehicle._id)}
                        className={`w-full py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 ${
                          isDark
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View Details</span>
                      </button>

                      {vehicle.availability === 'Available' ? (
                        <button
                          onClick={() => handleBookVehicle(vehicle._id)}
                          disabled={bookingLoading === vehicle._id}
                          className={`w-full py-3 rounded-xl transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 ${
                            isDark
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {bookingLoading === vehicle._id ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Booking...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Book Now</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className={`w-full py-3 rounded-xl font-semibold text-center transition-colors duration-300 ${
                          isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Currently Booked</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllVehicles;