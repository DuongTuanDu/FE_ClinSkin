import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Input, message } from "antd";
import { registerUser } from "@redux/auth/auth.thunk";
import { setEmailVerify } from "@redux/auth/auth.slice";
import CustomButton from "../CustomButton";

const Register = ({ setStep }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const { name, email, password, rePassword } = values;

        if (password !== rePassword) {
            message.error("Mật khẩu nhập lại không trùng khớp");
            return;
        }

        dispatch(registerUser({ name, email, password })).then((res) => {
            if (res.payload.success) {
                message.success(res.payload.message);
                dispatch(setEmailVerify(email));
                navigate("/auth");
                setStep("verify");
                return;
            }
        });
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-6"
            requiredMark={false}
        >
            <div className="text-xl font-bold text-center">ĐĂNG KÝ</div>

            <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
                <Input placeholder="Nhập họ và tên..." size="large" />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                ]}
            >
                <Input placeholder="Nhập email..." size="large" />
            </Form.Item>

            <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                ]}
            >
                <Input.Password placeholder="Nhập mật khẩu..." size="large" />
            </Form.Item>

            <Form.Item
                name="rePassword"
                label="Nhập lại mật khẩu"
                dependencies={["password"]}
                rules={[
                    { required: true, message: "Vui lòng nhập lại mật khẩu" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(
                                new Error("Mật khẩu nhập lại không trùng khớp")
                            );
                        },
                    }),
                ]}
            >
                <Input.Password placeholder="Nhập lại mật khẩu..." size="large" />
            </Form.Item>

            <Form.Item>
                <CustomButton
                    variant="primary"
                    type="submit"
                    className="w-full mt-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                >
                    Đăng ký
                </CustomButton>
            </Form.Item>

            <div className="mt-4 text-sm text-gray-600 text-center">
                <p>
                    Bạn đã có tài khoản?{" "}
                    <span
                        onClick={() => {
                            navigate("/auth");
                            setStep("login");
                        }}
                        className="cursor-pointer font-bold"
                    >
                        Đăng nhập
                    </span>
                </p>
            </div>
        </Form>
    );
};

export default Register;
