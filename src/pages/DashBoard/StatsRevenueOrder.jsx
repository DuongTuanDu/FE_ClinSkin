import React, { useState } from "react";
import dayjs from "@utils/dayjsTz";
import { formatPrice } from "@/helpers/formatPrice";
import { Card, Row, Col, Select, Spin, Empty, Segmented } from "antd";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";

const { Option } = Select;

const StatsRevenueOrder = () => {
    const [query, setQuery] = useState({
        year: dayjs().year(),
        month: dayjs().month() + 1,
        type: "date",
    });

    // Mock data generator based on query type
    const generateMockData = (query) => {
        const { type, year, month } = query;

        if (type === "date") {
            // Generate daily data for the selected month
            const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();
            const stats = [];

            for (let day = 1; day <= daysInMonth; day++) {
                const baseRevenue = Math.random() * 5000000 + 1000000; // 1M - 6M VND
                const totalAmount = baseRevenue * (1.2 + Math.random() * 0.3); // 20-50% markup
                const totalOrders = Math.floor(Math.random() * 25) + 5; // 5-30 orders

                stats.push({
                    name: `${day}/${month}`,
                    totalAmount: Math.round(totalAmount),
                    totalCost: Math.round(baseRevenue),
                    revenue: Math.round(totalAmount - baseRevenue),
                    orders: totalOrders,
                    delivered: Math.floor(totalOrders * (0.7 + Math.random() * 0.2)), // 70-90%
                    pending: Math.floor(totalOrders * (Math.random() * 0.15)), // 0-15%
                    processing: Math.floor(totalOrders * (Math.random() * 0.15)), // 0-15%
                    cancelled: Math.floor(totalOrders * (Math.random() * 0.1)), // 0-10%
                    totalOrders: totalOrders
                });
            }

            return {
                type: "date",
                timeRange: {
                    start: `01/${month}/${year}`,
                    end: `${daysInMonth}/${month}/${year}`
                },
                stats
            };
        } else if (type === "month") {
            // Generate monthly data for the selected year
            const stats = [];

            for (let m = 1; m <= 12; m++) {
                const baseRevenue = Math.random() * 150000000 + 50000000; // 50M - 200M VND
                const totalAmount = baseRevenue * (1.2 + Math.random() * 0.3);
                const totalOrders = Math.floor(Math.random() * 500) + 200; // 200-700 orders

                stats.push({
                    name: `Tháng ${m}`,
                    totalAmount: Math.round(totalAmount),
                    totalCost: Math.round(baseRevenue),
                    revenue: Math.round(totalAmount - baseRevenue),
                    orders: totalOrders,
                    delivered: Math.floor(totalOrders * (0.75 + Math.random() * 0.15)),
                    pending: Math.floor(totalOrders * (Math.random() * 0.1)),
                    processing: Math.floor(totalOrders * (Math.random() * 0.1)),
                    cancelled: Math.floor(totalOrders * (Math.random() * 0.05)),
                    totalOrders: totalOrders
                });
            }

            return {
                type: "month",
                timeRange: {
                    start: `01/01/${year}`,
                    end: `31/12/${year}`
                },
                stats
            };
        } else {
            // Generate yearly data for the last 5 years
            const stats = [];
            const currentYear = dayjs().year();

            for (let i = 4; i >= 0; i--) {
                const y = currentYear - i;
                const baseRevenue = Math.random() * 1000000000 + 500000000; // 500M - 1.5B VND
                const totalAmount = baseRevenue * (1.25 + Math.random() * 0.2);
                const totalOrders = Math.floor(Math.random() * 3000) + 2000; // 2000-5000 orders

                stats.push({
                    name: `${y}`,
                    totalAmount: Math.round(totalAmount),
                    totalCost: Math.round(baseRevenue),
                    revenue: Math.round(totalAmount - baseRevenue),
                    orders: totalOrders,
                    delivered: Math.floor(totalOrders * (0.8 + Math.random() * 0.1)),
                    pending: Math.floor(totalOrders * (Math.random() * 0.05)),
                    processing: Math.floor(totalOrders * (Math.random() * 0.05)),
                    cancelled: Math.floor(totalOrders * (Math.random() * 0.05)),
                    totalOrders: totalOrders
                });
            }

            return {
                type: "year",
                timeRange: {
                    start: `01/01/${currentYear - 4}`,
                    end: `31/12/${currentYear}`
                },
                stats
            };
        }
    };

    // Mock API simulation
    const [isLoading] = useState(false);
    const [error] = useState(null);
    const data = generateMockData(query);

    if ((!isLoading && !data) || error)
        return <Empty description="Đã có lỗi xảy ra" />;

    // Custom Tooltip component
    const CustomRevenueTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 shadow-lg border rounded-lg">
                    <div className="font-medium mb-2">{label}</div>
                    {payload.map((entry, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center gap-4"
                            style={{ color: entry.color }}
                        >
                            <span>{entry.name}:</span>
                            <span className="font-medium">
                                {entry.name === "Số đơn"
                                    ? entry.value
                                    : formatPrice(entry.value) + " VND"}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Custom Tooltip for order status
    const CustomOrderTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 shadow-lg border rounded-lg">
                    <div className="font-medium mb-2">{label}</div>
                    {payload.map((entry, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center gap-4"
                            style={{ color: entry.color }}
                        >
                            <span>{entry.name}:</span>
                            <span className="font-medium">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const { timeRange = {} } = data || {};

    return (
        <Spin spinning={isLoading} tip="Đang tải...">
            {/* Header và Filters */}
            <Card className="mb-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-xl font-bold m-0">Doanh thu & đơn hàng</h2>
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
                <div className="text-gray-500 text-sm">
                    Thời gian: {timeRange?.start} - {timeRange?.end}
                </div>
            </Card>

            {isLoading ? (
                <div className="flex justify-center items-center h-[400px]">
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[16, 16]}>
                    {/* Biểu đồ doanh thu & doanh số */}
                    <Col sm={24} lg={12}>
                        <Card>
                            <div className="mb-4">
                                <div className="flex items-center gap-2">
                                    <MdTrendingUp className="text-[#1677ff] text-xl" />
                                    <span className="font-medium">Doanh thu & Doanh số</span>
                                </div>
                            </div>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data?.stats}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#e55c76"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            height={60}
                                            angle={-30}
                                            textAnchor="end"
                                        />
                                        <YAxis />
                                        <Tooltip content={<CustomRevenueTooltip />} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            name="Doanh thu"
                                            stroke="#f25055"
                                            strokeWidth={3}
                                            dot={true}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="totalAmount"
                                            name="Doanh số"
                                            stroke="#52c41a"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="totalOrders"
                                            name="Số đơn"
                                            stroke="#722ed1"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>

                    {/* Biểu đồ trạng thái đơn hàng */}
                    <Col sm={24} lg={12}>
                        <Card>
                            <div className="mb-4">
                                <div className="flex items-center gap-2">
                                    <MdTrendingDown className="text-[#722ed1] text-xl" />
                                    <span className="font-medium">Trạng thái đơn hàng</span>
                                </div>
                            </div>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data?.stats}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#b7dce7"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            height={60}
                                            angle={-30}
                                            textAnchor="end"
                                        />
                                        <YAxis />
                                        <Tooltip content={<CustomOrderTooltip />} />
                                        <Legend />
                                        <Bar
                                            dataKey="delivered"
                                            name="Hoàn thành"
                                            fill="#52c41a"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="processing"
                                            name="Đang xử lý"
                                            fill="#1677ff"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="cancelled"
                                            name="Đã hủy"
                                            fill="#ff4d4f"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                </Row>
            )}
        </Spin>
    );
};

export default StatsRevenueOrder;