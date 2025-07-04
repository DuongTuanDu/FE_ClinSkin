// import React, { useState } from "react";
// import { Collapse, Drawer, Form, Input, Select, Radio } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import { orderCod } from "@redux/order/order.thunk";
// import { useNavigate } from "react-router-dom";
// import { setOrderReturn } from "@redux/order/order.slide";
// import { MdVerifiedUser } from "react-icons/md";
// import CartOrder from "./CartOrder";
// import { formatPrice } from "@helpers/formatPrice";
// import CustomButton from "@/components/CustomButton";
// import { useGetDistrictQuery, useGetProvinceQuery, useGetWardQuery } from "@/redux/ship/ship.query";
// import { setOpenModelAuth } from "@/redux/auth/auth.slice";
// import { removeProductAfterOrderSuccess } from "@/redux/cart/cart.slice";
// const { Option } = Select;

// const ModalCheckout = ({ open, setOpen, products = [], totalAmount = 0 }) => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { isAuthenticated } = useSelector((state) => state.auth);
//     const { address } = useSelector((state) => state.user);
//     console.log("address", address);
    
//     const [location, setLoacation] = useState({
//         province: {
//             id: "",
//             name: "",
//         },
//         district: {
//             id: "",
//             name: "",
//         },
//         ward: {
//             id: "",
//             name: "",
//         },
//     });
//     const { data: provinces = [], isLoading: isLoadingProvinces } =
//         useGetProvinceQuery();
//     const { data: districts = [], isLoading: isLoadingDistricts } =
//         useGetDistrictQuery(
//             { payload: location.province.id },
//             { skip: !location.province.id }
//         );
//     const { data: wards = [], isLoading: isLoadingWards } = useGetWardQuery(
//         { payload: location.district.id },
//         { skip: !location.district.id }
//     );
//     const [isLoading, setIsLoading] = useState(false);
//     const [form] = Form.useForm();

//     const handleChangeLocation = (key, value) => {
//         setLoacation((prev) => ({
//             ...prev,
//             [key]: value,
//         }));
//     };

//     const handleProvinceChange = (value) => {
//         const selected = provinces.find((p) => p.ProvinceID === value);
//         if (selected) {
//             handleChangeLocation("province", {
//                 id: selected.ProvinceID,
//                 name: selected.ProvinceName,
//             });
//             form.setFieldsValue({ district: undefined, ward: undefined });
//         }
//     };

//     const handleDistrictChange = (value) => {
//         const selected = districts.find((d) => d.DistrictID === value);
//         if (selected) {
//             handleChangeLocation("district", {
//                 id: selected.DistrictID,
//                 name: selected.DistrictName,
//             });
//             form.setFieldsValue({ ward: undefined });
//         }
//     };

//     const handleWardChange = (value) => {
//         const selected = wards.find((w) => w.WardCode === value);
//         if (selected) {
//             handleChangeLocation("ward", {
//                 id: selected.WardCode,
//                 name: selected.WardName,
//             });
//         }
//     };

//     const handleSubmit = async (values) => {
//         try {
//             if (!isAuthenticated) {
//                 dispatch(setOpenModelAuth(true));
//                 return;
//             }
//             setIsLoading(true);
//             const order = {
//                 name: values.name,
//                 phone: values.phone,
//                 address: {
//                     province: {
//                         id: parseInt(location.province.id),
//                         name: location.province.name
//                     },
//                     district: {
//                         id: parseInt(location.district.id),
//                         name: location.district.name
//                     },
//                     ward: {
//                         id: parseInt(location.ward.id),
//                         name: location.ward.name
//                     },
//                 },
//                 addressDetail: values.addressDetail,
//                 note: values.note || "",
//                 paymentMethod: values.paymentMethod?.toLowerCase() || "cod",
//                 products,
//                 totalAmount,
//             };

//             switch (order.paymentMethod) {
//                 case "cod":
//                     dispatch(orderCod(order)).then((res) => {
//                         if (res.payload.success) {
//                             products.forEach((item) =>
//                                 dispatch(
//                                     removeProductAfterOrderSuccess({
//                                         productId: item.productId
//                                     })
//                                 )
//                             );
//                             setLoacation((prev) => ({
//                                 ...prev,
//                                 province: {
//                                     id: "",
//                                     name: "",
//                                 },
//                                 district: {
//                                     id: "",
//                                     name: "",
//                                 },
//                                 ward: {
//                                     id: "",
//                                     name: "",
//                                 },
//                             }));
//                             form.resetFields();
//                             dispatch(setOrderReturn(res.payload.data));
//                             navigate("/order-return");
//                         }
//                     });
//                     break;

