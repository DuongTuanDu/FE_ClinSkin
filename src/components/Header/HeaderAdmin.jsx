import React, { useState } from "react";
import { Layout, Button, Avatar, Dropdown, Badge, Input } from "antd";
import {
  BellOutlined,
  SearchOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "@redux/auth/auth.slice";
import { BsFillMenuButtonFill, BsFillMenuButtonWideFill } from "react-icons/bs";

const { Header } = Layout;

const HeaderAdmin = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { adminInfo } = useSelector((state) => state.auth);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    dispatch(logoutAdmin());
    window.location.href = "/admin";
  };

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => navigate("/admin/settings")}
          className="flex items-center gap-4"
        >
          <SettingOutlined /> <span>Cài đặt</span>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div onClick={handleLogout} className="flex items-center gap-4">
          <LogoutOutlined /> <span>Đăng xuất</span>
        </div>
      ),
    },
  ];

  return (
    <Header className="bg-white flex justify-between items-center shadow-md px-8">
      <div className="flex items-center">
        <Button
          type="text"
          icon={
            collapsed ? <BsFillMenuButtonWideFill /> : <BsFillMenuButtonFill />
          }
          onClick={toggle}
          className="text-lg w-16 h-16"
        />
        <motion.div
          animate={{ width: isSearchFocused ? 300 : 200 }}
          transition={{ duration: 0.3 }}
          className="ml-4 hidden md:block"
        >
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="rounded-full"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </motion.div>
      </div>
      <div className="flex items-center">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Badge color={"#65bebc"} count={5} className="mr-4" offset={[-5, 5]}>
            <Button icon={<BellOutlined />} shape="circle" size="large" />
          </Badge>
        </motion.div>
        <Dropdown menu={{ items }}>
          <a
            className="ant-dropdown-link flex items-center"
            onClick={(e) => e.preventDefault()}
          >
            <Avatar src={adminInfo.avatar.url} className="mr-2" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-rose-700 font-extrabold text-sm text-center uppercase">
              {adminInfo.name}
            </span>
          </a>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderAdmin;
