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
import ModalReasonCancel from "./ModalReasonCancel";
import {
  updateStatusOrderByUser,
} from "@redux/order/order.thunk";
import { useDispatch } from "react-redux";
import OrderInfor from "./OrderInfor";
import OrderProductItem from "./OrderProductItem";
import { groupProductsByProductId } from "@/helpers/order";

const { Title, Text } = Typography;

const OrderAll = ({
  isLoading,
  orders,
  page,
  pageSize,
  totalItems,
  setPaginate,
  refetch
}) => {
  const dispatch = useDispatch();
  const [orderId, setOrderId] = useState("");
  const [productDetail, setProductDetail] = useState({});
  const [openRate, setOpenRate] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);

  const renderOrderActions = (order) => {
    switch (order.status) {
      case "pending":
      case "processing":
        return (
          <Button
            onClick={() => {
              setOrderId(order._id);
              setOpenCancel(true);
            }}
            danger
          >
            Hủy đơn hàng
          </Button>
        );
      case "shipping":
        return (
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
        );
      // case "cancelled":
      //   return <Button >Mua lại</Button>;
      default:
        return <></>;
    }
  };

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
      <ModalReasonCancel
        {...{
          open: openCancel,
          setOpen: setOpenCancel,
          orderId,
          setOrderId,
          refetch,
        }}
      />
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={orders}
        renderItem={(order) => (
          <List.Item>
            <Card
              className="mb-4 sm:mb-6 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              title={
                <Space className="flex items-center justify-between flex-wrap py-2">
                  <div className="font-medium text-xs lg:text-base">
                    Đơn hàng: <span className="uppercase">OD{order._id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderOrderActions(order)}
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
                      setOrderId,
                      setProductDetail,
                      setOpenRate,
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
            onChange={(page) => {
              setPaginate((prev) => ({ ...prev, page }));
            }}
            showTotal={(total) => `Tổng ${total} đơn hàng`}
          />
        </div>
      )}
    </Spin>
  );
};

export default OrderAll;
