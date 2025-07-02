import React, { useState } from "react";
import Slider from "react-slick";
import { defaultProduct } from "@const/defaultProduct";
import { formatPrice } from "@helpers/formatPrice";
import { Badge, Rate, Tag } from "antd";
import { createAverageRate } from "@utils/createIcon";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import ImageCarousel from "@components/ImageCarousel";
import { Link } from "react-router-dom";
import QuickViewOverlay from "./QuickViewOverlay";
import Loading from "../Loading/Loading";
import ProductDrawer from "./ProductDrawer";

const ProductCarousel = ({
  products = defaultProduct,
  isLoading,
  title,
  show = 5,
  auto = true,
  scroll = 1,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const CustomArrow = ({ direction, onClick }) => {
    return (
      <motion.div
        whileHover={{ scale: 1.2, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`absolute top-1/2 -translate-y-1/2 ${direction === "prev" ? "left-4" : "right-4"
          } z-10 cursor-pointer bg-white bg-opacity-70 rounded-full p-3 shadow-lg`}
        onClick={onClick}
      >
        {direction === "prev" ? (
          <FaChevronLeft className="text-gray-800 text-xl" />
        ) : (
          <FaChevronRight className="text-gray-800 text-xl" />
        )}
      </motion.div>
    );
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: show,
    slidesToScroll: scroll,
    autoplay: auto,
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  if (isLoading) return <Loading />;

  if (products.length === 0 && !isLoading) return null;

  const ProductItem = ({ item }) => {
    const discountPercentage = item.promotion
      ? item.promotion.discountPercentage
      : 0;
    const discountedPrice = item.promotion ? item.finalPrice : item.price;

    return (
      <div className="px-2 py-2">
        <div className="cursor-pointer flex flex-col h-full overflow-hidden transition-all duration-300 relative group">
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
          <div className="p-4">
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-extrabold text-sm text-center uppercase">
              {item.brand.name}
            </div>
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
            <div className="flex items-center justify-center gap-2">
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
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative px-6 py-8">
      {open && selectedProduct && (
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mx-auto px-4 pb-6 md:px-8"
      >
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-base lg:text-3xl font-bold text-center text-gray-800 uppercase"
          >
            {title}
          </motion.h2>
        )}
      </motion.div>
      <Slider {...settings}>
        {products.map((item, index) => (
          <ProductItem key={index} item={item} />
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
