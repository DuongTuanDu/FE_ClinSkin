import React, { useEffect, useState } from "react";
import {
    Card,
    Steps,
    Typography,
    Tag,
    Divider,
    Button,
    List,
    Avatar,
} from "antd";
import {
    CheckCircleFilled,
    ShoppingOutlined,
    ClockCircleOutlined,
    CarOutlined,
    SmileOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDateOrder } from "@helpers/formatDate";
import { formatPrice } from "@helpers/formatPrice";
import Loading from "@components/Loading/Loading";

const { Title } = Typography;

const OrderReturn = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const { orderReturn, isLoading, error } = useSelector((state) => state.order);

    const orderId = queryParams.get("vnp_TxnRef");
    const code = queryParams.get("vnp_ResponseCode");

    useEffect(() => {
        if (
            !orderId &&
            !code &&
            !orderReturn._id &&
            !error.message) {
            navigate("/");
        }
    }, [orderReturn._id, orderId, code, error]);


    const OrderStatus = () => (
        <Steps
            direction="vertical"
            current={getStepFromStatus(orderReturn?.status)}
            className="custom-steps"
            items={[
                {
                    title: "Đơn hàng đã đặt",
                    description: formatDateOrder(orderReturn?.createdAt),
                    icon: <ShoppingOutlined />,
                },
                {
                    title: "Đã xác nhận",
                    description: "Đơn hàng đã được xác nhận",
                    icon: <CheckCircleFilled />,
                },
                {
                    title: "Đã lấy hàng",
                    description: "Đơn hàng đã được lấy từ kho",
                    icon: <ClockCircleOutlined />,
                },
                {
                    title: "Đang vận chuyển",
                    description: "Đơn hàng đang được vận chuyển",
                    icon: <CarOutlined />,
                },
                {
                    title: "Đang giao hàng",
                    description: "Đang giao hàng đến khách hàng",
                    icon: <CarOutlined />,
                },
                {
                    title: "Hoàn thành",
                    description: "Đã giao hàng thành công",
                    icon: <SmileOutlined />,
                },
            ]}
        />
    );

    const getStepFromStatus = (status) => {
        const stepMap = {
            "pending": 0,
            "confirmed": 1,
            "picked_up": 2,
            "in_transit": 3,
            "carrier_confirmed": 3,
            "delivery_pending": 4,
            "carrier_delivered": 5,
            "delivered_confirmed": 5,
            "failed_pickup": 2,
            "delivery_failed": 5, // Show as completed step but with failed state
            "return": 3,
            "return_confirmed": 3,
            "cancelled": 0
        };
        return stepMap[status] || 0;
    };

    const OrderSummary = () => (
        <List
            itemLayout="horizontal"
            dataSource={orderReturn?.products}
            renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={item.image} shape="square" size={64} />}
                        title={<span>{item.name}</span>}
                        description={`${item.quantity} x ${formatPrice(item.price)} đ`}
                    />
                    <div className="font-semibold">
                        {formatPrice(item.price * item.quantity)} đ
                    </div>
                </List.Item>
            )}
        />
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8 rounded-xl">
            <Card className="max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden">
                <div
                    className="text-center text-pink-600"
                >

                    <CheckCircleFilled style={{ fontSize: 80 }} className="mb-4" />

                    <div className="text-xl lg:text-3xl text-pink-600">
                        Đặt hàng thành công!
                    </div>
                    <div className="text-gray-600 text-base lg:text-lg">
                        Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý
                    </div>
                </div>

                <>
                    <Divider className="my-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-pink-50 p-6 rounded-lg shadow-md">
                            <Title level={4} className="text-pink-700 mb-4">
                                Thông tin đơn hàng
                            </Title>
                            <p className="mb-2">
                                <strong>Mã đơn hàng:</strong>{" "}
                                <span className="uppercase">OD{orderReturn._id}</span>
                            </p>
                            <p className="mb-2">
                                <strong>Ngày đặt:</strong>{" "}
                                {formatDateOrder(orderReturn.createdAt)}
                            </p>
                            <p className="mb-2">
                                <strong>Tổng tiền:</strong>{" "}
                                <span className="font-semibold">
                                    {formatPrice(orderReturn.totalAmount)} đ
                                </span>
                            </p>
                            <p className="mb-2">
                                <strong>Phương thức thanh toán:</strong>{" "}
                                {orderReturn.paymentMethod}
                            </p>
                            <Tag color="pink" className="mt-2">
                                {orderReturn.status === "pending" ? "Đang chờ xử lý" : 
                                 orderReturn.status === "confirmed" ? "Đã xác nhận" :
                                 orderReturn.status === "picked_up" ? "Đã lấy hàng" :
                                 orderReturn.status === "in_transit" ? "Đang vận chuyển" :
                                 orderReturn.status === "carrier_confirmed" ? "Shipper đã xác nhận" :
                                 orderReturn.status === "failed_pickup" ? "Lấy hàng thất bại" :
                                 orderReturn.status === "delivery_pending" ? "Đang giao hàng" :
                                 orderReturn.status === "carrier_delivered" ? "Shipper đã giao hàng" :
                                 orderReturn.status === "delivery_failed" ? "Giao hàng thất bại" :
                                 orderReturn.status === "delivered_confirmed" ? "Khách hàng đã xác nhận" :
                                 orderReturn.status === "return" ? "Trả hàng" :
                                 orderReturn.status === "return_confirmed" ? "Đã xác nhận trả hàng" :
                                 orderReturn.status === "cancelled" ? "Đã hủy" : "Đang chờ"}
                            </Tag>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-lg shadow-md">
                            <Title level={4} className="text-purple-700 mb-4">
                                Trạng thái đơn hàng
                            </Title>
                            <OrderStatus />
                        </div>
                    </div>

                    <Divider className="my-8" />
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg shadow-md">
                        <Title level={4} className="text-pink-700 mb-4">
                            Sản phẩm đã đặt
                        </Title>
                        <OrderSummary />
                    </div>
                </>

                <Divider className="my-8" />
                <div className="flex justify-center gap-4 flex-wrap">
                    <Link to={`/order-detail/${orderReturn._id}`}>
                        <Button
                            type="link"
                            className="text-lg"
                            icon={<ArrowRightOutlined />}
                        >
                            Chi tiết thông tin đơn hàng
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default OrderReturn;
