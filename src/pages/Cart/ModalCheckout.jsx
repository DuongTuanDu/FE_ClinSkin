import React, { useState, useEffect } from "react";
import { Collapse, Drawer, Form, Input, Radio, Card, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { orderCod } from "@redux/order/order.thunk";
import { useNavigate } from "react-router-dom";
import { setOrderReturn } from "@redux/order/order.slide";
import { MdVerifiedUser, MdLocationOn, MdCheckCircle } from "react-icons/md";
import CartOrder from "./CartOrder";
import { formatPrice } from "@helpers/formatPrice";
import CustomButton from "@/components/CustomButton";
import { setOpenModelAuth } from "@/redux/auth/auth.slice";
import { removeProductAfterOrderSuccess } from "@/redux/cart/cart.slice";

const { Text } = Typography;

const ModalCheckout = ({ addresses = [], isLoadingAddress, open, setOpen, products = [], totalAmount = 0 }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
    console.log("userInfo", userInfo);
    
    const { socketCustomer: socket } = useSelector((state) => state.socket);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    // Set default address on component mount
    useEffect(() => {
        if (addresses.length > 0) {
            const defaultAddress = addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddress(defaultAddress);
            } else {
                setSelectedAddress(addresses[0]);
            }
        }
    }, [addresses]);

    useEffect(() => {
        if (userInfo) {
            form.setFieldsValue({
                name: userInfo.name || '',
                phone: userInfo.phone || ''
            });
        }
    }, [userInfo, form]);

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
    };

    const handleSubmit = async (values) => {
        try {
            if (!isAuthenticated) {
                dispatch(setOpenModelAuth(true));
                return;
            }

            if (!selectedAddress) {
                message.error("Vui lòng chọn địa chỉ giao hàng");
                return;
            }

            setIsLoading(true);
            const order = {
                name: values.name,
                phone: values.phone,
                address: {
                    province: selectedAddress.province,
                    district: selectedAddress.district,
                    ward: selectedAddress.ward,
                },
                addressDetail: selectedAddress.street,
                note: values.note || "",
                paymentMethod: values.paymentMethod?.toLowerCase() || "cod",
                products,
                totalAmount,
            };

            switch (order.paymentMethod) {
                case "cod":
                    dispatch(orderCod(order)).then((res) => {
                        if (res.payload.success) {
                            products.forEach((item) =>
                                dispatch(
                                    removeProductAfterOrderSuccess({
                                        productId: item.productId
                                    })
                                )
                            );
                            socket?.emit(
                                "createOrder",
                                JSON.stringify({
                                    order: res.payload.data,
                                    model: "User",
                                    recipient: res.payload.data.user,
                                })
                            );

                            setSelectedAddress(null);
                            form.resetFields();
                            dispatch(setOrderReturn(res.payload.data));
                            navigate("/order-return");
                        }
                    });
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const AddressCard = ({ address, isSelected, onSelect }) => (
        <Card
            className={`mb-3 cursor-pointer transition-all duration-200 ${isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
            onClick={() => onSelect(address)}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <MdLocationOn className="text-gray-500" />
                        <Text strong className="text-sm">
                            {address.label}
                        </Text>
                        {address.isDefault && (
                            <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                                Mặc định
                            </span>
                        )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                        <div>{address.street}</div>
                        <div>
                            {address.ward.name}, {address.district.name}, {address.province.name}
                        </div>
                    </div>
                </div>
                {isSelected && (
                    <MdCheckCircle className="text-blue-500 text-xl flex-shrink-0" />
                )}
            </div>
        </Card>
    );

    return (
        <Drawer
            open={open}
            onClose={() => setOpen(false)}
            width={900}
            placement="right"
            closable={true}
            title="Thông tin đặt hàng"
        >
            <Collapse
                className="mb-6"
                items={[
                    {
                        key: "1",
                        label: (
                            <span className="text-base font-semibold text-gray-700">
                                Đơn hàng ({products.length} sản phẩm)
                            </span>
                        ),
                        children: <CartOrder products={products} />,
                    },
                ]}
            />

            {/* Address Selection Collapse */}
            <Collapse
                className="mb-6"
                defaultActiveKey={["address"]}
                items={[
                    {
                        key: "address",
                        label: (
                            <span className="text-base font-semibold text-gray-700">
                                Chọn địa chỉ giao hàng ({addresses.length} địa chỉ)
                            </span>
                        ),
                        children: (
                            <div className="max-h-64 overflow-y-auto">
                                {isLoadingAddress ? (
                                    <div className="text-center py-4">
                                        <Text type="secondary">Đang tải địa chỉ...</Text>
                                    </div>
                                ) : addresses.length > 0 ? (
                                    addresses.map((address) => (
                                        <AddressCard
                                            key={address._id}
                                            address={address}
                                            isSelected={selectedAddress?._id === address._id}
                                            onSelect={handleAddressSelect}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-4">
                                        <Text type="secondary">
                                            Chưa có địa chỉ nào. Vui lòng thêm địa chỉ trước khi đặt hàng.
                                        </Text>
                                    </div>
                                )}
                            </div>
                        ),
                    },
                ]}
            />

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ paymentMethod: "COD" }}
                requiredMark={false}
            >
                <div className="flex items-center gap-4">
                    <Form.Item
                        name="name"
                        label="Họ tên người nhận"
                        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                        className="flex-1"
                    >
                        <Input size="large" placeholder="Nhập họ tên" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại" },
                            { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" },
                        ]}
                        className="flex-1"
                    >
                        <Input size="large" placeholder="Nhập số điện thoại" />
                    </Form.Item>
                </div>

                <Form.Item name="note" label="Ghi chú (nếu có)">
                    <Input.TextArea rows={4} placeholder="Nhập ghi chú" />
                </Form.Item>

                <Form.Item name="paymentMethod" label="Phương thức thanh toán">
                    <Radio.Group className="flex">
                        <Radio
                            value="COD"
                            className="flex-1 bg-green-100 p-3 rounded-xl hover:bg-green-100 shadow-sm"
                        >
                            <div className="flex items-center">
                                <MdVerifiedUser className="text-green-500 mr-2 text-3xl" />
                                Thanh toán COD
                            </div>
                        </Radio>
                    </Radio.Group>
                </Form.Item>

                <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-800">
                        Tổng tiền:
                    </span>
                    <span className="text-base font-bold">
                        {formatPrice(totalAmount)}đ
                    </span>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <CustomButton
                        onClick={() => setOpen(false)}
                        className="!rounded-full"
                    >
                        Hủy
                    </CustomButton>
                    <CustomButton
                        loading={isLoading}
                        type="submit"
                        variant="primary"
                        className="hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 bg-gradient-to-r from-pink-500 to-purple-500 text-white !rounded-full"
                    >
                        Đặt hàng ngay
                    </CustomButton>
                </div>
            </Form>
        </Drawer>
    );
};

export default ModalCheckout;