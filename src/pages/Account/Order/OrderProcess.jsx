import React, { useState } from "react";
import {
  List,
  Card,
  Spin,
  Pagination,
  Typography,
  Space,
  Steps,
  Button,
} from "antd";
import {
  ClockCircleOutlined,
  SyncOutlined,
  CarOutlined,
  CheckCircleOutlined,
  HighlightOutlined,
} from "@ant-design/icons";
import OrderProductItem from "./OrderProductItem";
import { groupProductsByProductId } from "@/helpers/order";
import OrderInfor from "./OrderInfor";
import ModalEditShip from "@/components/Modal/ModalEditShip";
import ModalReasonCancel from "./ModalReasonCancel";

const { Title } = Typography;
const { Step } = Steps;

const OrderProcess = ({
  isLoading,
  orders,
  page,
  pageSize,
  totalItems,
  setPaginate,
  refetch,
}) => {
  const [order, setOrder] = useState({});
  const [openOrder, setOpenEdit] = useState(false);
  const [openCancel, setOpenCancel] = useState(false)
  const [orderId, setOrderId] = useState("")

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return { color: "orange", text: "Đang chờ xử lý", step: 0 };
      case "confirmed":
        return { color: "blue", text: "Đã xác nhận", step: 1 };
      case "picked_up":
        return { color: "purple", text: "Đã lấy hàng", step: 2 };
      case "in_transit":
        return { color: "geekblue", text: "Đang vận chuyển", step: 3 };
      case "carrier_confirmed":
        return { color: "green", text: "Shipper đã xác nhận", step: 3 };
      case "delivery_pending":
        return { color: "cyan", text: "Đang giao hàng", step: 4 };
      default:
        return { color: "default", text: status, step: 0 };
    }
  };

  return (
    <Spin spinning={isLoading}>
      <ModalReasonCancel {...{
        open: openCancel,
        setOpen: setOpenCancel,
        orderId,
        setOrderId,
        refetch
      }} />
      <ModalEditShip
        {...{
          open: openOrder,
          setOpen: setOpenEdit,
          order,
          refetch,
        }}
      />
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={orders}
        renderItem={(order) => {
          const { color, text, step } = getStatusInfo(order.status);
          return (
            <List.Item>
              <Card
                className="mb-4 sm:mb-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                title={
                  <Space className="flex items-center justify-between flex-wrap py-2">
                    <Title level={5}>
                      Đơn hàng: <span className="uppercase">OD{order._id}</span>
                    </Title>
                    <div className="flex items-center gap-2">
                      {(order.status === "pending" || order.status === "confirmed") && (
                        <Button onClick={() => {
                          setOrderId(order._id)
                          setOpenCancel(true)
                        }} danger>Hủy đơn hàng</Button>
                      )}
                      <Button
                        onClick={() => {
                          setOrder(order);
                          setOpenEdit(true);
                        }}
                      >
                        <HighlightOutlined />
                      </Button>
                    </div>
                  </Space>
                }
              >
                <Steps current={step} size="small" className="mb-4">
                  <Step title="Đang chờ xử lý" icon={<ClockCircleOutlined />} />
                  <Step title="Đã xác nhận" icon={<CheckCircleOutlined />} />
                  <Step title="Đã lấy hàng" icon={<SyncOutlined />} />
                  <Step title="Đang vận chuyển" icon={<CarOutlined />} />
                  <Step title="Đang giao hàng" icon={<CarOutlined />} />
                  <Step title="Hoàn thành" icon={<CheckCircleOutlined />} />
                </Steps>
                <List
                  itemLayout="horizontal"
                  dataSource={groupProductsByProductId(order.products)}
                  renderItem={(product) => (
                    <OrderProductItem
                      {...{
                        order,
                        product,
                      }}
                    />
                  )}
                />
                <OrderInfor {...{ order }} />
              </Card>
            </List.Item>
          );
        }}
      />
      {orders.length > 0 && (
        <div className="text-right mt-4">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalItems}
            onChange={(page) => setPaginate((prev) => ({ ...prev, page }))}
            showTotal={(total) => `Tổng ${total} đơn hàng đang xử lý`}
          />
        </div>
      )}
    </Spin>
  );
};

export default OrderProcess;
