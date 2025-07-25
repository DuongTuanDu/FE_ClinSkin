// import React, { useEffect, useState } from "react";
// import {
//     Card,
//     Steps,
//     Typography,
//     Tag,
//     Divider,
//     Button,
//     List,
//     Avatar,
// } from "antd";
// import {
//     CheckCircleFilled,
//     ShoppingOutlined,
//     ClockCircleOutlined,
//     CarOutlined,
//     SmileOutlined,
//     ArrowRightOutlined,
// } from "@ant-design/icons";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { formatDateOrder } from "@helpers/formatDate";
// import { formatPrice } from "@helpers/formatPrice";
// import Loading from "@components/Loading/Loading";
// import { orderStripeReturn } from "@/redux/order/order.thunk";
// import { removeProductAfterOrderSuccess } from "@/redux/cart/cart.slice";

// const { Title } = Typography;

// const OrderReturn = () => {
//     const location = useLocation();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const queryParams = new URLSearchParams(location.search);
//     const { orderReturn, isLoading, error } = useSelector((state) => state.order);
//     console.log("orderReturn", orderReturn);


//     const orderId = queryParams.get("vnp_TxnRef");
//     const code = queryParams.get("vnp_ResponseCode");
//     const stripeSessionId = queryParams.get("session_id");
//     const orderSessionId = queryParams.get("order_session") || "";
//     console.log("orderSessionId", orderSessionId);


//     const handleOrderStripeReturn = async () => {
//         const res = await dispatch(
//             orderStripeReturn({ stripeSessionId, orderSessionId })
//         ).unwrap();
//         if (res.success) {
//             const { products } = res.data;
//             if (products.length > 0) {
//                 products.forEach((item) => {
//                     dispatch(
//                         removeProductAfterOrderSuccess({
//                             productId: item.pid,
//                             color: item.color,
//                         })
//                     );
//                 });
//             }
//             setIsSuccess(true);
//             navigate("/order-return");
//         } else {
//             setIsSuccess(false);
//             navigate("/order-return");
//         }
//     };

//     useEffect(() => {
//         if (
//             !orderId &&
//             !code &&
//             !orderReturn._id &&
//             !error.message &&
//             !stripeSessionId &&
//             !orderSessionId
//         ) {
//             navigate("/");
//         }
//     }, [orderReturn._id, orderId, code, error, stripeSessionId, orderSessionId]);

//     useEffect(() => {
//         if (stripeSessionId || orderSessionId) {
//             handleOrderStripeReturn();
//         }
//     }, [stripeSessionId, orderSessionId]);

//     const displayOrder = payload || orderReturn || {};

//     const OrderStatus = () => (
//         <Steps
//             direction="vertical"
//             current={1}
//             className="custom-steps"
//             items={[
//                 {
//                     title: "Đơn hàng đã đặt",
//                     description: displayOrder?.createdAt ? formatDateOrder(displayOrder.createdAt) : "Đang xử lý...",
//                     icon: <ShoppingOutlined />,
//                 },
//                 {
//                     title: "Đang xử lý",
//                     description: "Đơn hàng của bạn đang được xử lý",
//                     icon: <ClockCircleOutlined />,
//                 },
//                 {
//                     title: "Đang giao hàng",
//                     icon: <CarOutlined />,
//                 },
//                 {
//                     title: "Đã giao hàng",
//                     icon: <SmileOutlined />,
//                 },
//             ]}
//         />
//     );

//     const OrderSummary = () => (
//         <List
//             itemLayout="horizontal"
//             dataSource={displayOrder?.products}
//             renderItem={(item) => (
//                 <List.Item>
//                     <List.Item.Meta
//                         avatar={<Avatar src={item.image} shape="square" size={64} />}
//                         title={<span>{item.name}</span>}
//                     // description={`${item.quantity} x ${formatPrice(item.price)} đ`}
//                     />
//                     {/* <div className="font-semibold">
//                         {formatPrice(item.price * item.quantity)} đ
//                     </div> */}
//                 </List.Item>
//             )}
//         />
//     );

//     if (isLoading) {
//         return <Loading />;
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8 rounded-xl">
//             <Card className="max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden">
//                 <div
//                     className="text-center text-pink-600"
//                 >

//                     <CheckCircleFilled style={{ fontSize: 80 }} className="mb-4" />

//                     <div className="text-xl lg:text-3xl text-pink-600">
//                         Đặt hàng thành công!
//                     </div>
//                     <div className="text-gray-600 text-base lg:text-lg">
//                         Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý
//                     </div>
//                 </div>

