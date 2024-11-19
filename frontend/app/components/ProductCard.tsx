/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Product } from "../types/interfaces";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

const ProductCard: React.FC<Product> = (product: Product) => {
  const { addNewItemToCart }: any = useAuth();

  const handleBuyClick = () => {
    addNewItemToCart(product);
  };

  return (
    <div
      key={product.id}
      className="text-center bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300 max-w-xs mx-auto"
    >
      <Link href={`/product/${product.id}`}>
        <h2 className="text-2xl font-bold text-gray-900 text-center ">
          {product.title}
        </h2>
      </Link>

      <img
        src={product.image}
        alt={product.title}
        className="rounded-md max-w-36 h-auto object-cover mb-2"
      />
      <h3 className="text-lg text-gray-700 text-center">
        {product.description}
      </h3>
      <h3 className="font-bold text-gray-700 text-center">{product.price}€</h3>

      <button
        onClick={handleBuyClick}
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
      >
        Buy
      </button>
    </div>
  );
};

export default ProductCard;
