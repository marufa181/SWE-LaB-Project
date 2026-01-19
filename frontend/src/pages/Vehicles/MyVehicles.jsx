import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVehicles } from '../hooks/useVehicles';
import { useTheme } from '../../context/ThemeContext'; 
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const MyVehicles = () => {
  const { user } = useAuth();
  const { isDark } = useTheme(); 
  const navigate = useNavigate();
  const { getMyVehicles, deleteVehicle, updateVehicle, loading } = useVehicles();
  const [vehicles, setVehicles] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [filter, setFilter] = useState('all');

  const bgGradient = isDark 
    ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
    : 'bg-gradient-to-br from-gray-50 to-blue-50';
  
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-300' : 'text-gray-600';
  const textLight = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';
  const hoverBg = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200';

  useEffect(() => {
    const fetchVehicles = async () => {
      if (user) {
        try {
          setFetchLoading(true);
          console.log('🔄 Fetching vehicles for user:', user.email);
          
          let response;
          try {
            response = await getMyVehicles();
            console.log('📦 Raw API response:', response);
          } catch (error) {
            console.log('⚠️ New endpoint failed, trying legacy endpoint:', error);
            response = await getMyVehicles(user.email);
          }
          
          let vehiclesArray = [];
          
          if (Array.isArray(response)) {
            vehiclesArray = response;
            console.log('✅ Using response as direct array');
          } else if (response && response.success && Array.isArray(response.data)) {
            vehiclesArray = response.data;
            console.log('✅ Using response.data from success object');
          } else if (response && Array.isArray(response.data)) {
            vehiclesArray = response.data;
            console.log('✅ Using response.data from data object');
          } else {
            console.warn('❌ Unexpected response format:', response);
            vehiclesArray = [];
          }
          
          console.log('🚗 Final vehicles array:', vehiclesArray);
          setVehicles(vehiclesArray);
          
          if (vehiclesArray.length === 0) {
            console.log('ℹ️ No vehicles found for user');
          }
          
        } catch (error) {
          console.error('❌ Failed to fetch vehicles:', error);
          toast.error(error.message || 'Failed to load your vehicles. Please try again.');
          setVehicles([]);
        } finally {
          setFetchLoading(false);
        }
      }
    };
    
    fetchVehicles();
  }, [user, getMyVehicles]);

  const filteredVehicles = vehicles.filter(vehicle => {
    if (!vehicle || typeof vehicle !== 'object') return false;
    
    switch (filter) {
      case 'available':
        return vehicle.availability === 'Available';
      case 'booked':
        return vehicle.availability === 'Booked';
      default:
        return true;
    }
  });

  const handleDeleteClick = (vehicle) => {
    if (!vehicle || !vehicle._id) {
      toast.error('Invalid vehicle data');
      return;
    }
    setVehicleToDelete(vehicle);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete || !vehicleToDelete._id) return;

    try {
      setDeletingId(vehicleToDelete._id);
      await deleteVehicle(vehicleToDelete._id);
      
      setVehicles(prevVehicles => 
        prevVehicles.filter(vehicle => vehicle._id !== vehicleToDelete._id)
      );
      toast.success('Vehicle deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete vehicle. Please try again.');
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setVehicleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setVehicleToDelete(null);
  };

  const handleViewDetails = (vehicleId) => {
    if (!vehicleId) {
      toast.error('Invalid vehicle ID');
      return;
    }
    navigate(`/vehicle/${vehicleId}`);
  };

  const handleUpdateVehicle = async (vehicleId) => {
    if (!vehicleId) {
      toast.error('Invalid vehicle ID');
      return;
    }
    
    console.log('🔄 Update button clicked for vehicle:', vehicleId);
    console.log('👤 Current user:', user?.email);
    
    try {
      const vehicle = vehicles.find(v => v._id === vehicleId);
      if (!vehicle) {
        toast.error('Vehicle not found in your list');
        return;
      }
      
      console.log('🚗 Vehicle found:', {
        id: vehicle._id,
        name: vehicle.vehicleName,
        owner: vehicle.userEmail,
        currentUser: user?.email,
        isOwner: vehicle.userEmail === user?.email
      });
      
      if (vehicle.userEmail !== user?.email) {
        toast.error('You are not authorized to update this vehicle');
        return;
      }
      
      navigate(`/update-vehicle/${vehicleId}`);
    } catch (error) {
      console.error('❌ Error preparing to update vehicle:', error);
      toast.error('Failed to access vehicle details');
    }
  };

  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v && v.availability === 'Available').length;
  const bookedVehicles = vehicles.filter(v => v && v.availability === 'Booked').length;

  if (fetchLoading) {
    return (
      <div className={`min-h-screen ${bgGradient} flex items-center justify-center transition-colors duration-300`}>
        <div className="text-center">
          <LoadingSpinner />
          <p className={`mt-4 ${textMuted} text-lg transition-colors duration-300`}>Loading your vehicles...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen ${bgGradient} flex items-center justify-center transition-colors duration-300`}>
        <div className={`${cardBg} rounded-2xl shadow-xl p-8 max-w-md mx-4 transition-colors duration-300`}>
          <div className={`w-16 h-16 ${isDark ? 'bg-red-900/50' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300`}>
            <svg className={`w-8 h-8 ${isDark ? 'text-red-400' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className={`text-xl font-bold ${textColor} mb-2 transition-colors duration-300`}>Authentication Required</h3>
          <p className={`${textMuted} mb-6 transition-colors duration-300`}>Please login to view your vehicles.</p>
          <Link 
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen ${bgGradient} py-8 transition-colors duration-300`}>
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className={`${isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-600'} font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full transition-colors duration-300`}>
                  My Fleet
                </span>
              </div>
              <h1 className={`text-4xl md:text-5xl font-bold ${textColor} mb-6 transition-colors duration-300`}>
                Manage Your Vehicles
              </h1>
              <p className={`${textMuted} text-lg max-w-2xl mx-auto leading-relaxed transition-colors duration-300`}>
                View, edit, and manage all your listed vehicles in one place.
              </p>
            </div>

            <div className={`${cardBg} rounded-2xl shadow-lg p-6 mb-8 transition-colors duration-300`}>
              <div className="flex flex-col lg:flex-row justify-between items-center">
                <div className="flex items-center space-x-8 mb-4 lg:mb-0">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalVehicles}</div>
                    <div className={`text-sm ${textLight} transition-colors duration-300`}>Total Vehicles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{availableVehicles}</div>
                    <div className={`text-sm ${textLight} transition-colors duration-300`}>Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{bookedVehicles}</div>
                    <div className={`text-sm ${textLight} transition-colors duration-300`}>Booked</div>
                  </div>
                </div>
                
                <Link 
                  to="/add-vehicle"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add New Vehicle</span>
                </Link>
              </div>
            </div>

            {vehicles.length > 0 && (
              <div className={`${cardBg} rounded-2xl shadow-lg p-6 mb-8 transition-colors duration-300`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className={`text-lg font-semibold ${textColor} mb-2 transition-colors duration-300`}>Filter Vehicles</h3>
                    <p className={`${textMuted} text-sm transition-colors duration-300`}>Show vehicles based on availability</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        filter === 'all'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                      }`}
                    >
                      All ({totalVehicles})
                    </button>
                    <button
                      onClick={() => setFilter('available')}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        filter === 'available'
                          ? 'bg-green-600 text-white shadow-lg'
                          : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                      }`}
                    >
                      Available ({availableVehicles})
                    </button>
                    <button
                      onClick={() => setFilter('booked')}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        filter === 'booked'
                          ? 'bg-orange-600 text-white shadow-lg'
                          : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                      }`}
                    >
                      Booked ({bookedVehicles})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {filteredVehicles.length === 0 ? (
              <div className={`${cardBg} rounded-2xl shadow-lg p-12 text-center transition-colors duration-300`}>
                <div className={`w-24 h-24 ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'} rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300`}>
                  <svg className={`w-12 h-12 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <h3 className={`text-2xl font-bold ${textColor} mb-3 transition-colors duration-300`}>
                  {vehicles.length === 0 ? 'No Vehicles Yet' : `No ${filter} Vehicles`}
                </h3>
                <p className={`${textMuted} mb-8 max-w-md mx-auto transition-colors duration-300`}>
                  {vehicles.length === 0 
                    ? 'Start your journey by adding your first vehicle and begin earning from rentals.'
                    : `You don't have any ${filter === 'available' ? 'available' : 'booked'} vehicles at the moment.`
                  }
                </p>
                {vehicles.length === 0 && (
                  <Link 
                    to="/add-vehicle"
                    className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Add Your First Vehicle
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <p className={`${textMuted} transition-colors duration-300`}>
                    Showing {filteredVehicles.length} of {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
                    {filter !== 'all' && ` (${filter})`}
                  </p>
                  {filter !== 'all' && (
                    <button
                      onClick={() => setFilter('all')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredVehicles.map((vehicle) => (
                    <div 
                      key={vehicle._id} 
                      className={`${cardBg} rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border ${borderColor}`}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={vehicle.coverImage || '/default-vehicle.jpg'} 
                          alt={vehicle.vehicleName || 'Vehicle'}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            e.target.src = '/default-vehicle.jpg';
                          }}
                        />
                        
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            vehicle.availability === 'Available' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-red-500 text-white'
                          }`}>
                            {vehicle.availability || 'Unknown'}
                          </span>
                        </div>

                        <div className="absolute top-4 right-4 flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(vehicle._id)}
                            className={`${isDark ? 'bg-gray-700/90 text-blue-400 hover:bg-blue-600' : 'bg-white/90 text-blue-600 hover:bg-blue-600 hover:text-white'} backdrop-blur-sm p-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110`}
                            title="View Details"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => handleUpdateVehicle(vehicle._id)}
                            className={`${isDark ? 'bg-gray-700/90 text-green-400 hover:bg-green-600' : 'bg-white/90 text-green-600 hover:bg-green-600 hover:text-white'} backdrop-blur-sm p-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110`}
                            title="Edit Vehicle"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteClick(vehicle)}
                            disabled={deletingId === vehicle._id || loading}
                            className={`${isDark ? 'bg-gray-700/90 text-red-400 hover:bg-red-600' : 'bg-white/90 text-red-600 hover:bg-red-600 hover:text-white'} backdrop-blur-sm p-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                            title="Delete Vehicle"
                          >
                            {deletingId === vehicle._id ? (
                              <div className={`w-4 h-4 border-2 ${isDark ? 'border-red-400' : 'border-red-600'} border-t-transparent rounded-full animate-spin`}></div>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>

                        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
                          <span className="font-bold text-lg">${vehicle.pricePerDay || 0}</span>
                          <span className="text-sm opacity-90">/day</span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className={`text-xl font-bold ${textColor} truncate mr-2 transition-colors duration-300`}>
                            {vehicle.vehicleName || 'Unnamed Vehicle'}
                          </h3>
                          <span className={`${isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-600'} px-2 py-1 rounded text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors duration-300`}>
                            {vehicle.category || 'Vehicle'}
                          </span>
                        </div>
                        
                        <p className={`${textMuted} mb-4 line-clamp-2 min-h-[40px] transition-colors duration-300`}>
                          {vehicle.description || 'No description available.'}
                        </p>
                        
                        <div className={`flex items-center ${textLight} text-sm mb-4 transition-colors duration-300`}>
                          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{vehicle.location || 'Location not specified'}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                          <div className={`flex items-center space-x-1 ${textMuted} transition-colors duration-300`}>
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="truncate">{vehicle.fuelType || 'N/A'}</span>
                          </div>
                          <div className={`flex items-center space-x-1 ${textMuted} transition-colors duration-300`}>
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{vehicle.seats || 'N/A'} seats</span>
                          </div>
                        </div>

                        <div className={`flex justify-between items-center pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'} transition-colors duration-300`}>
                          <div className={`text-xs ${textLight} transition-colors duration-300`}>
                            {vehicle.createdAt ? `Added ${new Date(vehicle.createdAt).toLocaleDateString()}` : 'Recently added'}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            vehicle.availability === 'Available' 
                              ? isDark 
                                ? 'bg-green-900/50 text-green-300' 
                                : 'bg-green-100 text-green-800'
                              : isDark
                                ? 'bg-red-900/50 text-red-300'
                                : 'bg-red-100 text-red-800'
                          } transition-colors duration-300`}>
                            {vehicle.availability || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && vehicleToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`${cardBg} rounded-2xl shadow-2xl max-w-md w-full p-6 transition-colors duration-300`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 ${isDark ? 'bg-red-900/50' : 'bg-red-100'} rounded-full flex items-center justify-center transition-colors duration-300`}>
                <svg className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className={`text-xl font-bold ${textColor} transition-colors duration-300`}>Delete Vehicle</h3>
                <p className={`${textMuted} transition-colors duration-300`}>This action cannot be undone</p>
              </div>
            </div>
            
            <div className={`${isDark ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'} border rounded-lg p-4 mb-6 transition-colors duration-300`}>
              <p className={`${isDark ? 'text-red-300' : 'text-red-800'} font-medium mb-2 transition-colors duration-300`}>
                Are you sure you want to delete "{vehicleToDelete.vehicleName || vehicleToDelete.name || 'this vehicle'}"?
              </p>
              <p className={`${isDark ? 'text-red-200' : 'text-red-600'} text-sm transition-colors duration-300`}>
                All vehicle data and associated bookings will be permanently removed from the database.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDeleteCancel}
                className={`flex-1 ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'} py-3 px-4 rounded-xl transition-all duration-200 font-medium`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingId === vehicleToDelete._id}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {deletingId === vehicleToDelete._id ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete Vehicle</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyVehicles;