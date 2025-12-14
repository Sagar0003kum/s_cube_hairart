"use client";

import { useCart } from "./context/CartContext";
import Link from "next/link"; // Add this import

export default function Home() {
  const { addToCart } = useCart();

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-10">
            Our Services
          </h1>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Machine Hair Cut */}
            <div className="border border-gray-700 rounded overflow-hidden">
              <img
                src="/services/machine-cut.jpg"
                alt="Machine Hair Cut"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">
                  Machine Hair Cut
                </h3>
                <p className="text-gray-400 mt-1">$20</p>

                <button
                  onClick={() =>
                    addToCart({ name: "Machine Hair Cut", price: 20 })
                  }
                  className="mt-4 w-full border border-gray-600 py-2 rounded hover:bg-gray-900"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Scissor Hair Cut */}
            <div className="border border-gray-700 rounded overflow-hidden">
              <img
                src="/services/scissor-cut.jpg"
                alt="Scissor Hair Cut"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">
                  Scissor Hair Cut
                </h3>
                <p className="text-gray-400 mt-1">$30</p>

                <button
                  onClick={() =>
                    addToCart({ name: "Scissor Hair Cut", price: 30 })
                  }
                  className="mt-4 w-full border border-gray-600 py-2 rounded hover:bg-gray-900"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Beard Trim */}
            <div className="border border-gray-700 rounded overflow-hidden">
              <img
                src="/services/beard-trim.jpg"
                alt="Beard Trim"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">
                  Beard Trim
                </h3>
                <p className="text-gray-400 mt-1">$10</p>

                <button
                  onClick={() =>
                    addToCart({ name: "Beard Trim", price: 10 })
                  }
                  className="mt-4 w-full border border-gray-600 py-2 rounded hover:bg-gray-900"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Razor Cut Beard */}
            <div className="border border-gray-700 rounded overflow-hidden">
              <img
                src="/services/razor-beard.jpg"
                alt="Razor Cut Beard"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">
                  Razor Cut Beard
                </h3>
                <p className="text-gray-400 mt-1">$15</p>

                <button
                  onClick={() =>
                    addToCart({ name: "Razor Cut Beard", price: 15 })
                  }
                  className="mt-4 w-full border border-gray-600 py-2 rounded hover:bg-gray-900"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">
            About Us
          </h2>

          <p className="text-gray-400">
            S_cube_HairArt is a modern grooming studio focused on precision,
            creativity, and customer satisfaction. We specialize in both
            classic and contemporary styles to help you look and feel your best.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Contact Us
          </h2>

          <p className="text-gray-400 mb-2">
            Email: <span className="text-white">support@squarehairart.com</span>
          </p>

          <p className="text-gray-400">
            Phone: <span className="text-white">+1 (403) 123-4567</span>
          </p>
        </div>
      </section>

      {/* Booking CTA Section - Add this at the end */}
      <section className="py-20 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-6">Ready for Your Next Haircut?</h2>
          <p className="text-gray-400 mb-8">
            Book an appointment with our expert barbers and get the perfect look you deserve.
          </p>
          <Link
            href="/book"
            className="inline-block bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg font-bold text-lg"
          >
            Book Appointment Now
          </Link>
        </div>
      </section>
    </main>
  );
}