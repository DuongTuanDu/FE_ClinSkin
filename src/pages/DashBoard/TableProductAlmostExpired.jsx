import { Image, Table, Tag, Tooltip } from "antd";
import React, { useMemo, useState } from "react";
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
}) => {
    const [selectedProducts, setSelectedProducts] = useState([]);

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
                        src={mainImage.url}
                        alt="Product"
                        width={80}
                        height={80}
                        placeholder={<PiSpinnerBall className="animate-spin" />}
                    />
                ),
            },
            {
                title: "Tên sản phẩm",
                dataIndex: "name",
                key: "name",
                render: (_, record) => (
                    <div className="space-y-1">
                        <Tooltip title={record.name}>
                            <div className="text-sm truncate-2-lines">{record.name}</div>
                        </Tooltip>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <span className="font-bold mr-1">Hạn sử dụng:</span>
                            <span className="mr-2">{formatDateReview(record.expiry)}</span>
                            {(() => {
                                const daysInfo = calculateDaysRemaining(record.expiry);
                                return (
                                    <Tag 
                                        size="small"
                                        style={{ 
                                            color: daysInfo.color,
                                            backgroundColor: daysInfo.bgColor,
                                            border: `1px solid ${daysInfo.color}`,
                                            fontSize: '11px'
                                        }}
                                    >
                                        {daysInfo.text}
                                    </Tag>
                                );
                            })()}
                        </div>
                        <div className="text-sm truncate-2-lines">
                            <span className="font-bold mr-1">Giá:</span>
                            <span>{formatPrice(record.price)} đ</span>
                        </div>
                        {record.promotion && (
                            <>
                                <div className="text-sm truncate-2-lines">
                                    <span className="font-bold mr-1">Khuyến mãi:</span>
                                    <span className="italic">
                                        {record.promotion.name}{" "}
                                        <Tag color="#fc541e">
                                            - {record.promotion.discountPercentage} %
                                        </Tag>
                                    </span>
                                </div>
                                <div className="text-sm truncate-2-lines">
                                    <span className="font-bold mr-1">Thời gian:</span>
                                    <span className="italic">
                                        {formatDateReview(record.promotion.startDate)} -
                                        {formatDateReview(record.promotion.endDate)}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                ),
            },
        ],
        []
    );

    // Sort products by expiry date (closest expiry first)
    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) => {
            const dateA = dayjs(a.expiry);
            const dateB = dayjs(b.expiry);
            return dateA.diff(dateB); // Ascending: closest expiry first
        });
    }, [products]);

    const rowSelection = {
        selectedRowKeys: selectedProducts.map((p) => p.product),
        onChange: (_, selectedRows) => {
            const currentPageProducts = sortedProducts.map((p) => p._id);

            const productsFromOtherPages = selectedProducts.filter(
                (p) => !currentPageProducts.includes(p.product)
            );

            const updatedCurrentPageProducts = selectedRows.map((row) => {
                const existingProduct = selectedProducts.find(
                    (p) => p.product === row._id
                );
                return {
                    image: row.mainImage.url,
                    product: row._id,
                    name: row.name,
                    price: row.price,
                    discountPercentage: existingProduct
                        ? existingProduct.discountPercentage
                        : 0,
                    maxQty: existingProduct ? existingProduct.maxQty : 0,
                };
            });

            setSelectedProducts([
                ...productsFromOtherPages,
                ...updatedCurrentPageProducts,
            ]);
        },
        getCheckboxProps: (record) => ({
            disabled: !isEmpty(record.promotion),
        }),
    };

    return (
        <>
            <Table
                rowKey={(record) => record._id}
                columns={columns}
                dataSource={sortedProducts}
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
                }}
                scroll={{ x: true }}
            />
        </>
    );
};

export default TableProductAlmostExpired;