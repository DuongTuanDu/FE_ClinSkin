import React, { useEffect } from 'react';
import { Card, Descriptions, Table, Tag, Typography, Divider, Space, Button, Spin, Empty, Image, Tooltip } from 'antd';
import { ShopOutlined, UserOutlined, PhoneOutlined, EnvironmentOutlined, PrinterOutlined, CalendarOutlined, SlackOutlined, CreditCardOutlined, SolutionOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderDetail } from "@redux/order/order.thunk";
import isEmpty from "lodash/isEmpty";
import { formatPrice } from "@helpers/formatPrice";

const { Title } = Typography;

const OrderDetail = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { order, isLoading } = useSelector(state => state.order)
    console.log("order", order);

    const { id } = useParams();

    useEffect(() => {
        if (id) dispatch(getOrderDetail(id));
    }, [id]);

    if (isLoading)
        return (
            <div className="flex items-center justify-center flex-col h-screen">
                <Spin size="large" />
            </div>
        );

    if (isEmpty(order)) return <Empty className="mt-24" />;

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "orange";
            case "processing": return "blue";
            case "shipping": return "cyan";
            case "delivered": return "green";
            case "cancelled": return "red";
            default: return "default";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "pending": return "Chờ xác nhận";
            case "processing": return "Đang xử lý";
            case "shipping": return "Đang giao";
            case "delivered": return "Đã giao";
            case "cancelled": return "Đã hủy";
            default: return status;
        }
    };

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <Image
                        src={record.image}
                        width={80}
                        height={80}
                        className="object-cover mr-2 rounded-md"
                    />
                    <span className="text-sm break-words max-w-96">{record.name}</span>
                </div>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${formatPrice(price)} đ`,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Tổng tiền',
            key: 'total',
            render: (_, record) => `${formatPrice(record.price * record.quantity)} đ`,
        },
    ];

    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="flex justify-end items-center mb-6">
                <Button icon={<PrinterOutlined />} type="primary">
                    In đơn hàng
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card title={<Title level={4}>Thông tin đơn hàng</Title>} className="shadow-sm">
                    <Descriptions column={1}>
                        <Descriptions.Item label={<Space><CalendarOutlined /> Ngày đặt hàng</Space>}>{new Date(order.createdAt).toLocaleString('vi-VN')}</Descriptions.Item>
                        <Descriptions.Item label={<Space><SlackOutlined /> Trạng thái</Space>}>
                            <Tag color={getStatusColor(order.status)}>{getStatusText(order.status)}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label={<Space><CreditCardOutlined /> Phương thức thanh toán</Space>} className='uppercase'>{order.paymentMethod}</Descriptions.Item>
                        <Descriptions.Item label={<Space><SolutionOutlined /> Ghi chú</Space>}>{order.note || 'Không có'}</Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card title={<Title level={4}>Thông tin khách hàng</Title>} className="shadow-sm">
                    <Descriptions column={1}>
                        <Descriptions.Item label={<Space><UserOutlined /> Tên</Space>}>{order.name}</Descriptions.Item>
                        <Descriptions.Item label={<Space><PhoneOutlined /> Số điện thoại</Space>}>{order.phone}</Descriptions.Item>
                        <Descriptions.Item label={<Space><EnvironmentOutlined /> Địa chỉ</Space>}>
                            {`${order.addressDetail}, ${order.address.ward.name}, ${order.address.district.name}, ${order.address.province.name}`}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>

            <Card title={<Title level={4}>Danh sách sản phẩm</Title>} className="shadow-sm mb-6">
                <Table
                    columns={columns}
                    dataSource={order.products}
                    pagination={false}
                    rowKey="productId"
                />
            </Card>

            <Card className="shadow-sm">
                <div className="flex justify-between items-center">
                    <Title level={4}><ShopOutlined /> Tổng tiền</Title>
                    <Title level={4}>
                        {formatPrice(order.totalAmount)} đ
                    </Title>
                </div>
            </Card>

            <Divider />

            <div className="flex justify-end space-x-4">
                <Button onClick={() => navigate('/admin/orders')} size="large">Quay lại</Button>
            </div>
        </div>
    );
};

export default OrderDetail;