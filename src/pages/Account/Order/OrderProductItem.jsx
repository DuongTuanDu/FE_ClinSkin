import { formatPrice } from '@/helpers/formatPrice';
import { Button, List, Tooltip, Typography } from 'antd';
import { isEmpty } from 'lodash';
import React from "react";
const { Text } = Typography;

const OrderProductItem = ({
    product,
    setOrderId,
    setProductDetail,
    setOpenRate,
    order,
}) => {
    return (
        <List.Item>
            <List.Item.Meta
                avatar={
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md"
                    />
                }
                title={product.name}
                description={
                    <>
                        <Text>
                            {formatPrice(product.price)} đ x {product.quantity}
                        </Text>
                        <div className="flex gap-2 mt-2">
                            {product.variants.map(
                                (variant, index) =>
                                    !isEmpty(variant.color) && (
                                        <Tooltip
                                            key={index}
                                            title={`${variant.color.name} (x${variant.quantity})`}
                                        >
                                            <div
                                                style={{ backgroundColor: variant.color.code }}
                                                className={`w-6 h-6 rounded-full border border-gray-300`}
                                            />
                                        </Tooltip>
                                    )
                            )}
                        </div>
                    </>
                }
            />
            <div className="flex flex-col items-center justify-end gap-1 flex-wrap">
                {order.status === "delivered_confirmed" && (
                    <Button
                        onClick={() => {
                            setOrderId(order._id);
                            setProductDetail({
                                _id: product.pid,
                                name: product.name,
                                image: product.image,
                            });
                            setOpenRate(true);
                        }}
                        disabled={product.isReviewed}
                    >
                        {product.isReviewed ? "Đã đánh giá" : "Đánh giá"}
                    </Button>
                )}
            </div>
        </List.Item>
    );
};

export default OrderProductItem
