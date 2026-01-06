import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSpring, animated, config } from '@react-spring/web';
import { formatDistanceToNow, isToday, isThisWeek } from 'date-fns';
import { useVehicles } from '../pages/hooks/useVehicles';
import VehicleCard from '../components/common/VehicleCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useTheme } from '../context/ThemeContext';

const HERO_IMAGE_URL = 'https://images.unsplash.com/photo-1725916631378-358ebe6ad000?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyJTIwZHJhd2luZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600';

const AnimatedCounter = ({ value }) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: value },
    delay: 500,
    config: config.molasses,
  });

  return <animated.span>{number.to(n => n.toFixed(0))}</animated.span>;
};

const DateBadge = ({ createdAt }) => {
  const getDateStatus = (dateString) => {
    if (!dateString) return { text: 'NEW', color: 'bg-green-500' };

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return { text: 'TODAY', color: 'bg-red-500' };
      } else if (diffDays <= 7) {
        return { text: 'THIS WEEK', color: 'bg-orange-500' };
      } else if (diffDays <= 30) {
        return { text: 'RECENT', color: 'bg-blue-500' };
      } else {
        return { 
          text: `${diffDays} DAYS AGO`, 
          color: 'bg-gray-500' 
        };
      }
    } catch (error) {
      console.error('Date processing error:', error);
      return { text: 'NEW', color: 'bg-green-500' };
    }
  };

  const badgeConfig = getDateStatus(createdAt);

  return (
    <div className={`absolute top-4 right-4 z-10 ${badgeConfig.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
      {badgeConfig.text}
    </div>
  );
};

const Home = () => {
  const { getLatestVehicles, loading } = useVehicles();
  const { isDark } = useTheme();
  const [latestVehicles, setLatestVehicles] = useState([]);

  useEffect(() => {
    const fetchLatestVehicles = async () => {
      try {
        console.log('🔄 Fetching latest vehicles...');
        const vehicles = await getLatestVehicles();
        console.log('🚗 Raw vehicles response:', vehicles);
        
        const latestSix = Array.isArray(vehicles) ? vehicles.slice(0, 6) : [];
        console.log('✅ Final 6 vehicles:', latestSix);
        setLatestVehicles(latestSix);
      } catch (error) {
        console.error('❌ Error fetching vehicles:', error);
        setLatestVehicles([]);
      }
    };
    
    fetchLatestVehicles();
  }, [getLatestVehicles]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${HERO_IMAGE_URL}')` }}
        >
          <div className={`absolute inset-0 backdrop-blur-[1px] ${
            isDark 
              ? 'bg-gradient-to-r from-gray-900/90 to-gray-800/80' 
              : 'bg-gradient-to-r from-green-900/90 to-green-800/80'
          }`}></div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
            isDark ? 'bg-green-500/5' : 'bg-green-500/10'
          }`}></div>
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
            isDark ? 'bg-green-400/5' : 'bg-green-400/10'
          }`}></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        >
          <div className="mb-8">
            <div className={`inline-flex items-center space-x-3 backdrop-blur-md rounded-full px-6 py-3 border mb-8 ${
              isDark
                ? 'bg-white/5 border-white/10 text-white/80'
                : 'bg-white/10 border-white/20 text-white/90'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isDark ? 'bg-green-400' : 'bg-green-400'
              }`}></div>
              <span className="text-sm font-medium">Trusted by 1000+ customers worldwide</span>
            </div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
          >
            Travel With
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className={`block bg-gradient-to-r bg-clip-text text-transparent ${
                isDark
                  ? 'from-green-300 to-green-200'
                  : 'from-green-200 to-green-300'
              }`}
            >
              Ease
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Premium vehicle rentals with seamless booking. Experience the freedom of the road with our curated fleet.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/vehicles"
                className={`group px-8 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 inline-flex items-center space-x-3 shadow-lg ${
                  isDark
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-white text-green-900'
                }`}
              >
                <span>All Vehicles</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/add-vehicle"
                className={`group border-2 px-8 py-4 rounded-2xl font-bold backdrop-blur-sm transition-all duration-300 inline-flex items-center space-x-3 ${
                  isDark
                    ? 'border-white/20 text-white hover:bg-white/5'
                    : 'border-white/30 text-white hover:bg-white/10'
                }`}
              >
                <span>List Your Vehicle</span>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className={`w-6 h-10 border-2 rounded-full flex justify-center ${
            isDark ? 'border-white/20' : 'border-white/30'
          }`}>
            <div className={`w-1 h-3 rounded-full mt-2 ${
              isDark ? 'bg-white/40' : 'bg-white/50'
            }`}></div>
          </div>
        </motion.div>
      </section>

      <section className={`relative py-28 overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-gray-800/30 to-gray-900/20'
          : 'bg-gradient-to-br from-gray-50 via-green-50/30 to-green-50/20'
      }`}>
        <div className={`absolute top-10 left-16 w-32 h-32 rounded-full blur-3xl ${
          isDark ? 'bg-green-300/5' : 'bg-green-300/10'
        }`}></div>
        <div className={`absolute bottom-20 right-16 w-40 h-40 rounded-full blur-2xl ${
          isDark ? 'bg-green-400/5' : 'bg-green-400/10'
        }`}></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 rounded-full shadow-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/80 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span className="text-white font-semibold text-sm uppercase tracking-widest">
                Latest Vehicles
              </span>
            </div>

            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Recently Added <span className="text-green-600">Rides</span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover our newest additions to the fleet. Fresh vehicles added regularly for your convenience.
            </p>

            <div className="w-28 h-1.5 bg-gradient-to-r from-green-500 to-green-600 mx-auto mb-8 rounded-full"></div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <LoadingSpinner />
              <span className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading latest vehicles...
              </span>
            </div>
          ) : latestVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {latestVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                  className={`group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <DateBadge createdAt={vehicle.createdAt} />
                  <VehicleCard vehicle={vehicle} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-24 backdrop-blur-md rounded-3xl shadow-lg border ${
              isDark
                ? 'bg-gray-800/80 border-gray-700/50'
                : 'bg-white/80 border-gray-200/50'
            }`}>
              <div className={`relative w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 ${
                isDark
                  ? 'bg-gradient-to-br from-green-900/20 to-green-800/20'
                  : 'bg-gradient-to-br from-green-100 to-green-100'
              }`}>
                <svg className={`w-16 h-16 ${
                  isDark ? 'text-green-400' : 'text-green-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                No vehicles available yet
              </h3>
              <p className={`max-w-md mx-auto ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Be the first to list your vehicle and start earning!
              </p>
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/vehicles"
                className="group inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-10 py-5 rounded-2xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <span>View All Vehicles</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className={`py-20 transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Top <span className="text-green-600">Categories</span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Choose from our carefully curated vehicle categories for every travel need
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                name: 'SUV', 
                desc: 'Spacious and comfortable for family trips and adventures', 
                icon: '🚗',
                count: '50+ Vehicles',
                color: 'from-blue-500 to-blue-600'
              },
              { 
                name: 'Electric', 
                desc: 'Eco-friendly and cost-effective for city driving', 
                icon: '⚡',
                count: '30+ Vehicles',
                color: 'from-green-500 to-green-600'
              },
              { 
                name: 'Vans', 
                desc: 'Ideal for group travel, cargo, and large families', 
                icon: '👥',
                count: '25+ Vehicles',
                color: 'from-orange-500 to-orange-600'
              },
              { 
                name: 'Sedans', 
                desc: 'Perfect for business trips and city commuting', 
                icon: '🎯',
                count: '45+ Vehicles',
                color: 'from-purple-500 to-purple-600'
              }
            ].map((category, index) => (
              <motion.div 
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`group text-center p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                  isDark
                    ? 'border-gray-700 hover:border-green-600 bg-gradient-to-b from-gray-800 to-gray-900'
                    : 'border-gray-100 hover:border-green-200 bg-gradient-to-b from-white to-gray-50'
                }`}
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <h3 className={`font-bold text-2xl mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {category.name}
                </h3>
                <p className={`mb-4 leading-relaxed ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {category.desc}
                </p>
                <div className="text-green-600 font-semibold">{category.count}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-20 transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-green-50 to-green-100'
      }`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">About Us</span>
                <h2 className={`text-4xl font-bold mt-2 mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  About TravelEase
                </h2>
                <p className={`text-lg mb-6 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  TravelEase is your premier vehicle booking platform that connects vehicle owners with travelers. 
                  We make renting vehicles simple, secure, and convenient.
                </p>
                <p className={`text-lg mb-8 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Whether you're planning a family vacation, business trip, or weekend getaway, 
                  find the perfect vehicle that suits your needs and budget.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    <AnimatedCounter value={500} />+
                  </div>
                  <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Vehicles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    <AnimatedCounter value={100} />+
                  </div>
                  <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Locations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    <AnimatedCounter value={1000} />+
                  </div>
                  <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                  <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Support</div>
                </div>
              </div>

              <Link 
                to="/about"
                className="inline-flex items-center space-x-2 text-green-600 font-semibold hover:text-green-700 transition-colors"
              >
                <span>Learn more about us</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  title: 'Easy Booking',
                  desc: 'Book your preferred vehicle in just a few clicks',
                  icon: '📅'
                },
                {
                  title: 'Verified Owners',
                  desc: 'All vehicle owners are thoroughly verified for your safety',
                  icon: '✅'
                },
                {
                  title: 'Best Prices',
                  desc: 'Competitive pricing with no hidden charges',
                  icon: '💰'
                },
                {
                  title: '24/7 Support',
                  desc: 'Round-the-clock customer support for all your needs',
                  icon: '📞'
                }
              ].map((feature, index) => (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-start space-x-4 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-green-900/30' : 'bg-green-100'
                  }`}>
                    <span className="text-xl">{feature.icon}</span>
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-green-100 text-xl mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust TravelEase for their transportation needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/vehicles"
              className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Browse All Vehicles
            </Link>
            <Link 
              to="/register"
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;