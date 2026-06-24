import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { SocketActions } from "@redux/socket/socket.slice";
import { get } from "@storage/storage";
import { getSocketServerUrl } from "@/utils/socketUrl";

const SOCKET_SERVER_URL = getSocketServerUrl();

const ProviderSocket = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, isAuthenticatedAdmin, userInfo, adminInfo } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = get("ACCESS_TOKEN");
    if (!token) return;

    const socketConnect = io(SOCKET_SERVER_URL, {
      auth: {
        token,
        actorType: "customer",
      },
      transports: ["websocket", "polling"],
    });

    dispatch(SocketActions.setSocketCustomer(socketConnect));

    return () => {
      socketConnect.disconnect();
      dispatch(SocketActions.setSocketCustomer(null));
    };
  }, [isAuthenticated, userInfo?._id, dispatch]);

  useEffect(() => {
    if (!isAuthenticatedAdmin) return;

    const token = get("ACCESS_TOKEN_ADMIN");
    if (!token) return;

    const socketConnect = io(SOCKET_SERVER_URL, {
      auth: {
        token,
        actorType: "admin",
      },
      transports: ["websocket", "polling"],
    });

    dispatch(SocketActions.setSocketAdmin(socketConnect));

    return () => {
      socketConnect.disconnect();
      dispatch(SocketActions.setSocketAdmin(null));
    };
  }, [isAuthenticatedAdmin, adminInfo?._id, dispatch]);

  return <>{children}</>;
};

export default ProviderSocket;
