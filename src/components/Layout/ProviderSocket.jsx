import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { SocketActions } from "@redux/socket/socket.slice";

const SOCKET_SERVER_URL = import.meta.env.VITE_APP_API_BASE_URL;

const ProviderSocket = ({ children }) => {
    const dispatch = useDispatch();
    const {
        isAuthenticated,
        isAuthenticatedAdmin,
        userInfo,
        adminInfo
    } = useSelector((state) => state.auth);

    // Socket connection for authenticated customer
    useEffect(() => {
        if (isAuthenticated) {
            const socketConnect = io(SOCKET_SERVER_URL, {
                query: {
                    userId: userInfo?._id,
                    userType: "customer",
                },
            });

            dispatch(SocketActions.setSocketCustomer(socketConnect));

            return () => {
                socketConnect.disconnect();
                dispatch(SocketActions.setSocketCustomer(null));
            };
        }
    }, [isAuthenticated]);

    // Socket connection for authenticated admin
    useEffect(() => {
        if (isAuthenticatedAdmin) {
            const socketConnect = io(SOCKET_SERVER_URL, {
                query: {
                    userId: adminInfo?._id,
                    userType: "admin",
                },
            });

            dispatch(SocketActions.setSocketAdmin(socketConnect));

            return () => {
                socketConnect.disconnect();
                dispatch(SocketActions.setSocketAdmin(null));
            };
        }
    }, [isAuthenticatedAdmin]);

    return <>{children}</>;
};

export default ProviderSocket;
