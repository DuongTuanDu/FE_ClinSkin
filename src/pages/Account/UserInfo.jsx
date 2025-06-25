import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const UserInfo = ({ user }) => {
  if (!user) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 text-center">
      <Avatar
        size={80}
        icon={<UserOutlined />}
        src={user.avatar?.url}
        className="mb-3"
      />
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p className="text-sm text-gray-500">{user.email}</p>
    </div>
  );
};

export default UserInfo;
