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
const SettingAdmin = lazy(() => import("@pages/SettingAdmin"));

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
        path: "/admin/settings",
        element: SettingAdmin,
        title: "Admin - Cài đặt",
        layoutTitle: "Thông tin cài đặt tài khoản",
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
