import React, { useState } from "react";
import {
  List,
  Card,
  Button,
  Spin,
  Pagination,
  Typography,
  Space,
} from "antd";
import {
  HighlightOutlined,
} from "@ant-design/icons";
import ModalEditShip from "@components/Modal/ModalEditShip"; 
import ModalReasonCancel from "./ModalReasonCancel";
import { groupProductsByProductId } from "@/helpers/order";
import OrderProductItem from "./OrderProductItem";
import OrderInfor from "./OrderInfor";

const { Title } = Typography;

const OrderWait = ({
  isLoading,
  orders,
  page,
  pageSize,
  totalItems,
  setPaginate,
  refetch
}) => {
  const [open, setOpen] = useState(false)
  const [orderItem, setOrderItem] = useState({})
  const [openCancel, setOpenCancel] = useState(false)
  const [orderId, setOrderId] = useState("")

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
          open,
          setOpen,
          order: orderItem,
          refetch
        }}
      />
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={orders}
        renderItem={(order) => (
          <List.Item>
            <Card
              className="mb-4 sm:mb-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              title={
                <Space className="flex items-center justify-between flex-wrap py-2">
                  <Title level={5}>Đơn hàng: <span className="uppercase">OD{order._id}</span></Title>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => {
                      setOrderId(order._id)
                      setOpenCancel(true)
                    }} danger>Hủy đơn hàng</Button>
                    <Button onClick={() => {
                      setOrderItem(order)
                      setOpen(true)
                    }}><HighlightOutlined /></Button>
                  </div>
                </Space>
              }
            >
              <List
                itemLayout="horizontal"
                dataSource={groupProductsByProductId(order.products)}
                renderItem={(product) => (
                  <OrderProductItem {...{
                    order,
                    product,
                  }} />
                )}
              />
               <OrderInfor {...{ order }} />
            </Card>
          </List.Item>
        )}
      />
      {
        orders.length > 0 &&
        <div className="text-right mt-4">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalItems}
            onChange={(page) => setPaginate((prev) => ({ ...prev, page }))}
            showTotal={(total) => `Tổng ${total} đơn hàng chờ xác nhận`}
          />
        </div>
      }
    </Spin>
  );
};

export default OrderWait;
