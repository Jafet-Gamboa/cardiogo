import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardUser from "../componentes/user/DashboardUser";
import InformationUser from "../componentes/user/InformationUser";
import ProfileUser from "../componentes/common/Profile";

const RutasUser = () => (
  <Routes>
    <Route index element={<DashboardUser />} /> {/* ruta base /cuidador */}
    <Route path="informacion" element={<InformationUser />} />
    <Route path="perfil" element={<ProfileUser />} />
  </Routes>
);

export default RutasUser;
