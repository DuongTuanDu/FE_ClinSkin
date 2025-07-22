import React, { useMemo, useState } from "react";
import {
  Pagination,
  Table,
  Tooltip,
  Tag,
  Select,
  Popconfirm,
  message,
} from "antd";
import { FaEye } from "react-icons/fa";
import { formatDateOrder } from "@helpers/formatDate";
import { formatPrice } from "@helpers/formatPrice";
import { orderStatus } from "@const/status";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteOrder,
  updateStatusOrderByAdmin,
} from "@redux/order/order.thunk";
import { useNavigate } from "react-router-dom";
import OrderCancelByAdmin from "./OrderCancelByAdmin";

const TableOrder = ({
  orders = [],
  isLoading = false,
  page,
  pageSize,
  totalItems,
  setPaginate,
  refetch,
}) => {
  const { socketAdmin: socket } = useSelector((state) => state.socket);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openCancel, setOpenCancel] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);

  const columns = useMemo(
    () => [
      {
        title: "STT",
        key: "stt",
        width: 60,
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "Mã đơn hàng",
        dataIndex: "_id",
        key: "_id",
        width: 100,
        render: (text) => (
          <Tooltip title={text}>
            <div className="uppercase max-w-64 break-words font-medium truncate-2-lines text-sm">
              OD{text}
            </div>
          </Tooltip>
        ),
      },
      {
        title: "Khách hàng",
        dataIndex: ["userId", "name"], // Sử dụng array để truy cập nested object
        key: "customerName",
        width: 150,
        render: (text, record) => (
          <Tooltip title={record.userId?.name || "N/A"}>
            <div className="max-w-64 break-words font-medium truncate-2-lines text-sm">
              {record.userId?.name || "N/A"}
            </div>
          </Tooltip>
        ),
      },
      {
        title: "Thanh toán",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
        width: 100,
        render: (paymentMethod) => (
          <Tag
            color={
              paymentMethod === "cod"
                ? "#f50"
                : paymentMethod === "stripe"
                  ? "#ad53ef"
                  : "#87d068"
            }
            className="uppercase"
          >
            {paymentMethod}
          </Tag>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 200,
        render: (status, record) => {
          // Xác định các option có thể chọn dựa trên trạng thái hiện tại
          const getAvailableOptions = (currentStatus) => {
            switch (currentStatus) {
              case "pending":
                return orderStatus.filter(item =>
                  ["pending", "processing", "cancelled"].includes(item.value)
                );
              case "processing":
                return orderStatus.filter(item =>
                  ["processing", "cancelled"].includes(item.value)
                );
              case "shipping":
                return orderStatus.filter(item =>
                  ["shipping", "delivered", "cancelled"].includes(item.value)
                );
              case "delivered":
              case "cancelled":
                return orderStatus.filter(item => item.value === currentStatus);
              default:
                return orderStatus;
            }
          };

          const availableOptions = getAvailableOptions(status);
          const isDisabled = status === "cancelled" || status === "delivered";

          return (
            <div className="flex items-center gap-2">
              <Select
                className="flex-1"
                disabled={isDisabled}
                value={status}
                onChange={(value) =>
                  handleUpdateStatus({ order: record, status: value })
                }
              >
                {availableOptions.map((item, index) => (
                  <Select.Option key={index} value={item.value}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
              {status === "processing" && (
                <Tooltip title="Lấy hàng">
                  <button
                    onClick={() => handlePickupOrder(record)}
                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
                  >
                    Lấy hàng
                  </button>
                </Tooltip>
              )}
            </div>
          );
        },
      },
      {
        title: "Tổng tiền",
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: 120,
        render: (totalAmount) => (
          <p className="font-medium text-[#820813]">
            {formatPrice(totalAmount)} đ
          </p>
        ),
      },
      {
        title: "Ngày đặt",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 150,
        render: (createdAt) => (
          <span className="text-sm">{formatDateOrder(createdAt)}</span>
        ),
      },
      {
        title: "Thao Tác",
        key: "action",
        width: 100,
        fixed: "right",
        render: (_, record) => (
          <div className="flex gap-2 items-center text-[#00246a]">
            <Tooltip title="Xem">
              <button
                onClick={() => navigate(`/admin/orders/${record._id}`)}
                className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
              >
                <FaEye />
              </button>
            </Tooltip>
            <Popconfirm
              className="max-w-40"
              placement="topLeft"
              title={"Xác nhận xóa thông tin đơn hàng"}
              onConfirm={() => removeOrder(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{
                loading: isLoading,
              }}
              destroyTooltipOnHide={true}
            >
              <Tooltip title="Xóa">
                <button className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors">
                  <MdOutlineDeleteOutline />
                </button>
              </Tooltip>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [page, pageSize]
  );

  const handleUpdateStatus = async ({ status, order }) => {
    if (status === "cancelled") {
      setOrderDetail(order);
      setOpenCancel(true);
      return;
    }

    const res = await dispatch(
      updateStatusOrderByAdmin({ id: order._id, data: { status } })
    ).unwrap();

    if (res.success) {
      socket?.emit(
        "updateOrderStatus",
        JSON.stringify({
          recipient: order.userId._id,
          model: "User",
          order: res.data,
        })
      );
      message.success(res.message);
      refetch();
    }
  };

  const handlePickupOrder = (order) => {
    navigate(`/admin/export-order/${order._id}`);
  };

  const removeOrder = async (id) => {
    const res = await dispatch(deleteOrder(id)).unwrap();
    if (res.success) {
      refetch();
      message.success(res.message);
    }
  };

  return (
    <>
      <OrderCancelByAdmin
        {...{
          socket,
          open: openCancel,
          order: orderDetail,
          onClose: (isFetch) => {
            if (isFetch) {
              refetch();
            }
            setOpenCancel(false);
            setOrderDetail(null);
          },
        }}
      />
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
            onChange={(newPage) =>
              setPaginate((prev) => ({ ...prev, page: newPage }))
            }
          />
        </div>
      )}
    </>
  );
};

export default React.memo(TableOrder);
