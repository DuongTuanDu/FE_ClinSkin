import CustomButton from "@/components/CustomButton";
import { updateStatusOrderByAdmin } from "@/redux/order/order.thunk";
import { Form, Input, message, Modal, Radio } from "antd";
import React, { useState } from "react";
import { IoMdArrowRoundBack, IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";

const OrderCancelByAdmin = ({ open, onClose, order }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const cancelReasons = [
    "Khách hàng yêu cầu hủy đơn hàng",
    "Hết hàng trong kho",
    "Thông tin giao hàng không chính xác hoặc không đủ",
    "Khách hàng không nhận hàng tại thời điểm giao",
    "Không liên lạc được với khách hàng",
    "Thời gian giao hàng bị trễ quá lâu",
    "Đơn hàng trùng lặp do lỗi hệ thống",
    "Lý do kỹ thuật hoặc lỗi hệ thống",
    "Khách hàng yêu cầu thay đổi sản phẩm trong đơn hàng",
    "Khác",
  ];

  const handleFinish = async (values) => {
    try {
      setIsLoading(true);
      const reason =
        values.reason === "Khác" ? values.customReason : values.reason;
      const res = await dispatch(
        updateStatusOrderByAdmin({
          id: order?._id,
          data: {
            status: "cancelled",
            cancelReason: reason,
          },
        })
      ).unwrap();
      if (res.success) {
        message.success(res.message);
        form.resetFields();
        onClose(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Xác nhận hủy đơn hàng"
      open={open}
      onCancel={() => onClose(false)}
      footer={null}
      className="max-w-2xl"
    >
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="reason"
          label="Vui lòng chọn lý do hủy:"
          rules={[{ required: true, message: "Vui lòng chọn lý do hủy" }]}
        >
          <Radio.Group className="flex flex-col gap-3">
            {cancelReasons.map((reason) => (
              <Radio key={reason} value={reason} className="text-gray-700">
                {reason}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prev, curr) => prev?.reason !== curr?.reason}
        >
          {({ getFieldValue }) =>
            getFieldValue("reason") === "Khác" && (
              <Form.Item
                name="customReason"
                rules={[{ required: true, message: "Vui lòng nhập lý do hủy" }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập lý do hủy chi tiết..."
                  className="resize-none"
                />
              </Form.Item>
            )
          }
        </Form.Item>

        <div className="flex justify-end gap-4 mt-6">
          <CustomButton
            onClick={() => onClose(false)}
            icon={<IoMdArrowRoundBack />}
            className="!rounded-full"
          >
            Đóng
          </CustomButton>
          <CustomButton
            type="submit"
            variant="danger"
            loading={isLoading}
            icon={<IoMdClose />}
            className="!rounded-full"
          >
            Xác nhận hủy
          </CustomButton>
        </div>
      </Form>
    </Modal>
  );
};

export default OrderCancelByAdmin;
