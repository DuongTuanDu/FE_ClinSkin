import React, { lazy, Suspense } from "react";
import Loading from "@components/Loading/Loading";

const PageTitle = lazy(() => import("@components/Layout/PageTitle"));
const LayoutShipper = lazy(() => import("@components/Layout/LayoutShipper"));


const ShippingOrders = lazy(() => import("@pages/ShippingOrders"));
const OrderDetailShipper = lazy(() => import("@pages/OrderDetailShipper"));

const WrapShipperRoute = ({
    element: Element,
    title,
    layoutTitle,
}) => (
    <Suspense fallback={<Loading />}>
        <PageTitle title={`ClinSkin Shipper | ${title}`}>
            <LayoutShipper title={layoutTitle}>
                <Element />
            </LayoutShipper>
        </PageTitle>
    </Suspense>
);

const shipperRoutes = [
    {
        path: "/shipper",
        element: ShippingOrders,
        title: "Shipping Orders",
        layoutTitle: "Shipping Orders Management",
    },
    {
        path: "/shipper/orders",
        element: ShippingOrders,
        title: "Shipping Orders",
        layoutTitle: "Shipping Orders Management",
    },
    {
        path: "/shipper/orders/:id",
        element: OrderDetailShipper,
        title: "Order Detail",
        layoutTitle: "Order Detail",
    },
];

export default shipperRoutes.map((route) => ({
    ...route,
    element: (
        <WrapShipperRoute
            element={route.element}
            title={route.title}
            layoutTitle={route.layoutTitle}
        />
    ),
}));
