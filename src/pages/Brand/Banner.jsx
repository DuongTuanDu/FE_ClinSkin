import React from "react";
import { motion } from "framer-motion";
import { FiShoppingBag } from "react-icons/fi";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { BiLeaf } from "react-icons/bi";
import CountUp from "./CountUp";

// Banner component
const Banner = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 rounded-xl overflow-hidden">
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
          className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-blue-300/30 to-indigo-300/30 rounded-full blur-3xl"
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
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-200/20 to-blue-200/20 rounded-full blur-3xl"
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
              <div className="space-y-2">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
                  <motion.span
                    initial={{ backgroundPosition: "0% 50%" }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="bg-gradient-to-r from-sky-600 via-blue-500 to-rose-600 bg-clip-text text-transparent bg-300% pb-2"
                  >
                    Các Thương Hiệu Cao Cấp
                  </motion.span>
                </h1>
                <p className="text-gray-700 text-base max-w-2xl leading-relaxed">
                  Khám phá các thương hiệu mỹ phẩm cao cấp đến từ các nước trên
                  thế giới. Chúng tôi cam kết mang đến những sản phẩm chính hãng
                  với chất lượng tốt nhất.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg"
              >
                <div className="flex justify-center mb-2">
                  <FiShoppingBag className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  <CountUp
                    from={0}
                    to={50}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />+
                </h3>
                <p className="text-sm lg:text-base text-gray-700 font-medium">
                  Thương hiệu
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg"
              >
                <div className="flex justify-center mb-2">
                  <HiOutlineBadgeCheck className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  100%
                </h3>
                <p className="text-sm lg:text-base text-gray-700 font-medium">
                  Chính hãng
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg"
              >
                <div className="flex justify-center mb-2">
                  <BiLeaf className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  <CountUp
                    from={500}
                    to={1000}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />+
                </h3>
                <p className="text-sm lg:text-base text-gray-700 font-medium">
                  Sản phẩm
                </p>
              </motion.div>
            </div>
          </div>

          {/* Image Grid Section */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="md:col-span-5 flex flex-col md:flex-row gap-4 relative z-10"
          >
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="md:col-span-5 grid grid-cols gap-4 relative z-10"
            >
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative h-48 rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src="https://image.hsv-tech.io/900x439/bbx/product-collections/eddaefda-c91e-4c6d-83ae-a8425901bf1d.webp"
                  alt="Brand 1"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative h-48 rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src="https://image.hsv-tech.io/900x439/bbx/common/7df65e05-451b-4198-869e-4c76d8b1b8dd.webp"
                  alt="Brand 3"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative h-48 rounded-xl overflow-hidden shadow-lg md:mt-24"
            >
              <img
                src="https://image.hsv-tech.io/900x439/bbx/common/99e0467c-2bfa-466d-8df5-82a4ebe7f8c8.webp"
                alt="Brand 2"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative SVGs */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 right-[10%] w-16 h-16 text-blue-400/30"
      >
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-[30%] w-12 h-12 text-indigo-400/30"
      >
        <svg viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="35" fill="white" />
          <circle cx="50" cy="50" r="25" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 right-[20%] w-20 h-20 text-violet-400/30"
      >
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 L95 25 L95 75 L50 100 L5 75 L5 25 Z" />
          <path d="M50 20 L80 40 L80 70 L50 85 L20 70 L20 40 Z" fill="white" />
        </svg>
      </motion.div>
    </div>
  );
};

export default Banner;
