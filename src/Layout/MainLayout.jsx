import React from "react";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "../routes/ProtectedRoute";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    </>
  );
};

export default MainLayout;
