import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccountUser } from "@redux/auth/auth.thunk";
import { get, set } from "@storage/storage";
import Loading from "@components/Loading/Loading";
import { useLocation } from "react-router-dom";
import {
  setIsAuthenticated,
  setIsLoading,
  setUserInfo,
} from "@/redux/auth/auth.slice";
import ModalAuth from "../Modal/ModalAuth";


const AuthUserWrapper = ({
  children,
  isModalAuth = false,
}) => {
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);
  const [open, setOpen] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const { pathname } = useLocation();
  const token = urlParams.get("token");
//   console.log(token);
  const initAuth = async () => {
    try {
      dispatch(setIsLoading(true));
      if (token) {
        set("ACCESS_TOKEN", token);
        await dispatch(getAccountUser()).unwrap();
        window.history.replaceState({}, "", location.pathname);
        return;
      }

      const accessToken = get("ACCESS_TOKEN");
      if (accessToken && !isAuthenticated) {
        const res = await dispatch(getAccountUser()).unwrap();
        if (res.success) {
          dispatch(setIsAuthenticated(true));
          dispatch(setUserInfo(res.data));
          setOpen(false);
        }
      }
    } finally {
      setIsInitialized(true);
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    initAuth();
  }, [dispatch, token, isAuthenticated]);

  if ((!isInitialized || isLoading) && pathname !== "/auth") {
    return <Loading />;
  }

  return isAuthenticated || !isModalAuth ? (
    children
  ) : (
    <ModalAuth {...{ open, onClose: () => setOpen(false) }} />
  );
};

export default AuthUserWrapper;
