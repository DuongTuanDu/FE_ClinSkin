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

const { Option } = Select;
const { Text, Title } = Typography;

// Mock data for testing - Expanded with more products and growth rates
const mockBestSellingProducts = [
    {
        id: 1,
        name: "Serum Vitamin C Advanced",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100",
        totalSold: 1250,
        revenue: 12500000,
        rating: 4.8,
        category: "Serum",
        growthRate: 15.5, // Tỉ lệ tăng so với tháng trước (%)
        monthlySales: [
            { month: "Tháng 1", sales: 95, revenue: 950000 },
            { month: "Tháng 2", sales: 108, revenue: 1080000 },
            { month: "Tháng 3", sales: 120, revenue: 1200000 },
            { month: "Tháng 4", sales: 85, revenue: 850000 },
            { month: "Tháng 5", sales: 140, revenue: 1400000 },
            { month: "Tháng 6", sales: 155, revenue: 1550000 },
            { month: "Tháng 7", sales: 98, revenue: 980000 },
            { month: "Tháng 8", sales: 132, revenue: 1320000 },
            { month: "Tháng 9", sales: 145, revenue: 1450000 },
            { month: "Tháng 10", sales: 88, revenue: 880000 },
            { month: "Tháng 11", sales: 102, revenue: 1020000 },
            { month: "Tháng 12", sales: 182, revenue: 1820000 }
        ],
        yearlySales: [
            { year: "2021", sales: 890, revenue: 8900000 },
            { year: "2022", sales: 1050, revenue: 10500000 },
            { year: "2023", sales: 1180, revenue: 11800000 },
            { year: "2024", sales: 1250, revenue: 12500000 },
            { year: "2025", sales: 650, revenue: 6500000 }
        ]
    },
    {
        id: 2,
        name: "Kem Dưỡng Ẩm Hyaluronic Acid",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100",
        totalSold: 980,
        revenue: 9800000,
        rating: 4.6,
        category: "Kem dưỡng",
        growthRate: -5.2,
        monthlySales: [
            { month: "Tháng 1", sales: 75, revenue: 750000 },
            { month: "Tháng 2", sales: 82, revenue: 820000 },
            { month: "Tháng 3", sales: 90, revenue: 900000 },
            { month: "Tháng 4", sales: 68, revenue: 680000 },
            { month: "Tháng 5", sales: 95, revenue: 950000 },
            { month: "Tháng 6", sales: 110, revenue: 1100000 },
            { month: "Tháng 7", sales: 78, revenue: 780000 },
            { month: "Tháng 8", sales: 85, revenue: 850000 },
            { month: "Tháng 9", sales: 98, revenue: 980000 },
            { month: "Tháng 10", sales: 72, revenue: 720000 },
            { month: "Tháng 11", sales: 88, revenue: 880000 },
            { month: "Tháng 12", sales: 139, revenue: 1390000 }
        ],
        yearlySales: [
            { year: "2021", sales: 780, revenue: 7800000 },
            { year: "2022", sales: 850, revenue: 8500000 },
            { year: "2023", sales: 920, revenue: 9200000 },
            { year: "2024", sales: 980, revenue: 9800000 },
            { year: "2025", sales: 520, revenue: 5200000 }
        ]
    },
    {
        id: 3,
        name: "Sữa Rửa Mặt Gentle Cleanser",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=100",
        totalSold: 850,
        revenue: 6800000,
        rating: 4.4,
        category: "Sữa rửa mặt",
        growthRate: 8.3,
        monthlySales: [
            { month: "Tháng 1", sales: 65, revenue: 520000 },
            { month: "Tháng 2", sales: 70, revenue: 560000 },
            { month: "Tháng 3", sales: 78, revenue: 624000 },
            { month: "Tháng 4", sales: 58, revenue: 464000 },
            { month: "Tháng 5", sales: 82, revenue: 656000 },
            { month: "Tháng 6", sales: 88, revenue: 704000 },
            { month: "Tháng 7", sales: 62, revenue: 496000 },
            { month: "Tháng 8", sales: 75, revenue: 600000 },
            { month: "Tháng 9", sales: 80, revenue: 640000 },
            { month: "Tháng 10", sales: 68, revenue: 544000 },
            { month: "Tháng 11", sales: 72, revenue: 576000 },
            { month: "Tháng 12", sales: 102, revenue: 816000 }
        ],
        yearlySales: [
            { year: "2021", sales: 650, revenue: 5200000 },
            { year: "2022", sales: 720, revenue: 5760000 },
            { year: "2023", sales: 800, revenue: 6400000 },
            { year: "2024", sales: 850, revenue: 6800000 },
            { year: "2025", sales: 450, revenue: 3600000 }
        ]
    },
    {
        id: 4,
        name: "Toner Niacinamide 10%",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100",
        totalSold: 720,
        revenue: 5760000,
        rating: 4.7,
        category: "Toner",
        growthRate: 12.1,
        monthlySales: [
            { month: "Tháng 1", sales: 55, revenue: 440000 },
            { month: "Tháng 2", sales: 62, revenue: 496000 },
            { month: "Tháng 3", sales: 68, revenue: 544000 },
            { month: "Tháng 4", sales: 48, revenue: 384000 },
            { month: "Tháng 5", sales: 72, revenue: 576000 },
            { month: "Tháng 6", sales: 78, revenue: 624000 },
            { month: "Tháng 7", sales: 52, revenue: 416000 },
            { month: "Tháng 8", sales: 65, revenue: 520000 },
            { month: "Tháng 9", sales: 70, revenue: 560000 },
            { month: "Tháng 10", sales: 58, revenue: 464000 },
            { month: "Tháng 11", sales: 62, revenue: 496000 },
            { month: "Tháng 12", sales: 90, revenue: 720000 }
        ],
        yearlySales: [
            { year: "2021", sales: 580, revenue: 4640000 },
            { year: "2022", sales: 620, revenue: 4960000 },
            { year: "2023", sales: 680, revenue: 5440000 },
            { year: "2024", sales: 720, revenue: 5760000 },
            { year: "2025", sales: 380, revenue: 3040000 }
        ]
    },
    {
        id: 5,
        name: "Kem Chống Nắng SPF 50+",
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100",
        totalSold: 650,
        revenue: 9750000,
        rating: 4.5,
        category: "Kem chống nắng",
        growthRate: -3.7,
        monthlySales: [
            { month: "Tháng 1", sales: 35, revenue: 525000 },
            { month: "Tháng 2", sales: 40, revenue: 600000 },
            { month: "Tháng 3", sales: 48, revenue: 720000 },
            { month: "Tháng 4", sales: 65, revenue: 975000 },
            { month: "Tháng 5", sales: 88, revenue: 1320000 },
            { month: "Tháng 6", sales: 95, revenue: 1425000 },
            { month: "Tháng 7", sales: 102, revenue: 1530000 },
            { month: "Tháng 8", sales: 85, revenue: 1275000 },
            { month: "Tháng 9", sales: 62, revenue: 930000 },
            { month: "Tháng 10", sales: 45, revenue: 675000 },
            { month: "Tháng 11", sales: 38, revenue: 570000 },
            { month: "Tháng 12", sales: 47, revenue: 705000 }
        ],
        yearlySales: [
            { year: "2021", sales: 550, revenue: 8250000 },
            { year: "2022", sales: 600, revenue: 9000000 },
            { year: "2023", sales: 620, revenue: 9300000 },
            { year: "2024", sales: 650, revenue: 9750000 },
            { year: "2025", sales: 340, revenue: 5100000 }
        ]
    },
    {
        id: 6,
        name: "Essence Retinol Night Care",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100",
        totalSold: 590,
        revenue: 8850000,
        rating: 4.3,
        category: "Essence",
        growthRate: 6.8,
        monthlySales: [
            { month: "Tháng 1", sales: 45, revenue: 675000 },
            { month: "Tháng 2", sales: 52, revenue: 780000 },
            { month: "Tháng 3", sales: 58, revenue: 870000 },
            { month: "Tháng 4", sales: 42, revenue: 630000 },
            { month: "Tháng 5", sales: 68, revenue: 1020000 },
            { month: "Tháng 6", sales: 75, revenue: 1125000 },
            { month: "Tháng 7", sales: 48, revenue: 720000 },
            { month: "Tháng 8", sales: 62, revenue: 930000 },
            { month: "Tháng 9", sales: 55, revenue: 825000 },
            { month: "Tháng 10", sales: 38, revenue: 570000 },
            { month: "Tháng 11", sales: 52, revenue: 780000 },
            { month: "Tháng 12", sales: 65, revenue: 975000 }
        ],
        yearlySales: [
            { year: "2021", sales: 480, revenue: 7200000 },
            { year: "2022", sales: 520, revenue: 7800000 },
            { year: "2023", sales: 560, revenue: 8400000 },
            { year: "2024", sales: 590, revenue: 8850000 },
            { year: "2025", sales: 310, revenue: 4650000 }
        ]
    },
    {
        id: 7,
        name: "Mặt Nạ Collagen Intensive",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100",
        totalSold: 480,
        revenue: 7200000,
        rating: 4.1,
        category: "Mặt nạ",
        growthRate: -8.4,
        monthlySales: [
            { month: "Tháng 1", sales: 35, revenue: 525000 },
            { month: "Tháng 2", sales: 42, revenue: 630000 },
            { month: "Tháng 3", sales: 48, revenue: 720000 },
            { month: "Tháng 4", sales: 32, revenue: 480000 },
            { month: "Tháng 5", sales: 55, revenue: 825000 },
            { month: "Tháng 6", sales: 62, revenue: 930000 },
            { month: "Tháng 7", sales: 38, revenue: 570000 },
            { month: "Tháng 8", sales: 45, revenue: 675000 },
            { month: "Tháng 9", sales: 42, revenue: 630000 },
            { month: "Tháng 10", sales: 28, revenue: 420000 },
            { month: "Tháng 11", sales: 35, revenue: 525000 },
            { month: "Tháng 12", sales: 52, revenue: 780000 }
        ],
        yearlySales: [
            { year: "2021", sales: 380, revenue: 5700000 },
            { year: "2022", sales: 420, revenue: 6300000 },
            { year: "2023", sales: 450, revenue: 6750000 },
            { year: "2024", sales: 480, revenue: 7200000 },
            { year: "2025", sales: 250, revenue: 3750000 }
        ]
    },
    {
        id: 8,
        name: "Oil Cleanser Deep Clean",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=100",
        totalSold: 420,
        revenue: 5040000,
        rating: 4.2,
        category: "Oil cleanser",
        growthRate: 4.2,
        monthlySales: [
            { month: "Tháng 1", sales: 28, revenue: 336000 },
            { month: "Tháng 2", sales: 35, revenue: 420000 },
            { month: "Tháng 3", sales: 42, revenue: 504000 },
            { month: "Tháng 4", sales: 25, revenue: 300000 },
            { month: "Tháng 5", sales: 48, revenue: 576000 },
            { month: "Tháng 6", sales: 55, revenue: 660000 },
            { month: "Tháng 7", sales: 32, revenue: 384000 },
            { month: "Tháng 8", sales: 38, revenue: 456000 },
            { month: "Tháng 9", sales: 35, revenue: 420000 },
            { month: "Tháng 10", sales: 22, revenue: 264000 },
            { month: "Tháng 11", sales: 28, revenue: 336000 },
            { month: "Tháng 12", sales: 42, revenue: 504000 }
        ],
        yearlySales: [
            { year: "2021", sales: 320, revenue: 3840000 },
            { year: "2022", sales: 360, revenue: 4320000 },
            { year: "2023", sales: 390, revenue: 4680000 },
            { year: "2024", sales: 420, revenue: 5040000 },
            { year: "2025", sales: 220, revenue: 2640000 }
        ]
    }
];

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
                            {entry.dataKey === "revenue" 
                                ? new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(entry.value)
                                : `${entry.value} sản phẩm`
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
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 3;

    // Simulate API call
    useEffect(() => {
        setIsLoading(true);
        // Reset pagination when query changes
        setPage(1);
        setDisplayedProducts([]);
        
        // Simulate API delay
        setTimeout(() => {
            // Filter products based on query (simulation)
            let filteredProducts = [...mockBestSellingProducts];
            
            // Sort by totalSold descending
            filteredProducts.sort((a, b) => b.totalSold - a.totalSold);
            
            setProducts(filteredProducts);
            
            // Load first page
            const firstPageProducts = filteredProducts.slice(0, pageSize);
            setDisplayedProducts(firstPageProducts);
            setHasMore(filteredProducts.length > pageSize);
            
            // Select first product by default
            if (firstPageProducts.length > 0) {
                setSelectedProduct(firstPageProducts[0]);
            }
            
            setIsLoading(false);
        }, 500);
    }, [query]);

    // Load more products for infinite scroll
    const loadMore = useCallback(() => {
        if (isLoading || !hasMore) return;
        
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        const newProducts = products.slice(startIndex, endIndex);
        
        setDisplayedProducts(prev => [...prev, ...newProducts]);
        setPage(prev => prev + 1);
        setHasMore(endIndex < products.length);
    }, [page, products, isLoading, hasMore]);

    // Handle infinite scroll
    const handleScroll = useCallback((e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 50) { // 50px buffer
            loadMore();
        }
    }, [loadMore]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
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
                                                            <span className="text-gray-600">Đánh giá:</span>
                                                            <div className="flex items-center gap-1">
                                                                <MdStarRate className="text-yellow-500" />
                                                                <span className="font-medium">{product.rating}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                                {hasMore && (
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
                                            {selectedProduct.name} - {query.type === "month" ? `Năm ${query.year}` : "5 năm gần nhất"}
                                        </Text>
                                    </div>
                                ) : "Chọn sản phẩm để xem biểu đồ"
                            }
                            className="h-full"
                        >
                            {selectedProduct ? (
                                <>
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2">
                                            <MdTrendingUp className="text-blue-600 text-xl" />
                                            <span className="font-medium">
                                                Biểu đồ bán hàng {query.type === "month" ? "theo tháng" : "theo năm"}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600">
                                            {query.type === "month" ? (
                                                <>
                                                    Tổng bán: {selectedProduct.monthlySales.reduce((sum, item) => sum + item.sales, 0).toLocaleString()} sản phẩm | 
                                                    Doanh thu: {formatPrice(selectedProduct.monthlySales.reduce((sum, item) => sum + item.revenue, 0))}
                                                </>
                                            ) : (
                                                <>
                                                    Tổng bán: {selectedProduct.yearlySales.reduce((sum, item) => sum + item.sales, 0).toLocaleString()} sản phẩm | 
                                                    Doanh thu: {formatPrice(selectedProduct.yearlySales.reduce((sum, item) => sum + item.revenue, 0))}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="h-96">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={query.type === "month" ? selectedProduct.monthlySales : selectedProduct.yearlySales}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey={query.type === "month" ? "month" : "year"}
                                                    height={60}
                                                    tick={<CustomizedAxisTick />}
                                                />
                                                <YAxis 
                                                    yAxisId="left" 
                                                    label={{ value: 'Số lượng bán', angle: -90, position: 'insideLeft' }}
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
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </>
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
