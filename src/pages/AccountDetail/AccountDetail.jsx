import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Statistic, Table, Tag, Pagination, Spin, Avatar, Button, Tabs } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from '@axios/axios';
import { formatDate } from '@helpers/formatDate';
import { formatPrice } from '@helpers/formatPrice';

const AccountDetail = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [accountDetail, setAccountDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [activeTab, setActiveTab] = useState('inventory');
  const loadedRef = useRef(new Set());

  useEffect(() => {
    // Nếu đã load adminId này rồi thì không load lại
    if (!adminId || loadedRef.current.has(adminId)) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi API trực tiếp
        const response = await axios.get(`/admin/admin-accounts/detail/${adminId}`);
        console.log('API Response:', response); // Debug log
        if (response.success) {
          setAccountDetail(response.data);
          loadedRef.current.add(adminId); // Mark as loaded
        }
      } catch (error) {
        console.error('Error loading account detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adminId]);

  const getTabData = () => {
    if (!accountDetail) return [];
    
    switch (activeTab) {
      case 'inventory':
        return accountDetail.recentActivity.inventoryBatches || [];
      case 'orders':
        return accountDetail.recentActivity.orderUpdates || [];
      case 'reviews':
        return accountDetail.recentActivity.reviewReplies || [];
      default:
        return [];
    }
  };

  const getCurrentPageData = () => {
    const data = getTabData();
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  const inventoryColumns = [
    {
      title: 'Số lô',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
    },
    {
      title: 'Sản phẩm',
      dataIndex: ['product', 'name'],
      key: 'productName',
      render: (text, record) => record.product?.name || 'N/A',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Giá nhập',
      dataIndex: 'costPrice',
      key: 'costPrice',
      render: (price) => formatPrice(price),
    },
    {
      title: 'Số lượng còn lại',
      dataIndex: 'remainingQuantity',
      key: 'remainingQuantity',
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date) => formatDate(date),
    },
    {
      title: 'Ngày nhận',
      dataIndex: 'receivedDate',
      key: 'receivedDate',
      render: (date) => formatDate(date),
    },
  ];

  const orderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => formatPrice(amount),
    },
    {
      title: 'Trạng thái hiện tại',
      dataIndex: 'currentStatus',
      key: 'currentStatus',
      render: (status) => <Tag color="blue">{status}</Tag>,
    },
    {
      title: 'Số lần cập nhật',
      dataIndex: 'updates',
      key: 'updatesCount',
      render: (updates) => updates?.length || 0,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDate(date),
    },
  ];

  const reviewColumns = [
    {
      title: 'Người dùng',
      dataIndex: ['user', 'name'],
      key: 'userName',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.user?.avatar?.url} size="small">
            {record.user?.name?.charAt(0)}
          </Avatar>
          {record.user?.name || 'N/A'}
        </div>
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: ['product', 'name'],
      key: 'productName',
      render: (text, record) => record.product?.name || 'N/A',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => `${rating}/5 ⭐`,
    },
    {
      title: 'Bình luận gốc',
      dataIndex: 'originalComment',
      key: 'originalComment',
      render: (text) => (
        <div className="max-w-xs truncate" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: 'Phản hồi',
      dataIndex: 'reply',
      key: 'reply',
      render: (text) => (
        <div className="max-w-xs truncate" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: 'Ngày phản hồi',
      dataIndex: 'repliedAt',
      key: 'repliedAt',
      render: (date) => formatDate(date),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!accountDetail) {
    return (
      <div className="text-center py-8">
        <p>Không thể tải thông tin chi tiết tài khoản</p>
        <Button onClick={() => navigate('/admin/accounts')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/admin/accounts')}
          className="mb-4"
        >
          Quay lại danh sách tài khoản
        </Button>
        <h1 className="text-2xl font-bold">Chi tiết tài khoản</h1>
      </div>

      {/* Admin Info */}
      <Card className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar 
            src={accountDetail.adminInfo?.avatar?.url} 
            size={80}
          >
            {accountDetail.adminInfo?.name?.charAt(0)}
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">{accountDetail.adminInfo?.name}</h2>
            <p className="text-gray-600 text-lg">@{accountDetail.adminInfo?.username}</p>
            <div className="mt-2">
              <Tag 
                color={accountDetail.adminInfo?.isActive ? 'green' : 'red'}
                className="text-sm px-3 py-1"
              >
                {accountDetail.adminInfo?.isActive ? 'Đang hoạt động' : 'Đã dừng'}
              </Tag>
            </div>
          </div>
        </div>
      </Card>

      {/* Activity Summary */}
      <Card title="Tổng quan hoạt động" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Inventory Stats */}
          <div className="border rounded-lg p-6 bg-blue-50">
            <h4 className="font-semibold mb-4 text-blue-800">Quản lý kho</h4>
            <div className="space-y-3">
              <Statistic
                title="Tổng số lô hàng"
                value={accountDetail.activitySummary?.inventory?.totalBatches || 0}
                valueStyle={{ color: '#1890ff' }}
              />
              <Statistic
                title="Tổng số lượng nhập"
                value={accountDetail.activitySummary?.inventory?.totalQuantityImported || 0}
                valueStyle={{ color: '#1890ff' }}
              />
              <Statistic
                title="Tổng giá trị nhập"
                value={accountDetail.activitySummary?.inventory?.totalValueImported || 0}
                formatter={(value) => formatPrice(value)}
                valueStyle={{ color: '#1890ff' }}
              />
            </div>
          </div>

          {/* Orders Stats */}
          <div className="border rounded-lg p-6 bg-green-50">
            <h4 className="font-semibold mb-4 text-green-800">Quản lý đơn hàng</h4>
            <div className="space-y-3">
              <Statistic
                title="Tổng đơn hàng xử lý"
                value={accountDetail.activitySummary?.orders?.totalOrdersHandled || 0}
                valueStyle={{ color: '#52c41a' }}
              />
              <Statistic
                title="Tổng lần cập nhật trạng thái"
                value={accountDetail.activitySummary?.orders?.totalStatusUpdates || 0}
                valueStyle={{ color: '#52c41a' }}
              />
            </div>
          </div>

          {/* Reviews Stats */}
          <div className="border rounded-lg p-6 bg-orange-50">
            <h4 className="font-semibold mb-4 text-orange-800">Quản lý đánh giá</h4>
            <div className="space-y-3">
              <Statistic
                title="Tổng số phản hồi"
                value={accountDetail.activitySummary?.reviews?.totalReplies || 0}
                valueStyle={{ color: '#fa8c16' }}
              />
              <Statistic
                title="Đánh giá trung bình"
                value={accountDetail.activitySummary?.reviews?.avgRatingOfRepliedReviews || 0}
                precision={1}
                suffix="⭐"
                valueStyle={{ color: '#fa8c16' }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card title="Hoạt động gần đây">
        <Tabs 
          activeKey={activeTab} 
          onChange={(key) => {
            setActiveTab(key);
            setCurrentPage(1);
          }}
          items={[
            {
              key: 'inventory',
              label: 'Quản lý kho',
              children: (
                <Table
                  columns={inventoryColumns}
                  dataSource={getCurrentPageData()}
                  rowKey="_id"
                  pagination={false}
                  scroll={{ x: true }}
                />
              ),
            },
            {
              key: 'orders',
              label: 'Quản lý đơn hàng',
              children: (
                <Table
                  columns={orderColumns}
                  dataSource={getCurrentPageData()}
                  rowKey="orderId"
                  pagination={false}
                  scroll={{ x: true }}
                />
              ),
            },
            {
              key: 'reviews',
              label: 'Quản lý đánh giá',
              children: (
                <Table
                  columns={reviewColumns}
                  dataSource={getCurrentPageData()}
                  rowKey="_id"
                  pagination={false}
                  scroll={{ x: true }}
                />
              ),
            },
          ]}
        />

        {getTabData().length > pageSize && (
          <div className="mt-4 flex justify-end">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={getTabData().length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} của ${total} mục`
              }
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default AccountDetail;
