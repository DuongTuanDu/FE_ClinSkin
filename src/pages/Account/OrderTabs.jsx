import React, { useCallback, useEffect, useState } from "react";
import { Tabs, Badge } from "antd";
import {
    UnorderedListOutlined,
    ClockCircleOutlined,
    SyncOutlined,
    CarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import OrderAll from "./Order/OrderAll";
import OrderWait from "./Order/OrderWait";
import OrderProcess from "./Order/OrderProcess";
import OrderShip from "./Order/OrderShip";
import OrderComplete from "./Order/OrderComplete";
import OrderCancel from "./Order/OrderCancel";
import { useGetOrderHistoryQuery } from "@/redux/order/order.query";

const OrderTabs = () => {
    const [status, setStatus] = useState("all");
    const [paginate, setPaginate] = useState({
        page: 1,
        pageSize: 5,
    });

    // Map UI tab status to backend status filters
    const getBackendStatus = (tabStatus) => {
        switch (tabStatus) {
            case "pending":
                return "pending";
            case "processing":
                return "confirmed,picked_up,in_transit,carrier_confirmed";
            case "shipping":
                return "delivery_pending,carrier_delivered,delivery_failed";
            case "delivered":
                return "delivered_confirmed";
            case "cancelled":
                return "cancelled,failed_pickup,return,return_confirmed";
            default:
                return "all";
        }
    };

    const { data, isLoading, refetch } = useGetOrderHistoryQuery({
        ...paginate,
        status: getBackendStatus(status),
    });

    const { data: orders = [], pagination = {}, statusCounts = {} } = data || {};

    const resPaginate = {
        page: pagination?.page,
        pageSize: pagination?.pageSize,
        totalPage: pagination?.totalPage,
        totalItems: pagination?.totalItems,
    };

    const items = [
        {
            key: "all",
            label: <TabLabel icon={<UnorderedListOutlined />} text="Tất cả" />,
            children: (
                <OrderAll
                    {...{
                        isLoading,
                        orders,
                        ...resPaginate,
                        setPaginate,
                        refetch,
                    }}
                />
            ),
        },
        {
            key: "pending",
            label: (
                <TabLabel
                    icon={<ClockCircleOutlined />}
                    text="Chờ xử lý"
                    badgeCount={statusCounts?.pending}
                />
            ),
            children: (
                <OrderWait
                    {...{
                        isLoading,
                        orders,
                        ...resPaginate,
                        setPaginate,
                        refetch,
                    }}
                />
            ),
        },
        {
            key: "processing",
            label: (
                <TabLabel
                    icon={<SyncOutlined />}
                    text="Đang xử lý"
                    badgeCount={
                        (statusCounts?.confirmed || 0) + 
                        (statusCounts?.picked_up || 0) + 
                        (statusCounts?.in_transit || 0) + 
                        (statusCounts?.carrier_confirmed || 0)
                    }
                />
            ),
            children: (
                <OrderProcess
                    {...{
                        isLoading,
                        orders,
                        ...resPaginate,
                        setPaginate,
                        refetch,
                    }}
                />
            ),
        },
        {
            key: "shipping",
            label: (
                <TabLabel
                    icon={<CarOutlined />}
                    text="Đang giao"
                    badgeCount={
                        (statusCounts?.delivery_pending || 0) + 
                        (statusCounts?.carrier_delivered || 0) +
                        (statusCounts?.delivery_failed || 0)
                    }
                />
            ),
            children: (
                <OrderShip
                    {...{
                        isLoading,
                        orders,
                        ...resPaginate,
                        setPaginate,
                        refetch,
                    }}
                />
            ),
        },
        {
            key: "delivered",
            label: (
                <TabLabel
                    icon={<CheckCircleOutlined />}
                    text="Hoàn thành"
                    badgeCount={statusCounts?.delivered_confirmed || 0}
                />
            ),
            children: (
                <OrderComplete
                    {...{
                        isLoading,
                        orders,
                        ...resPaginate,
                        setPaginate,
                        refetch,
                    }}
                />
            ),
        },
        {
            key: "cancelled",
            label: (
                <TabLabel
                    icon={<CloseCircleOutlined />}
                    text="Đã hủy/Trả hàng"
                    badgeCount={
                        (statusCounts?.cancelled || 0) +
                        (statusCounts?.failed_pickup || 0) +
                        (statusCounts?.return || 0) +
                        (statusCounts?.return_confirmed || 0)
                    }
                />
            ),
            children: (
                <OrderCancel
                    {...{
                        isLoading,
                        orders,
                        ...resPaginate,
                        setPaginate,
                        refetch,
                    }}
                />
            ),
        },
    ];

    return (
        <Tabs
            defaultActiveKey="all"
            items={items}
            className="custom-tabs"
            onChange={(key) => {
                setStatus(key);
                setPaginate((prev) => ({
                    ...prev,
                    page: 1,
                    pageSize: 5,
                }));
            }}
            tabPosition={"top"}
        />
    );
};

const TabLabel = ({ icon, text, badgeCount }) => (
    <div className="flex items-center space-x-2">
        {icon}
        <span className="font-medium">{text}</span>
        {badgeCount > 0 && (
            <Badge color="#e38282" count={badgeCount} className="ml-1" />
        )}
    </div>
);

export default OrderTabs;
