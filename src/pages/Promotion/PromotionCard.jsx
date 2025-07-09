import React from "react";
import QuickViewOverlay from "@components/Product/QuickViewOverlay"; // đảm bảo đường dẫn đúng
import { formatPrice } from "@helpers/formatPrice";

const PromotionCard = ({ product, discount, onQuickView }) => {
  const priceAfterDiscount = product.price - (product.price * discount) / 100;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition relative group">
      <div className="relative">
        <img
          src={product.mainImage?.url || "/fallback.jpg"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />

        {/* Nút Quick View xuất hiện khi hover */}
        <QuickViewOverlay onClick={(e) => {
          e.stopPropagation();
          onQuickView(product);
        }} />
      </div>

      <div className="p-4 space-y-1">
        <h3 className="font-bold text-base line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-semibold text-red-500">
            {formatPrice(priceAfterDiscount)}₫
          </span>
          <span className="text-sm line-through text-gray-400">
            {formatPrice(product.price)}₫
          </span>
          <span className="ml-auto text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
            -{discount}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;
