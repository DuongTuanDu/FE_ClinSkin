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
}) => {
    // Format value display
    const formatValue = (val) => {
        if (typeof val !== "number") return val || "0";
        
        if (title.trim() === "Doanh thu" || title.trim() === "Thanh toán thành công") {
            return formatPrice(val);
        }
        if (title.trim() === "Đánh giá") {
            return val.toFixed(1);
        }
        return formatPrice(val);
    };

    // Format subtitle value
    const formatSubValue = (val) => {
        if (typeof val !== "number") return val || "0";
        
        if (subTitle === "Tỷ lệ hoàn thành") {
            return `${val}%`;
        }
        if (subTitle === "Lợi nhuận gộp" || subTitle === "Chờ xử lý") {
            return formatPrice(val);
        }
        return formatPrice(val);
    };

    // Determine if we should show progress circle
    const shouldShowProgress = subTitle === "Tỷ lệ hoàn thành" && typeof subValue === "number" && subValue <= 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card
                bordered={false}
                className="hover:shadow-lg shadow-md cursor-pointer transition-all duration-300 h-full"
                style={{
                    background: `linear-gradient(135deg, ${color}08 0%, white 100%)`,
                    borderLeft: `4px solid ${color}`,
                    borderRadius: "12px",
                }}
                bodyStyle={{ padding: "20px" }}
            >
                <div className="flex justify-between items-start h-full">
                    <div className="flex-grow">
                        {/* Header with icon and title */}
                        <div className="flex items-center gap-3 mb-3">
                            <div 
                                className="p-2 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${color}15` }}
                            >
                                <Icon className="text-xl" style={{ color }} />
                            </div>
                            <span className="font-medium text-gray-700 text-sm">{title}</span>
                        </div>

                        {/* Main value */}
                        <div className="mb-3">
                            <div 
                                className="text-2xl font-bold mb-1"
                                style={{ color }}
                            >
                                {formatValue(value)}
                                {(title.trim() === "Doanh thu" || title.trim() === "Thanh toán thành công") && (
                                    <span className="text-sm font-normal text-gray-500 ml-1">VND</span>
                                )}
                            </div>
                        </div>

                        {/* Subtitle information */}
                        {subTitle && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MdTrendingUp 
                                        className={`text-sm ${
                                            subTitle === "Tỷ lệ hoàn thành" && subValue >= 80 ? "text-green-500" :
                                            subTitle === "Tỷ lệ hoàn thành" && subValue >= 60 ? "text-yellow-500" :
                                            subTitle === "Tỷ lệ hoàn thành" ? "text-red-500" : "text-blue-500"
                                        }`}
                                    />
                                    <span className="text-xs text-gray-500">{subTitle}</span>
                                </div>
                                <span 
                                    className="text-sm font-semibold"
                                    style={{ 
                                        color: subTitle === "Tỷ lệ hoàn thành" && subValue >= 80 ? "#52c41a" :
                                               subTitle === "Tỷ lệ hoàn thành" && subValue >= 60 ? "#faad14" :
                                               subTitle === "Tỷ lệ hoàn thành" ? "#ff4d4f" : color
                                    }}
                                >
                                    {formatSubValue(subValue)}
                                    {(subTitle === "Lợi nhuận gộp" || subTitle === "Chờ xử lý") && (
                                        <span className="text-xs font-normal text-gray-500 ml-1">VND</span>
                                    )}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Progress circle for completion rate */}
                    {shouldShowProgress && (
                        <div className="ml-3">
                            <Progress
                                type="circle"
                                percent={subValue}
                                size={55}
                                strokeColor={{
                                    '0%': subValue >= 80 ? '#52c41a' : subValue >= 60 ? '#faad14' : '#ff4d4f',
                                    '100%': subValue >= 80 ? '#73d13d' : subValue >= 60 ? '#ffc53d' : '#ff7875',
                                }}
                                strokeWidth={6}
                                format={(percent) => (
                                    <span 
                                        className="text-xs font-bold"
                                        style={{ 
                                            color: percent >= 80 ? '#52c41a' : percent >= 60 ? '#faad14' : '#ff4d4f'
                                        }}
                                    >
                                        {percent}%
                                    </span>
                                )}
                            />
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
};

// Main component
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