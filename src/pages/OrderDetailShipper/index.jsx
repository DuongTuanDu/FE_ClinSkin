import React, { useState, useEffect } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Descriptions, 
  Table, 
  Tag, 
  Button, 
  Steps, 
  Space,
  message,
  Modal,
  Select,
  Input,
  Spin
} from "antd";
import { 
  ArrowLeftOutlined, 
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import axios from "@axios/axios";
import { formatPrice } from "@helpers/formatPrice";

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

const OrderDetailShipper = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updateNote, setUpdateNote] = useState("");
  
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch order detail
  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/shipping/orders/${id}`);
      
      const orderData = response.data;
      
      // Format order data for component
      const formattedOrder = {
        id: orderData._id,
        orderCode: orderData.codeShip || orderData._id.slice(-8).toUpperCase(),
        customerName: orderData.name,
        customerPhone: orderData.phone,
        shippingAddress: `${orderData.addressDetail}, ${orderData.address.ward.name}, ${orderData.address.district.name}, ${orderData.address.province.name}`,
        status: orderData.status,
        totalAmount: orderData.totalAmount,
        items: orderData.products.map(product => ({
          name: product.name,
          quantity: product.quantity,
          price: product.price,
          image: product.image
        })),
        createdAt: orderData.createdAt,
        note: orderData.note || "",
        paymentMethod: orderData.paymentMethod,
        ship: orderData.ship,
        timeline: orderData.statusHistory?.map(history => ({
          status: history.status,
          time: history.date,
          description: history.note || getStatusDescription(history.status),
          type: history.type
        })) || []
      };
      
      setOrder(formattedOrder);
    } catch (error) {
      console.error("Error fetching order detail:", error);
      message.error("Không thể tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  // Update order status
  const handleUpdateStatus = async () => {
    if (!newStatus) {
      message.warning("Vui lòng chọn trạng thái mới");
      return;
    }

    try {
      setUpdateLoading(true);
      await axios.put(`/shipping/orders/${id}/status`, {
        status: newStatus,
        note: updateNote
      });
      message.success("Cập nhật trạng thái đơn hàng thành công");
      setStatusModalVisible(false);
      setNewStatus("");
      setUpdateNote("");
      fetchOrderDetail(); // Refresh data
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Không thể cập nhật trạng thái đơn hàng");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Get status description
  const getStatusDescription = (status) => {
    const descriptions = {
      in_transit: "Đơn hàng đang được vận chuyển",
      carrier_confirmed: "Shipper đã xác nhận nhận hàng",
      failed_pickup: "Lấy hàng thất bại",
      delivery_pending: "Đang giao hàng đến khách hàng",
      carrier_delivered: "Shipper đã giao hàng thành công",
      delivery_failed: "Giao hàng thất bại",
      return: "Đơn hàng được trả về",
      cancelled: "Đơn hàng đã bị hủy"
    };
    return descriptions[status] || "Cập nhật trạng thái";
  };

  // Get status info
  const getStatusInfo = (status) => {
    const statusConfig = {
      in_transit: { color: "blue", text: "Đang vận chuyển", icon: <CarOutlined /> },
      carrier_confirmed: { color: "green", text: "Shipper đã xác nhận", icon: <CheckCircleOutlined /> },
      failed_pickup: { color: "red", text: "Lấy hàng thất bại", icon: <ClockCircleOutlined /> },
      delivery_pending: { color: "processing", text: "Đang giao hàng", icon: <CarOutlined /> },
      carrier_delivered: { color: "success", text: "Shipper đã giao hàng", icon: <CheckCircleOutlined /> },
      delivery_failed: { color: "error", text: "Giao hàng thất bại", icon: <ClockCircleOutlined /> },
      return: { color: "warning", text: "Trả hàng", icon: <ClockCircleOutlined /> },
      cancelled: { color: "default", text: "Đã hủy", icon: <ClockCircleOutlined /> }
    };
    
    return statusConfig[status] || { color: "default", text: status, icon: <ClockCircleOutlined /> };
  };

  // Get current step for timeline
  const getCurrentStep = (status) => {
    const stepMap = {
      in_transit: 0,
      carrier_confirmed: 1,
      failed_pickup: 0,
      delivery_pending: 2,
      carrier_delivered: 3,
      delivery_failed: 2,
      return: 2,
      cancelled: 0
    };
    return stepMap[status] || 0;
  };

  // Table columns for items
  const itemColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "center",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      align: "right",
      render: (price) => formatPrice(price)
    },
    {
      title: "Thành tiền",
      key: "total",
      width: 140,
      align: "right",
      render: (_, record) => formatPrice(record.price * record.quantity)
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <Card>
        <Text>Không tìm thấy đơn hàng</Text>
      </Card>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate("/shipper")}
            >
              Quay lại
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              Chi tiết đơn hàng {order.orderCode}
            </Title>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setStatusModalVisible(true)}
            disabled={['carrier_delivered', 'cancelled', 'return', 'delivery_failed'].includes(order.status)}
          >
            Cập nhật trạng thái
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Order Status Timeline */}
        <Col span={24}>
          <Card title="Trạng thái đơn hàng">
            <Steps
              current={getCurrentStep(order.status)}
              status={order.status === 'cancelled' || order.status === 'failed_pickup' || order.status === 'delivery_failed' ? 'error' : 'process'}
            >
              <Step 
                title="Đang vận chuyển" 
                description="Đơn hàng đang được vận chuyển"
                icon={<CarOutlined />}
              />
              <Step 
                title="Đã nhận hàng" 
                description="Shipper đã xác nhận nhận hàng"
                icon={<CheckCircleOutlined />}
              />
              <Step 
                title="Đang giao hàng" 
                description="Đang giao hàng đến khách hàng"
                icon={<CarOutlined />}
              />
              <Step 
                title="Hoàn thành" 
                description="Đã giao hàng thành công"
                icon={<CheckCircleOutlined />}
              />
            </Steps>
            
            {order.timeline && order.timeline.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <Title level={5}>Lịch sử cập nhật:</Title>
                {order.timeline.map((item, index) => (
                  <div key={index} style={{ marginBottom: 8 }}>
                    <Tag color={getStatusInfo(item.status).color}>
                      {getStatusInfo(item.status).text}
                    </Tag>
                    <Text type="secondary">
                      {new Date(item.time).toLocaleString("vi-VN")} - {item.description}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>

        {/* Order Information */}
        <Col xs={24} lg={12}>
          <Card title="Thông tin đơn hàng">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Mã đơn hàng">
                <strong>{order.orderCode}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={statusInfo.color} icon={statusInfo.icon}>
                  {statusInfo.text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <Text strong style={{ color: "#f5222d", fontSize: "16px" }}>
                  {formatPrice(order.totalAmount)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                <Tag color={order.paymentMethod === 'cod' ? 'orange' : order.paymentMethod === 'online' ? 'blue' : 'green'}>
                  {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod === 'online' ? 'Trực tuyến' : 'Stripe'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">
                {order.note || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Customer Information */}
        <Col xs={24} lg={12}>
          <Card title="Thông tin khách hàng">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Tên khách hàng">
                <strong>{order.customerName}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                <a href={`tel:${order.customerPhone}`}>
                  {order.customerPhone}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng">
                {order.shippingAddress}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Order Items */}
        <Col span={24}>
          <Card title="Sản phẩm trong đơn hàng">
            <Table
              columns={itemColumns}
              dataSource={order.items}
              pagination={false}
              rowKey={(record, index) => index}
              summary={(pageData) => {
                const total = pageData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <strong>Tổng cộng:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3} align="right">
                      <strong style={{ color: "#f5222d", fontSize: "16px" }}>
                        {formatPrice(total)}
                      </strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Status Update Modal */}
      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={statusModalVisible}
        onOk={handleUpdateStatus}
        onCancel={() => {
          setStatusModalVisible(false);
          setNewStatus("");
          setUpdateNote("");
        }}
        confirmLoading={updateLoading}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 16 }}>
          <Text>Trạng thái hiện tại: </Text>
          <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
        </div>
        
        <div>
          <Text>Trạng thái mới:</Text>
          <Select
            style={{ width: "100%", marginTop: 8 }}
            placeholder="Chọn trạng thái mới"
            value={newStatus}
            onChange={setNewStatus}
          >
            {order.status === 'in_transit' && (
              <>
                <Option value="carrier_confirmed">Shipper đã xác nhận nhận hàng</Option>
                <Option value="failed_pickup">Lấy hàng thất bại</Option>
              </>
            )}
            {order.status === 'carrier_confirmed' && (
              <Option value="delivery_pending">Bắt đầu giao hàng</Option>
            )}
            {order.status === 'delivery_pending' && (
              <>
                <Option value="carrier_delivered">Shipper đã giao hàng thành công</Option>
                <Option value="delivery_failed">Giao hàng thất bại</Option>
              </>
            )}
            {order.status === 'delivery_failed' && (
              <>
                <Option value="delivery_pending">Thử giao lại</Option>
                <Option value="return">Chuyển trả hàng</Option>
              </>
            )}
            {order.status === 'failed_pickup' && (
              <Option value="in_transit">Thử lấy hàng lại</Option>
            )}
          </Select>
        </div>

        <div style={{ marginTop: 16 }}>
          <Text>Ghi chú (tùy chọn):</Text>
          <Input.TextArea
            style={{ marginTop: 8 }}
            placeholder="Nhập ghi chú về việc cập nhật trạng thái..."
            value={updateNote}
            onChange={(e) => setUpdateNote(e.target.value)}
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetailShipper;
