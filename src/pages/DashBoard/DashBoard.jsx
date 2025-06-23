import { Button, Card, Select } from "antd";
import TableProductAlmostExpired from "@/pages/DashBoard/TableProductAlmostExpired";
import { PlusOutlined } from "@ant-design/icons";
import axiosInstance from "@axios/axios";

import React, { useEffect, useState } from "react";
import StatsOverview from "./StatsOverview";
import StatsRevenueOrder from "./StatsRevenueOrder";
import StatsReview from "./StatsReview";


const DashBoard = () => {
    const [paginate, setPaginate] = useState({
        page: 1,
        pageSize: 10,
        totalPage: 0,
        totalItems: 0,
    });
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [selectedDays, setSelectedDays] = useState(30);

    const fetchProduct = async () => {
        setIsLoadingProducts(true);
        try {
            const response = await axiosInstance.get('/admin/dashboard/products-near-expiry', {
                params: {
                    days: selectedDays,
                    page: paginate.page,
                    pageSize: paginate.pageSize
                }
            });

            if (response.success) {
                setProducts(response.data);
                setPaginate((prev) => ({
                    ...prev,
                    ...response.pagination,
                }));
            }
        } catch (error) {
            console.error('Error fetching products near expiry:', error);
            setProducts([]);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [paginate.page, paginate.pageSize, selectedDays]);

    const daysOptions = [
        { label: '30 ngày tới', value: 30 },
        { label: '60 ngày tới', value: 60 },
        { label: '90 ngày tới', value: 90 },
        { label: '120 ngày tới', value: 120 },
        { label: '150 ngày tới', value: 150 },
        { label: '180 ngày tới', value: 180 },
    ];

    return (
        <div className="space-y-4 p-4">
            <StatsOverview />
            <StatsRevenueOrder />
            <StatsReview />
            <Card className="shadow-lg" bordered={false}>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-4 flex-wrap">
                        <h2 className="text-xl font-bold m-0">
                            Sản phẩm sắp hết hạn
                            <span className="text-sm text-gray-500 font-normal ml-2">
                                ({paginate.totalItems} sản phẩm)
                            </span>
                        </h2>
                        <Select
                            value={selectedDays}
                            onChange={(value) => {
                                setSelectedDays(value);
                                setPaginate(prev => ({ ...prev, page: 1 }));
                            }}
                            options={daysOptions}
                            style={{ width: 120 }}
                            placeholder="Chọn ngày"
                        />
                    </div>
                    <Button
                        disabled={products.length === 0}
                        type="primary"
                        icon={<PlusOutlined />}
                        className={`bg-indigo-600 ${products.length > 0 ? "hover:bg-indigo-700" : ""
                            } w-full sm:w-auto`}
                    >
                        Tạo khuyến mãi
                    </Button>
                </div>
                <TableProductAlmostExpired
                    {...{
                        products,
                        setPaginate,
                        paginate,
                        isLoading: isLoadingProducts,
                    }}
                />
            </Card>
        </div>
    );
};

export default DashBoard;