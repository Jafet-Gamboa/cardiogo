import React from "react";
import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <div className="bg-gray-100">
      <div className="mx-auto p-6 space-y-6">
        <Outlet /> 
      </div>
    </div>
  );
};

export default Admin;
