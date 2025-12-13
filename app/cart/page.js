"use client";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: cart,
        total: total,
        createdAt: serverTimestamp(),
      });

      clearCart();
      alert("Order placed successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <h1 className="text-3xl font-bold mb-8">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-400">
          Your cart is empty.
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-700 pb-3"
              >
                <div>
                  <p className="font-semibold">
                    {item.name}
                  </p>
                  <p className="text-gray-400">
                    ${item.price}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(index)}
                  className="text-red-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-gray-700 pt-6">
            <p className="text-xl font-semibold">
              Total: ${total}
            </p>

            <button
              onClick={handleCheckout}
              className="mt-4 border border-gray-600 px-6 py-3 rounded hover:bg-gray-900"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={clearCart}
              className="ml-4 text-sm text-red-400 hover:underline"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </main>
  );
}
