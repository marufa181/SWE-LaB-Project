import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const VehicleForm = ({ vehicle, onSubmit, loading, isUpdate = false }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    vehicleName: '',
    owner: '',
    category: '',
    pricePerDay: '',
    location: '',
    availability: 'Available',
    description: '',
    coverImage: '',
    userEmail: ''
  });
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (vehicle && isUpdate) {
      setFormData({
        vehicleName: vehicle.vehicleName || '',
        owner: vehicle.owner || '',
        category: vehicle.category || '',
        pricePerDay: vehicle.pricePerDay || '',
        location: vehicle.location || '',
        availability: vehicle.availability || 'Available',
        description: vehicle.description || '',
        coverImage: vehicle.coverImage || '',
        userEmail: vehicle.userEmail || ''
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        userEmail: user.email,
        owner: user.displayName || user.email.split('@')[0]
      }));
    }
  }, [vehicle, user, isUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (name === 'coverImage') {
      setImageError(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicleName.trim()) newErrors.vehicleName = 'Vehicle name is required';
    if (!formData.owner.trim()) newErrors.owner = 'Owner name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.pricePerDay || formData.pricePerDay <= 0) newErrors.pricePerDay = 'Valid price is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.coverImage.trim()) newErrors.coverImage = 'Cover image URL is required';
    if (!formData.userEmail) newErrors.userEmail = 'Email is required';
    
    if (formData.coverImage.trim()) {
      try {
        new URL(formData.coverImage);
      } catch (e) {
        newErrors.coverImage = 'Please enter a valid URL';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const submitData = {
      vehicleName: formData.vehicleName.trim(),
      owner: formData.owner.trim(),
      category: formData.category,
      pricePerDay: Number(formData.pricePerDay),
      location: formData.location.trim(),
      availability: formData.availability,
      description: formData.description.trim(),
      coverImage: formData.coverImage.trim(),
      userEmail: formData.userEmail
    };
    
    console.log('Submitting vehicle data:', submitData); 
    onSubmit(submitData);
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 rounded-2xl shadow-xl border transition-colors duration-300 ${
      isDark
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-100'
    }`}>
      <h2 className={`text-3xl font-bold text-center mb-8 transition-colors duration-300 ${
        isDark ? 'text-white' : 'text-gray-800'
      }`}>
        {isUpdate ? 'Update Vehicle' : 'Add New Vehicle'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`p-6 rounded-xl transition-colors duration-300 ${
          isDark ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Vehicle Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Vehicle Name *
              </label>
              <input
                type="text"
                name="vehicleName"
                value={formData.vehicleName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                  errors.vehicleName 
                    ? 'border-red-500' 
                    : isDark
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                } border`}
                placeholder="e.g., Toyota Corolla 2023"
              />
              {errors.vehicleName && <p className="text-red-500 text-sm mt-2">{errors.vehicleName}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Owner Name *
              </label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                  errors.owner 
                    ? 'border-red-500' 
                    : isDark
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                } border`}
                placeholder="Owner's full name"
              />
              {errors.owner && <p className="text-red-500 text-sm mt-2">{errors.owner}</p>}
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl transition-colors duration-300 ${
          isDark ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Specifications
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                  errors.category 
                    ? 'border-red-500' 
                    : isDark
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 text-gray-900'
                } border`}
              >
                <option value="">Select Category</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Electric">Electric</option>
                <option value="Van">Van</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Price Per Day ($) *
              </label>
              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                  errors.pricePerDay 
                    ? 'border-red-500' 
                    : isDark
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                } border`}
                placeholder="e.g., 70"
                min="1"
                step="0.01"
              />
              {errors.pricePerDay && <p className="text-red-500 text-sm mt-2">{errors.pricePerDay}</p>}
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl transition-colors duration-300 ${
          isDark ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Pricing & Location
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Availability *
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 border ${
                  isDark
                    ? 'border-gray-600 bg-gray-700 text-white'
                    : 'border-gray-300 text-gray-900'
                }`}
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                  errors.location 
                    ? 'border-red-500' 
                    : isDark
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                } border`}
                placeholder="e.g., Dhaka, Bangladesh"
              />
              {errors.location && <p className="text-red-500 text-sm mt-2">{errors.location}</p>}
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl transition-colors duration-300 ${
          isDark ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Media & Description
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Cover Image URL *
              </label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                  errors.coverImage 
                    ? 'border-red-500' 
                    : isDark
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                } border`}
                placeholder="https://example.com/image.jpg"
              />
              {errors.coverImage && <p className="text-red-500 text-sm mt-2">{errors.coverImage}</p>}
              
              {formData.coverImage && !errors.coverImage && (
                <div className="mt-4">
                  <p className={`text-sm mb-2 transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Preview:
                  </p>
                  <div className="relative">
                    <img 
                      src={formData.coverImage} 
                      alt="Vehicle preview" 
                      className={`w-full max-w-md h-48 object-cover rounded-xl border-2 transition-colors duration-300 ${
                        isDark ? 'border-gray-600' : 'border-gray-300'
                      } ${imageError ? 'hidden' : 'block'}`}
                      onError={() => setImageError(true)}
                    />
                    {imageError && (
                      <div className={`w-full max-w-md h-48 rounded-xl border-2 flex items-center justify-center transition-colors duration-300 ${
                        isDark 
                          ? 'border-gray-600 bg-gray-700 text-gray-400' 
                          : 'border-gray-300 bg-gray-100 text-gray-500'
                      }`}>
                        <span>Image failed to load</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                  errors.description 
                    ? 'border-red-500' 
                    : isDark
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                } border`}
                placeholder="Describe the vehicle features, condition, amenities, special notes..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl transition-colors duration-300 ${
          isDark ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Owner Information
          </h3>
          
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Your Email *
            </label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-300 border ${
                isDark
                  ? 'border-gray-600 bg-gray-700 text-gray-400'
                  : 'border-gray-300 bg-gray-100 text-gray-600'
              }`}
              readOnly
            />
            <p className={`text-xs mt-2 transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              This email cannot be changed and will be used to identify your vehicles
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none font-semibold text-lg shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{isUpdate ? 'Updating Vehicle...' : 'Adding Vehicle...'}</span>
            </div>
          ) : (
            isUpdate ? 'Update Vehicle' : 'Add Vehicle to Fleet'
          )}
        </button>
      </form>
    </div>
  );
};

export default VehicleForm;