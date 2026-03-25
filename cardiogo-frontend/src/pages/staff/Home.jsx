import React from "react";
import { Outlet } from "react-router-dom";
// import Header from "../../componentes/common/Header";
import ManagementUser from "../../componentes/staff/ManagementUser";
import ManagementMedicines from "../../componentes/staff/ManagementMedicines";

const Staff = () => {
  return (
    <div className="bg-gray-100">
      {/* <Header role="administrativo" /> */}
        {/* <ManagementUser />
        <ManagementMedicines /> */}

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Outlet /> {/* Aquí se renderizan HighUser o HighMedicines según la ruta */}
      </div>
    </div>
  );
};

export default Staff;
