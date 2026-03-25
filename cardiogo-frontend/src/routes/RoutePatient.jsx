import React from "react";
import { Routes, Route } from "react-router-dom";
import InformationPatient from "../componentes/user/InformationPatient";
import ProfileUser from "../componentes/common/Profile";

const RutasPatient = () => (
  <Routes>
    <Route index element={<InformationPatient />} /> {/* ruta base /cuidador */}
    <Route path="perfil" element={<ProfileUser />} />
  </Routes>
);

export default RutasPatient;
