import React from "react";
import { Route, Routes } from "react-router-dom";
import UserRoutes from "./user";
import AdminRoutes from "./admin";
import ShipperRoutes from "./shipper";

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
      {ShipperRoutes.map((route, index) => (
        <Route
          key={`shipper-${index}`}
          path={route.path}
          element={route.element}
        />
      ))}
    </Routes>
  );
};

export default Router;