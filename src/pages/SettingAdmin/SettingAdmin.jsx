import React, { useEffect, useState } from "react";
import { Form, Input, Upload, message } from "antd";
import CustomButton from "@/components/CustomButton";
import { useSelector, useDispatch } from "react-redux";
import { IoCloudUpload } from "react-icons/io5";
import axios from "@/axios/axios";
import { getAccountAdmin } from "@/redux/auth/auth.thunk";

const SettingAdmin = () => {
    const dispatch = useDispatch();
    const { adminInfo } = useSelector((state) => state.auth);
    const [form] = Form.useForm();
    const [avatar, setAvatar] = useState([]);

    useEffect(() => {
        if (adminInfo) {
            form.setFieldsValue({
                name: adminInfo.name,
            });

            if (adminInfo.avatar?.url) {
                setAvatar([
                    {
                        uid: "-1",
                        name: "avatar.png",
                        status: "done",
                        url: adminInfo.avatar.url,
                    },
                ]);
            }
        }
    }, [adminInfo, form]);

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append("name", values.name);

        if (avatar.length > 0 && avatar[0].originFileObj) {
            formData.append("avatar", avatar[0].originFileObj);
        }

        if (values.password && values.newPassword) {
            formData.append("password", values.password);
            formData.append("newPassword", values.newPassword);
        }

        try {
            const res = await axios.put(
                `/admin/auth/update-profile/${adminInfo._id}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (res.data.success) {
                message.success("Cập nhật tài khoản thành công");
                dispatch(getAccountAdmin());
                form.resetFields(["password", "newPassword"]);
            } else {
                message.success("Cập nhật tài khoản thành công");
            }
        } catch (error) {
            message.error(error?.response?.data?.message || "Đã xảy ra lỗi");
        }
    };

    return (
        <Form
            requiredMark={false}
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="py-4 min-w-96 max-w-xl mx-auto"
        >
            <Form.Item
                name="avatar"
                className="flex items-center justify-center w-full"
            >
                <Upload
                    accept="image/*"
                    onChange={({ fileList }) => setAvatar(fileList)}
                    fileList={avatar}
                    listType="picture-circle"
                    beforeUpload={() => false}
                    maxCount={1}
                >
                    {avatar.length === 0 && (
                        <div className="flex flex-col items-center">
                            <IoCloudUpload className="w-6 h-6" />
                            <div className="mt-2">Tải ảnh</div>
                        </div>
                    )}
                </Upload>
            </Form.Item>

            <Form.Item
                name="name"
                label="Họ và tên"
                rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                    { min: 3, message: "Họ và tên phải có ít nhất 3 ký tự" },
                ]}
            >
                <Input
                    size="large"
                    placeholder="Nhập họ tên..."
                    className="w-full mt-1"
                />
            </Form.Item>

            <Form.Item
                name="password"
                label="Mật khẩu cũ"
                dependencies={["newPassword"]}
                rules={[
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value && getFieldValue("newPassword")) {
                                return Promise.reject(
                                    new Error("Vui lòng nhập mật khẩu cũ nếu muốn đổi mật khẩu")
                                );
                            }
                            return Promise.resolve();
                        },
                    }),
                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                ]}
            >
                <Input.Password
                    size="large"
                    placeholder="Nhập mật khẩu cũ..."
                    className="w-full mt-1"
                />
            </Form.Item>

            <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                dependencies={["password"]}
                rules={[
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value && getFieldValue("password")) {
                                return Promise.reject(
                                    new Error("Vui lòng nhập mật khẩu mới nếu đã nhập mật khẩu cũ")
                                );
                            }
                            if (value && value === getFieldValue("password")) {
                                return Promise.reject(
                                    new Error("Mật khẩu mới không được giống với mật khẩu cũ")
                                );
                            }
                            return Promise.resolve();
                        },
                    }),
                    { min: 6, message: "Mật khẩu mới phải có ít nhất 6 ký tự" },
                ]}
            >
                <Input.Password
                    size="large"
                    placeholder="Nhập mật khẩu mới..."
                    className="w-full mt-1"
                />
            </Form.Item>

            <CustomButton variant="primary" type="submit" className="w-full">
                Cập nhật tài khoản
            </CustomButton>
        </Form>
    );
};

export default SettingAdmin;
