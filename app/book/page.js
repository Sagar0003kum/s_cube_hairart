"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { getBarbers, getAvailableSlots, createBooking } from "../lib/bookingApi";
import { useRouter } from "next/navigation";

const SERVICES = [
  { id: 1, name: "Machine Hair Cut", duration: 30, price: 20 },
  { id: 2, name: "Scissor Hair Cut", duration: 45, price: 30 },
  { id: 3, name: "Beard Trim", duration: 20, price: 10 },
  { id: 4, name: "Razor Cut Beard", duration: 25, price: 15 },
  { id: 5, name: "Hair Wash & Style", duration: 40, price: 25 },
  { id: 6, name: "Kids Haircut", duration: 30, price: 18 }
];

export default function BookPage() {
  const { user } = useAuth();
  const { bookingDetails, updateBookingDetails } = useBooking();
  const router = useRouter();

  const [barbers, setBarbers] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [step, setStep] = useState(1);

  useEffect(() => {
    const loadBarbers = async () => {
      setLoading(true);
      const result = await getBarbers();
      if (result.success) {
        setBarbers(result.data);
      }
      setLoading(false);
    };
    loadBarbers();
  }, []);

  useEffect(() => {
    // ✅ FIX: Add optional chaining for barber and date
    if (bookingDetails?.barber?.id && bookingDetails?.date) {
      const loadSlots = async () => {
        setLoading(true);
        const result = await getAvailableSlots(
          bookingDetails.barber.id,
          bookingDetails.date
        );
        if (result.success) {
          setAvailableSlots(result.data);
        }
        setLoading(false);
      };
      loadSlots();
    }
  }, [bookingDetails?.barber?.id, bookingDetails?.date]);

  const handleServiceSelect = (service) => {
    updateBookingDetails("service", service);
    setStep(2);
    setMessage({ type: "", text: "" });
  };

  const handleBarberSelect = (barber) => {
    updateBookingDetails("barber", barber);
    setStep(3);
    setMessage({ type: "", text: "" });
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];
    
    if (selectedDate < today) {
      setMessage({ type: "error", text: "Please select a future date" });
      return;
    }
    
    updateBookingDetails("date", selectedDate);
  };

  const handleTimeSelect = (time) => {
    updateBookingDetails("time", time);
    setStep(4);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setMessage({ 
        type: "error", 
        text: "Please login to book an appointment. Redirecting to login..." 
      });
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    // ✅ FIX: Use optional chaining and extract variables
    const service = bookingDetails?.service;
    const barber = bookingDetails?.barber;
    const date = bookingDetails?.date;
    const time = bookingDetails?.time;

    if (!service || !barber || !date || !time) {
      setMessage({ 
        type: "error", 
        text: "Please complete all booking details before submitting." 
      });
      return;
    }

    // ✅ Additional safety checks
    if (!barber.id || !barber.name) {
      setMessage({ 
        type: "error", 
        text: "Invalid barber selection. Please select a barber again." 
      });
      setStep(2); // Send back to barber selection
      return;
    }

    if (!service.id || !service.name || !service.price) {
      setMessage({ 
        type: "error", 
        text: "Invalid service selection. Please select a service again." 
      });
      setStep(1); // Send back to service selection
      return;
    }

    setLoading(true);
    
    const bookingData = {
      userId: user.uid,
      userName: user.email,
      service: {
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration || 30
      },
      barber: {
        id: barber.id,
        name: barber.name,
        specialty: barber.specialty || "Hair Stylist",
        rating: barber.rating || 4.5
      },
      date: date,
      time: time,
      notes: bookingDetails?.notes || "",
      total: service.price,
      status: "confirmed"
    };

    const result = await createBooking(bookingData, user.uid);
    
    if (result.success) {
      setMessage({ 
        type: "success", 
        text: `${result.message} Your appointment is on ${date} at ${time}` 
      });
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } else {
      setMessage({ type: "error", text: result.error || "Booking failed" });
    }
    
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
        <p className="text-gray-400 mb-8">Choose your service, barber, and preferred time</p>

        {/* Success Message */}
        <div className="mb-6 p-4 border border-blue-500 rounded-lg bg-blue-900/20">
          <div className="flex items-center">
            <div className="mr-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
            </div>
            <div>
              <p className="font-medium text-white">Booking System Ready</p>
              <p className="text-sm text-blue-300">Select your service to begin</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12 relative">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center z-10">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center 
                ${step >= stepNumber ? 'bg-purple-600' : 'bg-gray-800 border border-gray-700'}`}>
                <span className="font-bold">{stepNumber}</span>
              </div>
              <span className="mt-2 text-sm text-gray-400">
                {["Service", "Barber", "Time", "Confirm"][stepNumber - 1]}
              </span>
            </div>
          ))}
          <div className="absolute top-6 left-12 right-12 h-1 bg-gray-800 -z-10"></div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded ${
            message.type === "error" ? "bg-red-900/30 border border-red-700" : "bg-green-900/30 border border-green-700"
          }`}>
            {message.text}
          </div>
        )}

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className={`border rounded-lg p-6 cursor-pointer transition-all hover:border-purple-600
                  ${bookingDetails?.service?.id === service.id ? 'border-purple-600 bg-purple-900/20' : 'border-gray-700'}`}
                onClick={() => handleServiceSelect(service)}
              >
                <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                <p className="text-gray-400 mb-3">Duration: {service.duration} mins</p>
                <p className="text-xl font-bold text-purple-400">${service.price}</p>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Barber Selection */}
        {step === 2 && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Select Barber</h2>
              <p className="text-gray-400 mb-6">
                Selected Service: <span className="text-white font-medium">
                  {bookingDetails?.service?.name || "No service selected"}
                </span>
              </p>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-400">Loading barbers...</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {barbers.map((barber) => (
                    <div
                      key={barber.id}
                      className={`border rounded-lg p-6 cursor-pointer transition-all hover:border-purple-600
                        ${bookingDetails?.barber?.id === barber.id ? 'border-purple-600 bg-purple-900/20' : 'border-gray-700'}`}
                      onClick={() => handleBarberSelect(barber)}
                    >
                      <div className="w-20 h-20 rounded-full bg-gray-800 mb-4 mx-auto flex items-center justify-center">
                        <span className="text-2xl text-white">
                          {barber.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg text-center mb-1">{barber.name}</h3>
                      <p className="text-gray-400 text-center mb-2">{barber.specialty}</p>
                      <p className="text-sm text-gray-400 text-center">Experience: {barber.experience}</p>
                      <div className="mt-4 flex justify-center items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{barber.rating || "4.5"}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="border border-gray-600 hover:bg-gray-900 px-6 py-3 rounded"
                  >
                    ← Back to Services
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ✅ FIXED: Step 3: Time Selection */}
        {step === 3 && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Select Date & Time</h2>
              <p className="text-gray-400">
                Service: <span className="text-white">
                  {bookingDetails?.service?.name || "No service selected"}
                </span> • 
                Barber: <span className="text-white">
                  {bookingDetails?.barber?.name || "No barber selected"}
                </span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block mb-2 font-medium">Select Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  onChange={handleDateChange}
                  value={bookingDetails?.date || ""}
                  className="w-full p-3 bg-black border border-gray-700 rounded focus:border-purple-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Available Time Slots {bookingDetails?.date && `for ${bookingDetails.date}`}
                </label>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleTimeSelect(slot)}
                        className={`p-3 rounded border ${
                          bookingDetails?.time === slot
                            ? 'border-purple-600 bg-purple-900/20'
                            : 'border-gray-700 hover:border-purple-600'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : bookingDetails?.date ? (
                  <p className="text-gray-400 p-4 border border-gray-700 rounded">
                    Loading time slots...
                  </p>
                ) : (
                  <p className="text-gray-400 p-4 border border-gray-700 rounded">
                    Please select a date first
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="border border-gray-600 hover:bg-gray-900 px-6 py-3 rounded"
              >
                ← Back to Barber Selection
              </button>
              
              {bookingDetails?.time && (
                <button
                  onClick={() => setStep(4)}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded font-medium"
                >
                  Continue to Confirmation →
                </button>
              )}
            </div>
          </>
        )}

        {/* ✅ FIXED: Step 4: Confirmation */}
        {step === 4 && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Confirm Your Booking</h2>
            
            <div className="border border-gray-700 rounded-lg p-6 mb-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Service:</span>
                  <span className="font-semibold">
                    {bookingDetails?.service?.name || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Price:</span>
                  <span className="font-semibold">
                    ${bookingDetails?.service?.price || "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Barber:</span>
                  <span className="font-semibold">
                    {bookingDetails?.barber?.name || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Date:</span>
                  <span className="font-semibold">
                    {bookingDetails?.date || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Time:</span>
                  <span className="font-semibold">
                    {bookingDetails?.time || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-4">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-2xl font-bold text-purple-400">
                    ${bookingDetails?.service?.price || "0"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block mb-2 font-medium">Additional Notes (Optional)</label>
              <textarea
                placeholder="Any special requests or instructions..."
                value={bookingDetails?.notes || ""}
                onChange={(e) => updateBookingDetails("notes", e.target.value)}
                className="w-full p-3 bg-black border border-gray-700 rounded focus:border-purple-600 focus:outline-none"
                rows="3"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 py-4 rounded-lg font-bold text-lg"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>

            <div className="mt-8">
              <button
                onClick={() => setStep(3)}
                className="w-full border border-gray-700 hover:bg-gray-900 py-3 rounded-lg"
              >
                ← Back to Time Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}