import React, { useState, useCallback } from "react";
import { Input, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import TableCategory from "@/pages/ManageCategory/TableCategory";
import debounce from "lodash/debounce";
import ModalCategoryAction from "@/pages/ManageCategory/ModalCategoryAction";
import { useGetCategoryListQuery } from "@/redux/category/category.query";

const ManageCategory = () => {
  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 10,
  });
  const [filter, setFilter] = useState({
    name: "",
  });
  const [open, setOpen] = useState(false);
  const [isFetch, setIsfetch] = useState(false);

  const { data, isLoading, refetch } = useGetCategoryListQuery({
    ...paginate,
    ...filter,
  });

  const { data: categories = [], pagination = {} } = data || {};

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

  return (
    <div className="mt-4">
      <ModalCategoryAction
        {...{
          page: pagination?.page,
          pageSize: pagination?.pageSize,
          open,
          setOpen,
          refetch,
          isFetch,
        }}
      />
      <div className="mb-4 bg-white p-4 rounded-md shadow-lg flex gap-4 items-center">
        <Input
          size="middle"
          placeholder="Tìm kiếm danh mục..."
          prefix={<SearchOutlined />}
          onChange={handleFilterChange}
          allowClear
        />
        <Button
          size="middle"
          onClick={() => setOpen(true)}
          type="primary"
          icon={<PlusOutlined />}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Thêm danh mục
        </Button>
      </div>

      <TableCategory
        categories={categories}
        isLoading={isLoading}
        page={pagination?.page}
        pageSize={pagination?.pageSize}
        totalItems={pagination?.totalItems || 0}
        setPaginate={handlePageChange}
        refetch={refetch}
        setIsfetch={setIsfetch}
      />
    </div>
  );
};

export default ManageCategory;
