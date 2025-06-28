import React, { useState, useEffect } from "react";
import dayjs from "@utils/dayjsTz";
import { formatPrice } from "@/helpers/formatPrice";
import { Card, Row, Col, Select, Statistic, Spin, Progress, Empty } from "antd";
import { FaUsers, FaShoppingBag, FaDollarSign } from "react-icons/fa";
import {
    MdPayment,
    MdStarRate,
    MdOutlineInventory,
    MdTrendingUp,
} from "react-icons/md";
import { motion } from "framer-motion";
import axiosInstance from "@/axios/axios";

const { Option } = Select;

const StatCard = ({
    icon: Icon,
    title,
    value,
    subTitle,
    subValue,
    color,
    prefix,
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <Card
            bordered={false}
            className="hover:shadow-lg shadow-md cursor-pointer transition-shadow duration-300"
            style={{
                background: `linear-gradient(135deg, ${color}15 0%, white 100%)`,
                borderTop: `3px solid ${color}`,
            }}
        >
            <div className="flex justify-between">
                <div className="flex-grow">
                    <Statistic
                        title={
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <Icon className="text-xl" style={{ color }} />
                                <span className="font-medium">{title}</span>
                            </div>
                        }
                        value={value}
                        prefix={prefix}
                        valueStyle={{ color: color, fontWeight: "bold" }}
                        formatter={
                            typeof value === "number" && !prefix
                                ? (val) => {
                                    if (
                                        title.trim() === "Doanh thu" ||
                                        title.trim() === "Thanh toán thành công"
                                    ) {
                                        return formatPrice(val) + " VND";
                                    }
                                    return formatPrice(val);
                                }
                                : prefix === "%"
                                ? (val) => `${val}%`
                                : undefined
                        }
                    />
                </div>
                {/* Progress circle for percentage metrics */}
                {subValue && typeof subValue === "number" && subValue <= 100 && (
                    <Progress
                        type="circle"
                        percent={subValue}
                        size={50}
                        strokeColor={color}
                        className="opacity-80"
                    />
                )}
            </div>
            {subTitle && (
                <div className="mt-2 text-gray-500 flex items-center gap-1">
                    <MdTrendingUp className="text-green-500" />
                    {subTitle}:{" "}
                    {typeof subValue === "number" && subValue > 100
                        ? formatPrice(subValue) + " VND"
                        : typeof subValue === "number" && subTitle === "Tỷ lệ hoàn thành"
                        ? subValue + "%"
                        : subValue}
                </div>
            )}
        </Card>
    </motion.div>
);

const StatsOverview = () => {
    const [query, setQuery] = useState({
        year: dayjs().year(),
        month: dayjs().month() + 1,
    });
    const [data, setData] = useState(null);
    const [overallStats, setOverallStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // API call function for monthly statistics
    const fetchMonthlyStatistics = async (year, month) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axiosInstance.get('/admin/dashboard/monthly-statistic', {
                params: {
                    year,
                    month
                }
            });
            if (response.success) {
                setData(response.data);
            } else {
                setError('Failed to fetch monthly data');
            }
        } catch (err) {
            console.error('Error fetching monthly statistics:', err);
            setError(err.message || 'Đã có lỗi xảy ra khi tải dữ liệu tháng');
        } finally {
            setIsLoading(false);
        }
    };

    // API call function for overall statistics
    const fetchOverallStatistics = async () => {
        try {
            const response = await axiosInstance.get('/admin/dashboard/overall-statistic');
            if (response.success) {
                setOverallStats(response.data);
            } else {
                console.error('Failed to fetch overall statistics');
            }
        } catch (err) {
            console.error('Error fetching overall statistics:', err);
        }
    };

    // Fetch data when component mounts or query changes
    useEffect(() => {
        fetchMonthlyStatistics(query.year, query.month);
    }, [query.year, query.month]);

    // Fetch overall statistics on component mount
    useEffect(() => {
        fetchOverallStatistics();
    }, []);

    if ((!isLoading && !data) || error)
        return <Empty description={error || "Đã có lỗi xảy ra"} />;

    // Destructure API data
    const { revenue = {}, orders = {} } = data || {};
    const { inventory = {}, users = {}, reviews = {} } = overallStats || {};

    return (
        <div className="mt-2">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex justify-between items-center flex-wrap"
            >
                <h2 className="text-xl font-bold m-0">Tổng quan</h2>
                <div className="flex gap-4 flex-wrap">
                    <Select
                        value={query.year}
                        onChange={(value) => setQuery((prev) => ({ ...prev, year: value }))}
                        className="w-32"
                        suffixIcon={<MdTrendingUp />}
                    >
                        {[...Array(5)].map((_, i) => (
                            <Option key={i} value={dayjs().year() - i}>
                                Năm {dayjs().year() - i}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        value={query.month}
                        onChange={(value) =>
                            setQuery((prev) => ({ ...prev, month: value }))
                        }
                        className="w-32"
                        suffixIcon={<MdTrendingUp />}
                    >
                        {[...Array(12)].map((_, i) => (
                            <Option key={i + 1} value={i + 1}>
                                Tháng {i + 1}
                            </Option>
                        ))}
                    </Select>
                </div>
            </motion.div>

            {isLoading ? (
                <div className="flex justify-center items-center h-[400px]">
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={8}>
                        <StatCard
                            icon={FaDollarSign}
                            title="Doanh thu"
                            value={revenue?.totalRevenue || 0}
                            subTitle="Lợi nhuận gộp"
                            subValue={revenue?.grossProfit || 0}
                            color="#1677ff"
                        />
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                        <StatCard
                            icon={FaShoppingBag}
                            title="Đơn hàng"
                            value={orders?.totalOrders || 0}
                            subTitle="Tỷ lệ hoàn thành"
                            subValue={orders?.completionRate || 0}
                            color="#52c41a"
                        />
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                        <StatCard
                            icon={MdPayment}
                            title="Thanh toán thành công"
                            value={orders?.totalCompletedAmount || 0}
                            subTitle="Chờ xử lý"
                            subValue={orders?.totalPendingAmount || 0}
                            color="#722ed1"
                        />
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                        <StatCard
                            icon={MdOutlineInventory}
                            title="Sản phẩm"
                            value={inventory?.totalBatches || 0}
                            subTitle="Sắp hết hạn"
                            subValue={inventory?.nearExpiry?.totalBatches || 0}
                            color="#13c2c2"
                        />
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                        <StatCard
                            icon={FaUsers}
                            title="Người dùng"
                            value={users?.totalUsers || 0}
                            subTitle="Mới (30 ngày)"
                            subValue={users?.newUsersLast30Days || 0}
                            color="#fa8c16"
                        />
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                        <StatCard
                            icon={MdStarRate}
                            title="Đánh giá"
                            value={reviews?.averageRating || 0}
                            subTitle="Tổng đánh giá"
                            subValue={reviews?.totalReviews || 0}
                            color="#eb2f96"
                        />
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default StatsOverview;