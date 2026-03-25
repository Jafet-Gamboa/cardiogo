import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "../pages/doctor/Home";
import DashboardDoctor from "../componentes/hospital/DashboardDoctor";
import PrescriptionForm from "../componentes/hospital/PrescribeMedications";
import PrescriptionsList from "../componentes/hospital/PrescriptionsList";
import PrescribeMedList from '../componentes/hospital/PrescribeMedList';
import FormUser from "../componentes/hospital/FormUser";

const RouteDoctor = () => (
  <Routes>
    <Route index element={<Home />} /> {/* ruta base /medico */}
    <Route path="dashboard" element={<DashboardDoctor />} />
    <Route path="managementReceta" element={<PrescribeMedList />} />
    <Route path="listRecetas" element={<PrescriptionsList />} />
    <Route path="managementUser" element={<FormUser />} />
  </Routes>
);

export default RouteDoctor;