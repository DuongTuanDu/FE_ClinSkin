import React, { useState, useCallback } from "react";
import { Input, Select, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
import { useGetOrderListQuery } from "@redux/order/order.query";
import TableOrder from "./TableOrder";
import ModalOrderDetail from "./ModalOrderDetail";

const { Option } = Select;

const ManageOrder = () => {
  const [paginate, setPaginate] = useState({ page: 1, pageSize: 10 });
  const [filter, setFilter] = useState({
    status: "",
    note: "",
    startDate: null,
  });

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const debouncedNoteFilter = useCallback(
    debounce((value) => {
      setFilter((prev) => ({ ...prev, note: value }));
      setPaginate((prev) => ({ ...prev, page: 1 }));
    }, 500),
    []
  );

  const handleNoteChange = (e) => {
    debouncedNoteFilter(e.target.value);
  };

  const queryParams = {
    page: paginate.page,
    limit: paginate.pageSize,
    status: filter.status,
    note: filter.note,
    startDate: filter.startDate?.toISOString(),
  };

  const { data, isLoading, refetch } = useGetOrderListQuery(queryParams);
  const { orders = [], total = 0, page, pageSize } = data || {};

  return (
    <div className="mt-4">
      <ModalOrderDetail
        open={detailModalOpen}
        setOpen={setDetailModalOpen}
        order={selectedOrder}
      />

      <div className="mb-4 bg-white p-4 rounded-md shadow flex flex-wrap gap-4 items-center">
        <Select
          placeholder="Lọc theo trạng thái"
          style={{ width: 200 }}
          allowClear
          value={filter.status || undefined}
          onChange={(value) => {
            setFilter((prev) => ({ ...prev, status: value }));
            setPaginate((prev) => ({ ...prev, page: 1 }));
          }}
        >
          <Option value="pending">Chờ xử lý</Option>
          <Option value="shipping">Đang giao</Option>
          <Option value="delivered">Đã giao</Option>
          <Option value="cancelled">Đã huỷ</Option>
        </Select>

        <DatePicker
          placeholder="Lọc từ ngày tạo"
          onChange={(date) => {
            setFilter((prev) => ({ ...prev, startDate: date }));
            setPaginate((prev) => ({ ...prev, page: 1 }));
          }}
        />
      </div>

      <TableOrder
        orders={orders}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        totalItems={total}
        setPaginate={setPaginate}
        refetch={refetch}
        onViewDetail={(order) => {
          setSelectedOrder(order);
          setDetailModalOpen(true);
        }}
      />
    </div>
  );
};

export default ManageOrder;
