"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, profile, profileLoaded } = useAuth(); // ✅ added profileLoaded
  const { cart } = useCart();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
  };

  return (
    <nav className="bg-black text-white px-6 py-4 border-b border-gray-800">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">S_cube_HairArt</h1>

        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-800" onClick={() => setOpen(false)}>Dashboard</Link>
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/services" className="hover:underline">Services</Link>
          <Link href="/styles" className="hover:underline">Styles</Link>

          <Link href="/cart" className="hover:underline">
            Cart ({cart.length})
          </Link>

          {/* ✅ Logged out => ALWAYS show Login */}
          {!user && (
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          )}

          {/* ✅ Logged in BUT profile still loading => show nothing (prevents wrong "Login" / wrong "Hello") */}
          {user && !profileLoaded && (
            <span className="text-gray-400">...</span>
          )}

          {/* ✅ Logged in AND profile loaded => show Hello firstName */}
          {user && profileLoaded && (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="hover:underline"
              >
                Hello {profile?.firstName || "User"}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded shadow-lg">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-800"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>

                  <Link
                    href="/payments"
                    className="block px-4 py-2 hover:bg-gray-800"
                    onClick={() => setOpen(false)}
                  >
                    Payment History
                  </Link>

                  <Link
                    href="/rewards"
                    className="block px-4 py-2 hover:bg-gray-800"
                    onClick={() => setOpen(false)}
                  >
                    Rewards
                  </Link>

                  <Link
                    href="/about"
                    className="block px-4 py-2 hover:bg-gray-800"
                    onClick={() => setOpen(false)}
                  >
                    About
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 text-red-400"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
