"use client";

import React from "react";
import ProductCard from "../components/ProductCard";

import { useAuth } from "../context/AuthContext";
import { Product } from "../types/interfaces";

const Products: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { products }: any = useAuth();

  return (
    <div className="flex flex-wrap justify-center p-4 gap-4 ">
      {products !== null &&
        products.map((product: Product) => (
          <ProductCard key={product.id} {...product} />
        ))}
    </div>
  );
};

export default Products;