//                 default:
//                     break;
//             }
//         } catch (error) {
//             console.log(error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <Drawer
//             open={open}
//             onClose={() => setOpen(false)}
//             width={900}
//             placement="right"
//             closable={true}
//             title="Thông tin đặt hàng"
//         >
//             <Collapse
//                 className="mb-6"
//                 items={[
//                     {
//                         key: "1",
//                         label: (
//                             <span className="text-base font-semibold text-gray-700">
//                                 Đơn hàng ({products.length} sản phẩm)
//                             </span>
//                         ),
//                         children: <CartOrder products={products} />,
//                     },
//                 ]}
//             />

//             <Form
//                 form={form}
//                 layout="vertical"
//                 onFinish={handleSubmit}
//                 initialValues={{ paymentMethod: "COD" }}
//                 requiredMark={false}
//             >
//                 <div className="flex items-center gap-4">
//                     <Form.Item
//                         name="name"
//                         label="Họ tên người nhận"
//                         rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
//                         className="flex-1"
//                     >
//                         <Input size="large" placeholder="Nhập họ tên" />
//                     </Form.Item>

//                     <Form.Item
//                         name="phone"
//                         label="Số điện thoại"
//                         rules={[
//                             { required: true, message: "Vui lòng nhập số điện thoại" },
//                             { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" },
//                         ]}
//                         className="flex-1"
//                     >
//                         <Input size="large" placeholder="Nhập số điện thoại" />
//                     </Form.Item>
//                 </div>

//                 <Form.Item
//                     name="province"
//                     label="Tỉnh thành"
//                     rules={[{ required: true, message: "Vui lòng chọn tỉnh thành" }]}
//                 >
//                     <Select
//                         loading={isLoadingProvinces}
//                         onChange={handleProvinceChange}
//                         size="large"
//                         placeholder="Chọn tỉnh thành"
//                         showSearch
//                         optionFilterProp="children"
//                         filterOption={(input, option) =>
//                             option?.children?.toLowerCase().includes(input.toLowerCase())
//                         }
//                     >
//                         {provinces?.map((p) => (
//                             <Option key={p.ProvinceID} value={p.ProvinceID}>
//                                 {p.ProvinceName}
//                             </Option>
//                         ))}
//                     </Select>
//                 </Form.Item>

//                 <Form.Item
//                     name="district"
//                     label="Quận huyện"
//                     rules={[{ required: true, message: "Vui lòng chọn quận huyện" }]}
//                 >
//                     <Select
//                         loading={isLoadingDistricts}
//                         onChange={handleDistrictChange}
//                         size="large"
//                         placeholder="Chọn quận huyện"
//                         showSearch
//                         optionFilterProp="children"
//                         filterOption={(input, option) =>
//                             option?.children?.toLowerCase().includes(input.toLowerCase())
//                         }
//                     >
//                         {districts?.map((d) => (
//                             <Option key={d.DistrictID} value={d.DistrictID}>
//                                 {d.DistrictName}
//                             </Option>
//                         ))}
//                     </Select>
//                 </Form.Item>

//                 <Form.Item
//                     name="ward"
//                     label="Phường xã"
//                     rules={[{ required: true, message: "Vui lòng chọn phường xã" }]}
//                 >
//                     <Select
//                         onChange={handleWardChange}
//                         loading={isLoadingWards}
//                         size="large"
//                         placeholder="Chọn phường xã"
//                         showSearch
//                         optionFilterProp="children"
//                         filterOption={(input, option) =>
//                             option?.children?.toLowerCase().includes(input.toLowerCase())
//                         }
//                     >
//                         {wards?.map((w) => (
//                             <Option key={w.WardCode} value={w.WardCode}>
//                                 {w.WardName}
//                             </Option>
//                         ))}
//                     </Select>
//                 </Form.Item>

//                 <Form.Item
//                     name="addressDetail"
//                     label="Địa chỉ"
//                     rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
//                 >
//                     <Input size="large" placeholder="Nhập địa chỉ" />
//                 </Form.Item>

