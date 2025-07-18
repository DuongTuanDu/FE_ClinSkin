import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import debounce from "lodash/debounce";
import { useEffect } from "react";
import { getAllAccountAdmin } from "@redux/auth/auth.thunk";
import { Button, Input, Select } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import TableAccount from "@/pages/ManageAccount/TableAccount";
import ModelAccountAction from "@components/Modal/ModelAccountAction";

const ManageAccount = () => {
    const dispatch = useDispatch();
    const [accounts, setAccounts] = useState([]);
    const [paginate, setPaginate] = useState({
        page: 1,
        pageSize: 10,
        totalPage: 0,
        totalItems: 0,
    });
    const [filter, setFilter] = useState({
        search: "",
        role: "",
    });
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchAccount = async () => {
        try {
            setLoading(true);
            const res = await dispatch(
                getAllAccountAdmin({ ...paginate, ...filter })
            ).unwrap();
            if (res.success) {
                setAccounts(res.data);
                setPaginate((prev) => ({
                    ...prev,
                    ...res.pagination,
                }));
            }
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, [dispatch, paginate.page, paginate.pageSize, filter]);

    const debouncedFilter = useCallback(
        debounce((key, value) => {
            setFilter((prev) => ({
                ...prev,
                [key]: value,
            }));
            setPaginate((prev) => ({ ...prev, page: 1 }));
        }, 1000),
        []
    );

    const handleFilterChange = (key, value) => {
        debouncedFilter(key, value);
    };

    // handle action
    const setStateByAction = ({ id, data, action = "update" }) => {
        const actions = {
            update: () => {
                setAccounts((prevAccounts) => {
                    const index = prevAccounts.findIndex((item) => item._id === id);
                    if (index !== -1) {
                        const updatedAccounts = [...prevAccounts];
                        updatedAccounts[index] = data;
                        return updatedAccounts;
                    }
                    return prevAccounts;
                });
            },
            remove: () => {
                setAccounts((prevAccounts) =>
                    prevAccounts.filter((item) => item._id !== id)
                );
            },
            create: () => {
                setAccounts((prevAccounts) => [data, ...prevAccounts]);
            },
        };

        actions[action]?.();
    };

    return (
        <div className="mt-4">
            <ModelAccountAction
                {...{
                    open,
                    onClose: () => setOpen(false),
                    setStateByAction,
                }}
            />
            <div className="mb-4 bg-white p-4 rounded-md shadow-lg flex gap-4 items-center">
                <Input
                    size="middle"
                    placeholder="Tìm kiếm..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    allowClear
                />
                <Select
                    size="middle"
                    placeholder="Chọn vai trò"
                    onChange={(value) => handleFilterChange("role", value)}
                    allowClear
                    className="w-48"
                >
                    <Select.Option value="ADMIN">ADMIN</Select.Option>
                    <Select.Option value="SUPPORT">SUPPORT</Select.Option>
                    <Select.Option value="STAFF">STAFF</Select.Option>
                </Select>
                <Button
                    onClick={() => setOpen(true)}
                    size="middle"
                    type="primary"
                    icon={<PlusOutlined />}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    Tạo tài khoản
                </Button>
            </div>
            <TableAccount
                {...{
                    accounts,
                    page: paginate.page,
                    pageSize: paginate.page,
                    setPaginate,
                    loading,
                    setStateByAction,
                }}
            />
        </div>
    );
};

export default ManageAccount;
