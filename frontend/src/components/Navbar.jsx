import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Dummy user (for testing logged in/out UI)
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    photo: 'https://i.pravatar.cc/300'
  });

  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setIsProfileOpen(false);
  };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <nav className={`shadow-lg border-b sticky top-0 z-50 transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-black'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
              TE
            </div>
            <span className="text-green-600">TravelEase</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/">Home</Link>
            <Link to="/vehicles">Vehicles</Link>

            {user && (
              <>
                <Link to="/add-vehicle">Add Vehicle</Link>
                <Link to="/my-vehicles">My Vehicles</Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="px-3 py-1 border rounded-lg"
            >
              {isDark ? '🌙' : '☀️'}
            </button>

            {user ? (
              <div
                className="relative"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <img
                    src={user.photo}
                    className="w-8 h-8 rounded-full"
                    alt="user"
                  />
                  <span>{user.name}</span>
                </div>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-lg w-52 p-2">
                    <p className="px-3 py-2 text-sm">{user.email}</p>
                    <Link to="/profile" className="block px-3 py-2 hover:bg-gray-100">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link to="/" className="block">Home</Link>
            <Link to="/vehicles" className="block">Vehicles</Link>

            {user ? (
              <>
                <Link to="/add-vehicle" className="block">Add Vehicle</Link>
                <Link to="/my-vehicles" className="block">My Vehicles</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block">Login</Link>
                <Link to="/register" className="block">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;