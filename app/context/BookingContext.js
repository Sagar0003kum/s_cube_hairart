"use client";

import { createContext, useContext, useState } from "react";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookingDetails, setBookingDetails] = useState({
    service: null,
    barber: null,
    date: null,
    time: null,
    notes: ""
  });

  
  const updateBookingDetails = (field, value) => {
    setBookingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearBookingDetails = () => {
    setBookingDetails({
      service: null,
      barber: null,
      date: null,
      time: null,
      notes: ""
    });
  };

  return (
    <BookingContext.Provider
      value={{
        bookingDetails,
        updateBookingDetails, 
        clearBookingDetails
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }
  return context;
}