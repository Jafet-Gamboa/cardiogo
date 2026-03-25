import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../componentes/common/Header";
// import DashboardDoctor from "../../componentes/hospital/DashboardDoctor";
import PatientsList from "../../componentes/hospital/PatientList";

const Doctor = () => {
  const location = useLocation();

  const showHomeModules = location.pathname === "/medico";

  return (
    <div className="bg-gray-100">
      <Header role="medico" />
      <div className="mx-auto p-6 space-y-6">
        {showHomeModules && (
          <>
            <PatientsList />
          </>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default Doctor;
