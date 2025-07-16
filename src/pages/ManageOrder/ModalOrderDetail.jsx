import React from "react";
import { Modal, Descriptions, Tag, Divider, Image, Button } from "antd";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const ModalOrderDetail = ({ open, setOpen, order }) => {
  const navigate = useNavigate();
  
  if (!order) return null;

  const {
    _id,
    userId,
    items = [],
    address = {},
    totalAmount,
    status,
    paymentMethod,
    cancelReason,
    note,
    createdAt,
    stripeSessionId,
  } = order || {};

  const handleGetItems = () => {
    navigate(`/admin/export-order/${_id}`);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      onOk={() => setOpen(false)}
      title={`Chi tiết đơn hàng`}
      footer={
        status === "pending" ? (
          <div className="flex justify-end">
            <Button type="primary" onClick={handleGetItems}>
              Lấy hàng
            </Button>
          </div>
        ) : null
      }
      width={800}
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Khách hàng">
          {userId?.name || "Ẩn danh"}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {userId?.email || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Thanh toán">
          {paymentMethod?.toUpperCase() || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={
            status === "pending"
              ? "orange"
              : status === "shipping"
              ? "blue"
              : status === "delivered"
              ? "green"
              : "red"
          }>
            {status?.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {totalAmount?.toLocaleString("vi-VN")} đ
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {format(new Date(createdAt), "dd/MM/yyyy HH:mm")}
        </Descriptions.Item>
        {note && (
          <Descriptions.Item label="Ghi chú" span={2}>
            {note}
          </Descriptions.Item>
        )}
        {cancelReason && (
          <Descriptions.Item label="Lý do hủy" span={2}>
            {cancelReason}
          </Descriptions.Item>
        )}
      </Descriptions>

      <Divider orientation="left">Địa chỉ giao hàng</Divider>
      <div className="mb-4">
        {address?.detail}, {address?.ward}, {address?.district}, {address?.province}
      </div>

      <Divider orientation="left">Sản phẩm</Divider>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-2 border rounded-md shadow-sm"
          >
            <Image
              width={60}
              height={60}
              src={item?.pid?.mainImage?.url || "https://placehold.co/60x60"}
              alt={item?.pid?.name}
              fallback="https://placehold.co/60x60"
            />
            <div className="flex-1">
              <div className="font-semibold">{item?.pid?.name || "[SP bị xóa]"}</div>
              <div>Giá: {item?.price?.toLocaleString("vi-VN")} đ</div>
              <div>Số lượng: {item?.quantity}</div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ModalOrderDetail;
