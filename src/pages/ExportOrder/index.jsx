import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetBatchesByOrderIdQuery } from "@/redux/inventory/inventoryBatch.query";
import { Card, Spin, Empty, Typography, Image, Tag, Table, InputNumber, Divider, Row, Col } from "antd";
import { FaBoxOpen } from "react-icons/fa";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ExportOrder = () => {
  const { orderId } = useParams();
  const { data, isLoading, error } = useGetBatchesByOrderIdQuery(orderId);
  const batchData = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <Empty description="Đã xảy ra lỗi khi tải dữ liệu" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Title level={3} className="mb-6">
        Chi tiết đơn xuất kho #{orderId}
      </Title>
      
      {batchData.length === 0 ? (
        <Empty description="Không có dữ liệu lô hàng cho đơn hàng này" />
      ) : (
        <div className="space-y-6">
          {batchData.map((item) => (
            <ProductWithBatches key={item.product._id} productData={item} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductWithBatches = ({ productData }) => {
  const { product, totalQuantity, price, batchItems } = productData;
  const { items = [], total = 0 } = batchItems || {};
  
  const [quantitiesToTake, setQuantitiesToTake] = useState({});
  
  // Initialize quantities to take based on total quantity needed
  useEffect(() => {
    if (items.length > 0 && totalQuantity > 0) {
      let remaining = totalQuantity;
      const newQuantities = {};
      
      // Distribute the total quantity across batches (prioritizing those closest to expiry)
      const sortedBatches = [...items].sort((a, b) => 
        new Date(a.expiryDate) - new Date(b.expiryDate)
      );
      
      for (const batch of sortedBatches) {
        if (remaining <= 0) break;
        const take = Math.min(batch.remainingQuantity, remaining);
        newQuantities[batch._id] = take;
        remaining -= take;
      }
      
      setQuantitiesToTake(newQuantities);
    }
  }, [items, totalQuantity]);

  // Calculate total quantity to be taken
  const totalToTake = Object.values(quantitiesToTake).reduce((sum, qty) => sum + qty, 0);

  const columns = [
    {
      title: 'Mã lô',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
      width: 100,
    },
    {
      title: 'Số lượng có sẵn',
      dataIndex: 'remainingQuantity',
      key: 'remainingQuantity',
      width: 100,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Số lượng cần lấy',
      dataIndex: '_id',
      key: 'toTake',
      width: 120,
      render: (_id) => (
        <InputNumber
          min={0}
          max={items.find(item => item._id === _id)?.remainingQuantity || 0}
          value={quantitiesToTake[_id] || 0}
          onChange={(value) => {
            setQuantitiesToTake(prev => ({
              ...prev,
              [_id]: value || 0
            }));
          }}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Hạn sử dụng',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 120,
      render: (date) => {
        const expDate = dayjs(date);
        const isExpiringSoon = expDate.diff(dayjs(), 'day') <= 30;
        return (
          <Tag color={isExpiringSoon ? "orange" : "green"}>
            {expDate.format('DD/MM/YYYY')}
          </Tag>
        );
      },
    },
    {
      title: 'Ngày nhập kho',
      dataIndex: 'receivedDate',
      key: 'receivedDate',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Giá nhập',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: 120,
      render: (price) => `${price.toLocaleString('vi-VN')} ₫`,
    }
  ];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <Row gutter={[24, 16]}>
        {/* Product Information (Left Side) */}
        <Col xs={24} md={8}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {product?.mainImage?.url ? (
                <Image
                  src={product.mainImage.url}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="object-cover rounded-md"
                  fallback="data:image/png;base64,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"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md">
                  <FaBoxOpen className="text-2xl text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <Title level={4} className="m-0">
                {product?.name || "Sản phẩm không có tên"}
              </Title>
              
              {/* <div className="text-sm text-gray-500 mb-1">
                ID: {product?._id}
              </div> */}

              <div className="mb-3 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">Thương hiệu:</span>
                    {product?.brandId && (
                        <Tag color="blue" className="!px-2 !py-0.5 !text-xs">{product.brandId.name}</Tag>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-gray-500 text-xs">Danh mục:</span>
                    {product?.categories?.map((cat) => (
                        <Tag key={cat._id} color="green" className="!px-1 !py-0.5 !text-xs">
                            {cat.name}
                        </Tag>
                    ))}
                </div>
            </div>
              
              <div className="gap-y-1 mt-3">
                <div className="text-sm">
                    <Text type="secondary">Tổng số lượng cần: </Text>
                    <Text strong>{totalQuantity}</Text>
                </div>
                {/* <div className="text-sm">
                  <Text type="secondary">Tổng số lượng lấy: </Text>
                  <Text strong type={totalToTake < totalQuantity ? "danger" : "success"}>
                    {totalToTake}
                  </Text>
                </div> */}
                <div className="text-sm">
                  <Text type="secondary">Tồn kho hiện tại: </Text>
                  <Text>{product?.currentStock || 0}</Text> 
                </div>
                <div className="text-sm">
                  <Text type="secondary">Giá bán: </Text>
                  <Text type="danger" strong>
                    {price?.toLocaleString('vi-VN')} ₫
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* Batch Items (Right Side) */}
        <Col xs={24} md={16}>
          <Table 
            dataSource={items} 
            columns={columns}
            rowKey="_id"
            size="small"
            pagination={false}
            className="mt-2"
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    <Text strong>Tổng</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong>{total}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <Text strong>{totalToTake}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} colSpan={3} />
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ExportOrder;
