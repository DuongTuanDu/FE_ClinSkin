import {
    message,
    Pagination,
    Popconfirm,
    Switch,
    Table,
    Tag,
    Tooltip,
} from "antd";
import React, { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GrEdit } from "react-icons/gr";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useDispatch } from "react-redux";
import ModelAccountAction from "@components/Modal/ModelAccountAction";
import { removeAccountAdmin, updateAccountAdmin } from "@redux/auth/auth.thunk";

const TableAccount = ({
    accounts = [],
    loading = false,
    page,
    pageSize,
    totalItems,
    setPaginate,
    setStateByAction,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [account, setAccount] = useState({});

    // remove
    const removeAccount = async (id) => {
        const res = await dispatch(removeAccountAdmin(id)).unwrap();
        if (res.success) {
            setStateByAction({ id, action: "remove" });
            message.success(res.message);
        }
    };
    // toggle
    const handleToggle = async ({ id, isActive }) => {
        const res = await dispatch(
            updateAccountAdmin({ id, data: { isActive } })
        ).unwrap();
        if (res.success) {
            setStateByAction({ id, action: "update", data: res.data });
            message.success(res.message);
        }
    };

    const columns = useMemo(
        () => [
            {
                title: "STT",
                key: "stt",
                width: 60,
                render: (_, __, index) => (page - 1) * pageSize + index + 1,
            },
            {
                title: "Ảnh",
                key: "avatar",
                dataIndex: "avatar",
                width: 80,
                render: (avatar) => (
                    <img src={avatar?.url} className="w-full h-auto" alt="" />
                ),
            },
            {
                title: "Họ và tên",
                dataIndex: "name",
                key: "name",
                render: (text) => <div className="text-sm">{text}</div>,
            },
            {
                title: "Tên đăng nhập",
                dataIndex: "username",
                key: "username",
                render: (text) => <div className="text-sm">{text}</div>,
            },
            {
                title: "Vai trò",
                dataIndex: "role",
                key: "role",
                render: (text) => <div className="text-sm">{text}</div>,
            },
            {
                title: "Trạng thái",
                dataIndex: "isActive",
                key: "isActive",
                render: (isActive) => (
                    <div className="text-base font-bold">
                        {isActive ? (
                            <Tag color="green">Đang hoạt động</Tag>
                        ) : (
                            <Tag color="red">Đã dừng</Tag>
                        )}
                    </div>
                ),
            },
            {
                title: "Thao Tác",
                key: "action",
                width: 160,
                render: (_, record) => (
                    <div className="flex gap-2 items-center text-[#00246a]">
                        <Tooltip title="Xem chi tiết">
                            <button
                                onClick={() => {
                                    navigate(`/admin/accounts/${record._id}`);
                                }}
                                className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
                            >
                                <FaEye />
                            </button>
                        </Tooltip>
                        <Tooltip title={record.isActive ? "Tạm dừng" : "Mở hoạt động"}>
                            <Switch
                                checked={record.isActive}
                                onChange={(checked) =>
                                    handleToggle({ id: record._id, isActive: checked })
                                }
                            />
                        </Tooltip>
                        <Tooltip title="Sửa">
                            <button
                                onClick={() => {
                                    setAccount(record);
                                    setOpen(true);
                                }}
                                className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
                            >
                                <GrEdit />
                            </button>
                        </Tooltip>
                        <Popconfirm
                            className="max-w-40"
                            placement="topLeft"
                            title={"Xác nhận xóa tài khoản"}
                            description={record?.name}
                            onConfirm={() => {
                                removeAccount(record._id);
                            }}
                            okText="Xóa"
                            cancelText="Hủy"
                            destroyTooltipOnHide={true}
                        >
                            <Tooltip title="Xóa">
                                <button className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors">
                                    <MdOutlineDeleteOutline />
                                </button>
                            </Tooltip>
                        </Popconfirm>
                    </div>
                ),
            },
        ],
        [page, pageSize]
    );

    return (
        <>
            <ModelAccountAction
                {...{
                    open,
                    onClose: () => {
                        setOpen(false);
                        setAccount({});
                    },
                    account,
                    setStateByAction,
                }}
            />
            <Table
                columns={columns}
                dataSource={accounts}
                rowKey={(record) => record._id}
                pagination={false}
                loading={loading}
                scroll={{ x: true }}
            />
            {accounts.length > 0 && (
                <div className="mt-4 flex justify-end">
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={totalItems}
                        onChange={(newPage, newPageSize) =>
                            setPaginate((prev) => ({
                                ...prev,
                                page: newPage,
                                pageSize: newPageSize,
                            }))
                        }
                        showSizeChanger
                    />
                </div>
            )}
        </>
    );
};

export default TableAccount;
