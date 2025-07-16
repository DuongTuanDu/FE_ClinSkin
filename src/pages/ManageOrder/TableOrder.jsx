import React, { useMemo } from "react";
import { Table, Tag, Tooltip, Pagination } from "antd";
import { format } from "date-fns";

const TableOrder = ({
  orders = [],
  isLoading = false,
  page,
  pageSize,
  totalItems,
  setPaginate,
  refetch,
  onViewDetail, 
}) => {
  const columns = useMemo(
    () => [
      {
        title: "STT",
        key: "index",
        width: 60,
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "Khách hàng",
        dataIndex: ["userId", "name"],
        key: "userId",
        render: (_, record) => record?.userId?.name || "Ẩn danh",
      },
      {
        title: "Tổng tiền",
        dataIndex: "totalAmount",
        key: "totalAmount",
        render: (total) => `${total.toLocaleString("vi-VN")} đ`,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const colorMap = {
            pending: "orange",
            shipping: "blue",
            delivered: "green",
            cancelled: "red",
          };
          return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
        },
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => format(new Date(date), "dd/MM/yyyy HH:mm"),
      },
      {
        title: "Hành Động",
        key: "view",
        render: (_, record) => (
          <button
            className="text-blue-600 underline"
            onClick={() => onViewDetail(record)}
          >
            Xem
          </button>
        ),
      },
    ],
    [page, pageSize, onViewDetail]
  );

  return (
    <>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey={(record) => record._id}
        pagination={false}
        loading={isLoading}
        scroll={{ x: true }}
      />
      {orders?.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalItems}
            onChange={(newPage, newPageSize) =>
              setPaginate(newPage, newPageSize)
            }
            showSizeChanger
            pageSizeOptions={["10", "20", "50"]}
          />
        </div>
      )}
    </>
  );
};

export default React.memo(TableOrder);
