import React, { useState, useCallback } from "react";
import { Input, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import TableProduct from "@/pages/ManageProduct/TableProduct";
import debounce from "lodash/debounce";
import ModalProductAction from "@/pages/ManageProduct/ModalProductAction";
// Replace with actual query when implemented
// import { useGetProductListQuery } from "@/redux/product/product.query";
import MockData from "./MockData"; // For testing until actual API is connected

const ManageProduct = () => {
  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 10,
  });
  const [filter, setFilter] = useState({
    name: "",
  });
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [isFetch, setIsFetch] = useState(false);

  // Mock data for testing - replace with actual query when ready
  const isLoading = false;
  const data = MockData;
  const refetch = () => console.log("Refetching products");
  
  // Uncomment this when you have the actual API query
  /*
  const { data, isLoading, refetch } = useGetProductListQuery({
    ...paginate,
    ...filter,
  });
  */

  const { data: products = [], pagination = {} } = data || {};

  const debouncedFilter = useCallback(
    debounce((value) => {
      setFilter({ name: value });
      setPaginate((prev) => ({ ...prev, page: 1 }));
    }, 1000),
    []
  );

  const handleFilterChange = (e) => {
    debouncedFilter(e.target.value);
  };

  const handlePageChange = (newPage, newPageSize) => {
    setPaginate({ page: newPage, pageSize: newPageSize });
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  return (
    <div className="mt-4">
      <ModalProductAction
        {...{
          open,
          setOpen,
          product: selectedProduct,
          refetch,
          isFetch,
        }}
      />
      <div className="mb-4 bg-white p-4 rounded-md shadow-lg flex gap-4 items-center">
        <Input
          size="middle"
          placeholder="Tìm kiếm sản phẩm..."
          prefix={<SearchOutlined />}
          onChange={handleFilterChange}
          allowClear
        />
        <Button
          size="middle"
          onClick={() => {
            setSelectedProduct({});
            setOpen(true);
          }}
          type="primary"
          icon={<PlusOutlined />}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Thêm sản phẩm
        </Button>
      </div>

      <TableProduct
        products={products}
        isLoading={isLoading}
        page={pagination?.page}
        pageSize={pagination?.pageSize}
        totalItems={pagination?.totalItems || 0}
        setPaginate={handlePageChange}
        refetch={refetch}
        setIsFetch={setIsFetch}
        onEdit={handleEditProduct}
      />
    </div>
  );
};

export default ManageProduct;