//                 <>
//                     <Divider className="my-8" />
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         <div className="bg-pink-50 p-6 rounded-lg shadow-md">
//                             <Title level={4} className="text-pink-700 mb-4">
//                                 Thông tin đơn hàng
//                             </Title>
//                             <p className="mb-2">
//                                 <strong>Mã đơn hàng:</strong>{" "}
//                                 <span className="uppercase">OD{orderReturn._id}</span>
//                             </p>
//                             <p className="mb-2">
//                                 <strong>Ngày đặt:</strong>{" "}
//                                 {formatDateOrder(orderReturn.createdAt)}
//                             </p>
//                             <p className="mb-2">
//                                 <strong>Tổng tiền:</strong>{" "}
//                                 <span className="font-semibold">
//                                     {formatPrice(orderReturn.totalAmount)} đ
//                                 </span>
//                             </p>
//                             <p className="mb-2">
//                                 <strong>Phương thức thanh toán:</strong>{" "}
//                                 {orderReturn.paymentMethod}
//                             </p>
//                             <Tag color="pink" className="mt-2">
//                                 {orderReturn.status === "pending" ? "Đang chờ" : ""}
//                             </Tag>
//                         </div>
//                         <div className="bg-purple-50 p-6 rounded-lg shadow-md">
//                             <Title level={4} className="text-purple-700 mb-4">
//                                 Trạng thái đơn hàng
//                             </Title>
//                             <OrderStatus />
//                         </div>
//                     </div>

//                     <Divider className="my-8" />
//                     <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg shadow-md">
//                         <Title level={4} className="text-pink-700 mb-4">
//                             Sản phẩm đã đặt
//                         </Title>
//                         <OrderSummary />
//                     </div>
//                 </>

//                 <Divider className="my-8" />
//                 <div className="flex justify-center gap-4 flex-wrap">
//                     <Link to={`/order-detail/${orderReturn._id}`}>
//                         <Button
//                             type="link"
//                             className="text-lg"
//                             icon={<ArrowRightOutlined />}
//                         >
//                             Chi tiết thông tin đơn hàng
//                         </Button>
//                     </Link>
//                 </div>
//             </Card>
//         </div>
//     );
// };

// export default OrderReturn;


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
import { useDispatch, useSelector } from "react-redux";
import { formatDateOrder } from "@helpers/formatDate";
import { formatPrice } from "@helpers/formatPrice";
import Loading from "@components/Loading/Loading";
import { orderStripeReturn } from "@/redux/order/order.thunk";
import { removeProductAfterOrderSuccess } from "@/redux/cart/cart.slice";

const { Title } = Typography;

