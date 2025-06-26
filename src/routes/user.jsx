import React, { lazy, Suspense } from "react";
import Loading from "@components/Loading";

const LayoutUser = lazy(() => import("@components/Layout/LayoutUser"));

// Lazy load all page components
const Home = lazy(() => import("@pages/Home/index"));
const Auth = lazy(() => import("@pages/Auth/index"));
const Account = lazy(() => import("@pages/Account/Account"));
const Detail = lazy(() => import("@pages/Detail/Detail"));
const AuthUserWapper = lazy(() => import("@components/Auth/AuthUserWapper"));
const SearchProduct = lazy(() => import("@pages/SearchProduct/UserSearchPageProducts"));
const Cart = lazy(() => import("@pages/Cart/Cart"));

const WrapRoute = ({ element: Element }) => (
  <Suspense fallback={<Loading />}>
    <AuthUserWapper>
      <LayoutUser>
        <Element />
      </LayoutUser>
    </AuthUserWapper>
  </Suspense>
);

const routes = [
  {
    path: "/",
    element: Home,
    title: "ClinSkin - Hãy cùng chăm sóc làn da của bạn cùng chúng tôi",
  },
  {
    path: "/auth",
    element: Auth,
    title: "Đăng nhập - Đăng ký",
  },
  { path: "/detail/:slug", element: Detail, title: "Chi tiết sản phẩm" },
  { path: "/searchProduct", element: SearchProduct, title: "Tim kiem san pham" },
  { path: "/account", element: Account, title: "Tài khoản" },
  { path: "/cart", element: Cart, title: "Giỏ hàng" },
];

const UserRoutes = routes.map(
  ({ path, element, title }) => ({
    path,
    element: (
      <WrapRoute
        element={element}
        title={title}
      />
    ),
  })
);

export default UserRoutes;