import React from "react";
import {
    CheckCircleFilled
} from "@ant-design/icons";

const OrderReturn = () => {
    return (
        <div className="container mx-auto py-24 px-4 sm:px-6 lg:px-8 rounded-xl">
            <div className={"text-center text-pink-600"}>
                <CheckCircleFilled style={{ fontSize: 80 }} className="mb-4" />
                <div className="text-xl lg:text-3xl text-pink-600">
                    Đặt hàng thành công!
                </div>
                <div className="text-gray-600 text-base lg:text-lg">
                    Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
                </div>
            </div>
        </div>
    );
};

export default OrderReturn;
