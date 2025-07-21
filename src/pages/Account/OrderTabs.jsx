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

    const { data, isLoading, refetch } = useGetOrderHistoryQuery({
        ...paginate,
        status,
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
                    text="Chờ xác nhận"
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
                    badgeCount={statusCounts?.processing}
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
                    badgeCount={statusCounts?.shipping}
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
                    text="Đã giao"
                    badgeCount={statusCounts?.delivered}
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
                    text="Đã hủy"
                    badgeCount={statusCounts?.cancelled}
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
