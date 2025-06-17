import React, { useState, useMemo } from "react";
import { Card, Row, Col, Select, Spin, Segmented } from "antd";
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

// Mock data generator
const generateMockData = (query) => {
    const { year, month, type } = query;
    
    // Generate time stats based on type
    const generateTimeStats = () => {
        const stats = [];
        let period = 30; // default for date
        let format = "DD/MM";
        
        if (type === "month") {
            period = 12;
            format = "MM/YYYY";
        } else if (type === "year") {
            period = 5;
            format = "YYYY";
        }
        
        for (let i = 1; i <= period; i++) {
            let name = "";
            let total = Math.floor(Math.random() * 50) + 5; // 5-55 reviews
            let avgRating = (Math.random() * 2 + 3).toFixed(1); // 3.0-5.0 rating
            
            if (type === "date") {
                name = `${i}/${month}`;
            } else if (type === "month") {
                name = `${i}/${year}`;
            } else {
                name = `${year - period + i}`;
            }
            
            // Some days might have no reviews
            if (Math.random() < 0.3) {
                total = 0;
                avgRating = 0;
            }
            
            stats.push({
                name,
                total,
                avgRating: parseFloat(avgRating),
                ratingCounts: {
                    "1": Math.floor(total * 0.05),
                    "2": Math.floor(total * 0.1),
                    "3": Math.floor(total * 0.15),
                    "4": Math.floor(total * 0.3),
                    "5": Math.floor(total * 0.4)
                }
            });
        }
        
        return stats;
    };
    
    // Generate product stats
    const generateProductStats = () => {
        const products = [
            "iPhone 15 Pro Max",
            "Samsung Galaxy S24",
            "MacBook Air M3",
            "AirPods Pro 2",
            "iPad Pro 12.9",
            "Dell XPS 13",
            "Sony WH-1000XM5",
            "Nintendo Switch OLED"
        ];
        
        return products.slice(0, 6).map(name => ({
            name,
            total: Math.floor(Math.random() * 100) + 20,
            avgRating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
            ratingCounts: {
                "1": Math.floor(Math.random() * 5),
                "2": Math.floor(Math.random() * 8),
                "3": Math.floor(Math.random() * 15),
                "4": Math.floor(Math.random() * 30),
                "5": Math.floor(Math.random() * 40)
            }
        }));
    };
    
    // Generate rating distribution
    const generateRatingDistribution = () => {
        return [
            { rating: 1, count: Math.floor(Math.random() * 20) + 5 },
            { rating: 2, count: Math.floor(Math.random() * 30) + 10 },
            { rating: 3, count: Math.floor(Math.random() * 50) + 20 },
            { rating: 4, count: Math.floor(Math.random() * 80) + 40 },
            { rating: 5, count: Math.floor(Math.random() * 100) + 60 }
        ];
    };
    
    const timeStats = generateTimeStats();
    const productStats = generateProductStats();
    const ratingDistribution = generateRatingDistribution();
    
    const totalReviews = timeStats.reduce((sum, item) => sum + item.total, 0);
    const avgRating = totalReviews > 0 
        ? (timeStats.reduce((sum, item) => sum + (item.avgRating * item.total), 0) / totalReviews).toFixed(1)
        : 0;
    
    return {
        timeStats,
        productStats,
        ratingDistribution,
        totals: {
            totalReviews,
            avgRating: parseFloat(avgRating)
        },
        timeRange: {
            start: type === "date" ? `01/${month}/${year}` : 
                   type === "month" ? `01/01/${year}` : 
                   `01/01/${year-4}`,
            end: type === "date" ? `30/${month}/${year}` : 
                 type === "month" ? `31/12/${year}` : 
                 `31/12/${year}`,
            type
        }
    };
};

const StatsReview = () => {
    const [query, setQuery] = useState({
        year: dayjs().year(),
        month: dayjs().month() + 1,
        type: "date",
    });

    // Mock loading state
    const [isLoading] = useState(false);
    
    // Generate mock data based on current query
    const data = useMemo(() => generateMockData(query), [query]);

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