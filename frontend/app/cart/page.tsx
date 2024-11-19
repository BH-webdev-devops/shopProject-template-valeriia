/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Cart: React.FC = () => {
  const {
    user,
    isAuthenticated,
    cart,
    reduceItemToCart,
    increaseItemToCart,
    createOrder,
    cleanCart,
  }: any = useAuth();
  const router = useRouter();
  console.log(cart);
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/register");
    }
  }, [isAuthenticated]);

  const handleCheckout = async () => {
    if (cart && cart.length > 0) {
      const res = await createOrder();
      if (res.status == 201) {
        cleanCart();
        alert("Thanks for your Order");
      } else {
        alert(res.data);
      }
    } else {
      alert("Your cart is empty.");
    }
  };

  const handleOrder = async () => {
    if (cart && cart.length > 0) {
      const res = await createOrder(user.id);
      if (res.status == 201) {
        alert("Thanks for your Order");
      } else {
        alert(res.body.message);
      }
    } else {
      alert("Your cart is empty.");
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="p-4 text-center text-gray-700">
        <p>Your cart is empty. Add some items!</p>
      </div>
    );
  }

  return (
    <div className="container bg-black text-white mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Your Cart</h2>
      <div className="space-y-6">
        {cart.map((item: any) => (
          <div
            key={item.product.id}
            className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-full w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="h-24 w-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-300">
                    {item.product.title}
                  </h3>
                  <p className="text-gray-400">{item.product.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => reduceItemToCart(item.product.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-600"
                >
                  -
                </button>
                <span className="text-lg font-semibold text-gray-300">
                  {item.count}
                </span>
                <button
                  onClick={() => increaseItemToCart(item.product.id)}
                  className="bg-green-500 text-white py-1 px-3 rounded-full hover:bg-green-600"
                >
                  +
                </button>
              </div>

              <div className="text-lg font-semibold text-gray-300">
                {item.product.price * item.count} €
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <div className="text-xl font-semibold text-gray-300">
          Total:{" "}
          {cart.reduce(
            (
              acc: number,
              item: { product: { price: number }; count: number }
            ) => acc + item.product.price * item.count,
            0
          )}{" "}
          €
        </div>

        <div className="space-x-4">
          <button
            onClick={handleOrder}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            Place the order
          </button>
          <button
            onClick={handleCheckout}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            Place the order and pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
