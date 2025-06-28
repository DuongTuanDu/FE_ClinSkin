import React, { useState, useEffect } from "react";
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
import axiosInstance from "@/axios/axios";

const { Option } = Select;

const StatsRevenueOrder = () => {
    const [query, setQuery] = useState({
        year: dayjs().year(),
        month: dayjs().month() + 1,
        type: "date",
    });
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch data from API based on query type
    const fetchData = async (query) => {
        try {
            setIsLoading(true);
            setError(null);
            let revenueResponse, orderResponse;

            const { type, year, month } = query;

            if (type === "date") {
                // Daily data - fetch both revenue and order data
                [revenueResponse, orderResponse] = await Promise.all([
                    axiosInstance.get(`/admin/dashboard/revenue/daily/${year}/${month}`),
                    axiosInstance.get(`/admin/dashboard/orders/daily/${year}/${month}`)
                ]);
                
                const { dailyData: revenueData, month: responseMonth, year: responseYear } = revenueResponse.data;
                const { dailyData: orderData } = orderResponse.data;
                
                const orderMap = orderData.reduce((acc, item) => {
                    acc[item.day] = item;
                    return acc;
                }, {});
                
                const stats = revenueData.map(item => {
                    const orderInfo = orderMap[item.day] || {};
                    return {
                        name: `${item.day}/${responseMonth}`,
                        totalAmount: item.totalRevenue,
                        totalCost: item.totalCost,
                        revenue: item.grossProfit,
                        orders: item.totalOrders,
                        delivered: orderInfo.completedOrders || 0,
                        processing: orderInfo.processingOrders || 0,
                        cancelled: orderInfo.cancelledOrders || 0,
                        pending: Math.max(0, item.totalOrders - (orderInfo.completedOrders || 0) - (orderInfo.processingOrders || 0) - (orderInfo.cancelledOrders || 0)),
                        totalOrders: item.totalOrders
                    };
                });

                const daysInMonth = dayjs(`${responseYear}-${responseMonth}`).daysInMonth();
                setData({
                    type: "date",
                    timeRange: {
                        start: `01/${responseMonth}/${responseYear}`,
                        end: `${daysInMonth}/${responseMonth}/${responseYear}`
                    },
                    stats
                });
            } else if (type === "month") {
                // Monthly data - fetch both revenue and order data
                [revenueResponse, orderResponse] = await Promise.all([
                    axiosInstance.get(`/admin/dashboard/revenue/monthly/${year}`),
                    axiosInstance.get(`/admin/dashboard/orders/monthly/${year}`)
                ]);
                
                const { monthlyData: revenueData, year: responseYear } = revenueResponse.data;
                const { monthlyData: orderData } = orderResponse.data;
                
                // Create a map for order data by month for easy lookup
                const orderMap = orderData.reduce((acc, item) => {
                    acc[item.month] = item;
                    return acc;
                }, {});
                
                const stats = revenueData.map(item => {
                    const orderInfo = orderMap[item.month] || {};
                    return {
                        name: `Tháng ${item.month}`,
                        totalAmount: item.totalRevenue,
                        totalCost: item.totalCost,
                        revenue: item.grossProfit,
                        orders: item.totalOrders,
                        delivered: orderInfo.completedOrders || 0,
                        processing: orderInfo.processingOrders || 0,
                        cancelled: orderInfo.cancelledOrders || 0,
                        pending: Math.max(0, item.totalOrders - (orderInfo.completedOrders || 0) - (orderInfo.processingOrders || 0) - (orderInfo.cancelledOrders || 0)),
                        totalOrders: item.totalOrders
                    };
                });

                setData({
                    type: "month",
                    timeRange: {
                        start: `01/01/${responseYear}`,
                        end: `31/12/${responseYear}`
                    },
                    stats
                });
            } else {
                // Yearly data - fetch both revenue and order data
                [revenueResponse, orderResponse] = await Promise.all([
                    axiosInstance.get(`/admin/dashboard/revenue/yearly`),
                    axiosInstance.get(`/admin/dashboard/orders/yearly`)
                ]);
                
                const { yearlyData: revenueData, yearRange } = revenueResponse.data;
                const { yearlyData: orderData } = orderResponse.data;
                
                // Create a map for order data by year for easy lookup
                const orderMap = orderData.reduce((acc, item) => {
                    acc[item.year] = item;
                    return acc;
                }, {});
                
                const stats = revenueData.map(item => {
                    const orderInfo = orderMap[item.year] || {};
                    return {
                        name: `${item.year}`,
                        totalAmount: item.totalRevenue,
                        totalCost: item.totalCost,
                        revenue: item.grossProfit,
                        orders: item.totalOrders,
                        delivered: orderInfo.completedOrders || 0,
                        processing: orderInfo.processingOrders || 0,
                        cancelled: orderInfo.cancelledOrders || 0,
                        pending: Math.max(0, item.totalOrders - (orderInfo.completedOrders || 0) - (orderInfo.processingOrders || 0) - (orderInfo.cancelledOrders || 0)),
                        totalOrders: item.totalOrders
                    };
                });

                const [startYear, endYear] = yearRange.split('-');
                setData({
                    type: "year",
                    timeRange: {
                        start: `01/01/${startYear}`,
                        end: `31/12/${endYear}`
                    },
                    stats
                });
            }
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError(err.response?.data?.message || "Đã có lỗi xảy ra khi tải dữ liệu");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when query changes
    useEffect(() => {
        fetchData(query);
    }, [query]);

    if ((!isLoading && !data) || error)
        return <Empty description={error || "Đã có lỗi xảy ra"} />;

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
                                    <span className="font-medium">Doanh thu & Lợi thuận</span>
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
                                            name="Lợi nhuận gộp"
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