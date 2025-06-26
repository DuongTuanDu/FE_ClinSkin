import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ModalAuth from "../Modal/ModalAuth";
import { setOpenModelAuth } from "@/redux/auth/auth.slice";
import ClickSpark from "../ClickSpark";

const LayoutAboutUs = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { openModelAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <ModalAuth
        {...{
          open: openModelAuth,
          onClose: () => dispatch(setOpenModelAuth(false)),
        }}
      />
      <ClickSpark
        sparkColor='#FFB6C1'
        sparkSize={15}
        sparkRadius={20}
        sparkCount={8}
        duration={400}
      >
        <main className="flex-grow">{children}</main>
      </ClickSpark>
    </div>
  );
};

export default LayoutAboutUs;