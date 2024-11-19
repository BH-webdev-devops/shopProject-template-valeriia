/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const OrderStatusPage: React.FC = () => {
  const { getOrders }: any = useAuth();
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await getOrders();
        console.log(response);
        if (response.status === 200) {
          setOrderData(response.body);
        } else {
          setError(response.body?.message || "Something went wrong");
        }
      } catch (err) {
        setError(`Failed to fetch orders ${err}`);
      }
    };
    fetchOrderData();
  }, []);

  console.log(orderData);
  if (error) {
    return (
      <div className="p-4 text-center text-gray-700">
        <p>{error}</p>
      </div>
    );
  }

  if (!orderData) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="min-h-screen bg-black text-white py-8 px-4">
        <div className="space-y-6">
          {orderData.map((order: any) => (
            <div
              key={order.id}
              className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-full w-full"
            >
              <h1 className="text-3xl font-bold text-center mb-6">
                Order #{order.id}
              </h1>

              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-300">
                    Status:
                  </h2>
                  <p className="text-xl font-bold text-green-500">
                    {order.status}
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-semibold text-gray-300">
                    Total:
                  </h2>
                  <p className="text-xl font-bold text-yellow-400">
                    {order.total} €
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-300">Items:</h2>
                <ul className="space-y-4 mt-2">
                  {order.items.map((item: any) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center p-3 rounded-lg bg-gray-800"
                    >
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-gray-400">Quantity: {item.count}</p>
                      </div>
                      <p className="text-yellow-400 font-bold">
                        {item.product.price * item.count} €
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Optional: Add a separator line */}
              <div className="border-t border-gray-700 mt-4 pt-4">
                <p className="text-sm text-gray-400">Order ID: {order.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default OrderStatusPage;
