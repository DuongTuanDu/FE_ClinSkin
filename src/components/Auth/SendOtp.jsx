import React from "react";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { sendOtp } from "@redux/auth/auth.thunk";
import { setEmailVerify } from "@redux/auth/auth.slice";
import CustomButton from "../CustomButton";

const SendOtp = ({ setStep, setIsReset }) => {
    const dispatch = useDispatch();

    const handleSubmit = async (values) => {
        const { email } = values;

        try {
            const res = await dispatch(sendOtp({ email })).unwrap();

            if (res.success) {
                message.success(res.message);
                dispatch(setEmailVerify(email));
                setIsReset(true);
                setStep("verify");
            }
        } catch (error) {
            message.error("Gửi OTP thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-xl font-bold text-center">GỬI MÃ OTP</div>
            <Form
                name="sendOtpForm"
                layout="vertical"
                requiredMark={false}
                onFinish={handleSubmit}
                className="space-y-4"
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email!" },
                        { type: "email", message: "Email không hợp lệ!" },
                    ]}
                >
                    <Input placeholder="Nhập email của bạn" size="large" />
                </Form.Item>
                <Form.Item>
                    <CustomButton
                        variant="primary"
                        type="submit"
                        className="w-full mt-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                    >
                        Gửi OTP
                    </CustomButton>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SendOtp;
