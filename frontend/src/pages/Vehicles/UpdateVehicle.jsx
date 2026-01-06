import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import VehicleForm from '../../components/forms/VehicleForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useVehicles } from '../hooks/useVehicles';
import { useTheme } from '../../context/ThemeContext'; 

const UpdateVehicle = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { isDark } = useTheme(); 
  const { getVehicleById, updateVehicle, loading } = useVehicles();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!user || !id) return;
      
      try {
        setFetchLoading(true);
        setUpdateError('');
        
        console.log('🔄 Fetching vehicle for update:', id);
        console.log('👤 Current user:', user.email);
        
        const vehicleData = await getVehicleById(id);
        
        console.log('📦 Vehicle data received:', vehicleData);
        
        if (!vehicleData) {
          console.log('❌ Vehicle not found with ID:', id);
          toast.error('Vehicle not found.');
          navigate('/my-vehicles');
          return;
        }
        
        console.log('🔐 Ownership check:', {
          vehicleOwner: vehicleData.userEmail,
          currentUser: user.email,
          isOwner: vehicleData.userEmail === user.email
        });
        
        if (vehicleData.userEmail !== user.email) {
          console.log('🚫 User is not the owner of this vehicle');
          toast.error('You can only update your own vehicles.');
          navigate('/my-vehicles');
          return;
        }
        
        console.log('✅ Vehicle loaded successfully:', vehicleData);
        setVehicle(vehicleData);
      } catch (error) {
        console.error('❌ Error fetching vehicle:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Vehicle not found or access denied.';
        setUpdateError(errorMessage);
        toast.error(errorMessage);
        navigate('/my-vehicles');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchVehicle();
  }, [id, user, getVehicleById, navigate]);

  const handleSubmit = async (vehicleData) => {
    try {
      setUpdateError('');
      console.log('🔄 Updating vehicle with data:', vehicleData);
      
      await updateVehicle(id, vehicleData);
      toast.success('Vehicle updated successfully!');
      navigate('/my-vehicles');
    } catch (error) {
      console.error('❌ Update error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update vehicle. Please try again.';
      setUpdateError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate('/my-vehicles');
  };

  const bgGradient = isDark 
    ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
    : 'bg-gradient-to-br from-gray-50 to-blue-50';
  
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-800';
  const textMuted = isDark ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const headerBg = isDark ? 'bg-gradient-to-r from-blue-700 to-blue-800' : 'bg-gradient-to-r from-blue-600 to-blue-700';

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
          <p className={`${textMuted} mb-6 transition-colors duration-300`}>Please login to update vehicles.</p>
          <Link 
            to="/login" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  if (fetchLoading) {
    return (
      <div className={`min-h-screen ${bgGradient} flex items-center justify-center transition-colors duration-300`}>
        <div className="text-center">
          <LoadingSpinner />
          <p className={`mt-4 ${textMuted} text-lg transition-colors duration-300`}>Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle && !fetchLoading) {
    return (
      <div className={`min-h-screen ${bgGradient} flex items-center justify-center transition-colors duration-300`}>
        <div className={`${cardBg} rounded-2xl shadow-xl p-8 max-w-md mx-4 transition-colors duration-300`}>
          <div className={`w-16 h-16 ${isDark ? 'bg-yellow-900/50' : 'bg-yellow-100'} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300`}>
            <svg className={`w-8 h-8 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className={`text-xl font-bold ${textColor} mb-2 transition-colors duration-300`}>Vehicle Not Found</h3>
          <p className={`${textMuted} mb-6 transition-colors duration-300`}>The vehicle you're trying to update doesn't exist or has been removed.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to="/my-vehicles" 
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium text-center"
            >
              Back to My Vehicles
            </Link>
            <Link 
              to="/vehicles" 
              className={`border-2 ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} px-6 py-3 rounded-xl transition-all duration-200 font-medium text-center`}
            >
              Browse All Vehicles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgGradient} py-8 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`${cardBg} rounded-2xl shadow-xl overflow-hidden transition-colors duration-300`}>
            <div className={`${headerBg} px-6 py-4 transition-colors duration-300`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-lg">Editing: {vehicle?.vehicleName}</h2>
                    <p className="text-blue-100 text-sm">Make your changes below</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 font-medium border border-white/30 backdrop-blur-sm"
                  >
                    Cancel
                  </button>
                  <Link 
                    to="/my-vehicles"
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>My Vehicles</span>
                  </Link>
                </div>
              </div>
            </div>

            {updateError && (
              <div className="mx-6 mt-6">
                <div className={`${isDark ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'} border rounded-xl p-4 transition-colors duration-300`}>
                  <div className="flex items-start space-x-3">
                    <div className={`w-5 h-5 ${isDark ? 'bg-red-800' : 'bg-red-100'} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-300`}>
                      <svg className={`w-3 h-3 ${isDark ? 'text-red-400' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${isDark ? 'text-red-300' : 'text-red-800'} mb-1 transition-colors duration-300`}>Update Error</h4>
                      <p className={`${isDark ? 'text-red-200' : 'text-red-700'} text-sm transition-colors duration-300`}>{updateError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6">
              <VehicleForm 
                vehicle={vehicle}
                onSubmit={handleSubmit}
                loading={loading}
                isUpdate={true}
              />
            </div>

            {vehicle && (
              <div className={`border-t ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50'} px-6 py-4 transition-colors duration-300`}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1 transition-colors duration-300`}>Category</div>
                    <div className={`font-semibold ${textColor} transition-colors duration-300`}>{vehicle.category}</div>
                  </div>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1 transition-colors duration-300`}>Price/Day</div>
                    <div className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-600'} transition-colors duration-300`}>${vehicle.pricePerDay}</div>
                  </div>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1 transition-colors duration-300`}>Status</div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.availability === 'Available' 
                        ? isDark 
                          ? 'bg-green-900/50 text-green-300 border border-green-700/30' 
                          : 'bg-green-100 text-green-800'
                        : isDark
                          ? 'bg-red-900/50 text-red-300 border border-red-700/30'
                          : 'bg-red-100 text-red-800'
                    } transition-colors duration-300`}>
                      {vehicle.availability}
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1 transition-colors duration-300`}>Location</div>
                    <div className={`font-semibold ${textColor} truncate transition-colors duration-300`}>{vehicle.location}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`${cardBg} rounded-xl p-6 border ${borderColor} transition-colors duration-300`}>
              <div className={`w-10 h-10 ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'} rounded-lg flex items-center justify-center mb-3 transition-colors duration-300`}>
                <svg className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`font-semibold ${textColor} mb-2 transition-colors duration-300`}>Update Tips</h3>
              <p className={`${textMuted} text-sm transition-colors duration-300`}>
                Keep your vehicle details accurate and up-to-date to attract more renters and avoid booking issues.
              </p>
            </div>

            <div className={`${cardBg} rounded-xl p-6 border ${borderColor} transition-colors duration-300`}>
              <div className={`w-10 h-10 ${isDark ? 'bg-green-900/50' : 'bg-green-100'} rounded-lg flex items-center justify-center mb-3 transition-colors duration-300`}>
                <svg className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`font-semibold ${textColor} mb-2 transition-colors duration-300`}>Best Practices</h3>
              <p className={`${textMuted} text-sm transition-colors duration-300`}>
                Use clear, high-quality images and provide detailed descriptions to increase your booking chances.
              </p>
            </div>

            <div className={`${cardBg} rounded-xl p-6 border ${borderColor} transition-colors duration-300`}>
              <div className={`w-10 h-10 ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-lg flex items-center justify-center mb-3 transition-colors duration-300`}>
                <svg className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className={`font-semibold ${textColor} mb-2 transition-colors duration-300`}>Manage Listings</h3>
              <p className={`${textMuted} text-sm transition-colors duration-300`}>
                Visit your vehicles dashboard to manage all your listings, view bookings, and track earnings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateVehicle;