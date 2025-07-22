import { motion } from "framer-motion";
import { FaLeaf, FaSpa } from "react-icons/fa";

const Banner = () => {
  return (
    <div className="relative bg-gradient-to-br from-rose-50 via-pink-100 to-rose-200 rounded-xl overflow-hidden">
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
          className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-pink-300/30 to-rose-300/30 rounded-full blur-3xl"
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
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Image Section - 4 cols */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative hidden md:block md:col-span-4"
          >
            <div className="relative">
              <img
                src="https://hsv-ecomm-production-bucket.s3.amazonaws.com/bbx/common/cb5cb6d4-8fba-4a1e-9928-b830051329d0.webp"
                className="w-full h-[400px] object-contain rounded-xl relative z-10 shadow-lg"
                alt="Category Banner"
              />
            </div>
          </motion.div>

          {/* Content Section - 8 cols */}
          <div className="md:col-span-8 space-y-8 relative z-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <h2 className="text-rose-600 font-medium text-base">
                  Danh mục sản phẩm
                </h2>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  <motion.span
                    initial={{ backgroundPosition: "0% 50%" }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 bg-clip-text text-transparent bg-300% pb-2"
                  >
                    Chăm Sóc Da Toàn Diện
                  </motion.span>
                </h1>
                <p className="text-gray-700 text-base max-w-2xl leading-relaxed">
                  Khám phá bộ sưu tập sản phẩm chăm sóc da cao cấp từ các thương
                  hiệu uy tín trên thế giới. Mỗi sản phẩm được chọn lọc kỹ càng
                  để mang đến trải nghiệm chăm sóc da tối ưu nhất.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg"
              >
                <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-br from-rose-600 to-pink-600 bg-clip-text text-transparent">
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
                <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-br from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  14+
                </h3>
                <p className="text-sm lg:text-base text-gray-700 font-medium">
                  Danh mục
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center lg:text-2xl p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg"
              >
                <h3 className="text-xl font-bold bg-gradient-to-br from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  1000+
                </h3>
                <p className="text-sm lg:text-base text-gray-700 font-medium">
                  Sản phẩm
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating icons */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-10 right-[15%] text-pink-400/30 text-4xl"
      >
        <FaLeaf />
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-10 right-[25%] text-rose-400/30 text-3xl"
      >
        <FaSpa />
      </motion.div>
    </div>
  );
};

export default Banner;
