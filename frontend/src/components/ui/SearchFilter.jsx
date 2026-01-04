import { useState, useEffect } from 'react';

const SearchFilter = ({ onFilter, onSort, isDark, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    priceRange: '',
    availability: '',
    ...initialFilters
  });

  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      ...initialFilters
    }));
  }, [initialFilters]);

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    if (onSort) {
      onSort(value);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      location: '',
      priceRange: '',
      availability: ''
    };
    setFilters(clearedFilters);
    setSortBy('');
    
    if (onFilter) {
      onFilter(clearedFilters);
    }
    if (onSort) {
      onSort('');
    }
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || sortBy !== '';

  const containerClass = isDark
    ? 'bg-gray-800 border-gray-700 text-gray-200 shadow-lg'
    : 'bg-white border-gray-200 text-gray-800 shadow-md';
  
  const labelClass = isDark ? 'text-gray-300' : 'text-gray-700';
  
  const inputClass = isDark
    ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
    : 'bg-white text-gray-800 border-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className={`${containerClass} p-6 rounded-lg border transition-all duration-300`}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${inputClass}`}
          >
            <option value="">All Categories</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Luxury">Luxury</option>
            <option value="Sports">Sports</option>
            <option value="Van">Van</option>
            <option value="Motorcycle">Motorcycle</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
            Location
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            placeholder="Enter location..."
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${inputClass}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
            Price Range
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${inputClass}`}
          >
            <option value="">Any Price</option>
            <option value="0-25">$0 - $25</option>
            <option value="26-50">$26 - $50</option>
            <option value="51-100">$51 - $100</option>
            <option value="101-200">$101 - $200</option>
            <option value="201-500">$201 - $500</option>
            <option value="501+">$501+</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
            Availability
          </label>
          <select
            value={filters.availability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${inputClass}`}
          >
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${inputClass}`}
          >
            <option value="">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-600">
          <div className="flex flex-wrap gap-2 mb-3 sm:mb-0">
            {filters.category && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isDark 
                  ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50' 
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                Category: {filters.category}
              </span>
            )}
            {filters.location && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isDark 
                  ? 'bg-green-900/50 text-green-300 border border-green-700/50' 
                  : 'bg-green-100 text-green-800 border border-green-200'
              }`}>
                Location: {filters.location}
              </span>
            )}
            {filters.priceRange && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isDark 
                  ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50' 
                  : 'bg-purple-100 text-purple-800 border border-purple-200'
              }`}>
                Price: {filters.priceRange}
              </span>
            )}
            {filters.availability && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isDark 
                  ? 'bg-orange-900/50 text-orange-300 border border-orange-700/50' 
                  : 'bg-orange-100 text-orange-800 border border-orange-200'
              }`}>
                Status: {filters.availability}
              </span>
            )}
            {sortBy && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isDark 
                  ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50' 
                  : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
              }`}>
                Sort: {sortBy}
              </span>
            )}
          </div>

          <button
            onClick={clearFilters}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2 ${
              isDark
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Clear All</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;