//                 <Form.Item name="note" label="Ghi chú (nếu có)">
//                     <Input.TextArea rows={4} placeholder="Nhập ghi chú" />
//                 </Form.Item>

//                 <Form.Item name="paymentMethod" label="Phương thức thanh toán">
//                     <Radio.Group className="flex">
//                         <Radio
//                             value="COD"
//                             className="flex-1 bg-green-100 p-3 rounded-xl hover:bg-green-100 shadow-sm"
//                         >
//                             <div className="flex items-center">
//                                 <MdVerifiedUser className="text-green-500 mr-2 text-3xl" />
//                                 Thanh toán COD
//                             </div>
//                         </Radio>
//                     </Radio.Group>
//                 </Form.Item>

//                 <div className="flex justify-between items-center">
//                     <span className="text-base font-semibold text-gray-800">
//                         Tổng tiền:
//                     </span>
//                     <span className="text-base font-bold">
//                         {formatPrice(totalAmount)}đ
//                     </span>
//                 </div>

//                 <div className="mt-6 flex justify-end space-x-4">
//                     <CustomButton
//                         onClick={() => setOpen(false)}
//                         className="!rounded-full"
//                     >
//                         Hủy
//                     </CustomButton>
//                     <CustomButton
//                         loading={isLoading}
//                         type="submit"
//                         variant="primary"
//                         className="hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 bg-gradient-to-r from-pink-500 to-purple-500 text-white !rounded-full"
//                     >
//                         Đặt hàng ngay
//                     </CustomButton>
//                 </div>
//             </Form>
//         </Drawer>
//     );
// };

// export default ModalCheckout;

