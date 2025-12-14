"use client";

import { useState } from "react";
import Link from "next/link";

export default function StylesPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Styles" },
    { id: "men", name: "Men's Cuts" },
    { id: "women", name: "Women's Styles" },
    { id: "fade", name: "Fades" },
    { id: "classic", name: "Classic" },
    { id: "modern", name: "Modern" }
  ];

  const hairStyles = [
    {
      id: 1,
      name: "Classic Taper Fade",
      category: ["men", "fade"],
      description: "Clean taper with gradual fade on sides, longer on top",
      difficulty: "Medium",
      image: "/styles/taper-fade.jpg",
      duration: "45 mins",
      price: "$30-35"
    },
    {
      id: 2,
      name: "Modern Pompadour",
      category: ["men", "modern"],
      description: "Voluminous style with height and definition",
      difficulty: "Advanced",
      image: "/styles/pompadour.jpg",
      duration: "50 mins",
      price: "$35-40"
    },
    {
      id: 3,
      name: "Textured Crop",
      category: ["men", "modern"],
      description: "Short, textured cut with messy finish",
      difficulty: "Easy",
      image: "/styles/textured-crop.jpg",
      duration: "35 mins",
      price: "$25-30"
    },
    {
      id: 4,
      name: "Layered Bob",
      category: ["women", "modern"],
      description: "Chin-length bob with face-framing layers",
      difficulty: "Medium",
      image: "/styles/layered-bob.jpg",
      duration: "60 mins",
      price: "$40-50"
    },
    {
      id: 5,
      name: "Undercut Style",
      category: ["men", "women", "modern"],
      description: "Sharp contrast between shaved sides and longer top",
      difficulty: "Advanced",
      image: "/styles/undercut.jpg",
      duration: "55 mins",
      price: "$35-45"
    },
    {
      id: 6,
      name: "Classic Side Part",
      category: ["men", "classic"],
      description: "Timeless side part with clean lines",
      difficulty: "Easy",
      image: "/styles/side-part.jpg",
      duration: "30 mins",
      price: "$25-30"
    },
    {
      id: 7,
      name: "Curly Shag",
      category: ["women", "modern"],
      description: "Layered cut for curly hair with lots of movement",
      difficulty: "Advanced",
      image: "/styles/curly-shag.jpg",
      duration: "75 mins",
      price: "$45-55"
    },
    {
      id: 8,
      name: "Buzz Cut",
      category: ["men", "classic"],
      description: "Uniform short length all around",
      difficulty: "Easy",
      image: "/styles/buzz-cut.jpg",
      duration: "20 mins",
      price: "$20-25"
    },
    {
      id: 9,
      name: "French Crop",
      category: ["men", "modern"],
      description: "Short front with textured top, clean back and sides",
      difficulty: "Medium",
      image: "/styles/french-crop.jpg",
      duration: "40 mins",
      price: "$30-35"
    },
    {
      id: 10,
      name: "Balayage Waves",
      category: ["women", "modern"],
      description: "Hand-painted highlights with beach waves",
      difficulty: "Advanced",
      image: "/styles/balayage.jpg",
      duration: "120 mins",
      price: "$80-100"
    },
    {
      id: 11,
      name: "Slick Back",
      category: ["men", "classic"],
      description: "Hair combed straight back with product",
      difficulty: "Easy",
      image: "/styles/slick-back.jpg",
      duration: "25 mins",
      price: "$25-30"
    },
    {
      id: 12,
      name: "Braided Updo",
      category: ["women", "modern"],
      description: "Elegant updo with intricate braiding",
      difficulty: "Advanced",
      image: "/styles/braided-updo.jpg",
      duration: "90 mins",
      price: "$60-75"
    }
  ];

  const filteredStyles = activeCategory === "all" 
    ? hairStyles 
    : hairStyles.filter(style => style.category.includes(activeCategory));

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Hair Style Gallery</h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Browse our collection of trending hairstyles. Find inspiration for your next cut 
            and see what our expert barbers can create for you.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-full border transition-all ${
                activeCategory === category.id
                  ? "bg-purple-600 border-purple-600"
                  : "border-gray-700 hover:border-purple-500"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Styles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredStyles.map((style) => (
            <div 
              key={style.id} 
              className="border border-gray-800 rounded-xl overflow-hidden hover:border-purple-600 transition-all duration-300 group"
            >
              {/* Image Container */}
              <div className="h-64 bg-linear-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-5xl">💇‍♂️</div>
                </div>
                
                {/* Category Tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {style.category.map((cat) => (
                    <span 
                      key={cat} 
                      className="px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-full text-xs border border-gray-700"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                
                {/* Difficulty Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                  style.difficulty === "Easy" ? "bg-green-900/80 text-green-300" :
                  style.difficulty === "Medium" ? "bg-yellow-900/80 text-yellow-300" :
                  "bg-red-900/80 text-red-300"
                }`}>
                  {style.difficulty}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-xl mb-2">{style.name}</h3>
                  <p className="text-gray-300 text-sm">{style.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="font-medium">{style.duration}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <p className="text-sm text-gray-400">Price Range</p>
                    <p className="font-medium text-purple-400">{style.price}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 border border-gray-700 hover:bg-gray-900 py-3 rounded-lg font-medium">
                    Save Style
                  </button>
                  <Link
                    href="/book"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-medium text-center"
                  >
                    Book This Style
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStyles.length === 0 && (
          <div className="text-center py-16 border border-gray-800 rounded-2xl">
            <div className="text-5xl mb-4">💇‍♀️</div>
            <h3 className="text-xl font-bold mb-2">No styles found</h3>
            <p className="text-gray-400 mb-6">Try selecting a different category</p>
            <button
              onClick={() => setActiveCategory("all")}
              className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Show All Styles
            </button>
          </div>
        )}

        {/* Inspiration Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="border border-gray-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Need Style Advice?</h3>
            <p className="text-gray-400 mb-6">
              Our barbers can help you choose the perfect style based on your hair type, 
              face shape, and personal preferences. Book a consultation today!
            </p>
            <Link
              href="/book"
              className="inline-flex items-center px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Book Consultation
              <span className="ml-2">→</span>
            </Link>
          </div>
          
          <div className="border border-gray-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Style Tips</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                Bring reference photos to your appointment
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                Consider your daily styling routine
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                Maintenance level matters - some styles need frequent trims
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                Ask about products that work best with your chosen style
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}