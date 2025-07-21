import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Radio, Input, Space, message } from "antd";
import { updateStatusOrderByUser } from "@redux/order/order.thunk";

const cancellationReasons = [
    "Tôi muốn thay đổi địa chỉ giao hàng",
    "Tôi muốn thay đổi phương thức thanh toán",
    "Tôi tìm thấy sản phẩm tương tự với giá tốt hơn",
    "Tôi đặt nhầm sản phẩm",
    "Tôi không còn nhu cầu mua sản phẩm này nữa",
    "Lý do khác"
];

const ModalReasonCancel = ({ open, setOpen, orderId, setOrderId, refetch }) => {
    const dispatch = useDispatch();
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    const handleSubmit = async () => {
        const finalReason = selectedReason === "Lý do khác" ? otherReason : selectedReason;
        const res = await dispatch(updateStatusOrderByUser({ id: orderId, data: { status: 'cancelled', cancelReason: finalReason } })).unwrap()
        if (res.success) {
            message.success(res.message)
            refetch()
            handleClose()
        }
    };

    const handleClose = () => {
        setSelectedReason("");
        setOtherReason("");
        setOpen(false);
        setOrderId("")
    };

    return (
        <Modal
            open={open}
            title={<div className="text-2xl font-bold text-center">Yêu cầu hủy đơn hàng</div>}
            onOk={handleSubmit}
            onCancel={handleClose}
            footer={[
                <button
                    key="cancel"
                    onClick={handleClose}
                    className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 border px-6 py-2 rounded-full transition duration-300 ease-in-out"
                >
                    Đóng
                </button>,
                <button
                    key="submit"
                    onClick={handleSubmit}
                    disabled={!selectedReason || (selectedReason === "Lý do khác" && !otherReason)}
                    className="bg-rose-600 hover:bg-rose-800 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out mx-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Hủy đơn hàng
                </button>,
            ]}
            width={500}
        >
            <div className="mt-4">
                <Radio.Group onChange={(e) => setSelectedReason(e.target.value)} value={selectedReason}>
                    <Space direction="vertical">
                        {cancellationReasons.map((reason, index) => (
                            <Radio key={index} value={reason}>
                                {reason}
                            </Radio>
                        ))}
                    </Space>
                </Radio.Group>

                {selectedReason === "Lý do khác" && (
                    <Input.TextArea
                        placeholder="Vui lòng nhập lý do của bạn"
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        className="mt-4"
                        rows={4}
                    />
                )}
            </div>
        </Modal>
    );
};

export default ModalReasonCancel;