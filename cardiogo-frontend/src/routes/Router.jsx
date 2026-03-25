import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home/Landing';
import Login from '../componentes/autentication/LoginForm';
import Registro from '../componentes/autentication/RegisterForm';
import AcademixScreens from '../pages/admin/AcademixScreens';

const RutasPublicas = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/academix" element={<AcademixScreens />} />
    <Route path="/login" element={<Login />} />
    <Route path="/registro" element={<Registro />} />
  </Routes>
);

export default RutasPublicas;