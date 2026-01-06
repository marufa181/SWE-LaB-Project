import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVehicles } from '../hooks/useVehicles';
import VehicleForm from '../../components/forms/VehicleForm';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTheme } from '../../context/ThemeContext'; 

const AddVehicle = () => {
  const { user } = useAuth();
  const { createVehicle, loading, error, clearError } = useVehicles();
  const navigate = useNavigate();
  const { isDark } = useTheme(); 

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (vehicleData) => {
    try {
      console.log('Adding vehicle with data:', vehicleData);
      await createVehicle(vehicleData);
      toast.success('Vehicle added successfully!');
      navigate('/my-vehicles');
    } catch (error) {
      console.error("Add Vehicle Error:", error);
      toast.error(error.message || 'Failed to add vehicle. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/my-vehicles');
  };

  const bgClass = isDark
    ? 'min-h-screen bg-gradient-to-br from-gray-900 to-gray-800'
    : 'min-h-screen bg-gradient-to-br from-gray-50 to-blue-50';
    
  const cardClass = isDark
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-100';

  const textClass = isDark ? 'text-white' : 'text-gray-800';
  const subTextClass = isDark ? 'text-gray-400' : 'text-gray-600';

  if (!user) {
    return (
      <div className={`${bgClass} flex items-center justify-center transition-colors duration-300`}>
        <div className={`text-center rounded-2xl shadow-xl p-8 max-w-md mx-4 border transition-colors duration-300 ${cardClass}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isDark ? 'bg-red-900/30' : 'bg-red-100'
          }`}>
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className={`text-xl font-bold mb-2 ${textClass}`}>Authentication Required</h3>
          <p className={`mb-6 ${subTextClass}`}>Please login to add a vehicle to our platform.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`${bgClass} flex items-center justify-center transition-colors duration-300`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`${bgClass} py-8 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`shadow-xl overflow-hidden border transition-colors duration-300 ${cardClass}`}>
            <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl">List Your Vehicle</h2>
                    <p className="text-green-100 text-sm">Share your vehicle with our community and start earning</p>
                  </div>
                </div>
                
                <button
                  onClick={handleCancel}
                  className="bg-white/20 text-white px-5 py-2.5 rounded-xl hover:bg-white/30 transition-all duration-200 font-medium border border-white/30 backdrop-blur-sm flex items-center space-x-2 self-start text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <VehicleForm 
                onSubmit={handleSubmit}
                loading={loading}
              />
            </div>

            <div className={`border-t bg-gray-50 px-6 py-5 transition-colors duration-300 ${
              isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-100 bg-gray-50'
            }`}>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className={`font-semibold mb-2 ${textClass}`}>Listing Tips</h4>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${subTextClass}`}>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Use high-quality, clear photos of your vehicle</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Be honest about the vehicle's condition and features</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Set a competitive price based on similar vehicles</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Provide detailed description and clear pickup instructions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`rounded-xl p-6 border transition-colors duration-300 ${
              isDark ? 'bg-blue-900/30 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
            }`}>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className={`font-bold mb-2 ${textClass}`}>Earn Money</h3>
              <p className={`text-sm ${subTextClass}`}>
                Turn your idle vehicle into a source of income. Set your own prices and availability.
              </p>
            </div>

            <div className={`rounded-xl p-6 border transition-colors duration-300 ${
              isDark ? 'bg-green-900/30 border-green-800' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
            }`}>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className={`font-bold mb-2 ${textClass}`}>Fully Insured</h3>
              <p className={`text-sm ${subTextClass}`}>
                Your vehicle is protected with comprehensive insurance coverage during every rental period.
              </p>
            </div>

            <div className={`rounded-xl p-6 border transition-colors duration-300 ${
              isDark ? 'bg-purple-900/30 border-purple-800' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
            }`}>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className={`font-bold mb-2 ${textClass}`}>Trusted Community</h3>
              <p className={`text-sm ${subTextClass}`}>
                Join thousands of vehicle owners who trust our platform to connect with verified renters.
              </p>
            </div>
          </div>

          <div className={`mt-8 p-6 text-center border transition-colors duration-300 ${cardClass}`}>
            <h3 className={`font-semibold mb-2 ${textClass}`}>Need Help Listing Your Vehicle?</h3>
            <p className={`text-sm mb-4 ${subTextClass}`}>
              Our support team is here to help you create the perfect listing.
            </p>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium text-sm flex items-center justify-center space-x-1 mx-auto transition-colors duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;