import React, { useState, useCallback } from "react";
import { Input, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import TableProduct from "@/pages/ManageProduct/TableProduct";
import debounce from "lodash/debounce";
import { useGetProductListQuery } from "@redux/product/product.query";
import ModalCreateProduct from "./ModalCreateProduct";
import ModalUpdateProduct from "./ModalUpdateProduct";
import { isEmpty } from "lodash";

const ManageProduct = () => {
  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 10,
  });
  const [filter, setFilter] = useState({
    name: "",
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [isFetch, setIsFetch] = useState(false);

  // Use a stable reference for the query parameters
  const queryParams = {
    page: paginate.page,
    pageSize: paginate.pageSize,
    name: filter.name,
  };

  // Use the actual API query with stable parameters
  const { data, isLoading, refetch } = useGetProductListQuery(queryParams);

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
    setUpdateModalOpen(true);
  };

  const handleAddProduct = () => {
    setCreateModalOpen(true);
  };

  return (
    <div className="mt-4">
      {/* Create Product Modal */}
      <ModalCreateProduct
        open={createModalOpen}
        setOpen={setCreateModalOpen}
        refetch={refetch}
      />

      {/* Update Product Modal */}
      <ModalUpdateProduct
        open={updateModalOpen}
        setOpen={setUpdateModalOpen}
        product={selectedProduct}
        refetch={refetch}
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
          onClick={handleAddProduct}
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
