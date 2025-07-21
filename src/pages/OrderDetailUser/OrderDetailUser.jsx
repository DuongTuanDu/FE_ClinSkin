import { useGetOrderDetailByUserQuery } from "@/redux/order/order.query";
import { Breadcrumb, Timeline, Empty, Card } from "antd";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
    FaMoneyBillWave,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaRegUser,
    FaRegStickyNote,
} from "react-icons/fa";
import dayjs from "@utils/dayjsTz";
import { getStatusColor } from "@/helpers/order";
import { formatPrice } from "@/helpers/formatPrice";
import Loading from "@/components/Loading/Loading";

const getStatusBg = (status) => {
    switch (status) {
        case "pending":
            return "bg-[#FFF3E0] text-[#F57C00]";
        case "processing":
            return "bg-[#E3F2FD] text-[#1976D2]";
        case "shipping":
            return "bg-[#EDE7F6] text-[#5E35B1]";
        case "delivered":
            return "bg-[#E8F5E9] text-[#2E7D32]";
        case "cancelled":
            return "bg-[#FFEBEE] text-[#C62828]";
        default:
            return "bg-gray-100 text-gray-600";
    }
};

const OrderDetailUser = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { id } = useParams();

    const { data, isLoading, error, isFetching } = useGetOrderDetailByUserQuery(
        { id },
        { skip: !isAuthenticated || !id }
    );

    const { data: order = {} } = data || {};
    console.log("order", order);
    

    if (isLoading || isFetching) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Empty description="Không tìm thấy thông tin đơn hàng" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="mx-auto py-8">
                <div className="mb-8">
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Trang chủ</Link> },
                            { title: <Link to="/account?tab=orders">Đơn hàng của tôi</Link> },
                            { title: "Chi tiết đơn hàng" },
                        ]}
                    />
                </div>

                <div className="space-y-8">
                    {/* Order Header */}
                    <Card
                        bordered={false}
                        className="shadow-sm rounded-xl overflow-hidden"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div>
                                <div className="text-gray-500 mb-1">Mã đơn hàng</div>
                                <div className="font-medium uppercase">OD{order._id}</div>
                            </div>
                            <div
                                className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBg(
                                    order.status
                                )}`}
                            >
                                {order.status === "pending" && "Đang chờ xác nhận"}
                                {order.status === "processing" && "Đang xử lý"}
                                {order.status === "shipping" && "Đang giao hàng"}
                                {order.status === "delivered" && "Đã giao hàng"}
                                {order.status === "cancelled" && "Đã hủy"}
                            </div>
                        </div>

                        <Timeline
                            items={order.statusHistory.map((history) => ({
                                color: getStatusColor(history.status),
                                children: (
                                    <div className="pb-4">
                                        <div className="font-medium mb-1">
                                            {history.status === "pending" &&
                                                "Đặt hàng thành công chờ xác nhận"}
                                            {history.status === "processing" &&
                                                "Đơn hàng đang được xử lý"}
                                            {history.status === "shipping" &&
                                                "Đơn hàng đang được giao"}
                                            {history.status === "delivered" && "Giao hàng thành công"}
                                            {history.status === "cancelled" && "Đơn hàng đã bị hủy"}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {dayjs(history.createdAt).format("DD/MM/YYYY HH:mm")}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {history.updatedBy?.name || "Hệ thống"}
                                        </div>
                                    </div>
                                ),
                            }))}
                        />
                    </Card>

                    {/* Products */}
                    <Card
                        bordered={false}
                        className="shadow-sm rounded-xl overflow-hidden"
                    >
                        <div className="space-y-6">
                            {order.products.map((product, index) => (
                                <div
                                    key={index}
                                    className="flex gap-6 p-4 hover:bg-gray-50 rounded-xl transition"
                                >
                                    <div className="w-16 lg:w-24 h-16 lg:h-24 flex-shrink-0">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover rounded-lg shadow-sm"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 mb-2 text-xs lg:text-base">
                                            {product.name}
                                        </h3>
                                        {product.color && (
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="text-gray-500">Màu sắc:</div>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-5 h-5 rounded-full shadow-sm border border-gray-200"
                                                        style={{ backgroundColor: product.color.code }}
                                                    />
                                                    <span className="text-gray-700">
                                                        {product.color.name}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-end">
                                            <div className="text-gray-500">
                                                Số lượng:{" "}
                                                <span className="text-gray-900">
                                                    {product.quantity}
                                                </span>
                                            </div>
                                            <div className="font-medium text-xs lg:text-base">
                                                {formatPrice(product.price)} đ
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="border-t pt-6 mt-6">
                                <div className="flex justify-between items-center">
                                    <div className="text-gray-500">Tổng tiền</div>
                                    <div className="text-base lg:text-lg font-medium">
                                        {formatPrice(order.totalAmount)} đ
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Shipping Info */}
                    <Card
                        bordered={false}
                        className="shadow-sm rounded-xl overflow-hidden"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <FaRegUser className="text-gray-400 mt-1" size={18} />
                                <div>
                                    <div className="text-gray-500 mb-1">Người nhận</div>
                                    <div className="font-medium">{order.name}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FaPhoneAlt className="text-gray-400 mt-1" size={16} />
                                <div>
                                    <div className="text-gray-500 mb-1">Số điện thoại</div>
                                    <div className="font-medium">{order.phone}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-gray-400 mt-1" size={18} />
                                <div>
                                    <div className="text-gray-500 mb-1">Địa chỉ giao hàng</div>
                                    <div>
                                        {order.addressDetail}, {order.address.ward.name}, {order.address.district.name},{" "}
                                        {order.address.province.name}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FaMoneyBillWave className="text-gray-400 mt-1" size={18} />
                                <div>
                                    <div className="text-gray-500 mb-1">
                                        Phương thức thanh toán
                                    </div>
                                    <div className="font-medium">{order.paymentMethod}</div>
                                </div>
                            </div>

                            {order.note && (
                                <div className="flex items-start gap-3">
                                    <FaRegStickyNote className="text-gray-400 mt-1" size={18} />
                                    <div>
                                        <div className="text-gray-500 mb-1">Ghi chú</div>
                                        <div>{order.note}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {order.cancelReason && (
                        <Card bordered={false} className="shadow-sm rounded-xl bg-red-50">
                            <div className="text-red-600 font-medium mb-2">Lý do hủy đơn</div>
                            <div className="text-gray-700">{order.cancelReason}</div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailUser;
