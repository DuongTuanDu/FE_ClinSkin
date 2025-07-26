import React, { useEffect } from "react";
import { Layout, Menu } from "antd";
import { motion } from "framer-motion";
import useScreen from "@hook/useScreen";
import {
  DashboardOutlined,
  ShoppingOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  AppstoreOutlined,
  TagOutlined,
  ShopOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { GrUserAdmin } from "react-icons/gr";
import { useSelector } from "react-redux";

// eslint-disable-next-line no-unused-vars
const LOGO_ANIMATION = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};
// eslint-disable-next-line no-unused-vars
const LOGO_TRANSITION = {
  duration: 0.5,
};

const MENU_ITEMS = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: "Thống kê",
    className: "mt-2",
    path: "/admin/dashboard",
    roles: ["ADMIN"], // Only ADMIN can access dashboard
  },
  {
    key: "sub1",
    icon: <ShoppingOutlined />,
    label: "Sản phẩm",
    roles: ["ADMIN", "STAFF"], // Both ADMIN and STAFF can access
    children: [
      {
        key: "sub1-2",
        icon: <AppstoreOutlined />,
        label: "Quản lý Sản phẩm",
        path: "/admin/products",
        roles: ["ADMIN", "STAFF"],
      },
      {
        key: "sub1-1",
        icon: <AppstoreOutlined />,
        label: "Quản lý Lô hàng",
        path: "/admin/inventory",
        roles: ["ADMIN", "STAFF"],
      },
      {
        key: "sub1-3",
        icon: <ShopOutlined />,
        label: "Danh mục",
        path: "/admin/categories",
        roles: ["ADMIN", "STAFF"],
      },
      {
        key: "sub1-4",
        icon: <TagOutlined />,
        label: "Thương hiệu",
        path: "/admin/brands",
        roles: ["ADMIN", "STAFF"],
      },
      {
        key: "sub1-5",
        icon: <GiftOutlined />,
        label: "Khuyến mãi",
        path: "/admin/promotions",
        roles: ["ADMIN", "STAFF"],
      },
      {
        key: "sub1-6",
        icon: <StarOutlined />,
        label: "Đánh giá",
        path: "/admin/reviews",
        roles: ["ADMIN", "STAFF"],
      },
    ],
  },
  {
    key: "7",
    icon: <UsergroupAddOutlined />,
    label: "Khách hàng",
    path: "/admin/users",
    roles: ["ADMIN", "STAFF"], // Both ADMIN and STAFF can access
  },
  {
    key: "8",
    icon: <ShoppingCartOutlined />,
    label: "Đơn hàng",
    path: "/admin/orders",
    roles: ["ADMIN", "STAFF"], // Both ADMIN and STAFF can access
  },
  {
    key: "9",
    icon: <GrUserAdmin />,
    label: "Quản trị",
    path: "/admin/accounts",
    roles: ["ADMIN"], // Only ADMIN can access
  },
  {
    key: "11",
    icon: <SettingOutlined />,
    label: "Cài đặt",
    path: "/admin/settings",
    roles: ["ADMIN", "STAFF"], // Both can access settings
  },
];

const { Sider } = Layout;

const Logo = ({ collapsed, adminInfo }) => (
  <div className="bg-white px-4 py-2 border-r">
    <motion.div
      className="cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-extrabold text-2xl m-0 text-center py-4"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={LOGO_ANIMATION.initial}
      animate={LOGO_ANIMATION.animate}
      transition={LOGO_TRANSITION}
    >
      {collapsed
        ? "CLS"
        : (adminInfo?.role === "ADMIN" || adminInfo?.role === "STAFF")
        && "ClinSkin"
      }
    </motion.div>
  </div>
);

// Function to filter menu items based on user role
const filterMenuItemsByRole = (menuItems, userRole) => {
  return menuItems.filter(item => {
    // If item has no roles defined, show it to all users
    if (!item.roles) return true;
    
    // Check if user role is allowed for this item
    if (!item.roles.includes(userRole)) return false;
    
    // If item has children, filter them recursively
    if (item.children) {
      const filteredChildren = filterMenuItemsByRole(item.children, userRole);
      // Only show parent if it has visible children or doesn't require children
      return filteredChildren.length > 0 || !item.children.length;
    }
    
    return true;
  }).map(item => {
    // Filter children if they exist
    if (item.children) {
      return {
        ...item,
        children: filterMenuItemsByRole(item.children, userRole)
      };
    }
    return item;
  });
};

const SiderAdmin = ({ collapsed, setCollapsed }) => {
  const { isMobile } = useScreen();
  const { adminInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile, setCollapsed]);

  const handleLogoClick = () => {
    if (adminInfo?.role === "ADMIN") {
      window.location.href = "/admin/dashboard";
    } else if (adminInfo?.role === "STAFF") {
      window.location.href = "/admin/products";
    }
  };

  const handleMenuClick = ({ key }) => {
    const filteredMenuItems = filterMenuItemsByRole(MENU_ITEMS, adminInfo?.role);
    const selectedItem = findMenuItemByKey(filteredMenuItems, key);
    if (selectedItem?.path) {
      window.location.href = selectedItem.path;
    }
  };

  const findMenuItemByKey = (items, targetKey) => {
    for (const item of items) {
      if (item.key === targetKey) return item;
      if (item.children) {
        const found = findMenuItemByKey(item.children, targetKey);
        if (found) return found;
      }
    }
    return null;
  };

  // Get filtered menu items based on user role
  const filteredMenuItems = filterMenuItemsByRole(MENU_ITEMS, adminInfo?.role);

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div onClick={handleLogoClick}>
        <Logo collapsed={collapsed} adminInfo={adminInfo} />
      </div>
      <Menu
        onClick={handleMenuClick}
        mode="inline"
        defaultOpenKeys={["sub1"]}
        className="h-screen bg-white"
        items={filteredMenuItems}
      />
    </Sider>
  );
};

export default SiderAdmin;
