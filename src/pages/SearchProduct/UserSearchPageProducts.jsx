import React, { useState, useEffect } from "react";
import { Input, Select, Slider, Pagination, Spin, Card, Row, Col, Badge, List, Rate, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useGetAllCategoryUserQuery } from "@/redux/category/category.query.jsx";
import { useGetAllBrandByUserQuery } from "@/redux/brand/brand.query.jsx";
import { useGetFilteredProductsQuery } from "@/redux/product/productSearch.query";
import { formatPrice } from "@helpers/formatPrice";
import { createAverageRate } from "@utils/createIcon";
import ImageCarousel from "@components/ImageCarousel";
import QuickViewOverlay from "@components/Product/QuickViewOverlay";
import ProductDrawer from "@components/Product/ProductDrawer";

const { Option } = Select;

const UserProductSearchPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);


  const { data: categories = [], isLoading: loadingCategories } = useGetAllCategoryUserQuery();
  const { data: brands = [], isLoading: loadingBrands } = useGetAllBrandByUserQuery();
  const {
    data: productData,
    isLoading: loadingProducts,
  } = useGetFilteredProductsQuery({
    page,
    pageSize,
    name: search,
    category,
    brandId: brand,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
  });
  const products = productData?.data || [];
  const totalPages = productData?.pagination?.totalPage || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Function to handle item click
  const renderItem = (item) => {
    const discountPercentage = item.promotion?.discountPercentage || 0;
    const discountedPrice = item.promotion ? item.finalPrice : item.price;

    return (
      <List.Item>
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer flex flex-col h-full relative group"
        >
          {item.totalQuantity <= 0 ? (
            <Badge.Ribbon text="Hết hàng" color="red">
              <div className="relative">
                <ImageCarousel
                  images={[item.mainImage, ...(item.images || [])].filter(
                    (img) => img && img.url
                  )}
                  name={item.name}
                />
                {discountPercentage > 0 && (
                  <Tag color="#f50" className="absolute top-2 left-2 z-10">
                    -{discountPercentage}%
                  </Tag>
                )}
              </div>
            </Badge.Ribbon>
          ) : (
            <div className="relative">
              <ImageCarousel
                images={[item.mainImage, ...(item.images || [])].filter(
                  (img) => img && img.url
                )}
                name={item.name}
              />
              {discountPercentage > 0 && (
                <Tag color="#f50" className="absolute top-2 left-2 z-10">
                  -{discountPercentage}%
                </Tag>
              )}
              <QuickViewOverlay
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProduct(item);
                  setDrawerVisible(true);
                }}
              />
            </div>
          )}

          <div className="pt-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-extrabold text-sm text-center uppercase">
            {item?.brand?.name || item?.brandInfo?.name}
          </div>

          <div className="mt-2 flex-grow">
            <Link to={`/detail/${item.slug}`}>
              <h3 className="text-xs line-clamp-2 items-center leading-5">
                {item.name}
              </h3>
            </Link>
            <div
              className={`flex items-center ${discountPercentage > 0 ? "justify-between" : "justify-center"
                } mb-2`}
            >
              <span className="font-bold">{formatPrice(discountedPrice)}đ</span>
              {discountPercentage > 0 && (
                <span className="text-gray-400 line-through text-sm">
                  {formatPrice(item.price)}đ
                </span>
              )}
            </div>
            <div className="py-2 flex items-center justify-center gap-2">
              <Rate
                disabled
                value={4.5}
                character={({ index }) =>
                  createAverageRate({
                    index: index + 1,
                    rate: 4.5,
                    width: "12px",
                    height: "12px",
                  })
                }
              />
              <span className="font-medium">({item.totalReviews})</span>
            </div>
          </div>
        </motion.div>
      </List.Item>
    );
  };

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Input
            placeholder="Tìm theo tên sản phẩm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder="Danh mục"
            value={category || undefined}
            onChange={setCategory}
            allowClear
            style={{ width: "100%" }}
            loading={loadingCategories}
          >
            {categories.map((cat) => (
              <Option key={cat._id} value={cat._id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={4}>
          <Select
            placeholder="Thương hiệu"
            value={brand || undefined}
            onChange={setBrand}
            allowClear
            style={{ width: "100%" }}
            loading={loadingBrands}
          >
            {brands.map((b) => (
              <Option key={b._id} value={b._id}>
                {b.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={2} className="flex items-center" style={{paddingRight: "0px"}}>
          <span>Khoảng giá:</span>
        </Col>
        <Col span={8} style={{paddingLeft: "0px"}}>
          <Slider
            range
            min={0}
            max={1000000}
            step={10000}
            value={priceRange}
            onChange={setPriceRange}
            tooltip={{ formatter: (value) => `${value.toLocaleString()}₫` }}
          />
        </Col>
      </Row>

      <div style={{ marginTop: "24px" }}>
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
        {loadingProducts ? (
          <Spin />
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center">
            <div className="space-y-4">
              <img
                className="w-80 m-auto"
                src="https://res.cloudinary.com/dah1iwbdz/image/upload/v1750475580/clinskin_u7acix.gif"
                alt=""
              />
              <div className="text-sm md:text-base italic text-center">
                Quý khách có thể tham khảo các sản phẩm khác. ClinSkin cảm ơn quý
                khách ❤️
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <List
              loading={loadingProducts}
              grid={{
                gutter: [24, 32],
                xs: 2,
                sm: 3,
                md: 4,
                lg: 5,
                xl: 5,
                xxl: 5,
              }}
              dataSource={products}
              renderItem={renderItem}
            />
          </motion.div>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Pagination
          current={page}
          total={totalPages * pageSize}
          pageSize={pageSize}
          onChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};

export default UserProductSearchPage;