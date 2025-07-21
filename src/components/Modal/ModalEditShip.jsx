import React, { useEffect, useState, useCallback } from "react";
import { Input, message, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import ErrorMessage from "@components/Error/ErrorMessage";
import { getDistrict, getProvince, getWard } from "@redux/ship/ship.thunk";
import { validateEditShipSchema, validateForm } from "@validate/validate";
import { getOrderHistory, updateOrderByUser } from "@redux/order/order.thunk";

const ModalEditShip = ({ open, setOpen, order = {}, refetch }) => {
    const dispatch = useDispatch();
    const { provinces, districts, wards, isLoading } = useSelector((state) => state.ship);

    const { pagination } = useSelector((state) => state.order);
    const [input, setInput] = useState({
        name: "",
        phone: "",
        province: { id: "", name: "" },
        district: { id: "", name: "" },
        ward: { id: "", name: "" },
        address: "",
    });

    const [validates, setValidates] = useState({});

    useEffect(() => {
        if (open) {
            dispatch(getProvince());
        }
    }, [open, dispatch]);

    useEffect(() => {
        if (open && !isEmpty(order)) {
            setInput({
                name: order.name,
                phone: order.phone,
                address: order.addressDetail,
                province: order.address.province,
                district: order.address.district,
                ward: order.address.ward,
            });
            if (order.address.province.id) {
                dispatch(getDistrict(order.address.province.id));
            }
            if (order.address.district.id) {
                dispatch(getWard(order.address.district.id));
            }
        }
    }, [open, order, dispatch]);

    const handleInputChange = useCallback((name, value) => {
        setInput(prev => ({ ...prev, [name]: value }));
        setValidates(prev => ({ ...prev, [name]: "" }));
    }, []);

    const handleProvinceChange = useCallback((value) => {
        const selectedProvince = provinces.find(p => p.ProvinceID === value);
        setInput(prev => ({
            ...prev,
            province: { id: value, name: selectedProvince.ProvinceName },
            district: { id: "", name: "" },
            ward: { id: "", name: "" },
        }));
        setValidates((prev) => ({
            ...prev,
            'province.id': ""
        }));
        dispatch(getDistrict(value));
    }, [provinces, dispatch]);

    const handleDistrictChange = useCallback((value) => {
        const selectedDistrict = districts.find(d => d.DistrictID === value);
        setInput(prev => ({
            ...prev,
            district: { id: value, name: selectedDistrict.DistrictName },
            ward: { id: "", name: "" },
        }));
        setValidates((prev) => ({
            ...prev,
            'district.id': ""
        }));
        dispatch(getWard(value));
    }, [districts, dispatch]);

    const handleWardChange = useCallback((value) => {
        const selectedWard = wards.find(w => w.WardCode === value);
        setInput(prev => ({
            ...prev,
            ward: { id: value, name: selectedWard.WardName },
        }));
        setValidates((prev) => ({
            ...prev,
            'ward.id': ""
        }));
    }, [wards]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = await validateForm({
            input,
            validateSchema: validateEditShipSchema,
        });
        if (Object.keys(validationErrors).length > 0) {
            setValidates(validationErrors);
            return;
        }

        const payload = {
            name: input.name,
            phone: input.phone,
            address: {
                province: input.province,
                district: input.district,
                ward: input.ward,
            },
            addressDetail: input.address,
        };

        const res = await dispatch(updateOrderByUser({ id: order._id, data: payload })).unwrap()
        if (res.success) {
            message.success(res.message)
            dispatch(getOrderHistory({
                page: pagination.page,
                pageSize: pagination.pageSize,
                status: order.status
            }))
            handleClose()
            refetch()
            return
        }
    };

    const handleClose = () => {
        setOpen(false)
        setInput(prev => ({
            ...prev,
            name: "",
            phone: "",
            province: { id: "", name: "" },
            district: { id: "", name: "" },
            ward: { id: "", name: "" },
            address: "",
        }))
    }

    return (
        <Modal
            open={open}
            title={<div className="text-2xl font-bold text-center">Cập nhật địa chỉ nhận hàng</div>}
            onOk={handleSubmit}
            onCancel={handleClose}
            footer={[
                <button
                    key="cancel"
                    onClick={handleClose}
                    className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 border px-6 py-2 rounded-full transition duration-300 ease-in-out"
                >
                    Hủy
                </button>,
                <button
                    key="submit"
                    onClick={handleSubmit}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out mx-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cập nhật
                </button>,
            ]}
            width={800}
        >
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['name', 'phone'].map((field) => (
                        <div key={field} className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field === 'name' ? 'Tên người nhận:' : 'Số điện thoại:'}
                            </label>
                            <Input
                                value={input[field]}
                                onChange={(e) => handleInputChange(field, e.target.value)}
                                size="large"
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {validates[field] && <ErrorMessage message={validates[field]} />}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh thành:</label>
                        <Select
                            disabled={isLoading}
                            loading={isLoading}
                            value={!isLoading ? input.province.id : ""}
                            onChange={handleProvinceChange}
                            size="large"
                            className="w-full"
                        >
                            {provinces?.map((province) => (
                                <Select.Option key={province.ProvinceID} value={province.ProvinceID}>
                                    {province.ProvinceName}
                                </Select.Option>
                            ))}
                        </Select>
                        {validates['province.id'] && <ErrorMessage message={validates['province.id']} />}
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quận huyện:</label>
                        <Select
                            loading={isLoading}
                            value={!isLoading ? input.district.id : ""}
                            onChange={handleDistrictChange}
                            size="large"
                            className="w-full"
                            disabled={!input.province.id || isLoading}
                        >
                            {districts?.map((district) => (
                                <Select.Option key={district.DistrictID} value={district.DistrictID}>
                                    {district.DistrictName}
                                </Select.Option>
                            ))}
                        </Select>
                        {validates['district.id'] && <ErrorMessage message={validates['district.id']} />}
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phường xã:</label>
                        <Select
                            loading={isLoading}
                            value={!isLoading ? String(input.ward.id) : ""}
                            onChange={handleWardChange}
                            size="large"
                            className="w-full"
                            disabled={!input.district.id || isLoading}
                        >
                            {wards?.map((ward) => (
                                <Select.Option key={ward.WardCode} value={ward.WardCode}>
                                    {ward.WardName}
                                </Select.Option>
                            ))}
                        </Select>
                        {validates['ward.id'] && <ErrorMessage message={validates['ward.id']} />}
                    </div>
                </div>
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ:</label>
                    <Input
                        value={input.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        size="large"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {validates.address && <ErrorMessage message={validates.address} />}
                </div>
            </form>
        </Modal>
    );
};

export default ModalEditShip;