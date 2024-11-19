"use client";

import { useParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Product } from "../../types/interfaces";
import ProductCard from "../../components/ProductCard";

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const { products }: any = useAuth();

  console.log(products);
  const productByID = products?.find(
    (product: Product) => product.id.toString() === id
  );

  return (
    <div className="p-6 bg-gray-50">
      <ProductCard {...productByID} />
    </div>
  );
};

export default ProductDetails;
