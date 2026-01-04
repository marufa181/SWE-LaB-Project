import { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaMapMarkerAlt, FaGasPump, FaUsers, FaStar, FaTag, FaDollarSign } from 'react-icons/fa';

const VehicleModal = ({ vehicle, isOpen, onClose }) => {
  const { isDark } = useTheme();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; 
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !vehicle) return null;

  const {
    _id,
    vehicleName,
    coverImage,
    pricePerDay,
    category,
    location,
    fuelType,
    seats,
    availability,
    rating,
    description,
    owner,
    userEmail
  } = vehicle;

  const isAvailable = availability === 'Available';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-colors duration-300">
      <div 
        className={`absolute inset-0 transition-colors duration-300 ${
          isDark ? 'bg-black/70' : 'bg-black/60'
        }`}
        onClick={onClose}
      ></div>
      
      <div className={`relative rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${
            isDark 
              ? 'bg-gray-700/80 hover:bg-gray-600' 
              : 'bg-white/80 hover:bg-white'
          }`}
        >
          <svg className={`w-6 h-6 transition-colors duration-300 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="relative h-80 lg:h-full min-h-[400px] lg:min-h-[500px]">
            <img
              src={coverImage || '/default-vehicle.jpg'}
              alt={vehicleName}
              className="w-full h-full object-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
              onError={(e) => {
                e.target.src = '/default-vehicle.jpg';
              }}
            />
            
            <div className={`absolute top-4 left-4 px-3 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border ${
              isAvailable 
                ? 'bg-green-500/90 border-green-400/30 text-white' 
                : 'bg-red-500/90 border-red-400/30 text-white'
            }`}>
              {isAvailable ? 'Available' : 'Booked'}
            </div>

            {rating && (
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                <FaStar className="text-yellow-400" size={14} />
                <span>{rating}</span>
              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-3 rounded-xl">
              <div className="flex items-center space-x-1">
                <FaDollarSign className="text-green-400" size={16} />
                <span className="text-2xl font-bold">{pricePerDay}</span>
                <span className="text-green-300 text-sm">/ day</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  isDark 
                    ? 'bg-blue-900/50 text-blue-300' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {category}
                </span>
                {fuelType && (
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    isDark 
                      ? 'bg-orange-900/50 text-orange-300' 
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {fuelType}
                  </span>
                )}
              </div>
              
              <h2 className={`text-3xl font-bold mb-3 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {vehicleName}
              </h2>
              
              <div className="flex items-center space-x-2 mb-4">
                <FaMapMarkerAlt className={`flex-shrink-0 ${
                  isDark ? 'text-blue-400' : 'text-blue-500'
                }`} size={16} />
                <span className={`transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {location}
                </span>
              </div>
            </div>

            <div className={`mb-6 p-6 rounded-xl transition-colors duration-300 ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Vehicle Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <FaTag className={`flex-shrink-0 ${
                    isDark ? 'text-green-400' : 'text-green-500'
                  }`} size={16} />
                  <div>
                    <div className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>Category</div>
                    <div className={`font-semibold transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{category}</div>
                  </div>
                </div>
                
                {fuelType && (
                  <div className="flex items-center space-x-3">
                    <FaGasPump className={`flex-shrink-0 ${
                      isDark ? 'text-orange-400' : 'text-orange-500'
                    }`} size={16} />
                    <div>
                      <div className={`text-sm transition-colors duration-300 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>Fuel Type</div>
                      <div className={`font-semibold transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{fuelType}</div>
                    </div>
                  </div>
                )}
                
                {seats && (
                  <div className="flex items-center space-x-3">
                    <FaUsers className={`flex-shrink-0 ${
                      isDark ? 'text-purple-400' : 'text-purple-500'
                    }`} size={16} />
                    <div>
                      <div className={`text-sm transition-colors duration-300 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>Seats</div>
                      <div className={`font-semibold transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{seats} people</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <FaDollarSign className={`flex-shrink-0 ${
                    isDark ? 'text-green-400' : 'text-green-500'
                  }`} size={16} />
                  <div>
                    <div className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>Price</div>
                    <div className={`font-semibold transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>${pricePerDay}/day</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Description
              </h3>
              <p className={`leading-relaxed transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {description || `Experience the perfect blend of performance and comfort with this ${category}. This vehicle offers exceptional driving dynamics and premium features that make every journey memorable.`}
              </p>
            </div>

            {owner && (
              <div className={`mb-6 p-4 rounded-xl transition-colors duration-300 ${
                isDark ? 'bg-gray-700/30' : 'bg-green-50'
              }`}>
                <h3 className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Listed by
                </h3>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    isDark ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'
                  }`}>
                    {owner.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={`font-semibold transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{owner}</div>
                    <div className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>Vehicle Owner</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button 
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl ${
                  isAvailable
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
                disabled={!isAvailable}
              >
                {isAvailable ? 'Book This Vehicle' : 'Currently Booked'}
              </button>
              
              <button className={`flex items-center justify-center w-14 h-14 rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg ${
                isDark
                  ? 'border-gray-600 hover:border-green-500 text-gray-400 hover:text-green-400'
                  : 'border-gray-300 hover:border-green-500 text-gray-600 hover:text-green-600'
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleModal;