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
        case "confirmed":
            return "blue";
        case "picked_up":
            return "purple";
        case "in_transit":
            return "geekblue";
        case "carrier_confirmed":
            return "green";
        case "failed_pickup":
            return "red";
        case "delivery_pending":
            return "cyan";
        case "carrier_delivered":
            return "lime";
        case "delivery_failed":
            return "magenta";
        case "delivered_confirmed":
            return "green";
        case "return":
            return "volcano";
        case "return_confirmed":
            return "gold";
        case "cancelled":
            return "red";
        default:
            return "default";
    }
};

export const getStatusText = (status) => {
    switch (status) {
        case "pending":
            return "Đang chờ xử lý";
        case "confirmed":
            return "Đã xác nhận";
        case "picked_up":
            return "Đã lấy hàng";
        case "in_transit":
            return "Đang vận chuyển";
        case "carrier_confirmed":
            return "Shipper đã xác nhận";
        case "failed_pickup":
            return "Lấy hàng thất bại";
        case "delivery_pending":
            return "Đang giao hàng";
        case "carrier_delivered":
            return "Shipper đã giao hàng";
        case "delivery_failed":
            return "Giao hàng thất bại";
        case "delivered_confirmed":
            return "Khách hàng đã xác nhận";
        case "return":
            return "Trả hàng";
        case "return_confirmed":
            return "Đã xác nhận trả hàng";
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

/**
 * Check if user can update order status
 * @param {string} currentStatus - Current order status
 * @param {string} newStatus - Desired new status
 * @param {string} userRole - User role: 'user', 'admin', 'shipper'
 * @returns {boolean} - Whether the status update is allowed
 */
export const canUpdateOrderStatus = (currentStatus, newStatus, userRole = 'user') => {
    switch (userRole) {
        case 'user':
            // User can only cancel pending orders and confirm delivery
            if (currentStatus === 'pending' && newStatus === 'cancelled') return true;
            if (currentStatus === 'carrier_delivered' && newStatus === 'delivered_confirmed') return true;
            if (currentStatus === 'carrier_delivered' && newStatus === 'delivery_failed') return true;
            // Allow user to change mind after reporting delivery failure
            if (currentStatus === 'delivery_failed' && newStatus === 'delivered_confirmed') return true;
            if (currentStatus === 'delivery_failed' && newStatus === 'cancelled') return true;
            return false;

        case 'admin':
            // Admin permissions
            if (currentStatus === 'pending' && ['confirmed', 'cancelled'].includes(newStatus)) return true;
            if (currentStatus === 'confirmed' && ['picked_up', 'cancelled'].includes(newStatus)) return true;
            if (currentStatus === 'picked_up' && ['in_transit', 'cancelled'].includes(newStatus)) return true;
            if (currentStatus === 'return' && newStatus === 'return_confirmed') return true;
            return false;

        case 'shipper':
            // Shipping service permissions
            if (currentStatus === 'in_transit' && ['carrier_confirmed', 'failed_pickup'].includes(newStatus)) return true;
            if (currentStatus === 'carrier_confirmed' && newStatus === 'delivery_pending') return true;
            if (currentStatus === 'delivery_pending' && ['carrier_delivered', 'delivery_failed'].includes(newStatus)) return true;
            if (currentStatus === 'delivery_failed' && newStatus === 'return') return true;
            return false;

        default:
            return false;
    }
};

/**
 * Get available status options for a user role
 * @param {string} currentStatus - Current order status
 * @param {string} userRole - User role: 'user', 'admin', 'shipper'
 * @returns {Array} - Array of available status options
 */
export const getAvailableStatusOptions = (currentStatus, userRole = 'user') => {
    const allStatuses = [
        { value: 'pending', label: 'Đang chờ xử lý' },
        { value: 'confirmed', label: 'Đã xác nhận' },
        { value: 'picked_up', label: 'Đã lấy hàng' },
        { value: 'in_transit', label: 'Đang vận chuyển' },
        { value: 'carrier_confirmed', label: 'Shipper đã xác nhận' },
        { value: 'failed_pickup', label: 'Lấy hàng thất bại' },
        { value: 'delivery_pending', label: 'Đang giao hàng' },
        { value: 'carrier_delivered', label: 'Shipper đã giao hàng' },
        { value: 'delivery_failed', label: 'Giao hàng thất bại' },
        { value: 'delivered_confirmed', label: 'Khách hàng đã xác nhận' },
        { value: 'return', label: 'Trả hàng' },
        { value: 'return_confirmed', label: 'Đã xác nhận trả hàng' },
        { value: 'cancelled', label: 'Đã hủy' }
    ];

    return allStatuses.filter(status => 
        canUpdateOrderStatus(currentStatus, status.value, userRole)
    );
};

/**
 * Get status display info for UI
 * @param {string} status - Order status
 * @returns {Object} - Status display information
 */
export const getStatusDisplayInfo = (status) => {
    const statusMap = {
        'pending': { 
            text: 'Đang chờ xử lý', 
            color: '#e3c01c', 
            bgColor: '#FFF3E0',
            description: 'Đơn hàng đang chờ được xác nhận'
        },
        'confirmed': { 
            text: 'Đã xác nhận', 
            color: '#1890ff', 
            bgColor: '#E3F2FD',
            description: 'Đơn hàng đã được xác nhận và chuẩn bị xử lý'
        },
        'picked_up': { 
            text: 'Đã lấy hàng', 
            color: '#fa6024', 
            bgColor: '#F3E5F5',
            description: 'Đơn hàng đã được lấy từ kho'
        },
        'in_transit': { 
            text: 'Đang vận chuyển', 
            color: '#722ed1', 
            bgColor: '#EDE7F6',
            description: 'Đơn hàng đang được vận chuyển'
        },
        'carrier_confirmed': { 
            text: 'Shipper đã xác nhận', 
            color: '#52c41a', 
            bgColor: '#E8F5E9',
            description: 'Shipper đã xác nhận nhận hàng'
        },
        'failed_pickup': { 
            text: 'Lấy hàng thất bại', 
            color: '#ff4d4f', 
            bgColor: '#FFEBEE',
            description: 'Không thể lấy hàng từ kho'
        },
        'delivery_pending': { 
            text: 'Đang giao hàng', 
            color: '#13c2c2', 
            bgColor: '#E0F7FA',
            description: 'Đang giao hàng đến khách hàng'
        },
        'carrier_delivered': { 
            text: 'Shipper đã giao hàng', 
            color: '#faad14', 
            bgColor: '#F1F8E9',
            description: 'Shipper đã giao hàng thành công'
        },
        'delivery_failed': { 
            text: 'Giao hàng thất bại', 
            color: '#ff7875', 
            bgColor: '#FCE4EC',
            description: 'Không thể giao hàng đến khách hàng'
        },
        'delivered_confirmed': { 
            text: 'Khách hàng đã xác nhận', 
            color: '#19c37d', 
            bgColor: '#E8F5E9',
            description: 'Khách hàng đã xác nhận nhận hàng'
        },
        'return': { 
            text: 'Trả hàng', 
            color: '#fa8c16', 
            bgColor: '#FFF3E0',
            description: 'Đơn hàng đang được trả về'
        },
        'return_confirmed': { 
            text: 'Đã xác nhận trả hàng', 
            color: '#d48806', 
            bgColor: '#FFFBF0',
            description: 'Đã xác nhận trả hàng thành công'
        },
        'cancelled': { 
            text: 'Đã hủy', 
            color: '#eb1c26', 
            bgColor: '#FFEBEE',
            description: 'Đơn hàng đã bị hủy'
        }
    };

    return statusMap[status] || { 
        text: status, 
        color: '#666666', 
        bgColor: '#f5f5f5',
        description: 'Trạng thái không xác định'
    };
};