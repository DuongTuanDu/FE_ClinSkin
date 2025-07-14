import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loading from "@components/Loading/Loading";
import ManagePromotion from "@/pages/ManagePromotion";

const PageTitle = lazy(() => import("@components/Layout/PageTitle"));
const LayoutAdmin = lazy(() => import("@components/Layout/LayoutAdmin"));
const AuthAdminWrapper = lazy(() => import("@components/Auth/AuthAdminWapper"));

// Lazy load all page components
const LoginAdmin = lazy(() => import("@pages/LoginAdmin"));
const Dashboard = lazy(() => import("@pages/DashBoard"));
const ManageCategory = lazy(() => import("@pages/ManageCategory"));
const ManageProduct = lazy(() => import("@pages/ManageProduct"));
const SettingAdmin = lazy(() => import("@pages/SettingAdmin"));
const ManageBrand = lazy(() => import("@pages/ManageBrand"));
const ManageReview = lazy(() => import("@pages/ManageReview"));
const ManageUser = lazy(() => import("@pages/ManageUser"));
const ManageOrder = lazy(() => import("@pages/ManageOrder"));
const ManageInventory = lazy(() => import("@pages/ManageInventory"));
const ExportOrder = lazy(() => import("@pages/ExportOrder"));
const CreatePromotion = lazy(() => import("@pages/CreatePromotion"));
const PromotionDetail = lazy(() => import("@pages/PromotionDetail"));
const ManageAccount = lazy(() => import("@pages/ManageAccount"));

const ProtectedRoute = ({ children }) => {
    const { isAuthenticatedAdmin, isLoading } = useSelector(
        (state) => state.auth
    );
    return !isAuthenticatedAdmin && !isLoading ? (
        <Navigate to="/admin" replace />
    ) : (
        children
    );
};

const AuthRoute = ({ children }) => {
    const { isAuthenticatedAdmin, isLoading, adminInfo } = useSelector(
        (state) => state.auth
    );
    return isAuthenticatedAdmin && !isLoading ? (
        <Navigate
            to={
                adminInfo.role === "ADMIN" && "/admin/dashboard"
            }
            replace
        />
    ) : (
        children
    );
};

const WrapAdminRoute = ({
    element: Element,
    title,
    layoutTitle,
    isProtected,
    isAuthRoute,
}) => (
    <Suspense fallback={<Loading />}>
        <PageTitle title={`ClinSkin | ${title}`}>
            <AuthAdminWrapper>
                {isAuthRoute ? (
                    <AuthRoute>
                        <Element />
                    </AuthRoute>
                ) : (
                    <LayoutAdmin title={layoutTitle}>
                        {isProtected ? (
                            <ProtectedRoute>
                                <Element />
                            </ProtectedRoute>
                        ) : (
                            <Element />
                        )}
                    </LayoutAdmin>
                )}
            </AuthAdminWrapper>
        </PageTitle>
    </Suspense>
);

const adminRoutes = [
    {
        path: "/admin",
        element: LoginAdmin,
        title: "Admin - Login",
        isAuthRoute: true,
    },
    {
        path: "/admin/dashboard",
        element: Dashboard,
        title: "Dashboard",
        layoutTitle: "Hi 👋, Wellcome Admin ClinSkin!",
        isProtected: true,
    },
    {
        path: "/admin/categories",
        element: ManageCategory,
        title: "Admin - Danh sách danh mục",
        layoutTitle: "Danh sách danh mục",
        isProtected: true,
    },

    {
        path: "/admin/promotions",
        element: ManagePromotion,
        title: "Admin - Danh sách Khuyến mãi",
        layoutTitle: "",
        isProtected: true,
    },
    {
        path: "/admin/products",
        element: ManageProduct,
        title: "Admin - Danh sách sản phẩm",
        layoutTitle: "Danh sách sản phẩm",
        isProtected: true,
    },
    {
        path: "/admin/reviews",
        element: ManageReview,
        title: "Admin - Danh sách review",
        layoutTitle: "Danh sách review",
        isProtected: true,
    },
    {
        path: "/admin/settings",
        element: SettingAdmin,
        title: "Admin - Cài đặt",
        layoutTitle: "Thông tin cài đặt tài khoản",
        isProtected: true,
    },
    {
        path: "/admin/brands",
        element: ManageBrand,
        title: "Admin - Danh sách thương hiệu",
        layoutTitle: "Danh sách thương hiệu",
        isProtected: true,
    },
    {
        path: "/admin/users",
        element: ManageUser,
        title: "Admin - Danh sách người dùng",
        layoutTitle: "Danh sách người dùng",
        isProtected: true,
    },
    {
        path: "/admin/orders",
        element: ManageOrder,
        title: "Admin - Danh sách đặt hàng",
        layoutTitle: "Danh sách đặt hàng",
        isProtected: true,
    },
    {
        path: "/admin/inventory",
        element: ManageInventory,
        title: "Admin - Quản lý lô hàng",
        layoutTitle: "Quản lý lô hàng",
        isProtected: true,
    },
    {
        path: "/admin/export-order/:orderId",
        element: ExportOrder,
        title: "Admin - Chi tiết đơn xuất kho",
        layoutTitle: "Chi tiết đơn xuất kho",
        isProtected: true,
    },
    {
        path: "/admin/promotions/create",
        element: CreatePromotion,
        title: "Admin - Tạo mới khuyến mãi",
        layoutTitle: "",
        isProtected: true,
    },
    {
        path: "/admin/promotions/:id",
        element: PromotionDetail,
        title: "Admin - Chi tiết khuyến mãi",
        layoutTitle: "",
        isProtected: true,
    },
    {
    path: "/admin/accounts",
    element: ManageAccount,
    title: "Admin - Quản lý tài khoản",
    layoutTitle: "Danh sách tài khoản quản trị",
    isProtected: true,
  },
];

const AdminRoutes = adminRoutes.map(
    ({ path, element, title, layoutTitle, isProtected, isAuthRoute }) => ({
        path,
        element: (
            <WrapAdminRoute
                element={element}
                title={title}
                layoutTitle={layoutTitle}
                isProtected={isProtected}
                isAuthRoute={isAuthRoute}
            />
        ),
    })
);

export default AdminRoutes;
