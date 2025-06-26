import React from "react";
import {
  UserOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

const AccountMenu = ({ handleSelectedMenu, cartItemCount, logout }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <Menu
        mode="inline"
        defaultSelectedKeys={["profile"]}
        onClick={({ key }) => {
          if (key === "logout") {
            logout();
          } else {
            handleSelectedMenu(key);
          }
        }}
      >
        <Menu.Item key="profile" icon={<UserOutlined />}>
          Thông tin cá nhân
        </Menu.Item>
        <Menu.Item key="orders" icon={<FileTextOutlined />}>
          Đơn hàng của tôi
        </Menu.Item>
        <Menu.Item key="carts" icon={<ShoppingCartOutlined />}>
          Giỏ hàng ({cartItemCount})
        </Menu.Item>
        <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
          Đăng xuất
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default AccountMenu;
