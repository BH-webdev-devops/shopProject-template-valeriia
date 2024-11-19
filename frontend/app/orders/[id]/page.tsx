/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const OrderDetailPage: React.FC = () => {
  const host = process.env.NEXT_PUBLIC_API_URL;
  const { id } = useParams();
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const router = useRouter();
  const fetchOrderData = async () => {
    try {
      const response = await fetchOrder();
      console.log(response);
      if (response?.status === 200) {
        setOrderData(response.body);
      } else {
        setError(response?.body?.message || "Something went wrong");
      }
    } catch (err) {
      setError(`Failed to fetch orders ${err}`);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${host}api/orders/` + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await res.json();
      return { status: res.status, body: response };
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleCancelOrder = async () => {
    const res = await fetch(`${host}api/orders/` + id + "/status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "CANCELED" }),
    });

    const response = await res.json();

    if (res.ok) {
      alert("Order cancelled successfully!");
      fetchOrderData();
    } else {
      alert("Failed to cancel the order " + response.message);
    }
  };

  const handleDeleteOrder = async () => {
    const res = await fetch(`${host}api/orders/` + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await res.json();

    if (res.ok) {
      alert("Order deleted successfully!");
      router.push("/orders");
    } else {
      alert("Failed to delete the order " + response.message);
    }
  };

  console.log(orderData);
  if (error) {
    return (
      <div className="p-4 text-center text-yellow-400">
        <p>{error}</p>
      </div>
    );
  }

  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container bg-black text-white mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Order #{orderData.id}
      </h1>

      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-300">Order Status:</h2>
          <p className="text-xl font-bold text-green-500">{orderData.status}</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold text-gray-300">Total:</h2>
          <p className="text-xl font-bold text-yellow-400">
            {orderData.total} €
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {orderData.items.map((item: any) => (
          <div
            key={item.product.id}
            className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-full w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.image || "https://via.placeholder.com/100"}
                  alt={item.product.name}
                  className="h-24 w-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-300">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-400">{item.product.description}</p>
                </div>
              </div>

              <div className="text-lg font-semibold text-gray-300">
                {item.product.price * item.count} €
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Quantity: {item.count}</span>
            </div>
          </div>
        ))}
      </div>

      {orderData.status !== "CANCELED" && (
        <div className="mt-6 text-center">
          <button
            onClick={handleCancelOrder}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
          >
            Cancel Order
          </button>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={handleDeleteOrder}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
        >
          Delete Order
        </button>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4">
        <p className="text-sm text-gray-400">Order ID: {orderData.id}</p>
      </div>
    </div>
  );
};

export default OrderDetailPage;
