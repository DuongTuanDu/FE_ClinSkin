import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeaderUser from "@components/Header/HeaderUser";
import FooterUser from "@components/Footer/FooterUser";
import { useDispatch, useSelector } from "react-redux";
import ModalAuth from "../Modal/ModalAuth";
import { setOpenModelAuth } from "@/redux/auth/auth.slice";
import ClickSpark from "../ClickSpark";
import ConversationSupport from "../Chat/ConversationSupport";

const LayoutUser = ({ children }) => {
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
    // eslint-disable-next-line
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
        <HeaderUser />
        <main className="flex-grow px-4 lg:px-16 py-2 min-h-screen">{children}</main>
        <ConversationSupport />
        <FooterUser />
      </ClickSpark>
    </div>
  );
};

export default LayoutUser;