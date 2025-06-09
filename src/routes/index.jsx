import React from "react";
import { Route, Routes } from "react-router-dom";
import UserRoutes from "./user";
import AdminRoutes from "./admin";

const Router = () => {
  return (
    <Routes>
      {UserRoutes.map((route, index) => (
        <Route
          key={`user-${index}`}
          path={route.path}
          element={route.element}
        />
      ))}
      {AdminRoutes.map((route, index) => (
        <Route
          key={`admin-${index}`}
          path={route.path}
          element={route.element}
        />
      ))}
    </Routes>
  );
};

export default Router;