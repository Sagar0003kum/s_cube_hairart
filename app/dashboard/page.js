"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserBookings, cancelBooking } from "../lib/bookingApi";
import Link from "next/link";

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    const result = await getUserBookings(user.uid);
    if (result.success) {
      // Remove duplicate bookings by ID
      const uniqueBookings = removeDuplicateBookings(result.data);
      setBookings(uniqueBookings);
    }
    setLoading(false);
  };

  // Function to remove duplicate bookings
  const removeDuplicateBookings = (bookingsArray) => {
    const seen = new Set();
    return bookingsArray.filter(booking => {
      // Create a composite key to check for duplicates
      const compositeKey = `${booking.id}-${booking.date}-${booking.time}-${booking.service?.name}`;
      if (seen.has(compositeKey)) {
        return false; // Skip duplicate
      }
      seen.add(compositeKey);
      return true;
    });
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      const result = await cancelBooking(bookingId);
      if (result.success) {
        alert("Booking cancelled successfully");
        fetchBookings(); 
      } else {
        alert("Failed to cancel booking");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  const upcomingBookings = bookings.filter(
    booking => booking.status === "confirmed" && 
    new Date(booking.date || Date.now()) >= new Date()
  );

  const pastBookings = bookings.filter(
    booking => booking.status === "cancelled" || 
    new Date(booking.date || Date.now()) < new Date()
  );

  // Function to generate unique keys
  const getUniqueKey = (booking, index) => {
    // Use composite key for uniqueness
    return `${booking.id || 'no-id'}-${booking.date || 'no-date'}-${booking.time || 'no-time'}-${index}`;
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-8">Please log in to view your dashboard</p>
          <Link
            href="/login"
            className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded font-medium"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.firstName || "User"}!</h1>
        <p className="text-gray-400 mb-8">Manage your appointments and profile</p>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold">{bookings.length}</p>
          </div>
          <div className="border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Upcoming</h3>
            <p className="text-3xl font-bold text-green-400">{upcomingBookings.length}</p>
          </div>
          <div className="border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Past</h3>
            <p className="text-3xl font-bold">{pastBookings.length}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/book"
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded font-medium"
            >
              Book New Appointment
            </Link>
            <Link
              href="/services"
              className="border border-gray-600 hover:bg-gray-900 px-6 py-3 rounded font-medium"
            >
              View Services
            </Link>
            <Link
              href="/styles"
              className="border border-gray-600 hover:bg-gray-900 px-6 py-3 rounded font-medium"
            >
              Browse Styles
            </Link>
          </div>
        </div>

        {/* Bookings Tabs */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 py-4 font-medium ${
                activeTab === "upcoming"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-900"
              }`}
            >
              Upcoming Appointments
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 py-4 font-medium ${
                activeTab === "past"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-900"
              }`}
            >
              Past & Cancelled
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-400">Loading bookings...</p>
              </div>
            ) : activeTab === "upcoming" ? (
              upcomingBookings.length > 0 ? (
                <div className="space-y-6">
                  {upcomingBookings.map((booking, index) => (
                    <div 
                      key={getUniqueKey(booking, index)} // Use unique key
                      className="border border-gray-700 rounded-lg p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {booking.service?.name || booking.serviceName || "Service"}
                          </h3>
                          <div className="space-y-2 text-gray-400">
                            <p>Barber: {booking.barber?.name || booking.barberName || "Barber"}</p>
                            <p>Date: {formatDate(booking.date)}</p>
                            <p>Time: {booking.time || "Not specified"}</p>
                            <p>Price: ${booking.total || booking.service?.price || 0}</p>
                            {booking.notes && <p>Notes: {booking.notes}</p>}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-3">
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="border border-red-600 text-red-400 hover:bg-red-900/30 px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                          <button className="border border-gray-600 hover:bg-gray-900 px-4 py-2 rounded">
                            Reschedule
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-green-400">Confirmed</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No upcoming appointments</p>
                  <Link
                    href="/book"
                    className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded font-medium"
                  >
                    Book Now
                  </Link>
                </div>
              )
            ) : (
              // Past Bookings Tab
              pastBookings.length > 0 ? (
                <div className="space-y-6">
                  {pastBookings.map((booking, index) => (
                    <div 
                      key={getUniqueKey(booking, index)} //  Use unique key
                      className="border border-gray-700 rounded-lg p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {booking.service?.name || booking.serviceName || "Service"}
                          </h3>
                          <div className="space-y-2 text-gray-400">
                            <p>Barber: {booking.barber?.name || booking.barberName || "Barber"}</p>
                            <p>Date: {formatDate(booking.date)}</p>
                            <p>Time: {booking.time || "Not specified"}</p>
                            <p>Price: ${booking.total || booking.service?.price || 0}</p>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            booking.status === "cancelled"
                              ? "bg-red-900/30 text-red-400"
                              : "bg-gray-800 text-gray-300"
                          }`}>
                            {booking.status === "cancelled" ? "Cancelled" : "Completed"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No past appointments</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}