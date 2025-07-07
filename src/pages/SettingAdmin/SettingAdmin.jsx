import React, { useEffect, useState } from "react";
import { Form, Input, message, Upload } from "antd";
import CustomButton from "@/components/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteFile,
    UPLOAD_CLINSKIN_ADMIN_PRESET,
    uploadFile,
} from "@/helpers/uploadCloudinary";
import { updateAccountAdmin } from "@/redux/auth/auth.thunk";
import { IoCloudUpload } from "react-icons/io5";
import { setAdminInfo } from "@/redux/auth/auth.slice";

const SettingAdmin = () => {
    const dispatch = useDispatch();
    const { adminInfo } = useSelector((state) => state.auth);
    console.log("adminInfo", adminInfo);
    
    const [form] = Form.useForm();
    const [avatar, setAvatar] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (adminInfo) {
            form.setFieldsValue({
                name: adminInfo.name,
                avatar: {
                    url: adminInfo.avatar.url,
                    publicId: adminInfo.avatar.publicId,
                },
            });
            setAvatar([
                { url: adminInfo.avatar.url, publicId: adminInfo.avatar.publicId },
            ]);
        }
    }, [adminInfo, form]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            let payload = {};
            if (avatar[0]?.originFileObj) {
                const result = await uploadFile({
                    file: avatar[0].originFileObj,
                    type: UPLOAD_CLINSKIN_ADMIN_PRESET,
                });

                if (adminInfo.avatar.publicId) {
                    await deleteFile(adminInfo.avatar.publicId);
                }
                
                payload = {
                    ...values,
                    avatar: { url: result.secure_url, publicId: result.public_id },
                };
            } else {
                payload = { ...values };
            }

            const res = await dispatch(
                updateAccountAdmin({ id: adminInfo?._id, data: payload })
            ).unwrap();

            if (res.success) {
                message.success(res.message);
                dispatch(setAdminInfo(res.data));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
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
                rules={[{ required: true, message: "Vui lòng chọn ảnh đại diện" }]}
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
                className="w-full lg:flex-1"
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
                className="w-full lg:flex-1"
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
                className="w-full lg:flex-1"
                dependencies={["password"]}
                rules={[
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value && getFieldValue("password")) {
                                return Promise.reject(
                                    new Error(
                                        "Vui lòng nhập mật khẩu mới nếu đã nhập mật khẩu cũ"
                                    )
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

            <CustomButton
                isLoading={loading}
                variant="primary"
                type="submit"
                className="w-full"
            >
                Cập nhật tài khoản
            </CustomButton>
        </Form>
    );
};

export default SettingAdmin;
