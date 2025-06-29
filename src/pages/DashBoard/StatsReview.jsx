import React, { useState, useEffect } from "react";
import { Card, Row, Col, Select, Spin, Segmented, message } from "antd";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { MdStarRate, MdTrendingUp } from "react-icons/md";
import dayjs from "@utils/dayjsTz";
import axiosInstance from "@axios/axios";

const { Option } = Select;

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 shadow-lg border rounded-lg min-w-[200px]">
                <p className="font-medium mb-2 text-gray-800 truncate max-w-[250px]">
                    {label}
                </p>
                {payload.map((entry, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between gap-4"
                        style={{ color: entry.color }}
                    >
                        <span className="text-gray-600">{entry.name}:</span>
                        <span className="font-medium">
                            {entry.name === "Điểm trung bình"
                                ? Number(entry.value).toFixed(1)
                                : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// API service functions
const fetchReviewsDaily = async (year, month) => {
    try {
        const response = await axiosInstance.get(`/admin/dashboard/reviews/daily/${year}/${month}`);
        return response;
    } catch (error) {
        message.error("Không thể tải dữ liệu đánh giá theo ngày");
        throw error;
    }
};

const fetchReviewsMonthly = async (year) => {
    try {
        const response = await axiosInstance.get(`/admin/dashboard/reviews/monthly/${year}`);
        return response;
    } catch (error) {
        message.error("Không thể tải dữ liệu đánh giá theo tháng");
        throw error;
    }
};

const fetchReviewsYearly = async () => {
    try {
        const response = await axiosInstance.get("/admin/dashboard/reviews/yearly");
        return response;
    } catch (error) {
        message.error("Không thể tải dữ liệu đánh giá theo năm");
        throw error;
    }
};

const StatsReview = () => {
    const [query, setQuery] = useState({
        year: dayjs().year(),
        month: dayjs().month() + 1,
        type: "date",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);

    // Function to transform API data for chart
    const transformData = (apiData, type) => {
        if (!apiData) return { timeStats: [], totals: { totalReviews: 0, avgRating: 0 } };

        let timeStats = [];
        let rawData = [];

        if (type === "date" && apiData.dailyData) {
            rawData = apiData.dailyData;
            timeStats = rawData.map(item => ({
                name: `${item.day}/${query.month}`,
                total: item.totalReviews,
                avgRating: parseFloat(item.averageRating) || 0
            }));
        } else if (type === "month" && apiData.monthlyData) {
            rawData = apiData.monthlyData;
            timeStats = rawData.map(item => ({
                name: `${item.month}/${query.year}`,
                total: item.totalReviews,
                avgRating: parseFloat(item.averageRating) || 0
            }));
        } else if (type === "year" && apiData.yearlyData) {
            rawData = apiData.yearlyData;
            timeStats = rawData.map(item => ({
                name: `${item.year}`,
                total: item.totalReviews,
                avgRating: parseFloat(item.averageRating) || 0
            }));
        }

        const totalReviews = timeStats.reduce((sum, item) => sum + item.total, 0);
        const avgRating = totalReviews > 0 
            ? (timeStats.reduce((sum, item) => sum + (item.avgRating * item.total), 0) / totalReviews).toFixed(1)
            : 0;

        return {
            timeStats,
            totals: {
                totalReviews,
                avgRating: parseFloat(avgRating)
            }
        };
    };

    // Fetch data based on query
    const fetchData = async () => {
        setIsLoading(true);
        try {
            let response;
            
            switch (query.type) {
                case "date":
                    response = await fetchReviewsDaily(query.year, query.month);
                    break;
                case "month":
                    response = await fetchReviewsMonthly(query.year);
                    break;
                case "year":
                    response = await fetchReviewsYearly();
                    break;
                default:
                    response = await fetchReviewsDaily(query.year, query.month);
            }

            if (response.success) {
                const transformedData = transformData(response.data, query.type);
                setData(transformedData);
            }
        } catch (error) {
            console.error("Error fetching review data:", error);
            setData({ timeStats: [], totals: { totalReviews: 0, avgRating: 0 } });
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when query changes
    useEffect(() => {
        fetchData();
    }, [query]);

    const COLORS = ["#52c41a", "#1677ff", "#722ed1", "#faad14", "#f5222d"];

    const CustomizedAxisTick = ({ x, y, payload }) => {
        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="end"
                    fill="#666"
                    transform="rotate(-35)"
                    className="text-xs"
                >
                    {payload.value.length > 25
                        ? `${payload.value.substring(0, 25)}...`
                        : payload.value}
                </text>
            </g>
        );
    };

    return (
        <div className="p-6">
            {/* Filters */}
            <Card className="mb-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-xl font-bold m-0">Đánh giá sản phẩm</h2>
                    <div className="flex gap-4 flex-wrap">
                        <Segmented
                            className="w-64"
                            value={query.type}
                            onChange={(value) =>
                                setQuery((prev) => ({ ...prev, type: value }))
                            }
                            options={[
                                { label: "Ngày", value: "date" },
                                { label: "Tháng", value: "month" },
                                { label: "Năm", value: "year" },
                            ]}
                            block
                        />

                        {query.type !== "year" && (
                            <Select
                                value={query.year}
                                onChange={(value) =>
                                    setQuery((prev) => ({ ...prev, year: value }))
                                }
                                className="w-32"
                                suffixIcon={<MdTrendingUp />}
                            >
                                {[...Array(5)].map((_, i) => (
                                    <Option key={i} value={dayjs().year() - i}>
                                        Năm {dayjs().year() - i}
                                    </Option>
                                ))}
                            </Select>
                        )}

                        {query.type === "date" && (
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
                        )}
                    </div>
                </div>
            </Card>

            {isLoading ? (
                <div className="flex justify-center items-center h-96">
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[16, 16]}>
                    {/* Đánh giá theo thời gian */}
                    <Col span={24}>
                        <Card>
                            <div className="mb-4">
                                <div className="flex items-center gap-2">
                                    <MdStarRate className="text-[#faad14] text-xl" />
                                    <span className="font-medium">Đánh giá theo thời gian</span>
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    Tổng đánh giá: {data?.totals?.totalReviews} | 
                                    Điểm trung bình: {data?.totals?.avgRating}⭐
                                </div>
                            </div>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data?.timeStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="name"
                                            height={60}
                                            tick={<CustomizedAxisTick />}
                                        />
                                        <YAxis 
                                            yAxisId="left" 
                                            domain={[0, 5]}
                                            ticks={[0, 1, 2, 3, 4, 5]}
                                            label={{ value: 'Điểm đánh giá', angle: -90, position: 'insideLeft' }}
                                        />
                                        <YAxis 
                                            yAxisId="right" 
                                            orientation="right"
                                            label={{ value: 'Số lượng đánh giá', angle: 90, position: 'insideRight' }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="avgRating"
                                            name="Điểm trung bình"
                                            stroke="#faad14"
                                            strokeWidth={2}
                                        />
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="total"
                                            name="Số đánh giá"
                                            stroke="#1677ff"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default StatsReview;