import React, { useState, useEffect } from "react";
import { Input, Select, Slider, Pagination, Spin, Card, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useGetAllCategoryUserQuery } from "@/redux/category/category.query.jsx";
import { useGetAllBrandByUserQuery } from "@/redux/brand/brand.query.jsx";
import { useGetFilteredProductsQuery } from "@/redux/product/productSearch.query";

const { Option } = Select;

const UserProductSearchPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

  // Gọi API từ RTK Query
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

  return (
    <div style={{ padding: "24px" }}>
      <h2>Tìm kiếm sản phẩm</h2>

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
        <Col span={10}>
          <span>Khoảng giá:</span>
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
        {loadingProducts ? (
          <Spin />
        ) : products.length === 0 ? (
          <p style={{ textAlign: "center" }}>Không tìm thấy sản phẩm nào.</p>
        ) : (
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.name}
                      src={product.mainImage?.url}
                      style={{ height: 200, objectFit: "cover" }}
                    />
                  }
                >
                  <Card.Meta
                    title={product.name}
                    description={`${product.price.toLocaleString()}₫`}
                  />
                </Card>
              </Col>
            ))}
          </Row>
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