"use client";

import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { BookingProvider } from "./context/BookingContext"; // Add this

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <BookingProvider> {/* Add this wrapper */}
              <Navbar />
              {children}
            </BookingProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}