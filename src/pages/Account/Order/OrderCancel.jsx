import React, { useState } from "react";
import {
  List,
  Card,
  Button,
  Spin,
  Pagination,
  Typography,
  Space,
  Popconfirm,
  message,
} from "antd";
import { useDispatch } from "react-redux";
import { updateStatusOrderByUser } from "@redux/order/order.thunk";
import { groupProductsByProductId } from "@/helpers/order";
import OrderProductItem from "./OrderProductItem";
import OrderInfor from "./OrderInfor";

const { Title } = Typography;

const OrderCancel = ({
  isLoading,
  orders,
  page,
  pageSize,
  totalItems,
  setPaginate,
  refetch,
}) => {
  const dispatch = useDispatch();
  const handleOrderAgain = async (orderId) => {
    const res = await dispatch(
      updateStatusOrderByUser({
        id: orderId,
        data: {
          status: "pending",
        },
      })
    ).unwrap();
    if (res.success) {
      message.success(res.message);
      refetch();
    }
  };

  return (
    <Spin spinning={isLoading}>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={orders}
        renderItem={(order) => (
          <List.Item>
            <Card
              title={
                <Space className="flex items-center justify-between flex-wrap">
                  <Title level={5}>
                    Đơn hàng: <span className="uppercase">OD{order._id}</span>
                  </Title>
                  {/* <div className="flex items-center gap-2">
                    <Popconfirm
                      className="max-w-40"
                      placement="bottom"
                      title={"Xác nhận mua lại ngay"}
                      onConfirm={() => handleOrderAgain(order._id)}
                      okText="Xác nhận"
                      cancelText="Hủy"
                      okButtonProps={{
                        loading: isLoading,
                      }}
                      destroyTooltipOnHide={true}
                    >
                      <Button>Mua lại</Button>
                    </Popconfirm>
                  </div> */}
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
            showTotal={(total) => `Tổng ${total} đơn hàng đã hủy`}
          />
        </div>
      )}
    </Spin>
  );
};

export default OrderCancel;
