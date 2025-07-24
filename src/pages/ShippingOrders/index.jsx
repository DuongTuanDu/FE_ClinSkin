import React, { useState, useEffect } from "react";
import { 
  Table, 
  Card, 
  Input, 
  Select, 
  Space, 
  Button, 
  Tag, 
  message,
  Row,
  Col,
  Typography,
  Pagination
} from "antd";
import { SearchOutlined, EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "@axios/axios";
import { formatPrice } from "@helpers/formatPrice";

const { Title } = Typography;
const { Option } = Select;

const ShippingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  const navigate = useNavigate();

  // Fetch orders
  const fetchOrders = async (params = {}) => {
    try {
      setLoading(true);
      const response = await axios.get("/shipping/orders", {
        params: {
          page: params.page || pagination.current,
          limit: params.limit || pagination.pageSize,
          status: params.status !== 'all' ? params.status : undefined,
          search: params.search || searchTerm || undefined
        }
      });
      
      // Format orders data from the API response
      const formattedOrders = (response.data || []).map(order => ({
        id: order._id,
        orderCode: order.codeShip || order._id.slice(-8).toUpperCase(),
        customerName: order.name,
        customerPhone: order.phone,
        shippingAddress: `${order.addressDetail}, ${order.address.ward.name}, ${order.address.district.name}, ${order.address.province.name}`,
        status: order.status,
        totalAmount: order.totalAmount,
        items: order.products.map(product => ({
          pid: product.pid,
          name: product.name,
          quantity: product.quantity,
          price: product.price,
          image: product.image,
          isReviewed: product.isReviewed
        })),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        note: order.note || "",
        paymentMethod: order.paymentMethod,
        ship: order.ship,
        cancelReason: order.cancelReason,
        userId: order.userId?.name || order.userId
      }));
      
      setOrders(formattedOrders);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.totalItems,
        current: response.pagination.page,
        pageSize: response.pagination.pageSize
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.current, pagination.pageSize]);

  // Handle search
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchOrders({ page: 1, status: statusFilter, search: searchTerm });
  };

  // Handle status filter change
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchOrders({ page: 1, status: value, search: searchTerm });
  };

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({ ...prev, current: page, pageSize }));
  };

  // View order detail
  const viewOrderDetail = (orderId) => {
    navigate(`/shipper/orders/${orderId}`);
  };

  // Get status tag
  const getStatusTag = (status) => {
    const statusConfig = {
      in_transit: { color: "blue", text: "Đang vận chuyển" },
      carrier_confirmed: { color: "green", text: "Đã xác nhận nhận hàng" },
      failed_pickup: { color: "red", text: "Lấy hàng thất bại" },
      delivery_pending: { color: "processing", text: "Đang giao hàng" },
      carrier_delivered: { color: "success", text: "Đã giao hàng" },
      delivery_failed: { color: "error", text: "Giao hàng thất bại" }
    };
    
    const config = statusConfig[status] || { color: "default", text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // Table columns
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
      width: 120,
      render: (text) => <strong>{text}</strong>
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
    },
    {
      title: "Số điện thoại",
      dataIndex: "customerPhone",
      key: "customerPhone",
      width: 120,
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      ellipsis: true,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      render: (amount) => <strong>{formatPrice(amount)}</strong>
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 140,
      render: (method) => {
        const methodConfig = {
          cod: { color: "orange", text: "COD" },
          online: { color: "blue", text: "Trực tuyến" },
          stripe: { color: "green", text: "Stripe" }
        };
        const config = methodConfig[method] || { color: "default", text: method };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) => getStatusTag(status)
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 150,
      ellipsis: true,
      render: (note) => note || "-"
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => viewOrderDetail(record.id)}
          size="small"
        >
          Xem
        </Button>
      )
    }
  ];

  return (
    <div>
      <Card>
        <Title level={4} style={{ marginBottom: 24 }}>
          Danh sách đơn hàng vận chuyển
        </Title>
        
        {/* Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="in_transit">Đang vận chuyển</Option>
              <Option value="carrier_confirmed">Đã xác nhận nhận hàng</Option>
              <Option value="failed_pickup">Lấy hàng thất bại</Option>
              <Option value="delivery_pending">Đang giao hàng</Option>
              <Option value="carrier_delivered">Đã giao hàng</Option>
              <Option value="delivery_failed">Giao hàng thất bại</Option>
              <Option value="return">Trả hàng</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={10}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                Tìm kiếm
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPagination(prev => ({ ...prev, current: 1 }));
                  fetchOrders({ page: 1, status: "all", search: "" });
                }}
              >
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1000 }}
          size="middle"
        />

        {/* Pagination */}
        <Row justify="end" style={{ marginTop: 16 }}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePaginationChange}
            onShowSizeChange={handlePaginationChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} của ${total} đơn hàng`
            }
          />
        </Row>
      </Card>
    </div>
  );
};

export default ShippingOrders;
