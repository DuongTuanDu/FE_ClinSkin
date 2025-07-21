export const renderPaymentMethod = (method) => {
    switch (method) {
        case "COD":
            return "Thanh toán khi nhận hàng";
        case "STRIPE":
            return "Thanh toán qua Stripe";
        case "VNPAY":
            return "Thanh toán qua VNPay";
        default:
            return method;
    }
};

export const getStatusColor = (status) => {
    switch (status) {
        case "pending":
            return "orange";
        case "processing":
            return "blue";
        case "shipping":
            return "cyan";
        case "delivered":
            return "green";
        case "cancelled":
            return "red";
        default:
            return "default";
    }
};

export const getStatusText = (status) => {
    switch (status) {
        case "pending":
            return "Chờ xác nhận";
        case "processing":
            return "Đang xử lý";
        case "shipping":
            return "Đang giao";
        case "delivered":
            return "Đã giao";
        case "cancelled":
            return "Đã hủy";
        default:
            return status;
    }
};

export const groupProductsByProductId = (products) => {
    const groupedProducts = {};
    products.forEach(product => {
        if (!groupedProducts[product.productId]) {
            groupedProducts[product.productId] = {
                ...product,
                variants: [{ quantity: product.quantity }]
            };
        } else {
            groupedProducts[product.productId].variants.push({ quantity: product.quantity });
            groupedProducts[product.productId].quantity += product.quantity;
        }
    });
    return Object.values(groupedProducts);
};