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
            current={1}
            className="custom-steps"
            items={[
                {
                    title: "Đơn hàng đã đặt",
                    description: formatDateOrder(orderReturn?.createdAt),
                    icon: <ShoppingOutlined />,
                },
                {
                    title: "Đang xử lý",
                    description: "Đơn hàng của bạn đang được xử lý",
                    icon: <ClockCircleOutlined />,
                },
                {
                    title: "Đang giao hàng",
                    icon: <CarOutlined />,
                },
                {
                    title: "Đã giao hàng",
                    icon: <SmileOutlined />,
                },
            ]}
        />
    );

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
                                {orderReturn.status === "pending" ? "Đang chờ" : ""}
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
