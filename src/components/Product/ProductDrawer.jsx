import React, { useState } from "react";
import {
    Rate,
    Tag,
    InputNumber,
    Button,
    Drawer,
    Tooltip,
    Divider,
} from "antd";
import { formatPrice } from "@helpers/formatPrice";
import { createAverageRate } from "@utils/createIcon";
import ImageCarousel from "@components/ImageCarousel";
import { LiaShoppingBasketSolid } from "react-icons/lia";
import CustomButton from "../CustomButton";

const ProductDrawer = ({ open, onClose, product = null }) => {
    const [selectedColor, setSelectedColor] = useState(
        product.variants?.[0]?.color || {}
    );
    const [quantity, setQuantity] = useState(1);

    const discountPercentage = product.promotion?.discountPercentage || 0;
    const discountedPrice = product.promotion
        ? product.finalPrice
        : product.price;

    return (
        <Drawer open={open} onClose={onClose} width={600} title="Chi tiết sản phẩm">
            <div className="space-y-6">
                <ImageCarousel
                    images={[product.mainImage, ...(product.images || [])].filter(
                        (img) => img && img.url
                    )}
                    name={product.name}
                />

                <div className="space-y-4">
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <Rate
                                disabled
                                character={({ index }) =>
                                    createAverageRate({
                                        index: index + 1,
                                        rate: parseFloat(product.averageRating),
                                        width: "16px",
                                        height: "16px",
                                    })
                                }
                            />
                            <span className="text-sm text-gray-500">
                                ({product.totalReviews} đánh giá)
                            </span>
                        </div>
                        <Button type="link" href={`/detail/${product.slug}`}>
                            Xem thêm
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-red-500">
                            {formatPrice(discountedPrice)}đ
                        </span>
                        {discountPercentage > 0 && (
                            <>
                                <span className="text-gray-500 line-through">
                                    {formatPrice(product.price)}đ
                                </span>
                                <Tag color="red">-{discountPercentage}%</Tag>
                            </>
                        )}
                    </div>

                    {product.variants?.length > 0 && (
                        <div>
                            <h3 className="font-medium mb-2">
                                Màu sắc: {selectedColor.name}
                            </h3>
                            <div className="flex gap-2">
                                {product.variants.map((variant, index) => (
                                    <Tooltip
                                        key={index}
                                        title={`${variant.color.name} - Còn ${variant.quantity} sản phẩm`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full cursor-pointer border-2 ${selectedColor.name === variant.color.name
                                                    ? "border-blue-500"
                                                    : "border-gray-300"
                                                }`}
                                            style={{ backgroundColor: variant.color.code }}
                                            onClick={() => setSelectedColor(variant.color)}
                                        />
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="font-medium mb-2">Số lượng</h3>
                        <div className="flex items-center gap-4">
                            <InputNumber
                                min={1}
                                max={100}
                                value={quantity}
                                onChange={setQuantity}
                                className="w-32"
                            />
                            <span className="text-sm text-gray-500">
                                Còn lại: 10 sản phẩm
                            </span>
                        </div>
                    </div>

                    <Divider />
                    <CustomButton
                        icon={<LiaShoppingBasketSolid className="mr-2 text-xl" />}
                        variant="primary"
                        className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                    >
                        Thêm vào giỏ hàng
                    </CustomButton>
                </div>
            </div>
        </Drawer>
    );
};

export default ProductDrawer;
