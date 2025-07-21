import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccountAdmin } from "@redux/auth/auth.thunk";
import Loading from "@components/Loading/Loading";
import { useLocation } from "react-router-dom";
import { get } from "@storage/storage";

const AuthAdminWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading, isAuthenticatedAdmin } = useSelector(
    (state) => state.auth
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const { pathname } = useLocation();

  // eslint-disable-next-line
  const initAuth = () => {
    const accessToken = get("ACCESS_TOKEN_ADMIN");
    if (accessToken && !isAuthenticatedAdmin) {
      dispatch(getAccountAdmin());
    }
    setIsInitialized(true);
  };

  useEffect(() => {
    initAuth();
  }, [dispatch]);

  if ((!isInitialized || isLoading) && pathname !== "/admin") {
    return <Loading />;
  }

  return children;
};

export default AuthAdminWrapper;
