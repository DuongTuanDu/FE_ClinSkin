import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Checkbox, message } from "antd";
import { useDispatch } from "react-redux";
import { loginUser, sendOtp } from "@redux/auth/auth.thunk";
import { set } from "@storage/storage";
import { setEmailVerify } from "@redux/auth/auth.slice";
import Cookies from "js-cookie";
import CustomButton from "../CustomButton";

const Login = ({ setStep, isModel, onClose }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialValues = {
        email: Cookies.get("email") || "",
        password: Cookies.get("password") || "",
        remember: false,
    };

    const handleSubmit = async (values) => {
        const { email, password, remember } = values;

        dispatch(loginUser({ email, password })).then((res) => {
            const data = res.payload;
            if (res.payload.success) {
                if (remember) {
                    Cookies.set("email", email, { expires: 30 });
                    Cookies.set("password", password, { expires: 30 });
                }
                set("ACCESS_TOKEN", data.accessToken);
                message.success("Đăng nhập thành công");
                if (isModel) {
                    onClose();
                    return;
                }
                navigate("/");
                return;
            }
            if (data?.data?.verify === false) {
                dispatch(setEmailVerify(data?.data?.email));
                dispatch(sendOtp({ email: data?.data?.email }));
                setStep("verify");
                return;
            }
        });
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={handleSubmit}
            className="space-y-6"
            requiredMark={false}
        >
            <div className="text-xl font-bold text-center">ĐĂNG NHẬP</div>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                ]}
            >
                <Input size="large" placeholder="Nhập email..." />
            </Form.Item>

            <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
                <Input.Password size="large" placeholder="Nhập mật khẩu..." />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
                <div className="flex items-center justify-between">
                    <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                    <div className="flex justify-between items-center">
                        <div
                            onClick={() => setStep("sendOtp")}
                            className="text-sm font-medium text-sky-950 hover:text-sky-800 cursor-pointer"
                        >
                            Quên mật khẩu?
                        </div>
                    </div>
                </div>
            </Form.Item>
            <Form.Item>
                <CustomButton
                    variant="primary"
                    type="submit"
                    className="w-full mt-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                >
                    Đăng nhập
                </CustomButton>
            </Form.Item>

            <div className="mt-4 text-sm text-gray-600 text-center">
                <p>
                    Bạn chưa có tài khoản?{" "}
                    <span
                        onClick={() => setStep("register")}
                        className="cursor-pointer font-bold"
                    >
                        Đăng ký
                    </span>
                </p>
            </div>

            <div className="mt-4 flex flex-col lg:flex-row items-center justify-between">
                <button
                    type="button"
                    className="p-3 w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="w-4"
                        id="google"
                    >
                        <path
                            fill="#fbbb00"
                            d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"
                        ></path>
                        <path
                            fill="#518ef8"
                            d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"
                        ></path>
                        <path
                            fill="#28b446"
                            d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"
                        ></path>
                        <path
                            fill="#f14336"
                            d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"
                        ></path>
                    </svg>
                    Google
                </button>
            </div>
        </Form>
    );
};

export default Login;
