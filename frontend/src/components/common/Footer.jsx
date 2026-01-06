import { FaFacebookF, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TE</span>
              </div>
              <h2 className="text-2xl font-bold text-white">TravelEase</h2>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Your trusted partner for vehicle rentals and trip management. Find the perfect ride for your journey with ease.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110">
                <FaFacebookF size={16} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-black text-gray-300 hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="bg-gray-800 hover:bg-pink-600 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110">
                <FaInstagram size={16} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-700 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110">
                <FaLinkedinIn size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/vehicles" className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Browse Vehicles
                </a>
              </li>
              <li>
                <a href="/add-vehicle" className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  List Your Vehicle
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Vehicle Types</h3>
            <ul className="space-y-3">
              <li>
                <a href="/vehicles?category=Sedan" className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Sedan Cars
                </a>
              </li>
              <li>
                <a href="/vehicles?category=SUV" className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  SUVs
                </a>
              </li>
              <li>
                <a href="/vehicles?category=Electric" className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Electric Vehicles
                </a>
              </li>
              <li>
                <a href="/vehicles?category=Van" className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Vans
                </a>
              </li>
              <li>
                <a href="/vehicles" className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  All Vehicles
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-green-400 mt-1 flex-shrink-0" size={16} />
                <span className="text-gray-400 text-sm leading-relaxed">123 Street, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-green-400 flex-shrink-0" size={16} />
                <span className="text-gray-400 text-sm">+880 1234-567890</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-green-400 flex-shrink-0" size={16} />
                <span className="text-gray-400 text-sm">support@travelease.com</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-white text-sm font-semibold mb-3">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 text-sm"
                />
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 whitespace-nowrap text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} TravelEase. All rights reserved.</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;