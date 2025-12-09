import { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Dummy vehicle data
  const [vehicles] = useState([
    {
      id: 1,
      name: 'Toyota Corolla',
      price: '$50 / day',
      image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=600&q=60',
    },
    {
      id: 2,
      name: 'Honda Civic',
      price: '$55 / day',
      image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=600&q=60',
    },
    {
      id: 3,
      name: 'Tesla Model 3',
      price: '$80 / day',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=60',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hero Section */}
      <section className="bg-green-600 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">TravelEase</h1>
        <p className="text-xl mb-6">
          Premium vehicle rentals made simple and fast
        </p>
        <Link
          to="/vehicles"
          className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition"
        >
          View All Vehicles
        </Link>
      </section>

      {/* Latest Vehicles Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Latest Vehicles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-52 object-cover"
              />

              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">
                  {vehicle.name}
                </h3>
                <p className="text-green-600 font-semibold mb-4">
                  {vehicle.price}
                </p>

                <Link
                  to="/vehicles"
                  className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Top Categories</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {['SUV', 'Electric', 'Vans', 'Sedan'].map((cat) => (
              <div
                key={cat}
                className="bg-gray-100 p-8 rounded-xl hover:shadow-md transition"
              >
                <div className="text-4xl mb-4">🚗</div>
                <h3 className="text-xl font-bold">{cat}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">About TravelEase</h2>
          <p className="text-gray-600 text-lg">
            TravelEase is a simple vehicle rental platform that helps you
            find the perfect ride for every journey. Easy booking, verified
            owners, and trusted service.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-16 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="mb-8 text-lg">
          Choose your vehicle and enjoy a smooth travel experience.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/vehicles"
            className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold"
          >
            Browse Vehicles
          </Link>
          <Link
            to="/register"
            className="border-2 border-white px-6 py-3 rounded-xl font-bold"
          >
            Create Account
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;