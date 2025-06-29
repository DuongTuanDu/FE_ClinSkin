import React, { lazy, Suspense } from "react";
import Loading from "@components/Loading";
import LayoutAboutUs from "@/components/Layout/LayoutAboutUs";

const LayoutUser = lazy(() => import("@components/Layout/LayoutUser"));

// Lazy load all page components
const Home = lazy(() => import("@pages/Home/index"));
const Auth = lazy(() => import("@pages/Auth/index"));
const Account = lazy(() => import("@pages/Account/Account"));
const Detail = lazy(() => import("@pages/Detail/Detail"));
const AuthUserWapper = lazy(() => import("@components/Auth/AuthUserWapper"));
const SearchProduct = lazy(() => import("@pages/SearchProduct/UserSearchPageProducts"));
const Cart = lazy(() => import("@pages/Cart/Cart"));
const AboutUs = lazy(() => import("@pages/About-us/index"));
const OrderReturn = lazy(() => import("@pages/OrderReturn/OrderReturn"));

const WrapRoute = ({ element: Element }) => (
  <Suspense fallback={<Loading />}>
    <AuthUserWapper>
      <LayoutUser>
        <Element />
      </LayoutUser>
    </AuthUserWapper>
  </Suspense>
);

const WrapAboutUsRoute = ({ element: Element }) => (
  <Suspense fallback={<Loading />}>
    <AuthUserWapper>
      <LayoutAboutUs>
        <Element />
      </LayoutAboutUs>
    </AuthUserWapper>
  </Suspense>
);

const routes = [
  {
    path: "/",
    element: Home,
    title: "ClinSkin - Hãy cùng chăm sóc làn da của bạn cùng chúng tôi",
    wrapper: WrapRoute,
  },
  {
    path: "/auth",
    element: Auth,
    title: "Đăng nhập - Đăng ký",
    wrapper: WrapRoute,
  },
  {
    path: "/detail/:slug",
    element: Detail,
    title: "Chi tiết sản phẩm",
    wrapper: WrapRoute,
  },
  {
    path: "/searchProduct",
    element: SearchProduct,
    title: "Tim kiem san pham",
    wrapper: WrapRoute,
  },
  {
    path: "/account",
    element: Account,
    title: "Tài khoản",
    wrapper: WrapRoute,
  },
  {
    path: "/cart",
    element: Cart,
    title: "Giỏ hàng",
    wrapper: WrapRoute,
  },
  {
    path: "/about-us",
    element: AboutUs,
    title: "Về chúng tôi",
    wrapper: WrapAboutUsRoute, // Sử dụng layout riêng
  },
  {
    path: "/order-return",
    element: OrderReturn,
    title: "Thông tin kết quả đặt hàng",
    isProtected: true,
    wrapper: WrapRoute,
  },
];

const UserRoutes = routes.map(
  ({ path, element, title, wrapper: WrapRoute }) => ({
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