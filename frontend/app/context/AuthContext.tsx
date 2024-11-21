/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, Item } from "../types/interfaces";

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  products: Product[] | null;
  cart: Item[] | null;
  login: (email: string, password: string) => Promise<any>;
  sentEmail: (from: string, subject: string, text: string) => Promise<any>;
  register: (form: FormData) => Promise<void>;
  logout: () => void;
  addNewItemToCart: (product: Product) => void;
  reduceItemToCart: (productId: number) => void;
  increaseItemToCart: (productId: number) => void;
  cleanCart: () => void;
  createOrder: (userId: number) => Promise<any>;
  getOrders: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Item[]>([]);

  const host = process.env.NEXT_PUBLIC_API_URL;
  // Check if there is a token in localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchProducts();
    if (token) {
      // Fetch the user data here, or simply set a user status if authenticated
      //   setUser({}); // placeholder for user data
    }
  }, []);

  // Register function
  const register = async (form: FormData) => {
    const res = await fetch(`${host}api/register`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    console.log(data);
    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    const res = await fetch(`${host}api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log(data);
    if (data.token) {
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      setUser(data.user);
    } else {
      setIsAuthenticated(false);
    }
    return data;
  };

  // Sent email
  const sentEmail = async (from: string, subject: string, text: string) => {
    const res = await fetch(`${host}api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, subject, text }),
    });
    return res;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const addNewItemToCart = (product: Product) => {
    const productInCart = cart?.findIndex(
      (item: Item) => item.product.id === product.id
    );
    if (productInCart > -1) {
      setCart((prevCart) => {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, count: item.count + 1 }
            : item
        );
      });
    } else {
      setCart((prevCart) => [...prevCart, { product: product, count: 1 }]);
    }
  };

  const reduceItemToCart = (productId: number) => {
    const productInCart = cart?.findIndex(
      (item: Item) => item.product.id === productId
    );
    if (productInCart > -1) {
      setCart((prevCart) => {
        return prevCart
          .map((item) => {
            if (item.product.id === productId) {
              return { ...item, count: item.count - 1 };
            }
            return item;
          })
          .filter((item: Item) => item.count > 0);
      });
    }
  };

  const increaseItemToCart = (productId: number) => {
    const productInCart = cart?.findIndex(
      (item: Item) => item.product.id === productId
    );
    if (productInCart > -1) {
      const prevCart = cart
        .map((item) => {
          if (item.product.id === productId) {
            return { ...item, count: item.count + 1 };
          }
          return item;
        })
        .filter((item: Item) => item.count > 0);
      setCart(prevCart);
    }
  };

  const cleanCart = () => {
    setCart([]);
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await fetch(`${host}api/profile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status == 200) {
          const data = await res.json();
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
        console.log(`Error fetching profile ${err}`);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${host}api/products/`);
      const data = await response.json();
      setProducts(data);
      console.log(data);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const getOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${host}api/users/orders`, {
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

  const createOrder = async (userId: number) => {
    const token = localStorage.getItem("token");
    const body = { userId: userId, items: cart };
    console.log("body");
    console.log(body);
    const res = await fetch(`${host}api/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const response = await res.json();
    return { status: res.status, body: response };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        products,
        cart,
        sentEmail,
        login,
        register,
        logout,
        addNewItemToCart,
        reduceItemToCart,
        increaseItemToCart,
        createOrder,
        cleanCart,
        getOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
