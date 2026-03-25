import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../componentes/common/Header";
import Dashboard from "../../componentes/admin/Dashboard";

const Admin = () => {
  const location = useLocation();

  const showHomeModules = location.pathname === "/administrador";

  return (
    <div className="bg-gray-100">
      <Header role="administrador" />
      <div className="mx-auto p-6 space-y-6">
        {showHomeModules && (
          <>
            <Dashboard />
          </>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
