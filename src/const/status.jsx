export const orderStatus = [
    {
        id: 1,
        name: "Đang chờ xử lý",
        value: "pending",
        color: "#e3c01c",
    },
    {
        id: 2,
        name: "Đã xác nhận",
        value: "confirmed",
        color: "#1890ff",
    },
    {
        id: 3,
        name: "Đã lấy hàng",
        value: "picked_up",
        color: "#fa6024",
    },
    {
        id: 4,
        name: "Đang vận chuyển",
        value: "in_transit",
        color: "#722ed1",
    },
    {
        id: 5,
        name: "Shipper đã xác nhận",
        value: "carrier_confirmed",
        color: "#52c41a",
    },
    {
        id: 6,
        name: "Lấy hàng thất bại",
        value: "failed_pickup",
        color: "#ff4d4f",
    },
    {
        id: 7,
        name: "Đang giao hàng",
        value: "delivery_pending",
        color: "#13c2c2",
    },
    {
        id: 8,
        name: "Shipper đã giao hàng",
        value: "carrier_delivered",
        color: "#faad14",
    },
    {
        id: 9,
        name: "Giao hàng thất bại",
        value: "delivery_failed",
        color: "#ff7875",
    },
    {
        id: 10,
        name: "Khách hàng đã xác nhận",
        value: "delivered_confirmed",
        color: "#19c37d",
    },
    {
        id: 11,
        name: "Trả hàng",
        value: "return",
        color: "#fa8c16",
    },
    {
        id: 12,
        name: "Đã xác nhận trả hàng",
        value: "return_confirmed",
        color: "#d48806",
    },
    {
        id: 13,
        name: "Đã hủy",
        value: "cancelled",
        color: "#eb1c26",
    },
];

export const bookingStatus = [
    {
        id: 1,
        name: "Đang chờ",
        value: "pending",
        color: "gold",
    },
    {
        id: 2,
        name: "Đã xác nhận",
        value: "confirmed",
        color: "blue",
    },
    {
        id: 3,
        name: "Hoàn thành",
        value: "completed",
        color: "green",
    },
    {
        id: 4,
        name: "Đã hủy",
        value: "cancelled",
        color: "red",
    },
];
