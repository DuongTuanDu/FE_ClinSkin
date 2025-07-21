import React from "react";
import {
  List,
  Card,
  Button,
  Spin,
  Pagination,
  Typography,
  Space,
  message,
  Popconfirm,
} from "antd";
import { useDispatch } from "react-redux";
import { updateStatusOrderByUser } from "@redux/order/order.thunk";
import OrderProductItem from "./OrderProductItem";
import { groupProductsByProductId } from "@/helpers/order";
import OrderInfor from "./OrderInfor";

const { Title } = Typography;

const OrderShip = ({
  isLoading,
  orders,
  page,
  pageSize,
  totalItems,
  setPaginate,
  refetch,
}) => {
  const dispatch = useDispatch();

  const handleCompleteOrder = async (orderId) => {
    const res = await dispatch(
      updateStatusOrderByUser({
        id: orderId,
        data: {
          status: "delivered",
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
              className="mb-4 sm:mb-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              title={
                <Space className="flex items-center justify-between flex-wrap py-2">
                  <Title level={5}>
                    Đơn hàng: <span className="uppercase">OD{order._id}</span>
                  </Title>
                  <div className="flex items-center gap-2">
                    <Popconfirm
                      className="max-w-40"
                      placement="bottom"
                      title={"Xác nhận giao hàng thành công"}
                      onConfirm={() => handleCompleteOrder(order._id)}
                      okText="Xác nhận"
                      cancelText="Hủy"
                      okButtonProps={{
                        loading: isLoading,
                      }}
                      destroyTooltipOnHide={true}
                    >
                      <Button type="primary">Đã nhận hàng</Button>
                    </Popconfirm>
                  </div>
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
            showTotal={(total) => `Tổng ${total} đơn hàng đang giao`}
          />
        </div>
      )}
    </Spin>
  );
};

export default OrderShip;
