import React, { useCallback, useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import TableBrand from "@/pages/ManageBrand/TableBrand";
import debounce from "lodash/debounce";
import ModalBrandAction from "@/pages/ManageBrand/ModalBrandAction";
import { useGetBrandListQuery } from "@/redux/brand/brand.query";

const ManageBrand = () => {
  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 10,
  });
  const [filter, setFilter] = useState({
    name: "",
  });
  const [open, setOpen] = useState(false);
  const { data, isLoading, refetch } = useGetBrandListQuery({
    ...paginate,
    ...filter,
  });
  const { data: brands = [], pagination = {} } = data || {};

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

  return (
    <div className="mt-4">
      <ModalBrandAction
        {...{
          refetch,
          open,
          setOpen,
        }}
      />
      <div className="mb-4 bg-white p-4 rounded-md shadow-lg flex gap-4 items-center">
        <Input
          size="middle"
          placeholder="Tìm kiếm thương hiệu..."
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
          Thêm thương hiệu
        </Button>
      </div>

      <TableBrand
        refetch={refetch}
        brands={brands}
        isLoading={isLoading}
        page={pagination?.page}
        pageSize={pagination?.pageSize}
        totalItems={pagination?.totalItems}
        setPaginate={setPaginate}
      />
    </div>
  );
};

export default ManageBrand;