import React, { useState, useEffect } from "react";
import { Collapse, Drawer, Form, Input, Select, Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { orderCod } from "@redux/order/order.thunk";
import { useNavigate } from "react-router-dom";
import { setOrderReturn } from "@redux/order/order.slide";
import { MdVerifiedUser } from "react-icons/md";
import CartOrder from "./CartOrder";
import { formatPrice } from "@helpers/formatPrice";
import CustomButton from "@/components/CustomButton";
import { useGetDistrictQuery, useGetProvinceQuery, useGetWardQuery } from "@/redux/ship/ship.query";
import { setOpenModelAuth } from "@/redux/auth/auth.slice";
import { removeProductAfterOrderSuccess } from "@/redux/cart/cart.slice";
const { Option } = Select;

const ModalCheckout = ({ open, setOpen, products = [], totalAmount = 0 }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
    const address = userInfo?.address;
    console.log("address", address);
    
    const [location, setLoacation] = useState({
        province: {
            id: "",
            name: "",
        },
        district: {
            id: "",
            name: "",
        },
        ward: {
            id: "",
            name: "",
        },
    });
    
    const [hasUserInteracted, setHasUserInteracted] = useState(false); // Flag để track user interaction

    // Queries for location data
    const { data: provinces = [], isLoading: isLoadingProvinces } =
        useGetProvinceQuery();
    const { data: districts = [], isLoading: isLoadingDistricts } =
        useGetDistrictQuery(
            { payload: location.province.id || address?.province },
            { skip: !location.province.id && !address?.province }
        );
    const { data: wards = [], isLoading: isLoadingWards } = useGetWardQuery(
        { payload: location.district.id || address?.district },
        { skip: !location.district.id && !address?.district }
    );

    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    // Effect to populate form with existing address data
    useEffect(() => {
        if (address && provinces.length > 0 && !hasUserInteracted) {
            // Find province name by ID
            const selectedProvince = provinces.find(p => p.ProvinceID.toString() === address.province);
            
            if (selectedProvince) {
                setLoacation(prev => ({
                    ...prev,
                    province: {
                        id: address.province,
                        name: selectedProvince.ProvinceName,
                    }
                }));
                
                // Set form values
                form.setFieldsValue({
                    province: parseInt(address.province)
                });
            }
        }
    }, [address, provinces, form, hasUserInteracted]);

    // Effect to populate district when districts data is loaded
    useEffect(() => {
        if (address && districts.length > 0 && location.province.id && !hasUserInteracted) {
            const selectedDistrict = districts.find(d => d.DistrictID.toString() === address.district);
            
            if (selectedDistrict) {
                setLoacation(prev => ({
                    ...prev,
                    district: {
                        id: address.district,
                        name: selectedDistrict.DistrictName,
                    }
                }));
                
                form.setFieldsValue({
                    district: parseInt(address.district)
                });
            }
        }
    }, [address, districts, location.province.id, form, hasUserInteracted]);

    // Effect to populate ward when wards data is loaded
    useEffect(() => {
        if (address && wards.length > 0 && location.district.id && !hasUserInteracted) {
            const selectedWard = wards.find(w => w.WardCode === address.ward);
            
            if (selectedWard) {
                setLoacation(prev => ({
                    ...prev,
                    ward: {
                        id: address.ward,
                        name: selectedWard.WardName,
                    }
                }));
                
                form.setFieldsValue({
                    ward: address.ward
                });
            }
        }
    }, [address, wards, location.district.id, form, hasUserInteracted]);

    const handleChangeLocation = (key, value) => {
        setLoacation((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleProvinceChange = (value) => {
        setHasUserInteracted(true); // Đánh dấu user đã tương tác
        const selected = provinces.find((p) => p.ProvinceID === value);
        if (selected) {
            handleChangeLocation("province", {
                id: selected.ProvinceID,
                name: selected.ProvinceName,
            });
            // Reset dependent fields
            handleChangeLocation("district", { id: "", name: "" });
            handleChangeLocation("ward", { id: "", name: "" });
            form.setFieldsValue({ district: undefined, ward: undefined });
        }
    };

    const handleDistrictChange = (value) => {
        setHasUserInteracted(true); // Đánh dấu user đã tương tác
        const selected = districts.find((d) => d.DistrictID === value);
        if (selected) {
            handleChangeLocation("district", {
                id: selected.DistrictID,
                name: selected.DistrictName,
            });
            // Reset ward when district changes
            handleChangeLocation("ward", { id: "", name: "" });
            form.setFieldsValue({ ward: undefined });
        }
    };

    const handleWardChange = (value) => {
        setHasUserInteracted(true); // Đánh dấu user đã tương tác
        const selected = wards.find((w) => w.WardCode === value);
        if (selected) {
            handleChangeLocation("ward", {
                id: selected.WardCode,
                name: selected.WardName,
            });
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (!isAuthenticated) {
                dispatch(setOpenModelAuth(true));
                return;
            }
            setIsLoading(true);
            const order = {
                name: values.name,
                phone: values.phone,
                address: {
                    province: {
                        id: parseInt(location.province.id),
                        name: location.province.name
                    },
                    district: {
                        id: parseInt(location.district.id),
                        name: location.district.name
                    },
                    ward: {
                        id: parseInt(location.ward.id),
                        name: location.ward.name
                    },
                },
                addressDetail: values.addressDetail,
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
                            setLoacation((prev) => ({
                                ...prev,
                                province: {
                                    id: "",
                                    name: "",
                                },
                                district: {
                                    id: "",
                                    name: "",
                                },
                                ward: {
                                    id: "",
                                    name: "",
                                },
                            }));
                            setHasUserInteracted(false); // Reset flag khi đặt hàng thành công
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

                <Form.Item
                    name="province"
                    label="Tỉnh thành"
                    rules={[{ required: true, message: "Vui lòng chọn tỉnh thành" }]}
                >
                    <Select
                        loading={isLoadingProvinces}
                        onChange={handleProvinceChange}
                        size="large"
                        placeholder="Chọn tỉnh thành"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option?.children?.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {provinces?.map((p) => (
                            <Option key={p.ProvinceID} value={p.ProvinceID}>
                                {p.ProvinceName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="district"
                    label="Quận huyện"
                    rules={[{ required: true, message: "Vui lòng chọn quận huyện" }]}
                >
                    <Select
                        loading={isLoadingDistricts}
                        onChange={handleDistrictChange}
                        size="large"
                        placeholder="Chọn quận huyện"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option?.children?.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {districts?.map((d) => (
                            <Option key={d.DistrictID} value={d.DistrictID}>
                                {d.DistrictName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="ward"
                    label="Phường xã"
                    rules={[{ required: true, message: "Vui lòng chọn phường xã" }]}
                >
                    <Select
                        onChange={handleWardChange}
                        loading={isLoadingWards}
                        size="large"
                        placeholder="Chọn phường xã"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option?.children?.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {wards?.map((w) => (
                            <Option key={w.WardCode} value={w.WardCode}>
                                {w.WardName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="addressDetail"
                    label="Địa chỉ"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                    <Input size="large" placeholder="Nhập địa chỉ" />
                </Form.Item>

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