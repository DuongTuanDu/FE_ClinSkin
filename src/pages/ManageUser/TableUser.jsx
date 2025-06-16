import React, { useMemo } from "react";
import { Table, Avatar, Tag, Tooltip, Pagination, Switch, message, Popconfirm } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { deleteUser, getUserList, updateUser } from "@redux/user/user.thunk";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { deleteFile } from "@helpers/uploadCloudinary";

const TableUser = ({
  users = [],
  isLoading = false,
  page,
  pageSize,
  totalItems,
  setPaginate,
}) => {

  const dispatch = useDispatch()
  const columns = useMemo(
    () => [
      {
        title: "STT",
        key: "index",
        width: 60,
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "Ảnh",
        dataIndex: "avatar",
        key: "avatar",
        render: (avatar) => (
          <Avatar
            src={avatar?.url}
            icon={!avatar?.url && <UserOutlined />}
            alt="Avatar"
          />
        ),
      },
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        render: (name) => (
          <Tooltip title={name}>
            <span className="truncate max-w-[150px]">{name}</span>
          </Tooltip>
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Trạng thái",
        dataIndex: "isActive",
        key: "isActive",
        render: (isActive) => (
          <Tag color={isActive ? "green" : "red"}>
            {isActive ? "Hoạt động" : "Không hoạt động"}
          </Tag>
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => new Date(date).toLocaleDateString(),
      },
      {
        title: "Thao tác",
        key: "action",
        render: (_, record) => (
          <div className="flex space-x-4 items-center">
            <Tooltip title={record.isActive ? "Vô hiệu hóa" : "Kích hoạt"}>
              <Switch
                checked={record.isActive}
                onChange={(checked) => handleToggleStatus(record._id, checked)}
              />
            </Tooltip>
            <Popconfirm
              className="max-w-40"
              placement="topLeft"
              title={"Xác nhận xóa người dùng"}
              description={record?.name}
              onConfirm={() => removeUser(record._id, record)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{
                loading: isLoading,
              }}
              destroyTooltipOnHide={true}
            >
              <Tooltip title="Xóa">
                <button
                  className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
                >
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

  const handleToggleStatus = async (id, isActive) => {
    const res = await dispatch(updateUser({
      id,
      payload: {
        isActive
      }
    })).unwrap()
    if (res.success) {
      dispatch(getUserList({
        page, pageSize
      }))
      message.success(res.message)
      return
    }
  };

  const removeUser = async (id, user) => {
    const res = await dispatch(deleteUser(id)).unwrap();

    if (res.success) {
      if (user.avatar.publicId) await deleteFile(user.avatar.publicId)
      dispatch(getUserList({
        page, pageSize
      }))
      message.success(res.message)
      return
    }
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={users}
        rowKey={(record) => record._id}
        pagination={false}
        loading={isLoading}
        scroll={{ x: true }}
      />
      {users.length > 0 && (
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
            showQuickJumper
          />
        </div>
      )}
    </>
  );
};

export default React.memo(TableUser);
