"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user, loading, isAuthenticated }: any = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/register");
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Redirecting...</p>;
  }

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-black text-white px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-gray-900 rounded-lg shadow-lg p-8">
        <h2 className="text-center text-3xl font-bold text-yellow-400 mb-4">
          {user.name}
        </h2>
        <p className="mt-2 text-center text-lg text-gray-300">
          ID: <span className="font-semibold text-white">{user.id}</span>
        </p>
        <p className="mt-1 text-center text-lg text-gray-300">
          <span className="font-semibold text-white">{user.email}</span>
        </p>

        {/* Add a button for better UX */}
        <div className="mt-6 text-center">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
