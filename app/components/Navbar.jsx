"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, profile } = useAuth();
  const { cart } = useCart();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
  };


  const displayName = profile?.firstName || "User";

  return (
    <nav className="bg-black text-white px-6 py-4 border-b border-gray-800">
      <div className="flex justify-between items-center">
        
        {/* LOGO WITH 3D GLOWING CUBE */}
        <Link href="/" className="flex items-center gap-3">
          <div className="cube-wrapper">
            <div className="cube">
              <div className="cube-face front"></div>
              <div className="cube-face back"></div>
              <div className="cube-face right"></div>
              <div className="cube-face left"></div>
              <div className="cube-face top"></div>
              <div className="cube-face bottom"></div>
            </div>
          </div>

          <span className="text-lg font-bold tracking-wide">
            S³ HairArt
          </span>
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>

          <Link href="/" className="hover:underline">
            Home
          </Link>

          <Link href="/services" className="hover:underline">
            Services
          </Link>

          <Link href="/styles" className="hover:underline">
            Styles
          </Link>

          {/* LOGGED OUT */}
          {!user && (
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          )}

          {/* LOGGED IN */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="hover:underline"
              >
                Hello {displayName}
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
