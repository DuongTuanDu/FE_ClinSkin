import React, { useState } from "react";
import { List, Card, Spin, Pagination, Typography, Space } from "antd";
import { groupProductsByProductId } from "@/helpers/order";
import OrderProductItem from "./OrderProductItem";
import OrderInfor from "./OrderInfor";

const { Title } = Typography;

const OrderComplete = ({
  isLoading,
  orders,
  page,
  pageSize,
  totalItems,
  setPaginate,
  refetch,
}) => {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [productDetail, setProductDetail] = useState({});

  return (
    <Spin spinning={isLoading}>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={orders}
        renderItem={(order) => (
          <List.Item>
            <Card
              className="mb-4 sm:mb-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              title={
                <Space className="flex items-center justify-between flex-wrap py-2">
                  <Title level={5}>
                    Đơn hàng: <span className="uppercase">OD{order._id}</span>
                  </Title>
                </Space>
              }
            >
              <List
                itemLayout="horizontal"
                dataSource={groupProductsByProductId(order.products)}
                renderItem={(product) => (
                  <OrderProductItem
                    {...{
                      order,
                      product,
                      setOrderId,
                      setProductDetail,
                      setOpenRate: setOpen,
                    }}
                  />
                )}
              />
              <OrderInfor {...{ order }} />
            </Card>
          </List.Item>
        )}
      />
      {orders.length > 0 && (
        <div className="text-right mt-4">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalItems}
            onChange={(page) => setPaginate((prev) => ({ ...prev, page }))}
            showTotal={(total) => `Tổng ${total} đơn hàng đã hoàn thành`}
          />
        </div>
      )}
    </Spin>
  );
};

export default OrderComplete;
