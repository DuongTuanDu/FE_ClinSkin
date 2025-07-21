import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetBatchesByOrderIdQuery } from "@/redux/inventory/inventoryBatch.query";
import { useCreateSalesHistoryMutation } from "@/redux/salesHistory/salesHistory.query";
import { Card, Spin, Empty, Typography, Image, Tag, Table, InputNumber, Divider, Row, Col, message, Descriptions, Alert } from "antd";
import { FaBoxOpen, FaExclamationTriangle } from "react-icons/fa";
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
        
        <Descriptions.Item label="Phương thức thanh toán" span={2}>{paymentMethod}</Descriptions.Item>
        
        <Descriptions.Item label="Tổng tiền" span={4}>
          <Text type="danger" strong>{totalAmount?.toLocaleString('vi-VN')} ₫</Text>
        </Descriptions.Item>
        
        <Descriptions.Item label="Địa chỉ" span={4}>
          {address?.province?.name}, {address?.district?.name}, {address?.ward?.name}
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
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetBatchesByOrderIdQuery(orderId);
  const [createSalesHistory, { isLoading: isCreating }] = useCreateSalesHistoryMutation();
  
  const orderData = data?.order || {};
  const availableItems = data?.data?.availableItems || [];
  const insufficientStockItems = data?.data?.insufficientStockItems || [];
  const hasInsufficientStock = data?.hasInsufficientStock || false;

  // Function to prepare form data for API submission
  const prepareFormData = () => {
    return {
      orderId: orderData.id,
      orderData: {
        id: orderData.id,
        user: {
          name: orderData.user?.name,
          email: orderData.user?.email,
          phone: orderData.user?.phone
        },
        totalAmount: orderData.totalAmount,
        status: orderData.status,
        note: orderData.note,
        paymentMethod: orderData.paymentMethod,
        address: {
          province: {
            id: orderData.address?.province?.id,
            name: orderData.address?.province?.name
          },
          district: {
            id: orderData.address?.district?.id,
            name: orderData.address?.district?.name
          },
          ward: {
            id: orderData.address?.ward?.id,
            name: orderData.address?.ward?.name
          }
        }
      },
      availableItems: availableItems.map(item => ({
        product: {
          _id: item.product._id,
          name: item.product.name,
          mainImage: item.product.mainImage?.url,
          currentStock: item.product.currentStock,
          brandId: {
            _id: item.product.brandId?._id,
            name: item.product.brandId?.name
          },
          categories: item.product.categories?.map(cat => ({
            _id: cat._id,
            name: cat.name
          }))
        },
        totalQuantity: item.totalQuantity,
        price: item.price,
        batchItems: {
          success: item.batchItems?.success,
          items: item.batchItems?.items?.map(batch => ({
            _id: batch._id,
            batchNumber: batch.batchNumber,
            productId: batch.productId,
            quantity: batch.quantity,
            costPrice: batch.costPrice,
            remainingQuantity: batch.remainingQuantity,
            expiryDate: batch.expiryDate,
            receivedDate: batch.receivedDate
          })),
          total: item.batchItems?.total
        }
      }))
    };
  };

  // Handle form submission
  const handleDelivery = async () => {
    if (hasInsufficientStock) {
      message.error("Không thể giao hàng do có sản phẩm thiếu hàng");
      return;
    }

    try {
      const formData = prepareFormData();
      const result = await createSalesHistory(formData).unwrap();
      
      if (result.success) {
        message.success("Giao hàng thành công!");
        console.log("Sales history created:", result);
        // Navigate to order management page with state to indicate refresh needed
        setTimeout(() => {
          navigate("/admin/orders", { 
            replace: true,
            state: { refreshData: true, timestamp: Date.now() }
          });
        }, 1500); 
      } else {
        message.error("Có lỗi xảy ra khi giao hàng");
      }
    } catch (error) {
      console.error("Error creating sales history:", error);
      message.error("Có lỗi xảy ra khi giao hàng");
    }
  };

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
      
      {/* Alert for insufficient stock */}
      {hasInsufficientStock && (
        <Alert
          message="Cảnh báo thiếu hàng"
          description="Một số sản phẩm trong đơn hàng không đủ số lượng tồn kho"
          type="warning"
          icon={<FaExclamationTriangle />}
          className="mb-6"
          showIcon
        />
      )}
      
      {/* Available items section */}
      {availableItems.length > 0 && (
        <div className="mb-6">
          <Title level={4} className="text-green-600">
            Sản phẩm có đủ hàng ({availableItems.length})
          </Title>
          <div className="space-y-6">
            {availableItems.map((item) => (
              <ProductWithBatches key={item.product._id} productData={item} />
            ))}
          </div>
        </div>
      )}
      
      {/* Insufficient stock items section */}
      {insufficientStockItems.length > 0 && (
        <div className="mb-6">
          <Title level={4} className="text-red-600">
            Sản phẩm thiếu hàng ({insufficientStockItems.length})
          </Title>
          <div className="space-y-6">
            {insufficientStockItems.map((item) => (
              <InsufficientStockProduct key={item.product._id} productData={item} />
            ))}
          </div>
        </div>
      )}
      
      {availableItems.length === 0 && insufficientStockItems.length === 0 && (
        <Empty description="Không có dữ liệu sản phẩm cho đơn hàng này" />
      )}
      
      <div className="flex justify-end mt-4">
        <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={hasInsufficientStock || isCreating}
            onClick={handleDelivery}
        >
            {isCreating ? "Đang xử lý..." : "Giao hàng"}
        </button>
      </div>
    </div>
  );
};

const InsufficientStockProduct = ({ productData }) => {
  const { product, requiredQuantity, availableQuantity, shortageQuantity, price, message: errorMessage } = productData;

  return (
    <Card className="shadow-md border-red-200 bg-red-50">
      <Row gutter={[24, 16]}>
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
                  <Text type="secondary">Số lượng yêu cầu: </Text>
                  <Text strong>{requiredQuantity}</Text>
                </div>
                <div className="text-sm">
                  <Text type="secondary">Số lượng có sẵn: </Text>
                  <Text strong type="warning">{availableQuantity}</Text>
                </div>
                <div className="text-sm">
                  <Text type="secondary">Số lượng thiếu: </Text>
                  <Text strong type="danger">{shortageQuantity}</Text>
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

        <Col xs={24} md={16}>
          <Alert
            message="Không đủ hàng"
            description={errorMessage}
            type="error"
            showIcon
            icon={<FaExclamationTriangle />}
          />
        </Col>
      </Row>
    </Card>
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
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-green-200 bg-green-50">
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
