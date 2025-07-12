import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, List, Avatar, Select, Spin, Segmented, Tag, Typography } from "antd";
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
import { MdTrendingUp, MdShoppingCart, MdStarRate, MdTrendingDown } from "react-icons/md";
import { FiShoppingBag } from "react-icons/fi";
import { IoTrendingUpOutline, IoTrendingDownOutline } from "react-icons/io5";
import dayjs from "@utils/dayjsTz";
import axiosInstance from "@axios/axios";

const { Option } = Select;
const { Text, Title } = Typography;

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
                            {entry.dataKey === "revenue" || entry.dataKey === "grossProfit"
                                ? new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(entry.value)
                                : entry.dataKey === "sales"
                                ? `${entry.value} sản phẩm`
                                : `${entry.value} đơn`
                            }
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const StatsBestSellingProducts = () => {
    const [query, setQuery] = useState({
        year: dayjs().year(),
        month: dayjs().month() + 1,
        type: "month", // month or year
    });

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [loadingChart, setLoadingChart] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [summary, setSummary] = useState(null);

    // API call function for chart data
    const fetchProductChartData = async (productId, year, type = "month") => {
        try {
            setLoadingChart(true);
            
            const apiUrl = type === "year" 
                ? `/admin/dashboard/product-chart/${productId}/five-years`
                : `/admin/dashboard/product-chart/${productId}/${year}`;
            
            const response = await axiosInstance.get(apiUrl);
            
            if (response.success) {
                if (type === "year") {
                    // Transform yearly data to chart format
                    const yearlyChartData = response.data.yearlyData.map(item => ({
                        month: `Năm ${item.year}`,
                        sales: item.totalQuantity,
                        revenue: item.totalRevenue,
                        grossProfit: item.grossProfit,
                        totalOrders: item.totalOrders
                    }));
                    
                    setChartData({
                        monthly: yearlyChartData,
                        productInfo: response.data.productInfo,
                        yearSummary: response.data.fiveYearSummary,
                        yearRange: response.data.yearRange
                    });
                } else {
                    // Transform monthly data to chart format
                    const monthlyChartData = response.data.monthlyData.map(item => ({
                        month: `Tháng ${item.month}`,
                        sales: item.totalQuantity,
                        revenue: item.totalRevenue,
                        grossProfit: item.grossProfit,
                        totalOrders: item.totalOrders
                    }));
                    
                    setChartData({
                        monthly: monthlyChartData,
                        productInfo: response.data.productInfo,
                        yearSummary: response.data.yearSummary
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching product chart data:", error);
            setChartData(null);
        } finally {
            setLoadingChart(false);
        }
    };

    // API call function
    const fetchBestSellingProducts = async (year, month, page = 1, isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setIsLoading(true);
                setDisplayedProducts([]); // Reset khi thay đổi query
            }
            
            // Build API URL based on query type
            const apiUrl = query.type === "month" 
                ? `/admin/dashboard/best-selling-products/${year}/${month}?page=${page}&limit=10`
                : `/admin/dashboard/best-selling-products/${year}?page=${page}&limit=10`;
            
            const response = await axiosInstance.get(apiUrl);
            
            if (response.success) {
                // Transform API data to component format
                const transformedProducts = response.data.map((item, index) => {
                    // Get data based on query type (month or year)
                    const currentData = query.type === "month" ? item.currentMonth : item.currentYear;
                    
                    return {
                        id: item.productId,
                        name: item.productInfo.name,
                        image: item.productInfo.mainImage?.url || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100",
                        totalSold: currentData.totalQuantity,
                        revenue: currentData.totalRevenue,
                        rating: item.productInfo.ratingCount > 0 
                            ? (item.productInfo.totalRating / item.productInfo.ratingCount).toFixed(1)
                            : 0,
                        ratingCount: item.productInfo.ratingCount || 0,
                        category: item.productInfo.brand || "Chưa phân loại",
                        growthRate: item.comparison.quantityChangePercent || 0,
                        brand: item.productInfo.brand,
                        slug: item.productInfo.slug,
                        price: item.productInfo.price,
                        grossProfit: currentData.grossProfit,
                        totalOrders: currentData.totalOrders
                    };
                });

                if (isLoadMore) {
                    // Thêm vào danh sách hiện có
                    setDisplayedProducts(prev => [...prev, ...transformedProducts]);
                } else {
                    // Thay thế danh sách mới
                    setDisplayedProducts(transformedProducts);
                    // Select first product by default khi load trang đầu
                    if (transformedProducts.length > 0) {
                        setSelectedProduct(transformedProducts[0]);
                    }
                }
                
                setProducts(prev => isLoadMore ? [...prev, ...transformedProducts] : transformedProducts);
                setPagination(response.pagination);
                setSummary(response.summary);
            }
        } catch (error) {
            console.error("Error fetching best selling products:", error);
            if (!isLoadMore) {
                // Fallback to empty state chỉ khi không phải load more
                setProducts([]);
                setDisplayedProducts([]);
                setSelectedProduct(null);
            }
        } finally {
            setIsLoading(false);
            setLoadingMore(false);
        }
    };

    // Load more function cho infinite scroll
    const loadMore = useCallback(() => {
        if (loadingMore || !pagination.hasNextPage) return;
        
        const nextPage = pagination.currentPage + 1;
        fetchBestSellingProducts(query.year, query.month, nextPage, true);
    }, [query.year, query.month, query.type, pagination.currentPage, pagination.hasNextPage, loadingMore]);

    // Handle infinite scroll
    const handleScroll = useCallback((e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 50) { // 50px buffer
            loadMore();
        }
    }, [loadMore]);

    // Reset pagination và load trang đầu khi query thay đổi
    useEffect(() => {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        fetchBestSellingProducts(query.year, query.month, 1, false);
    }, [query.year, query.month, query.type]);

    // Fetch chart data when selected product and year changes
    useEffect(() => {
        if (selectedProduct) {
            fetchProductChartData(selectedProduct.id, query.year, query.type);
        }
    }, [selectedProduct?.id, query.year, query.type]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        // Fetch chart data for selected product
        fetchProductChartData(product.id, query.year, query.type);
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Serum': 'blue',
            'Kem dưỡng': 'green',
            'Sữa rửa mặt': 'orange',
            'Toner': 'purple',
            'Kem chống nắng': 'red',
            'Essence': 'cyan',
            'Mặt nạ': 'magenta',
            'Oil cleanser': 'volcano'
        };
        return colors[category] || 'default';
    };

    const renderGrowthRate = (growthRate) => {
        const isPositive = growthRate > 0;
        const IconComponent = isPositive ? IoTrendingUpOutline : IoTrendingDownOutline;
        const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
        
        return (
            <div className={`flex items-center gap-1 ${colorClass}`}>
                <IconComponent className="text-sm" />
                <span className="text-xs font-medium">
                    {Math.abs(growthRate).toFixed(1)}%
                </span>
            </div>
        );
    };

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
            {/* Header */}
            <Card className="mb-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-xl font-bold m-0 flex items-center gap-2">
                        <FiShoppingBag className="text-blue-600" />
                        Sản phẩm bán chạy nhất
                    </h2>
                    <div className="flex gap-4 flex-wrap">
                        <Segmented
                            className="w-48"
                            value={query.type}
                            onChange={(value) =>
                                setQuery((prev) => ({ ...prev, type: value }))
                            }
                            options={[
                                { label: "Theo tháng", value: "month" },
                                { label: "Theo năm", value: "year" },
                            ]}
                            block
                        />

                        {query.type === "month" && (
                            <>
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
                            </>
                        )}

                        {query.type === "year" && (
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
                    </div>
                </div>
            </Card>

            {isLoading ? (
                <div className="flex justify-center items-center h-96">
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[24, 16]}>
                    {/* Left: Product List */}
                    <Col xs={24} lg={10}>
                        <Card 
                            title={
                                <div className="flex items-center gap-2">
                                    <MdShoppingCart className="text-green-600" />
                                    <span>Top sản phẩm bán chạy</span>
                                    {summary && (
                                        <span className="text-sm text-gray-500">
                                            ({summary.totalProducts} sản phẩm)
                                        </span>
                                    )}
                                </div>
                            }
                            className="h-full"
                        >
                            <div 
                                className="max-h-96 overflow-y-auto"
                                onScroll={handleScroll}
                            >
                                <List
                                    dataSource={displayedProducts}
                                    renderItem={(product, index) => (
                                        <List.Item
                                            className={`cursor-pointer p-4 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                                                selectedProduct?.id === product.id 
                                                    ? 'bg-blue-50 border-l-4 border-blue-500' 
                                                    : 'border-l-4 border-transparent'
                                            }`}
                                            onClick={() => handleProductSelect(product)}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <div className="relative">
                                                        <Avatar 
                                                            src={product.image} 
                                                            size={64}
                                                            shape="square"
                                                        />
                                                        <div className="absolute -top-2 -left-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                                            {index + 1}
                                                        </div>
                                                    </div>
                                                }
                                                title={
                                                    <div>
                                                        <div className="flex items-center justify-between">
                                                            <Text strong className="text-base">
                                                                {product.name}
                                                            </Text>
                                                            {renderGrowthRate(product.growthRate)}
                                                        </div>
                                                        <div className="mt-1">
                                                            <Tag color={getCategoryColor(product.category)}>
                                                                {product.category}
                                                            </Tag>
                                                        </div>
                                                    </div>
                                                }
                                                description={
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-600">Đã bán:</span>
                                                            <span className="font-medium text-green-600">
                                                                {product.totalSold.toLocaleString()} sản phẩm
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-600">Doanh thu:</span>
                                                            <span className="font-medium text-blue-600">
                                                                {formatPrice(product.revenue)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-600">Lợi nhuận:</span>
                                                            <span className="font-medium text-purple-600">
                                                                {formatPrice(product.grossProfit)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-600">Đơn hàng:</span>
                                                            <span className="font-medium text-orange-600">
                                                                {product.totalOrders} đơn
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-600">Đánh giá:</span>
                                                            <div className="flex items-center gap-1">
                                                                {product.rating > 0 ? (
                                                                    <>
                                                                        <MdStarRate className="text-yellow-500" />
                                                                        <span className="font-medium">{product.rating}</span>
                                                                        <span className="text-xs text-gray-500">
                                                                            ({product.ratingCount})
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-gray-400 text-sm">
                                                                        Chưa có đánh giá
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                                {loadingMore && (
                                    <div className="text-center py-4">
                                        <Spin size="small" />
                                        <div className="text-gray-500 text-sm mt-2">Đang tải thêm...</div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>

                    {/* Right: Chart */}
                    <Col xs={24} lg={14}>
                        <Card 
                            title={
                                selectedProduct ? (
                                    <div>
                                        <Text type="secondary" className="text-sm">
                                            {selectedProduct.name} - {query.type === "month" ? `Năm ${query.year}` : (chartData?.yearRange || "5 năm gần nhất")}
                                        </Text>
                                    </div>
                                ) : "Chọn sản phẩm để xem biểu đồ"
                            }
                            className="h-full"
                        >
                            {selectedProduct ? (
                                loadingChart ? (
                                    <div className="flex justify-center items-center h-96">
                                        <Spin size="large" />
                                    </div>
                                ) : chartData ? (
                                    <>
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2">
                                                <MdTrendingUp className="text-blue-600 text-xl" />
                                                <span className="font-medium">
                                                    {query.type === "month" 
                                                        ? `Biểu đồ bán hàng theo tháng năm ${query.year}`
                                                        : `Biểu đồ bán hàng theo năm (${chartData.yearRange || "5 năm gần nhất"})`
                                                    }
                                                </span>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-600">
                                                Tổng bán: {chartData.yearSummary.totalQuantity.toLocaleString()} sản phẩm | 
                                                Doanh thu: {formatPrice(chartData.yearSummary.totalRevenue)} | 
                                                Lợi nhuận: {formatPrice(chartData.yearSummary.grossProfit)} | 
                                                Đơn hàng: {chartData.yearSummary.totalOrders} đơn
                                            </div>
                                        </div>
                                        <div className="h-96">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={chartData.monthly}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="month"
                                                        height={60}
                                                        tick={<CustomizedAxisTick />}
                                                    />
                                                    <YAxis 
                                                        yAxisId="left" 
                                                        label={{ 
                                                            value: query.type === "month" ? 'Số lượng bán' : 'Số lượng bán', 
                                                            angle: -90, 
                                                            position: 'insideLeft' 
                                                        }}
                                                    />
                                                    <YAxis 
                                                        yAxisId="right" 
                                                        orientation="right"
                                                        label={{ 
                                                            value: 'Doanh thu (VND)', 
                                                            angle: 90, 
                                                            position: 'insideRight',
                                                            offset: 10,
                                                            textAnchor: 'middle'
                                                        }}
                                                    />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Legend />
                                                    <Line
                                                        yAxisId="left"
                                                        type="linear"
                                                        dataKey="sales"
                                                        name="Số lượng bán"
                                                        stroke="#1677ff"
                                                        strokeWidth={2}
                                                    />
                                                    <Line
                                                        yAxisId="right"
                                                        type="linear"
                                                        dataKey="revenue"
                                                        name="Doanh thu"
                                                        stroke="#52c41a"
                                                        strokeWidth={2}
                                                    />
                                                    <Line
                                                        yAxisId="right"
                                                        type="linear"
                                                        dataKey="grossProfit"
                                                        name="Lợi nhuận"
                                                        stroke="#722ed1"
                                                        strokeWidth={2}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-96 text-gray-500">
                                        <div className="text-center">
                                            <MdTrendingDown className="text-6xl mb-4 mx-auto opacity-50" />
                                            <p>Không có dữ liệu biểu đồ cho sản phẩm này</p>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="flex items-center justify-center h-96 text-gray-500">
                                    <div className="text-center">
                                        <MdShoppingCart className="text-6xl mb-4 mx-auto opacity-50" />
                                        <p>Chọn một sản phẩm từ danh sách bên trái để xem biểu đồ thống kê</p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default StatsBestSellingProducts;
