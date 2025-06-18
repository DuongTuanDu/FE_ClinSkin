import React, { useState, useCallback } from "react";
import { Input, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import TableInventory from "@/pages/ManageInventory/TableInventory";
import debounce from "lodash/debounce";
import ModalInventoryAction from "@/pages/ManageInventory/ModalInventoryAction";
import { useGetAllBatchesQuery } from "@/redux/inventory/inventoryBatch.query";
import SelectProductsAsyncInfinite from "@/components/CustomSelect/SelectProductsAsyncInfinite";

const ManageInventory = () => {
  const [paginate, setPaginate] = useState({
    page: 1,
    limit: 10,
  });
  const [filter, setFilter] = useState({
    batchNumber: "",
    productId: "",
    importer: "",
    sortBy: "createdAt",
    sortOrder: "descend",
  });
  const [open, setOpen] = useState(false);

  const { data, isLoading, refetch } = useGetAllBatchesQuery({
    ...paginate,
    ...filter,
  });

  const { data: batches = [], pagination = {} } = data || {};

  const debouncedFilterBatchNumber = useCallback(
    debounce((value) => {
      setFilter((prev) => ({ ...prev, batchNumber: value }));
      setPaginate((prev) => ({ ...prev, page: 1 }));
    }, 800),
    []
  );

  const handleFilterChange = (e) => {
    debouncedFilterBatchNumber(e.target.value);
  };

  const handleProductFilter = (selectedOption) => {
    setFilter((prev) => ({ ...prev, productId: selectedOption ? selectedOption.value : "" }));
    setPaginate((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage, newPageSize) => {
    setPaginate({ page: newPage, limit: newPageSize });
  };

  const handleSortChange = (sortBy, sortOrder) => {
    setFilter((prev) => ({ ...prev, sortBy, sortOrder }));
    setPaginate((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="mt-4">
      <ModalInventoryAction
        {...{
          open,
          setOpen,
          refetch,
        }}
      />
      <div className="mb-4 bg-white p-4 rounded-md shadow-lg flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1">
          <Input
            size="middle"
            placeholder="Tìm kiếm theo mã lô..."
            prefix={<SearchOutlined />}
            onChange={handleFilterChange}
            allowClear
          />
        </div>
        <div className="w-full md:w-64">
          <SelectProductsAsyncInfinite onSelectChange={handleProductFilter} />
        </div>
        <Button
          size="middle"
          onClick={() => setOpen(true)}
          type="primary"
          icon={<PlusOutlined />}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Thêm lô hàng
        </Button>
      </div>

      <TableInventory
        batches={batches}
        isLoading={isLoading}
        page={pagination?.currentPage || 1}
        pageSize={pagination?.itemsPerPage || 10}
        totalItems={pagination?.totalItems || 0}
        setPaginate={handlePageChange}
        sortBy={filter.sortBy}
        sortOrder={filter.sortOrder}
        onSortChange={handleSortChange}
        refetch={refetch}
      />
    </div>
  );
};

export default ManageInventory;