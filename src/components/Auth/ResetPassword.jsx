import React from "react";
import { Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "@redux/auth/auth.thunk";
import { setEmailVerify } from "@redux/auth/auth.slice";
import CustomButton from "../CustomButton";

const ResetPassword = ({ setStep, setIsReset }) => {
    const dispatch = useDispatch();
    const { emailVerify } = useSelector((state) => state.auth);

    const handleSubmit = async (values) => {
        const { password, rePassword } = values;

        if (password !== rePassword) {
            message.error("Mật khẩu nhập lại không trùng khớp!");
            return;
        }

        try {
            const res = await dispatch(
                resetPassword({
                    email: emailVerify,
                    password,
                })
            ).unwrap();

            if (res.success) {
                message.success(res.message);
                dispatch(setEmailVerify(""));
                setStep("login");
                setIsReset(false);
            }
        } catch (error) {
            message.error("Đã xảy ra lỗi khi đặt lại mật khẩu.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-xl font-bold text-center">ĐẶT LẠI MẬT KHẨU</div>
            <Form
                layout="vertical"
                requiredMark={false}
                onFinish={handleSubmit}
                className="space-y-4"
            >
                <Form.Item
                    name="password"
                    label="Mật khẩu mới"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập mật khẩu mới!",
                        },
                        {
                            min: 6,
                            message: "Mật khẩu phải có ít nhất 6 ký tự!",
                        },
                    ]}
                >
                    <Input.Password placeholder="Nhập mật khẩu mới" size="large" />
                </Form.Item>

                <Form.Item
                    name="rePassword"
                    label="Xác nhận mật khẩu mới"
                    dependencies={["password"]}
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng xác nhận lại mật khẩu!",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error("Mật khẩu nhập lại không trùng khớp!")
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Xác nhận mật khẩu mới" size="large" />
                </Form.Item>
                <Form.Item>
                    <CustomButton
                        variant="primary"
                        type="submit"
                        className="w-full mt-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                    >
                        Đặt lại mật khẩu
                    </CustomButton>
                </Form.Item>
            </Form>

            <div className="mt-4 text-base text-gray-600 text-center font-bold">
                <span onClick={() => setStep("login")} className="cursor-pointer">
                    Quay lại đăng nhập
                </span>
            </div>
        </div>
    );
};

export default ResetPassword;
