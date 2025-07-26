import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loading from "@components/Loading/Loading";
import ManagePromotion from "@/pages/ManagePromotion";
import ProviderSocket from "@/components/Layout/ProviderSocket";

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
const OrderDetail = lazy(() => import("@pages/OrderDetail"));
const ManageInventory = lazy(() => import("@pages/ManageInventory"));
const ExportOrder = lazy(() => import("@pages/ExportOrder"));
const CreatePromotion = lazy(() => import("@pages/CreatePromotion"));
const PromotionDetail = lazy(() => import("@pages/PromotionDetail"));
const ManageAccount = lazy(() => import("@pages/ManageAccount"));
const AccountDetail = lazy(() => import("@pages/AccountDetail"));

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

const RoleProtectedRoute = ({ children, allowedRoles = ["ADMIN", "STAFF"] }) => {
    const { adminInfo } = useSelector((state) => state.auth);
    
    if (!allowedRoles.includes(adminInfo?.role)) {
        // Redirect based on role
        const redirectPath = adminInfo?.role === "STAFF" ? "/admin/products" : "/admin/dashboard";
        return <Navigate to={redirectPath} replace />;
    }
    
    return children;
};

const AuthRoute = ({ children }) => {
    const { isAuthenticatedAdmin, isLoading, adminInfo } = useSelector(
        (state) => state.auth
    );
    return isAuthenticatedAdmin && !isLoading ? (
        <Navigate
            to={
                adminInfo.role === "ADMIN" 
                    ? "/admin/dashboard" 
                    : adminInfo.role === "STAFF" 
                        ? "/admin/products"
                        : "/admin/dashboard"
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
    allowedRoles = ["ADMIN", "STAFF"] // Default allow both roles
}) => (
    <Suspense fallback={<Loading />}>
        <PageTitle title={`ClinSkin | ${title}`}>
            <AuthAdminWrapper>
                <ProviderSocket>
                    {isAuthRoute ? (
                        <AuthRoute>
                            <Element />
                        </AuthRoute>
                    ) : (
                        <LayoutAdmin title={layoutTitle}>
                            {isProtected ? (
                                <ProtectedRoute>
                                    <RoleProtectedRoute allowedRoles={allowedRoles}>
                                        <Element />
                                    </RoleProtectedRoute>
                                </ProtectedRoute>
                            ) : (
                                <Element />
                            )}
                        </LayoutAdmin>
                    )}
                </ProviderSocket>
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
        allowedRoles: ["ADMIN"], // Only ADMIN can access dashboard
    },
    {
        path: "/admin/categories",
        element: ManageCategory,
        title: "Admin - Danh sách danh mục",
        layoutTitle: "Danh sách danh mục",
        isProtected: true,
        allowedRoles: ["ADMIN", "STAFF"], // Both can access
    },

    {
        path: "/admin/promotions",
        element: ManagePromotion,
        title: "Admin - Danh sách Khuyến mãi",
        layoutTitle: "",
        isProtected: true,
        allowedRoles: ["ADMIN", "STAFF"], // Both can access
    },
    {
        path: "/admin/products",
        element: ManageProduct,
        title: "Admin - Danh sách sản phẩm",
        layoutTitle: "Danh sách sản phẩm",
        isProtected: true,
        allowedRoles: ["ADMIN", "STAFF"], // Both can access
    },
    {
        path: "/admin/reviews",
        element: ManageReview,
        title: "Admin - Danh sách review",
        layoutTitle: "Danh sách review",
        isProtected: true,
        allowedRoles: ["ADMIN", "STAFF"], // Both can access
    },
    {
        path: "/admin/settings",
        element: SettingAdmin,
        title: "Admin - Cài đặt",
        layoutTitle: "Thông tin cài đặt tài khoản",
        isProtected: true,
        allowedRoles: ["ADMIN", "STAFF"], // Both can access
    },
    {
        path: "/admin/brands",
        element: ManageBrand,
        title: "Admin - Danh sách thương hiệu",
        layoutTitle: "Danh sách thương hiệu",
        isProtected: true,
        allowedRoles: ["ADMIN", "STAFF"], // Both can access
    },
    {
        path: "/admin/users",
        element: ManageUser,
        title: "Admin - Danh sách người dùng",
        layoutTitle: "Danh sách người dùng",
        isProtected: true,
        allowedRoles: ["ADMIN", "STAFF"], // Both can access
    },
    {
        path: "/admin/orders",
        element: ManageOrder,
        title: "Admin - Danh sách đặt hàng",
        layoutTitle: "Danh sách đặt hàng",
        isProtected: true,
        allowedRoles: ["ADMIN", "STAFF"], // Both can access
    },
    {
        path: "/admin/inventory",
        element: ManageInventory,
        title: "Admin - Quản lý lô hàng",
        layoutTitle: "Quản lý lô hàng",
        isProtected: true,
        allowedRoles: ["ADMIN", "STAFF"], // Both can access
    },
    {
        path: "/admin/export-order/:orderId",
        element: ExportOrder,
        title: "Admin - Chi tiết đơn xuất kho",
        layoutTitle: "Chi tiết đơn xuất kho",
        isProtected: true,
        allowedRoles: ["ADMIN", "STAFF"], // Both can access
    },
    {
        path: "/admin/promotions/create",
        element: CreatePromotion,
        title: "Admin - Tạo mới khuyến mãi",
        layoutTitle: "",
        isProtected: true,
        allowedRoles: ["ADMIN", "STAFF"], // Both can access
    },
    {
        path: "/admin/promotions/:id",
        element: PromotionDetail,
        title: "Admin - Chi tiết khuyến mãi",
        layoutTitle: "",
        isProtected: true,
        allowedRoles: ["ADMIN", "STAFF"], // Both can access
    },
    {
        path: "/admin/accounts",
        element: ManageAccount,
        title: "Admin - Quản lý tài khoản",
        layoutTitle: "Danh sách tài khoản quản trị",
        isProtected: true,
        allowedRoles: ["ADMIN"], // Only ADMIN can access
    },
    {
        path: "/admin/accounts/:adminId",
        element: AccountDetail,
        title: "Admin - Chi tiết tài khoản",
        layoutTitle: "Chi tiết tài khoản",
        isProtected: true,
        allowedRoles: ["ADMIN"], // Only ADMIN can access
    },
    {
        path: "/admin/orders/:id",
        element: OrderDetail,
        title: "Admin - Chi tiết đơn hàng",
        layoutTitle: "Chi tiết đơn hàng",
        isProtected: true,
        allowedRoles: ["ADMIN", "STAFF"], // Both can access
    },
];

const AdminRoutes = adminRoutes.map(
    ({ path, element, title, layoutTitle, isProtected, isAuthRoute, allowedRoles }) => ({
        path,
        element: (
            <WrapAdminRoute
                element={element}
                title={title}
                layoutTitle={layoutTitle}
                isProtected={isProtected}
                isAuthRoute={isAuthRoute}
                allowedRoles={allowedRoles}
            />
        ),
    })
);

export default AdminRoutes;
