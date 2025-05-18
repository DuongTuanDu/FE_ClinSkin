import React, { lazy, Suspense } from "react";
import Loading from "@components/Loading";

const LayoutUser = lazy(() => import("@components/Layout/LayoutUser"));

// Lazy load all page components
const Home = lazy(() => import("@pages/Home/index"));
const Auth = lazy(() => import("@pages/Auth/index"));


const WrapRoute = ({ element: Element }) => (
  <Suspense fallback={<Loading />}>
    <LayoutUser>
      <Element />
    </LayoutUser>
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
  }
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