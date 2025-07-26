import { Image, Table, Tag, Tooltip } from "antd";
import React, { useMemo, useEffect } from "react";
import { formatDateReview } from "@helpers/formatDate";
import { PiSpinnerBall } from "react-icons/pi";
import { formatPrice } from "@helpers/formatPrice";
import { isEmpty } from "lodash";
import dayjs from "@utils/dayjsTz";

const TableProductAlmostExpired = ({
    products,
    isLoading,
    paginate,
    setPaginate,
    selectedProducts = [], // Nhận selected products từ parent
    setSelectedProducts, // Nhận setter function từ parent
}) => {
    // Helper function to calculate days remaining
    const calculateDaysRemaining = (endDate) => {
        const today = dayjs();
        const expiry = dayjs(endDate);
        const daysRemaining = expiry.diff(today, 'day');
        
        if (daysRemaining < 0) {
            return { text: "Đã hết hạn", color: "#f5222d", bgColor: "#fff2f0" };
        } else if (daysRemaining === 0) {
            return { text: "Hết hạn hôm nay", color: "#fa8c16", bgColor: "#fff7e6" };
        } else if (daysRemaining <= 7) {
            return { text: `Còn ${daysRemaining} ngày`, color: "#faad14", bgColor: "#fffbe6" };
        } else if (daysRemaining <= 30) {
            return { text: `Còn ${daysRemaining} ngày`, color: "#1677ff", bgColor: "#f6ffed" };
        } else {
            return { text: `Còn ${daysRemaining} ngày`, color: "#52c41a", bgColor: "#f6ffed" };
        }
    };

    // Create unique key for each product
    const getProductKey = (product) => {
        return product.name || product._id;
    };

    // Clear selection when switching pages or changing filters
    useEffect(() => {
        // Optional: You might want to clear selection when changing pages
        // setSelectedProducts([]);
    }, [paginate.page, paginate.pageSize]);

    const batchColumns = [
        {
            title: "Mã lô hàng",
            dataIndex: "batchNumber",
            key: "batchNumber",
            width: 100,
            render: (text) => (
                <span className="font-mono text-xs">{text}</span>
            ),
        },
        {
            title: "Số lượng còn lại",
            dataIndex: "remainingQuantity",
            key: "remainingQuantity",
            width: 100,
            render: (quantity) => (
                <span className="text-sm">{quantity}</span>
            ),
        },
        {
            title: "Ngày hết hạn",
            dataIndex: "expiryDate",
            key: "expiryDate",
            width: 140,
            render: (expiryDate) => {
                const daysInfo = calculateDaysRemaining(expiryDate);
                return (
                    <div className="space-y-1">
                        <div className="text-xs">{formatDateReview(expiryDate)}</div>
                        <Tag 
                            size="small"
                            style={{ 
                                color: daysInfo.color,
                                backgroundColor: daysInfo.bgColor,
                                border: `1px solid ${daysInfo.color}`,
                                fontSize: '10px'
                            }}
                        >
                            {daysInfo.text}
                        </Tag>
                    </div>
                );
            },
        },
        {
            title: "Giá nhập",
            dataIndex: "costPrice",
            key: "costPrice",
            width: 100,
            render: (price) => (
                <span className="text-xs">{formatPrice(price)} đ</span>
            ),
        },
    ];

    const columns = useMemo(
        () => [
            {
                title: "Ảnh",
                dataIndex: "mainImage",
                key: "mainImage",
                width: 100,
                render: (mainImage) => (
                    <Image
                        className="rounded-md"
                        src={mainImage?.url}
                        alt="Product"
                        width={80}
                        height={80}
                        placeholder={<PiSpinnerBall className="animate-spin" />}
                    />
                ),
            },
            {
                title: "Thông tin sản phẩm",
                dataIndex: "name",
                key: "name",
                width: 400,
                render: (_, record) => {
                    const daysInfo = calculateDaysRemaining(record.nearExpiryDate);
                    
                    return (
                        <div className="space-y-2">
                            <Tooltip title={record.name}>
                                <div className="text-sm font-medium truncate-2-lines">{record.name}</div>
                            </Tooltip>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="font-bold">Tổng số lượng:</span>
                                    <span className="ml-1 text-blue-600">{record.currentStock}</span>
                                    <span className="text-gray-500"> sản phẩm</span>
                                </div>
                                <div>
                                    <span className="font-bold">Sắp hết hạn:</span>
                                    <span className="ml-1 text-orange-600">{record.nearExpiryQuantity}</span>
                                    <span className="text-gray-500"> sản phẩm</span>
                                </div>
                                <div>
                                    <span className="font-bold">Giá bán:</span>
                                    <span className="ml-1 text-green-600">{formatPrice(record.price)} đ</span>
                                </div>
                                <div>
                                    <span className="font-bold">Hết hạn gần nhất:</span>
                                    <div className="mt-1">
                                        <div className="text-xs">{formatDateReview(record.nearExpiryDate)}</div>
                                        <Tag 
                                            size="small"
                                            style={{ 
                                                color: daysInfo.color,
                                                backgroundColor: daysInfo.bgColor,
                                                border: `1px solid ${daysInfo.color}`,
                                                fontSize: '10px'
                                            }}
                                        >
                                            {daysInfo.text}
                                        </Tag>
                                    </div>
                                </div>
                            </div>

                            {record.promotion && (
                                <div className="border-t pt-2 mt-2">
                                    <div className="text-xs">
                                        <span className="font-bold text-red-600">Khuyến mãi:</span>
                                        <span className="ml-1 italic">
                                            {record.promotion.name}{" "}
                                            <Tag color="#fc541e" size="small">
                                                - {record.promotion.discountPercentage} %
                                            </Tag>
                                        </span>
                                    </div>
                                    <div className="text-xs mt-1">
                                        <span className="font-bold">Thời gian:</span>
                                        <span className="ml-1 italic">
                                            {formatDateReview(record.promotion.startDate)} - {formatDateReview(record.promotion.endDate)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                },
            },
            {
                title: "Danh sách lô hàng sắp hết hạn",
                key: "batches",
                width: 500,
                render: (_, record) => {
                    return (
                        <div className="max-w-full">
                            <Table
                                columns={batchColumns}
                                dataSource={record.nearExpiryBatches}
                                pagination={false}
                                size="small"
                                rowKey="batchId"
                                className="border border-gray-200 rounded"
                                scroll={{ x: 400 }}
                            />
                        </div>
                    );
                },
            },
        ],
        []
    );

    const rowSelection = {
        selectedRowKeys: selectedProducts.map((p) => getProductKey(p)),
        onChange: (selectedRowKeys, selectedRows) => {
            // Get products from current page
            const currentPageProductKeys = products.map((p) => getProductKey(p));

            // Keep products from other pages that are still selected
            const productsFromOtherPages = selectedProducts.filter(
                (p) => !currentPageProductKeys.includes(getProductKey(p))
            );

            // Map selected rows to the expected format
            const updatedCurrentPageProducts = selectedRows.map((row) => {
                const existingProduct = selectedProducts.find(
                    (p) => getProductKey(p) === getProductKey(row)
                );
                return {
                    _id: row._id || row.productId,
                    productId: row._id || row.productId,
                    image: row.mainImage?.url,
                    mainImage: row.mainImage,
                    name: row.name,
                    price: row.price,
                    currentStock: row.currentStock,
                    nearExpiryQuantity: row.nearExpiryQuantity,
                    nearExpiryDate: row.nearExpiryDate,
                    nearExpiryBatches: row.nearExpiryBatches,
                    promotion: row.promotion,
                    // Keep existing promotion settings if already selected
                    discountPercentage: existingProduct
                        ? existingProduct.discountPercentage
                        : 0,
                    maxQty: existingProduct ? existingProduct.maxQty : 0,
                    maxDiscountAmount: existingProduct ? existingProduct.maxDiscountAmount : 0,
                };
            });

            // Combine products from other pages with current page selections
            const allSelectedProducts = [
                ...productsFromOtherPages,
                ...updatedCurrentPageProducts,
            ];

            setSelectedProducts(allSelectedProducts);
        },
        getCheckboxProps: (record) => ({
            disabled: !isEmpty(record.promotion),
        }),
    };

    return (
        <>
            <Table
                rowKey={(record) => getProductKey(record)}
                columns={columns}
                dataSource={products}
                loading={isLoading}
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
                pagination={{
                    current: paginate.page,
                    pageSize: paginate.pageSize,
                    total: paginate.totalItems,
                    onChange: (page, pageSize) =>
                        setPaginate((prev) => ({
                            ...prev,
                            page,
                            pageSize,
                        })),
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                        `${range[0]}-${range[1]} của ${total} sản phẩm`,
                }}
                scroll={{ x: true }}
            />
        </>
    );
};

export default TableProductAlmostExpired;