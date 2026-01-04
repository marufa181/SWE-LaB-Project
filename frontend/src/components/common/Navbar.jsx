import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={`shadow-lg border-b sticky top-0 z-50 backdrop-blur-sm transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900/95 border-gray-700' 
        : 'bg-white/95 border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TE</span>
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent ${
              isDark ? 'from-green-400 to-green-300' : ''
            }`}>
              TravelEase
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-4 py-2 transition-all duration-200 rounded-lg font-medium ${
                isDark
                  ? 'text-gray-300 hover:text-green-400 hover:bg-gray-800'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/vehicles" 
              className={`px-4 py-2 transition-all duration-200 rounded-lg font-medium ${
                isDark
                  ? 'text-gray-300 hover:text-green-400 hover:bg-gray-800'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              All Vehicles
            </Link>
            {user && (
              <>
                <Link 
                  to="/add-vehicle" 
                  className={`px-4 py-2 transition-all duration-200 rounded-lg font-medium ${
                    isDark
                      ? 'text-gray-300 hover:text-green-400 hover:bg-gray-800'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  Add Vehicle
                </Link>
                <Link 
                  to="/my-vehicles" 
                  className={`px-4 py-2 transition-all duration-200 rounded-lg font-medium ${
                    isDark
                      ? 'text-gray-300 hover:text-green-400 hover:bg-gray-800'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  My Vehicles
                </Link>
                <Link 
                  to="/my-bookings" 
                  className={`px-4 py-2 transition-all duration-200 rounded-lg font-medium ${
                    isDark
                      ? 'text-gray-300 hover:text-green-400 hover:bg-gray-800'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  My Bookings
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            
            {user ? (
              <div className="relative">
                <div 
                  className={`flex items-center space-x-3 p-2 transition-all duration-200 rounded-lg border cursor-pointer ${
                    isDark
                      ? 'hover:bg-gray-800 border-transparent hover:border-gray-700'
                      : 'hover:bg-gray-50 border-transparent hover:border-gray-200'
                  }`}
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <img 
                      src={user.photoURL || '/default-avatar.png'} 
                      alt={user.displayName || 'User'} 
                      className="w-8 h-8 rounded-full ring-2 ring-green-100"
                    />
                    <div className="text-left">
                      <p className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {user.displayName || 'User'}
                      </p>
                      <p className={`text-xs truncate max-w-[120px] ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isProfileOpen ? 'rotate-180' : ''
                    } ${isDark ? 'text-gray-400' : 'text-gray-400'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {isProfileOpen && (
                  <div 
                    className={`absolute right-0 mt-2 w-64 rounded-xl shadow-lg border py-2 z-50 transition-colors duration-300 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    }`}
                    onMouseEnter={() => setIsProfileOpen(true)}
                    onMouseLeave={() => setIsProfileOpen(false)}
                  >
                    <div className={`px-4 py-3 border-b ${
                      isDark ? 'border-gray-700' : 'border-gray-100'
                    }`}>
                      <p className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {user.displayName || 'User'}
                      </p>
                      <p className={`text-sm truncate ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {user.email}
                      </p>
                    </div>
                    <div className="py-2">
                      <Link 
                        to="/my-vehicles" 
                        className={`flex items-center px-4 py-2 text-sm transition-colors ${
                          isDark
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-green-400'
                            : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                        }`}
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        My Vehicles
                      </Link>
                      <Link 
                        to="/my-bookings" 
                        className={`flex items-center px-4 py-2 text-sm transition-colors ${
                          isDark
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-green-400'
                            : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                        }`}
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Bookings
                      </Link>
                    </div>
                    <div className={`border-t pt-2 ${
                      isDark ? 'border-gray-700' : 'border-gray-100'
                    }`}>
                      <button 
                        onClick={handleLogout}
                        className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                          isDark
                            ? 'text-red-400 hover:bg-red-900/30'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className={`px-6 py-2 font-medium rounded-lg transition-all duration-200 border ${
                    isDark
                      ? 'text-gray-300 hover:bg-gray-800 border-gray-600 hover:border-gray-500'
                      : 'text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            
            <button 
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute left-0 top-1 w-6 h-0.5 transition-all duration-200 ${
                  isMenuOpen ? 'rotate-45 top-3' : ''
                } ${isDark ? 'bg-gray-300' : 'bg-gray-700'}`}></span>
                <span className={`absolute left-0 top-3 w-6 h-0.5 transition-all duration-200 ${
                  isMenuOpen ? 'opacity-0' : ''
                } ${isDark ? 'bg-gray-300' : 'bg-gray-700'}`}></span>
                <span className={`absolute left-0 top-5 w-6 h-0.5 transition-all duration-200 ${
                  isMenuOpen ? '-rotate-45 top-3' : ''
                } ${isDark ? 'bg-gray-300' : 'bg-gray-700'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={`md:hidden border-t backdrop-blur-sm transition-colors duration-300 ${
            isDark 
              ? 'border-gray-700 bg-gray-900/95' 
              : 'border-gray-200 bg-white/95'
          }`}>
            <div className="py-4 space-y-1">
              <Link 
                to="/" 
                className={`block px-4 py-3 rounded-lg transition-colors font-medium ${
                  isDark
                    ? 'text-gray-300 hover:text-green-400 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/vehicles" 
                className={`block px-4 py-3 rounded-lg transition-colors font-medium ${
                  isDark
                    ? 'text-gray-300 hover:text-green-400 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                All Vehicles
              </Link>
              {user && (
                <>
                  <Link 
                    to="/add-vehicle" 
                    className={`block px-4 py-3 rounded-lg transition-colors font-medium ${
                      isDark
                        ? 'text-gray-300 hover:text-green-400 hover:bg-gray-800'
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Add Vehicle
                  </Link>
                  <Link 
                    to="/my-vehicles" 
                    className={`block px-4 py-3 rounded-lg transition-colors font-medium ${
                      isDark
                        ? 'text-gray-300 hover:text-green-400 hover:bg-gray-800'
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Vehicles
                  </Link>
                  <Link 
                    to="/my-bookings" 
                    className={`block px-4 py-3 rounded-lg transition-colors font-medium ${
                      isDark
                        ? 'text-gray-300 hover:text-green-400 hover:bg-gray-800'
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                </>
              )}
            </div>

            <div className={`border-t pt-4 pb-2 ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {user ? (
                <div className="px-4 space-y-3">
                  <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                    isDark ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <img 
                      src={user.photoURL || '/default-avatar.png'} 
                      alt={user.displayName || 'User'} 
                      className="w-10 h-10 rounded-full ring-2 ring-green-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {user.displayName || 'User'}
                      </p>
                      <p className={`text-xs truncate ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-colors font-medium ${
                      isDark
                        ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="px-4 space-y-2">
                  <Link 
                    to="/login" 
                    className={`block w-full text-center px-4 py-3 rounded-lg transition-colors font-medium ${
                      isDark
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;