import React from "react";
import { useGetAccountUserQuery } from "@/redux/user/user.query";
import { Spin, Descriptions } from "antd";

const AccountForm = ({userInfo, isAuthenticated}) => {
  if (!isAuthenticated) return <div>Không thể tải thông tin tài khoản.</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
      <Descriptions column={1} bordered size="middle">
        <Descriptions.Item label="Họ và tên">{userInfo.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{userInfo.email}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo tài khoản">
          {new Date(userInfo.createdAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default AccountForm;