const OrderReturn = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const { orderReturn, isLoading, error } = useSelector((state) => state.order);

    console.log("orderReturn", orderReturn);

    // ✅ FIX: Thêm state để track success
    const [isSuccess, setIsSuccess] = useState(false);
    const [payload, setPayload] = useState(null);

    const orderId = queryParams.get("vnp_TxnRef");
    const code = queryParams.get("vnp_ResponseCode");
    const stripeSessionId = queryParams.get("session_id");
    const orderSessionId = queryParams.get("order_id"); // ✅ FIX: Đổi từ order_session sang order_id

    const handleOrderStripeReturn = async () => {
        try {
            console.log("Calling orderStripeReturn with:", { stripeSessionId, orderSessionId });

            const res = await dispatch(
                orderStripeReturn({ stripeSessionId, orderSessionId })
            ).unwrap();

            console.log("orderStripeReturn response:", res);

            if (res.success) {
                const { products } = res.data;
                if (products && products.length > 0) {
                    products.forEach((item) => {
                        dispatch(
                            removeProductAfterOrderSuccess({
                                productId: item.pid, // ✅ FIX: Đổi từ productId sang pid
                                color: item.color,
                            })
                        );
                    });
                }
                setIsSuccess(true);
                setPayload(res.data);
            } else {
                setIsSuccess(false);
                console.error("Order return failed:", res.message);
            }
        } catch (error) {
            console.error("Error in handleOrderStripeReturn:", error);
            setIsSuccess(false);
        }
    };

    useEffect(() => {
        // ✅ FIX: Chỉ redirect khi không có thông tin cần thiết
        if (
            !orderId &&
            !code &&
            !stripeSessionId &&
            !orderSessionId &&
            !orderReturn?._id &&
            !error?.message
        ) {
            console.log("No order info found, redirecting to home");
            navigate("/");
        }
    }, [orderReturn._id, orderId, code, error, stripeSessionId, orderSessionId, navigate]);

    useEffect(() => {
        if (stripeSessionId || orderSessionId) {
            console.log("Processing Stripe return...");
            handleOrderStripeReturn();
        }
    }, [stripeSessionId, orderSessionId]);

    // ✅ FIX: Sử dụng payload hoặc orderReturn, với fallback values
    const displayOrder = payload || orderReturn || {};

    const OrderStatus = () => (
        <Steps
            direction="vertical"
            current={getStepFromStatus(orderReturn?.status)}
            className="custom-steps"
            items={[
                {
                    title: "Đơn hàng đã đặt",
                    description: displayOrder?.createdAt ? formatDateOrder(displayOrder.createdAt) : "Đang xử lý...",
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
            dataSource={displayOrder?.products || []}
            renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={item.image} shape="square" size={64} />}
                        title={<span>{item.name || "Sản phẩm"}</span>}
                        description={`${item.quantity || 0} x ${formatPrice(item.price || 0)} đ`}
                    />
                    <div className="font-semibold">
                        {formatPrice((item.price || 0) * (item.quantity || 0))} đ
                    </div>
                </List.Item>
            )}
        />
    );

    // ✅ FIX: Hiển thị loading khi đang xử lý hoặc chưa có data
    if (isLoading || (!displayOrder._id && (stripeSessionId || orderSessionId))) {
        return <Loading />;
    }

    // ✅ FIX: Hiển thị error state nếu có lỗi
    if (error?.message && !displayOrder._id) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-red-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 rounded-xl">
                <Card className="max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden">
                    <div className="text-center text-red-600">
                        <div className="text-xl lg:text-3xl text-red-600 mb-4">
                            Có lỗi xảy ra!
                        </div>
                        <div className="text-gray-600 text-base lg:text-lg mb-6">
                            {error.message || "Không thể tải thông tin đơn hàng"}
                        </div>
                        <Button
                            type="primary"
                            onClick={() => navigate("/")}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Về trang chủ
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8 rounded-xl">
            <Card className="max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden">
                <div className="text-center text-pink-600">
                    <CheckCircleFilled style={{ fontSize: 80 }} className="mb-4" />
                    <div className="text-xl lg:text-3xl text-pink-600">
                        Đặt hàng thành công!
                    </div>
                    <div className="text-gray-600 text-base lg:text-lg">
                        Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý
                    </div>
                </div>

                {displayOrder._id && (
                    <>
                        <Divider className="my-8" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-pink-50 p-6 rounded-lg shadow-md">
                                <Title level={4} className="text-pink-700 mb-4">
                                    Thông tin đơn hàng
                                </Title>
                                <p className="mb-2">
                                    <strong>Mã đơn hàng:</strong>{" "}
                                    <span className="uppercase">OD{displayOrder._id}</span>
                                </p>
                                <p className="mb-2">
                                    <strong>Ngày đặt:</strong>{" "}
                                    {displayOrder.createdAt ? formatDateOrder(displayOrder.createdAt) : "Đang cập nhật..."}
                                </p>
                                <p className="mb-2">
                                    <strong>Tổng tiền:</strong>{" "}
                                    <span className="font-semibold">
                                        {formatPrice(displayOrder.totalAmount || 0)} đ
                                    </span>
                                </p>
                                <p className="mb-2">
                                    <strong>Phương thức thanh toán:</strong>{" "}
                                    {displayOrder.paymentMethod === "stripe" ? "Stripe" : displayOrder.paymentMethod || "COD"}
                                </p>
                                <Tag color="pink" className="mt-2">
                                    {displayOrder.status === "pending" ? "Đang chờ xử lý" :
                                        displayOrder.status === "confirmed" ? "Đã xác nhận" :
                                            displayOrder.status === "picked_up" ? "Đã lấy hàng" :
                                                displayOrder.status === "in_transit" ? "Đang vận chuyển" :
                                                    displayOrder.status === "carrier_confirmed" ? "Shipper đã xác nhận" :
                                                        displayOrder.status === "failed_pickup" ? "Lấy hàng thất bại" :
                                                            displayOrder.status === "delivery_pending" ? "Đang giao hàng" :
                                                                displayOrder.status === "carrier_delivered" ? "Shipper đã giao hàng" :
                                                                    displayOrder.status === "delivery_failed" ? "Giao hàng thất bại" :
                                                                        displayOrder.status === "delivered_confirmed" ? "Khách hàng đã xác nhận" :
                                                                            displayOrder.status === "return" ? "Trả hàng" :
                                                                                displayOrder.status === "return_confirmed" ? "Đã xác nhận trả hàng" :
                                                                                    displayOrder.status === "cancelled" ? "Đã hủy" : "Đang chờ"}
                                </Tag>
                            </div>

                            <Divider className="my-8" />
                            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg shadow-md">
                                <Title level={4} className="text-pink-700 mb-4">
                                    Sản phẩm đã đặt ({displayOrder.products?.length || 0} sản phẩm)
                                </Title>
                                <OrderSummary />
                            </div>
                        </div>
                    </>
                )}

                <Divider className="my-8" />
                <div className="flex justify-center gap-4 flex-wrap">
                    {displayOrder._id && (
                        <Link to={`/order-detail/${displayOrder._id}`}>
                            <Button
                                type="link"
                                className="text-lg"
                                icon={<ArrowRightOutlined />}
                            >
                                Chi tiết thông tin đơn hàng
                            </Button>
                        </Link>
                    )}
                    <Button
                        type="primary"
                        className="text-lg bg-pink-500 hover:bg-pink-600"
                        onClick={() => navigate("/")}
                    >
                        Tiếp tục mua sắm
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default OrderReturn;