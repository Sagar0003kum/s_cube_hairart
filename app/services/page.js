"use client";

import { useCart } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function ServicesPage() {
  const { addToCart } = useCart();

  const services = [
    {
      id: 1,
      name: "Machine Hair Cut",
      description: "Precision cut using clippers for a clean, even look. Perfect for fades, buzz cuts, and short styles.",
      price: 20,
      duration: "30 mins",
      image: "/services/machine-cut.jpg",
      popular: true
    },
    {
      id: 2,
      name: "Scissor Hair Cut",
      description: "Hand-cut with shears for textured, layered styles. Ideal for medium to long hair with more styling options.",
      price: 30,
      duration: "45 mins",
      image: "/services/scissor-cut.jpg",
      popular: true
    },
    {
      id: 3,
      name: "Beard Trim",
      description: "Shape and trim your beard for a neat, well-groomed appearance. Includes detailing and clean lines.",
      price: 10,
      duration: "20 mins",
      image: "/services/beard-trim.jpg",
      popular: false
    },
    {
      id: 4,
      name: "Razor Cut Beard",
      description: "Precision shave with a straight razor for sharp lines and a smooth finish. Includes hot towel treatment.",
      price: 15,
      duration: "25 mins",
      image: "/services/razor-beard.jpg",
      popular: false
    },
    {
      id: 5,
      name: "Hair Wash & Style",
      description: "Full wash, conditioning, and professional styling. Includes product application and finishing touches.",
      price: 25,
      duration: "40 mins",
      image: "/services/hair-wash.jpg",
      popular: true
    },
    {
      id: 6,
      name: "Kids Haircut",
      description: "Fun, quick cuts for children. Our barbers are patient and experienced with kids of all ages.",
      price: 18,
      duration: "30 mins",
      image: "/services/kids-cut.jpg",
      popular: false
    },
    {
      id: 7,
      name: "Hair Coloring",
      description: "Professional hair coloring services. Consultation included to find your perfect shade.",
      price: 45,
      duration: "90 mins",
      image: "/services/coloring.jpg",
      popular: false
    },
    {
      id: 8,
      name: "Head Massage",
      description: "Relaxing scalp and neck massage to improve circulation and promote hair health.",
      price: 15,
      duration: "15 mins",
      image: "/services/massage.jpg",
      popular: false
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Professional haircut and grooming services tailored to your style. 
            From classic cuts to modern trends, we&apos;ve got you covered.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="border border-gray-800 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-purple-400">8+</p>
            <p className="text-gray-400 mt-2">Services</p>
          </div>
          <div className="border border-gray-800 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-purple-400">30min</p>
            <p className="text-gray-400 mt-2">Avg. Duration</p>
          </div>
          <div className="border border-gray-800 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-purple-400">$15+</p>
            <p className="text-gray-400 mt-2">Starting Price</p>
          </div>
          <div className="border border-gray-800 rounded-lg p-6 text-center">
            <Link 
              href="/book" 
              className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="border border-gray-800 rounded-xl overflow-hidden hover:border-purple-600 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="h-48 bg-gray-900 relative overflow-hidden">
                <div className="w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-4xl">✂️</div>
                </div>
                {service.popular && (
                  <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Popular
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-xl">{service.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">{service.duration}</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-400">${service.price}</p>
                </div>

                <p className="text-gray-300 mb-6 line-clamp-2">
                  {service.description}
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => addToCart({
                      name: service.name,
                      price: service.price,
                      id: service.id
                    })}
                    className="flex-1 border border-gray-700 hover:bg-gray-900 py-3 rounded-lg font-medium"
                  >
                    Add to Cart
                  </button>
                  <Link
                    href="/book"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-medium text-center"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Booking CTA */}
        <div className="mt-16 p-8 border border-gray-800 rounded-2xl bg-linear-to-r from-gray-900 to-black">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready for Your Transformation?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Book an appointment with our expert barbers and experience premium grooming services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold text-lg"
              >
                Book Appointment
              </Link>
              <Link
                href="/styles"
                className="px-8 py-4 border border-gray-700 hover:bg-gray-900 rounded-xl font-bold text-lg"
              >
                Browse Styles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}