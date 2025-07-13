import React, { useEffect, useState } from "react";
import { Breadcrumb, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "@redux/auth/auth.slice";
import { clearCart } from "@redux/cart/cart.slice";
import AccountForm from "./AccountForm";
import UserInfo from "./UserInfo";
import AccountMenu from "./AccountMenu";
import AddressManagement from "./AddressManagement";

const CONTENT_TYPES = {
  PROFILE: "profile",
  ORDERS: "orders", 
  CARTS: "carts",
  ADDRESSES: "addresses", // Thêm tab địa chỉ
};

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [contentType, setContentType] = useState(CONTENT_TYPES.PROFILE);
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const products = useSelector((state) => state.cart.cart.products); 

  const queryParams = new URLSearchParams(location.search);
  const tab = queryParams.get("tab") || CONTENT_TYPES.PROFILE;

  const handleSelectedMenu = (tab) => {
    setContentType(tab);
    navigate(`/account?tab=${tab}`);
  };

  useEffect(() => {
    setContentType(tab);
    if (!queryParams.get("tab")) {
      navigate("/account?tab=profile");
    }
  }, [navigate, tab]);

  const logout = () => {
    dispatch(clearCart());
    dispatch(logoutUser());
    navigate("/");
  };

  const renderContent = () => {
    switch (contentType) {
      case CONTENT_TYPES.PROFILE:
        return <AccountForm userInfo={userInfo} isAuthenticated={isAuthenticated} />;
      case CONTENT_TYPES.ADDRESSES:
        return <AddressManagement userInfo={userInfo} isAuthenticated={isAuthenticated} />;
      case CONTENT_TYPES.ORDERS:
        return (
          <Card>
            <div className="text-center py-8">
              <h3>Đơn hàng của tôi</h3>
              <p className="text-gray-500">Chức năng đang phát triển...</p>
            </div>
          </Card>
        );
      case CONTENT_TYPES.CARTS:
        return (
          <Card>
            <div className="text-center py-8">
              <h3>Giỏ hàng yêu thích</h3>
              <p className="text-gray-500">Chức năng đang phát triển...</p>
            </div>
          </Card>
        );
      default:
        return <></>;
    }
  };

  // Cập nhật breadcrumb dựa trên tab hiện tại
  const getBreadcrumbItems = () => {
    const baseItems = [{ title: "Trang chủ" }, { title: "Tài khoản" }];
    
    switch (contentType) {
      case CONTENT_TYPES.ADDRESSES:
        return [...baseItems, { title: "Quản lý địa chỉ" }];
      case CONTENT_TYPES.ORDERS:
        return [...baseItems, { title: "Đơn hàng" }];
      case CONTENT_TYPES.CARTS:
        return [...baseItems, { title: "Giỏ hàng yêu thích" }];
      default:
        return [...baseItems, { title: "Thông tin cá nhân" }];
    }
  };

  return (
    <div className="container mx-auto mt-6 px-4 max-w-7xl">
      <Breadcrumb
        items={getBreadcrumbItems()}
        className="text-sm mb-6"
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: User Info and Menu */}
        <div className="w-full md:w-1/4 top-4 lg:sticky">
          <UserInfo user={userInfo} />
          <AccountMenu
            handleSelectedMenu={handleSelectedMenu}
            cartItemCount={products.length}
            navigate={navigate}
            logout={logout}
            currentTab={contentType} // Truyền tab hiện tại để highlight menu
          />
        </div>

        {/* Right Column: Dynamic Content */}
        <div className="w-full md:w-3/4 min-h-screen">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Account;