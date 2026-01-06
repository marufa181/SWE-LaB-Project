import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaTag, FaDollarSign, FaStar, FaGasPump, FaUsers } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const VehicleCard = ({ vehicle }) => {
  const { isDark } = useTheme();
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
    rating
  } = vehicle;

  const isAvailable = availability === 'Available';

  return (
    <Link
      to={`/vehicle/${_id}`}
      aria-label={`View details for ${vehicleName}`}
      className={`group relative block rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border 
        ${isDark 
          ? 'bg-gray-900 border-gray-700 hover:border-green-400/30 hover:shadow-[0_0_30px_rgba(74,222,128,0.2)]' 
          : 'bg-white border-gray-100 hover:border-green-500/20 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]'
        }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={coverImage || '/default-vehicle.jpg'}
          alt={vehicleName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => (e.target.src = '/default-vehicle.jpg')}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border
          ${isAvailable
            ? 'bg-green-600/90 text-white border-green-400/30'
            : 'bg-red-600/90 text-white border-red-400/30'
          }`}>
          {isAvailable ? 'Available' : 'Booked'}
        </div>

        {rating && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 border border-white/10">
            <FaStar className="text-yellow-400" size={10} />
            <span>{rating}</span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-xl border border-white/10">
          <div className="flex items-center space-x-1">
            <FaDollarSign className="text-green-400" size={12} />
            <span className="font-bold text-lg">{pricePerDay}</span>
            <span className="text-green-300 text-xs">/ day</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-xl font-bold line-clamp-1 flex-1 mr-2 transition-colors duration-200
            ${isDark 
              ? 'text-white group-hover:text-green-400' 
              : 'text-gray-900 group-hover:text-green-600'
            }`}>
            {vehicleName}
          </h3>
          <span className={`px-2 py-1 rounded-lg text-xs font-medium border whitespace-nowrap flex-shrink-0
            ${isDark 
              ? 'bg-blue-900/40 text-blue-300 border-blue-800' 
              : 'bg-blue-100 text-blue-600 border-blue-200'
            }`}>
            {category}
          </span>
        </div>

        <div className={`flex items-center mb-4 text-sm 
          ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <FaMapMarkerAlt className="text-blue-500 mr-2 flex-shrink-0" size={14} />
          <span className="truncate" title={location}>{location}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          {fuelType && (
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} flex items-center`}>
              <FaGasPump className="text-orange-400 mr-2 flex-shrink-0" size={14} />
              <span>{fuelType}</span>
            </div>
          )}
          {seats && (
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} flex items-center`}>
              <FaUsers className="text-purple-400 mr-2 flex-shrink-0" size={14} />
              <span>{seats} seats</span>
            </div>
          )}
          <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} flex items-center`}>
            <FaTag className="text-green-400 mr-2 flex-shrink-0" size={14} />
            <span>{category}</span>
          </div>
          {!rating && (
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} flex items-center`}>
              <FaStar className="text-yellow-400 mr-2 flex-shrink-0" size={14} />
              <span>No rating</span>
            </div>
          )}
        </div>

        <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium px-3 py-1 rounded-full border
              ${isAvailable
                ? isDark
                  ? 'bg-green-900/40 text-green-400 border-green-700/50'
                  : 'bg-green-100 text-green-700 border-green-200'
                : isDark
                  ? 'bg-red-900/40 text-red-400 border-red-700/50'
                  : 'bg-red-100 text-red-700 border-red-200'
              }`}>
              {isAvailable ? 'Ready to Book' : 'Currently Booked'}
            </span>

            <div className={`text-sm font-semibold flex items-center space-x-1 transition-transform duration-200 group-hover:translate-x-1
              ${isDark 
                ? 'text-blue-400 group-hover:text-green-400' 
                : 'text-blue-600 group-hover:text-green-600'
              }`}>
              <span>View Details</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;
