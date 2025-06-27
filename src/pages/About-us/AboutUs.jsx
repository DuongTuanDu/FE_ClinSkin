import React from "react";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaStar,
  FaShippingFast,
  FaHandHoldingHeart,
} from "react-icons/fa";
import {
  IoSparkles,
  IoRocket,
  IoLeaf,
} from "react-icons/io5";
import {
  HiSparkles,
  HiHeart,
  HiStar,
} from "react-icons/hi2";
import { Card, Row, Col, Timeline, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { achievements, team, timeline, values } from "./dataSection";

const AboutUs = () => {
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

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 px-4 text-center overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10"></div>
        <motion.div
          className="absolute top-20 left-10 text-pink-300/30"
          variants={floatingVariants}
          animate="animate"
        >
          <IoSparkles className="text-6xl" />
        </motion.div>
        <motion.div
          className="absolute top-32 right-20 text-purple-300/30"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "1s" }}
        >
          <HiSparkles className="text-8xl" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-1/4 text-pink-300/30"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
        >
          <IoLeaf className="text-7xl" />
        </motion.div>

        <div className="container mx-auto relative z-10">
          <motion.div variants={itemVariants}>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="text-6xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-pulse cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  ClinSkin
                </div>
                <motion.div
                  className="absolute -top-4 -right-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <HiStar className="text-4xl text-yellow-400" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed"
            variants={itemVariants}
          >
            Hành trình chăm sóc và bảo vệ làn da khỏe đẹp cho cộng đồng Việt Nam.
          </motion.p>

          <motion.div variants={itemVariants}>
            <motion.button
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
            >
              <FaHandHoldingHeart className="inline mr-2" />
              Khám phá câu chuyện
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        className="py-12 lg:py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Sứ mệnh của ClinSkin
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          <Row gutter={[32, 32]} className="container mx-auto">
            <Col xs={24} lg={12}>
              <motion.div variants={itemVariants}>
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-pink-50">
                  <div className="text-center p-6">
                    <div className="text-6xl mb-6">
                      <IoRocket className="text-purple-500 mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Tầm nhìn</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Trở thành thương hiệu skincare số 1 Việt Nam, mang đến giải pháp
                      chăm sóc da hiệu quả và an toàn cho mọi người.
                    </p>
                  </div>
                </Card>
              </motion.div>
            </Col>

            <Col xs={24} lg={12}>
              <motion.div variants={itemVariants}>
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50">
                  <div className="text-center p-6">
                    <div className="text-6xl mb-6">
                      <HiHeart className="text-pink-500 mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Sứ mệnh</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Cung cấp sản phẩm skincare chất lượng cao, tư vấn chuyên nghiệp
                      và dịch vụ tận tâm để khách hàng có làn da đẹp tự nhiên.
                    </p>
                  </div>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        className="py-16 px-4 bg-gradient-to-r from-pink-50 to-purple-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những giá trị mà ClinSkin luôn theo đuổi và thể hiện trong từng sản phẩm, dịch vụ
            </p>
          </motion.div>

          <Row gutter={[24, 24]} className="container mx-auto">
            {values.map((value, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div variants={itemVariants}>
                  <Card className="h-full min-h-[279px] text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 bg-white/80 backdrop-blur-sm">
                    <div className="p-6">
                      <div className="mb-4 flex justify-center">
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </motion.section>

      {/* Achievements Section */}
      <motion.section
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Thành tựu của chúng tôi
            </h2>
            <p className="text-xl text-gray-600">
              Những con số ấn tượng chứng minh sự tin tưởng của khách hàng
            </p>
          </motion.div>

          <Row gutter={[24, 24]} className="container mx-auto">
            {achievements.map((achievement, index) => (
              <Col xs={12} lg={6} key={index}>
                <motion.div variants={itemVariants}>
                  <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                    <div className="p-6">
                      <motion.div
                        className="text-4xl text-gradient bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4"
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.3 }}
                      >
                        {achievement.icon}
                      </motion.div>
                      <motion.div
                        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        {achievement.number}
                      </motion.div>
                      <p className="text-gray-600 font-medium">
                        {achievement.label}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section
        className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container mx-auto max-w-4xl">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-xl text-gray-600">
              Từ những bước đầu tiên đến thành công ngày hôm nay
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Timeline
              mode="left"
              className="custom-timeline"
              items={timeline.map((item, index) => ({
                dot: (
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center"
                  >
                    <FaStar className="text-white text-xs" />
                  </motion.div>
                ),
                children: (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2">
                      {item.year}
                    </h3>
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {item.content}
                    </p>
                  </motion.div>
                )
              }))}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Đội ngũ chuyên gia
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những chuyên gia hàng đầu trong lĩnh vực skincare và làm đẹp
            </p>
          </motion.div>

          <Row gutter={[32, 32]} className="container mx-auto">
            {team.map((member, index) => (
              <Col xs={24} md={8} key={index}>
                <motion.div variants={itemVariants}>
                  <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 bg-white/90 backdrop-blur-sm">
                    <div className="p-6">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Avatar
                          size={120}
                          src={member.avatar}
                          className="mb-4 border-4 border-gradient-to-r from-pink-500 to-purple-500"
                        />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-semibold mb-3">
                        {member.role}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {member.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <motion.div
          className="absolute top-10 left-10 text-white/20"
          variants={floatingVariants}
          animate="animate"
        >
          <FaHeart className="text-8xl" />
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-10 text-white/20"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "1s" }}
        >
          <IoSparkles className="text-6xl" />
        </motion.div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Hãy để ClinSkin chăm sóc làn da của bạn
            </h2>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Khám phá bộ sưu tập sản phẩm skincare tuyệt vời và nhận tư vấn từ chuyên gia chăm sốc da tốt nhất.
            </p>
            <motion.button
              className="bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
            >
              <FaShippingFast className="inline mr-2" />
              Mua sắm ngay
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;