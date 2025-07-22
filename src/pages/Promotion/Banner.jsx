import React from "react";
import { motion } from "framer-motion";
import { HiOutlineGift, HiOutlineClock } from "react-icons/hi";
import { RiPriceTag3Line } from "react-icons/ri";

const Banner = ({ discountPercentage }) => {
  return (
    <div className="relative bg-gradient-to-br from-red-50 via-orange-100 to-red-200 rounded-xl overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-red-300/30 to-orange-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: 1,
          }}
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-200/20 to-red-200/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Content Section */}
          <div className="md:col-span-7 space-y-8 relative z-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="px-4 py-1 bg-red-500 text-white rounded-full text-sm font-medium animate-pulse">
                  Hot deal
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  <motion.span
                    initial={{ backgroundPosition: "0% 50%" }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="capitalize bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-clip-text text-transparent bg-300% pb-2"
                  >
                    Khuyễn mãi khủng chính hãng
                  </motion.span>
                </h1>
                <div className="flex gap-2 items-center">
                  <span className="text-xl md:text-2xl font-bold text-red-600">
                    Giảm đến
                  </span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl md:text-4xl font-bold text-red-600"
                  >
                    {discountPercentage}%
                  </motion.span>
                </div>
                <p className="text-gray-700 text-base max-w-2xl leading-relaxed">
                  Hàng ngàn sản phẩm chăm sóc da cao cấp đang được giảm giá sốc.
                  Nhanh tay săn deal hấp dẫn cùng nhiều quà tặng giá trị.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg"
              >
                <div className="flex justify-center mb-2">
                  <RiPriceTag3Line className="text-2xl text-red-600" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-br from-red-600 to-orange-600 bg-clip-text text-transparent">
                  500+
                </h3>
                <p className="text-sm lg:text-base text-gray-700 font-medium">
                  Sản phẩm sale
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg"
              >
                <div className="flex justify-center mb-2">
                  <HiOutlineGift className="text-2xl text-red-600" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-br from-red-600 to-orange-600 bg-clip-text text-transparent">
                  100+
                </h3>
                <p className="text-sm lg:text-base text-gray-700 font-medium">
                  Quà tặng
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg"
              >
                <div className="flex justify-center mb-2">
                  <HiOutlineClock className="text-2xl text-red-600" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-br from-red-600 to-orange-600 bg-clip-text text-transparent">
                  7
                </h3>
                <p className="text-sm lg:text-base text-gray-700 font-medium">
                  Ngày vàng
                </p>
              </motion.div>
            </div>
          </div>

          {/* Promotion Image Section */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="md:col-span-5 relative z-10 flex items-center justify-center"
          >
            <div className="relative">
              {/* Main Image */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-20"
              >
                {/* Discount Badge */}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-6 -right-6 w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold">
                      -{discountPercentage}%
                    </div>
                    <div className="text-sm">OFF</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 -right-8 w-16 h-16 text-orange-400/30"
              >
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" />
                </svg>
              </motion.div>

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-8 -left-8 w-20 h-20 text-red-400/30"
              >
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="50" cy="50" r="45" />
                  <circle cx="50" cy="50" r="35" fill="white" />
                  <circle cx="50" cy="50" r="25" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Sale Tags */}
      <motion.div
        animate={{ y: [-10, 10], rotate: [-10, 10] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-[20%] right-[5%] text-red-400/50 text-4xl"
      >
        <RiPriceTag3Line />
      </motion.div>

      <motion.div
        animate={{ y: [10, -10], rotate: [10, -10] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-[20%] right-[15%] text-orange-400/50 text-3xl"
      >
        <RiPriceTag3Line />
      </motion.div>
    </div>
  );
};

export default Banner;
