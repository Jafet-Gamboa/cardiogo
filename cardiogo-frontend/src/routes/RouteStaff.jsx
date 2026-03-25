import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/staff/Home"
import ManagementMedicines from "../componentes/staff/ManagementMedicines";
import ManagementUser from "../componentes/staff/ManagementUser";
import ManagementPersonal from "../componentes/staff/ManagementPersonal";

const RutasStaff = () => (
  <Routes>
    <Route index element={<Home />} /> {/* ruta base /staff */}
    <Route path="gestion-medicamentos" element={<ManagementMedicines />} />
    <Route path="gestion-pacientes" element={<ManagementUser />} />
    <Route path="gestion-cuidadores" element={<ManagementPersonal />} />  

  </Routes>
);

export default RutasStaff;
