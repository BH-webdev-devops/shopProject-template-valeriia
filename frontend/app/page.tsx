'use client'
import { useAuth } from "./context/AuthContext";
import Products from "./components/Products";

export default function Home() {
  const { user, isAuthenticated }: any = useAuth()

  return (
    <>
      {isAuthenticated && user ? (
        <h1 className="text-center text-xl">Hello world {user.email}</h1>
      ) : (
        <h1 className="text-center text-xl">Hello world</h1>
      )}
      <Products/>
    </>
  );
}

