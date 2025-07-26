import { Button, Card, Select, message } from "antd";
import TableProductAlmostExpired from "@/pages/DashBoard/TableProductAlmostExpired";
import { PlusOutlined } from "@ant-design/icons";
import axiosInstance from "@axios/axios";

import React, { useEffect, useState } from "react";
import StatsOverview from "./StatsOverview";
import StatsRevenueOrder from "./StatsRevenueOrder";
import StatsReview from "./StatsReview";
import StatsBestSellingProducts from "./StatsBestSellingProducts";
import CreatePromotionModal from "./CreatePromotionModal"; // Import modal component

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
    const [selectedProducts, setSelectedProducts] = useState([]); // Thêm state cho selected products
    const [isModalVisible, setIsModalVisible] = useState(false); // Thêm state cho modal

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
        { label: '1 ngày tới', value: 1 },
        { label: '30 ngày tới', value: 30 },
        { label: '60 ngày tới', value: 60 },
        { label: '90 ngày tới', value: 90 },
        { label: '120 ngày tới', value: 120 },
        { label: '150 ngày tới', value: 150 },
        { label: '180 ngày tới', value: 180 },
    ];

    // Handler để mở modal
    const handleCreatePromotion = () => {
        if (selectedProducts.length === 0) {
            message.warning("Vui lòng chọn ít nhất một sản phẩm để tạo khuyến mãi");
            return;
        }
        setIsModalVisible(true);
    };

    // Handler để đóng modal
    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    // Handler khi tạo khuyến mãi thành công
    const handlePromotionSuccess = () => {
        // Refresh lại danh sách sản phẩm sau khi tạo khuyến mãi thành công
        fetchProduct();
        // Clear selected products
        setSelectedProducts([]);
    };

    // Format selected products để pass vào modal
    const formatSelectedProductsForModal = () => {
        return selectedProducts.map(product => ({
            productId: product._id || product.productId,
            _id: product._id || product.productId,
            name: product.name,
            image: product.mainImage?.url || product.image,
            price: product.price,
            currentStock: product.currentStock,
            nearExpiryQuantity: product.nearExpiryQuantity,
            nearExpiryDate: product.nearExpiryDate,
        }));
    };

    return (
        <div className="space-y-4 p-4">
            <StatsOverview />
            <StatsRevenueOrder />
            <StatsReview />
            <StatsBestSellingProducts />
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
                    <div className="flex items-center gap-2">
                        {selectedProducts.length > 0 && (
                            <span className="text-sm text-gray-600">
                                Đã chọn: {selectedProducts.length} sản phẩm
                            </span>
                        )}
                        <Button
                            disabled={selectedProducts.length === 0}
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreatePromotion}
                            className={`bg-indigo-600 ${
                                selectedProducts.length > 0 ? "hover:bg-indigo-700" : ""
                            } w-full sm:w-auto`}
                        >
                            Tạo khuyến mãi ({selectedProducts.length})
                        </Button>
                    </div>
                </div>
                <TableProductAlmostExpired
                    {...{
                        products,
                        setPaginate,
                        paginate,
                        isLoading: isLoadingProducts,
                        selectedProducts, // Pass selected products
                        setSelectedProducts, // Pass setter function
                    }}
                />
            </Card>

            {/* Modal tạo khuyến mãi */}
            <CreatePromotionModal
                visible={isModalVisible}
                onCancel={handleModalClose}
                preSelectedProducts={formatSelectedProductsForModal()}
                onSuccess={handlePromotionSuccess}
            />
        </div>
    );
};

export default DashBoard;