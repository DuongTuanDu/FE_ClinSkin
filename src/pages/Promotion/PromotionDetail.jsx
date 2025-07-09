import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Input,
  Slider,
  Breadcrumb,
  Empty,
  Pagination,
  Skeleton,
} from "antd";
import { useGetPromotionProductBySlugQuery } from "@/redux/promotion/promotion.query";
import PromotionCard from "./PromotionCard";
import ProductDrawer from "@components/Product/ProductDrawer";
import Banner from "./Banner";

const PromotionDetail = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [search, setSearch] = useState("");
  const [discountRange, setDiscountRange] = useState([0, 100]);
  const [priceRange, setPriceRange] = useState([0, 10000000]);

  const { data, isLoading } = useGetPromotionProductBySlugQuery({
    slug,
    name: search,
    discountMin: discountRange[0],
    discountMax: discountRange[1],
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
  });

  const promotion = useMemo(() => {
    if (!data || !data.data) return null;
    return data.data;
  }, [data, slug]);

  const paginatedProducts = useMemo(() => {
    if (!promotion) return [];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return promotion.products.slice(start, end);
  }, [promotion, page]);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setDrawerVisible(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} active />
        ))}
      </div>
    );
  }

  if (!promotion) {
    return <Empty description="Không tìm thấy khuyến mãi" />;
  }

  return (
    <div className="container mx-auto space-y-6 py-8">
      <Breadcrumb
        items={[
          { title: "Trang chủ", href: "/" },
          { title: promotion.name },
        ]}
      />
      <Banner />
      <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-2">
          <span>Giảm giá từ</span>
          <Slider
            range
            min={0}
            max={100}
            value={discountRange}
            onChange={(val) => setDiscountRange(val)}
            style={{ width: 200 }}
          />
          <span>
            {discountRange[0]}% - {discountRange[1]}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>Khoảng giá</span>
          <Slider
            range
            min={0}
            max={10000000}
            step={100000}
            value={priceRange}
            onChange={(val) => setPriceRange(val)}
            style={{ width: 200 }}
          />
          <span>
            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </span>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-blue-700 text-center">
        {promotion.name}
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto">
        {promotion.description}
      </p>

      {promotion.products.length === 0 ? (
        <Empty description="Không có sản phẩm nào trong khuyến mãi này." />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts.map(({ product, discountPercentage }) => (
              <PromotionCard
                key={product._id}
                product={product}
                discount={discountPercentage}
                onQuickView={handleQuickView}
              />
            ))}
          </div>

          <div className="flex justify-center pt-6">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={promotion.products.length}
              showSizeChanger={false}
              onChange={(newPage) => setPage(newPage)}
            />
          </div>
        </>
      )}

      {drawerVisible && selectedProduct && (
        <ProductDrawer
          open={drawerVisible}
          product={selectedProduct}
          onClose={() => {
            setDrawerVisible(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default PromotionDetail;
