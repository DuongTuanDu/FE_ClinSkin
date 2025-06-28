import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from "sub-vn";

const getNameByCode = (code, list) => {
  return list.find((item) => item.code === code)?.name || "";
};

const UserInfo = ({ user }) => {
  if (!user) return null;

  const province = getNameByCode(user.address?.province, getProvinces());
  const district = getNameByCode(user.address?.district, getDistrictsByProvinceCode(user.address?.province));
  const ward = getNameByCode(user.address?.ward, getWardsByDistrictCode(user.address?.district));

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
      <p className="text-sm text-gray-500">{user.phone}</p>
      <p className="text-sm text-gray-500">{`${ward}, ${district}, ${province}`}</p>
    </div>
  );
};

export default UserInfo;
