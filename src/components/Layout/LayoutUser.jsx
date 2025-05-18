import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeaderUser from "@components/Header/HeaderUser";
import FooterUser from "@components/Footer/FooterUser";

const LayoutUser = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <HeaderUser />
      <main className="flex-grow px-4 lg:px-16 py-2">{children}</main>
      <FooterUser />
    </div>
  );
};

export default LayoutUser;