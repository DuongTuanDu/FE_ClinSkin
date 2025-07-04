import React, { useState } from "react";
import { Badge, List, Rate, Skeleton, Tag, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice } from "@helpers/formatPrice";
import { createAverageRate } from "@utils/createIcon";
import ImageCarousel from "@components/ImageCarousel";
import QuickViewOverlay from "./QuickViewOverlay";
import ProductDrawer from "./ProductDrawer";

const ProductListViewMore = ({
    isLoading,
    products = [],
    title = "",
}) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    };

    const renderItem = (item) => {
        const discountPercentage = item.promotion?.discountPercentage || 0;
        const discountedPrice = item.promotion ? item.finalPrice : item.price;

        return (
            <List.Item>
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer flex flex-col h-full relative group"
                >
                    {item.totalQuantity <= 0 ? (
                        <Badge.Ribbon text="Hết hàng" color="red">
                            <div className="relative">
                                <ImageCarousel
                                    images={[item.mainImage, ...(item.images || [])].filter(
                                        (img) => img && img.url
                                    )}
                                    name={item.name}
                                />
                                {discountPercentage > 0 && (
                                    <Tag color="#f50" className="absolute top-2 left-2 z-10">
                                        -{discountPercentage}%
                                    </Tag>
                                )}
                            </div>
                        </Badge.Ribbon>
                    ) : (
                        <div className="relative">
                            <ImageCarousel
                                images={[item.mainImage, ...(item.images || [])].filter(
                                    (img) => img && img.url
                                )}
                                name={item.name}
                            />
                            {discountPercentage > 0 && (
                                <Tag color="#f50" className="absolute top-2 left-2 z-10">
                                    -{discountPercentage}%
                                </Tag>
                            )}
                            <QuickViewOverlay
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProduct(item);
                                    setDrawerVisible(true);
                                }}
                            />
                        </div>
                    )}

                    <div className="pt-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-extrabold text-sm text-center uppercase">
                        {item?.brand?.name || item?.brandInfo?.name}
                    </div>

                    <div className="mt-2 flex-grow">
                        <Link to={`/detail/${item.slug}`}>
                            <h3 className="text-xs line-clamp-2 items-center leading-5">
                                {item.name}
                            </h3>
                        </Link>
                        <div
                            className={`flex items-center ${discountPercentage > 0 ? "justify-between" : "justify-center"
                                } mb-2`}
                        >
                            <span className="font-bold">{formatPrice(discountedPrice)}đ</span>
                            {discountPercentage > 0 && (
                                <span className="text-gray-400 line-through text-sm">
                                    {formatPrice(item.price)}đ
                                </span>
                            )}
                        </div>
                        <div className="py-2 flex items-center justify-center gap-2">
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
                            <span className="font-medium">({item.totalReviews})</span>
                        </div>
                    </div>
                </motion.div>
            </List.Item>
        );
    };

    if (products.length === 0 && !isLoading) {
        return (
            <div className="flex items-center justify-center">
                <div className="space-y-4">
                    <img
                        className="w-80 m-auto"
                        src="https://res.cloudinary.com/dah1iwbdz/image/upload/v1750475580/clinskin_u7acix.gif"
                        alt=""
                    />
                    <div className="text-sm md:text-base italic text-center">
                        Quý khách có thể tham khảo các sản phẩm khác. ClinSkin cảm ơn quý
                        khách ❤️
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, idx) => (
                    <Skeleton key={idx} active className="h-[300px]" />
                ))}
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto px-4 py-8 md:px-8"
        >
            {drawerVisible && selectedProduct && (
                <ProductDrawer
                    {...{
                        open: drawerVisible,
                        product: selectedProduct,
                        onClose: () => {
                            setDrawerVisible(false);
                            setSelectedProduct(null);
                        },
                    }}
                />
            )}
            {title && (
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-base lg:text-2xl font-bold uppercase mb-6 text-center"
                >
                    {title}
                </motion.h2>
            )}
            <List
                loading={isLoading}
                grid={{
                    gutter: [24, 32],
                    xs: 2,
                    sm: 3,
                    md: 4,
                    lg: 5,
                    xl: 5,
                    xxl: 5,
                }}
                dataSource={isLoading ? Array(10).fill({}) : products}
                renderItem={renderItem}
            />

            <div className="mt-8 flex justify-center items-center">
                <button
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center text-base"
                    onClick={() => navigate("/searchProduct")}
                >
                    Xem thêm
                </button>
            </div>
        </motion.div>
    );
};

export default ProductListViewMore;