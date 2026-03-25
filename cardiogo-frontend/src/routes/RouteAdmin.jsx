import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "../pages/admin/Home";
import Dashboard from '../componentes/admin/Dashboard';
import Alta from '../componentes/admin/HighPersonal';
import Gestion from '../componentes/admin/ManagementPersonal';
import AcademixScreens from '../pages/admin/AcademixScreens';

const RutasAdmin = () => (
  <Routes>
    <Route index element={<Home />} /> 
    <Route path="/" element={<Dashboard />} />
    <Route path="/academix" element={<AcademixScreens />} />
    <Route path="alta-usuarios" element={<Alta />} />
    <Route path="gestion-usuarios" element={<Gestion />} />
  </Routes>
);
  
export default RutasAdmin;