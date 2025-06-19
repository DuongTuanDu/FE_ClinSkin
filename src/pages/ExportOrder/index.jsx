import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetBatchesByOrderIdQuery } from "@/redux/inventory/inventoryBatch.query";
import { Card, Spin, Empty, Typography, Image, Tag, Table, InputNumber, Divider, Row, Col, message, Descriptions } from "antd";
import { FaBoxOpen } from "react-icons/fa";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const OrderSummary = ({ orderData }) => {
  const { id, user, totalAmount, status, note, paymentMethod, address } = orderData;
  
  return (
    <Card className="mb-6 shadow-md">
      <Title level={4}>Thông tin đơn hàng</Title>
      <Descriptions bordered size="small" column={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
        <Descriptions.Item label="Mã đơn hàng" span={2}>{id}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái" span={2}>
          <Tag color={
            status === 'pending' ? 'orange' : 
            status === 'delivered' ? 'green' : 
            status === 'canceled' ? 'red' : 'blue'
          }>
            {status}
          </Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="Khách hàng" span={2}>{user?.name}</Descriptions.Item>
        <Descriptions.Item label="Email" span={2}>{user?.email}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại" span={2}>{user?.phone}</Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán" span={2}>{paymentMethod}</Descriptions.Item>
        
        <Descriptions.Item label="Tổng tiền" span={4}>
          <Text type="danger" strong>{totalAmount?.toLocaleString('vi-VN')} ₫</Text>
        </Descriptions.Item>
        
        <Descriptions.Item label="Địa chỉ" span={4}>
          {address?.detail}, {address?.ward}, {address?.district}, {address?.province}
        </Descriptions.Item>
        
        {note && (
          <Descriptions.Item label="Ghi chú" span={4}>
            {note}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};

const ExportOrder = () => {
  const { orderId } = useParams();
  const { data, isLoading, error } = useGetBatchesByOrderIdQuery(orderId);
  const batchData = data?.data || [];
  const orderData = data?.order || {};

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
      <OrderSummary orderData={orderData} />
      <Text className="text-lg font-semibold mb-4">Danh sách sản phẩm trong đơn hàng</Text>
      {batchData.length === 0 ? (
        <Empty description="Không có dữ liệu lô hàng cho đơn hàng này" />
      ) : (
        <div className="space-y-6">
          {batchData.map((item) => (
            <ProductWithBatches key={item.product._id} productData={item} />
          ))}
        </div>
      )}
      
      <div className="flex justify-end mt-4">
        <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow transition"
            onClick={() => {
                // TODO: Implement delivery logic here
                // You can open a modal, call an API, or show a notification
                message.warning("doing")
            }}
        >
            Giao hàng
        </button>
      </div>
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

  // Function to calculate days remaining before expiry
  const calculateDaysRemaining = (endDate) => {
    const today = dayjs();
    const expiry = dayjs(endDate);
    const daysRemaining = expiry.diff(today, 'day');
    
    if (daysRemaining < 7) {
        return { text: `Còn ${daysRemaining} ngày`, color: "#f5222d", bgColor: "#fff2f0" };
    } else if (daysRemaining <= 30) {
        return { text: `Còn ${daysRemaining} ngày`, color: "#1677ff", bgColor: "#f6ffed" };
    } else {
        return { text: `Còn ${daysRemaining} ngày`, color: "#52c41a", bgColor: "#f6ffed" };
    }
  };

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
            <Text>{quantitiesToTake[_id] || 0}</Text>
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
      title: 'Thời hạn còn lại',
      dataIndex: 'expiryDate',
      key: 'daysRemaining',
      width: 120,
      render: (date) => {
        const { text, color, bgColor } = calculateDaysRemaining(date);
        return (
          <Tag style={{ color: color, backgroundColor: bgColor, borderColor: color }}>
            {text}
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
