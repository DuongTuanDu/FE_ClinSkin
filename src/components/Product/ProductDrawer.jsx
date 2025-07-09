import React, { useState } from "react";
import {
    Rate,
    Tag,
    InputNumber,
    Button,
    Drawer,
    Tooltip,
    Divider,
    notification,
} from "antd";
import { formatPrice } from "@helpers/formatPrice";
import { createAverageRate } from "@utils/createIcon";
import ImageCarousel from "@components/ImageCarousel";
import { LiaShoppingBasketSolid } from "react-icons/lia";
import CustomButton from "../CustomButton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "@/redux/cart/cart.slice";
import { IoNotifications } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import confetti from "canvas-confetti";

const ProductDrawer = ({ open, onClose, product = null }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);

    const discountPercentage = product.promotion?.discountPercentage || 0;
    const discountedPrice = product.promotion
        ? product.finalPrice
        : product.price;

    const openNotification = (productInfo) => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FCD25A", "#FF8C42"],
        });

        notification.success({
            message: (
                <div className="text-base md:text-lg mb-2 animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-rose-700 font-extrabold">
                    Thông báo thêm giỏ hàng thành công
                </div>
            ),
            description: (
                <>
                    <div className="flex items-center space-x-4 mt-4">
                        <div className="relative flex-shrink-0">
                            <img
                                src={productInfo.image}
                                alt={productInfo.name}
                                className="w-24 h-24 object-cover rounded-lg shadow-md transform transition-all duration-300 hover:scale-105"
                            />
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce shadow-lg">
                                <FaCheckCircle className="inline-block mr-1" /> Đã thêm
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="truncate-2-lines text-sm font-semibold mb-2 text-gray-800 line-clamp-2 hover:line-clamp-none transition-all duration-300">
                                {productInfo.name}
                            </h4>
                            {productInfo.color &&
                                Object.keys(productInfo.color).length > 0 && (
                                    <div className="flex items-center mb-2">
                                        <p className="text-xs text-gray-600 mr-2">Màu:</p>
                                        <div
                                            className="w-4 h-4 rounded-full border border-gray-300 shadow-inner"
                                            style={{ backgroundColor: productInfo.color.code }}
                                            title={productInfo.color.name}
                                        ></div>
                                        <span className="ml-1 text-xs text-gray-700 font-bold">
                                            {productInfo.color.name}
                                        </span>
                                    </div>
                                )}
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                    {formatPrice(productInfo.price)} đ
                                </span>
                                <span className="text-sm text-gray-500">
                                    Số lượng: {productInfo.quantity}
                                </span>
                            </div>
                        </div>
                    </div>
                    <CustomButton
                        icon={<LiaShoppingBasketSolid className="mr-2 text-xl" />}
                        onClick={() => {
                            navigate("/cart");
                        }}
                        variant="primary"
                        className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                    >
                        Xem giỏ hàng
                    </CustomButton>
                </>
            ),
            icon: <IoNotifications className="animate-pulse text-[#f59c23]" />,
            placement: "top",
            duration: 5,
            className: "custom-notification",
            style: {
                width: "600px",
            },
        });
    };

    const handleAddToCart = () => {
        const cartItem = {
            productId: product._id,
            name: product.name,
            image: product.mainImage.url,
            price: discountedPrice,
            brand: product.brand.name,
            quantity: quantity,
        };

        dispatch(addToCart(cartItem));
        openNotification(cartItem);
    };

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
                                value={4.5}
                                character={({ index }) =>
                                    createAverageRate({
                                        index: index + 1,
                                        rate: 4.5,
                                        width: "12px",
                                        height: "12px",
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
                        onClick={handleAddToCart}
                    >
                        Thêm vào giỏ hàng
                    </CustomButton>
                </div>
            </div>
        </Drawer>
    );
};

export default ProductDrawer;
