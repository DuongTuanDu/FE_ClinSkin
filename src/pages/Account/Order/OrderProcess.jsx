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
        return { color: "orange", text: "Chờ xác nhận", step: 0 };
      case "processing":
        return { color: "blue", text: "Đang xử lý", step: 1 };
      case "shipping":
        return { color: "cyan", text: "Đang giao", step: 2 };
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
                      <Button onClick={() => {
                        setOrderId(order._id)
                        setOpenCancel(true)
                      }} danger>Hủy đơn hàng</Button>
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
                  <Step title="Chờ xác nhận" icon={<ClockCircleOutlined />} />
                  <Step title="Đang xử lý" icon={<SyncOutlined spin />} />
                  <Step title="Đang giao" icon={<CarOutlined />} />
                  <Step title="Đã giao" icon={<CheckCircleOutlined />} />
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
