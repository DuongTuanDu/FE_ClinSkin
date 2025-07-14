import { Form, Input, message, Modal, Select } from "antd";
import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createAccountAdmin, updateAccountAdmin } from "@redux/auth/auth.thunk";

const ModelAccountAction = ({
    open,
    onClose,
    account = {},
    setStateByAction,
}) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (!isEmpty(account)) {
            form.setFieldValue("name", account.name);
            form.setFieldValue("role", account.role);
            form.setFieldValue("username", account.username);
        }
    }, [account]);

    const handleSubmit = async (values) => {
        delete values.resPassword;
        const action = isEmpty(account) ? createAccountAdmin : updateAccountAdmin;
        const payload = isEmpty(account)
            ? values
            : { id: account._id, data: values };
        const res = await dispatch(action(payload)).unwrap();
        if (res.success) {
            form.resetFields();
            if (isEmpty(account)) {
                setStateByAction({
                    data: res.data,
                    action: "create",
                });
            } else {
                setStateByAction({
                    id: res.data._id,
                    data: res.data,
                    action: "update",
                });
            }
            message.success(res.message);
            onClose();
        }
    };

    return (
        <Modal
            title={isEmpty(account) ? "Tạo tài khoản quản trị" : "Cập nhật tài khoản"}
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                requiredMark={false}
            >
                <div className="flex gap-4 items-center">
                    <Form.Item
                        className="flex-1"
                        label="Họ và tên"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập họ và tên !" }]}
                    >
                        <Input size="large" placeholder="Họ và tên..." />
                    </Form.Item>
                    <Form.Item
                        className="flex-1"
                        label="Tên đăng nhập"
                        name="username"
                        rules={[
                            { required: true, message: "Vui lòng nhập tên đăng nhập !" },
                        ]}
                    >
                        <Input
                            disabled={!isEmpty(account)}
                            size="large"
                            placeholder="Tên đăng nhập..."
                        />
                    </Form.Item>
                </div>
                <div className="flex gap-4 items-center">
                    <Form.Item
                        className="flex-1"
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: isEmpty(account),
                                message: "Vui lòng nhập mật khẩu !",
                            },
                            {
                                min: 6,
                                message: "Mật khẩu phải có ít nhất 6 ký tự.",
                            },
                        ]}
                    >
                        <Input.Password size="large" placeholder="Mật khẩu..." />
                    </Form.Item>
                    <Form.Item
                        className="flex-1"
                        label="Nhập lại mật khẩu"
                        name="rePassword"
                        rules={[
                            {
                                required: isEmpty(account),
                                message: "Vui lòng nhập lại mật khẩu !",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error("Mật khẩu nhập lại không khớp")
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password size="large" placeholder="Nhập lại mật khẩu..." />
                    </Form.Item>
                </div>
                <Form.Item
                    label="Vai trò"
                    name="role"
                    rules={[{ required: true, message: "Vui lòng chọn vai trò !" }]}
                >
                    <Select
                        size="large"
                        placeholder="Chọn vai trò"
                        allowClear
                        className="w-48"
                    >
                        <Select.Option value="ADMIN">ADMIN</Select.Option>
                        <Select.Option value="SUPPORT">SUPPORT</Select.Option>
                        <Select.Option value="STAFF">STAFF</Select.Option>
                    </Select>
                </Form.Item>
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => {
                            form.resetFields();
                            onClose();
                        }}
                        type="button"
                        className="py-2 px-4 rounded-md border-2 hover:opacity-80"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-base text-white rounded-md"
                    >
                        {isEmpty(account) ? "Tạo tài khoản" : "Cập nhật tài khoản"}
                    </button>
                </div>
            </Form>
        </Modal>
    );
};

export default ModelAccountAction;
