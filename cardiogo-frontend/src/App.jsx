import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RolProvider } from "./context/RolContext";
import RutasPublicas from "./routes/Router";
import User from "./pages/User";
import Staff from "./pages/staff/Staff";
import Doctor from "./pages/doctor/Doctor";
import Admin from "./pages/admin/Admin";
import RutasAdmin from "./routes/RouteAdmin";
import RutasCuidador from "./routes/RouteUser";
import RutasStaff from "./routes/RouteStaff";
import RutasMedico from "./routes/RouteDoctor";
import Patient from "./pages/patient/Home";
import RutasPatient from "./routes/RoutePatient";
import LandingPage from "./pages/home/Landing";

const App = () => {
  // 🔹 Función interna para proteger rutas
  const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem("accessToken");
    const rol = localStorage.getItem("rolId");

    // Si no hay sesión, redirige al login
    if (!token) {
      return <Navigate to="/" replace />;
    }

    // Si hay un rol requerido y no coincide, redirige también
    // if (requiredRole && rol !== requiredRole.toString()) {
    //   return <Navigate to="/" replace />;
    // }

    // Si pasa la validación, muestra el contenido
    return children;
  };

  return (
    <RolProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 🔹 Rutas públicas (login, registro, etc.) */}
            <Route path="/*" element={<RutasPublicas />} />

            {/* 🔹 Paciente */}
            <Route
              path="/paciente/*"
              element={
                <ProtectedRoute requiredRole={3}>
                  <Patient />
                </ProtectedRoute>
              }
            >
              <Route path="*" element={<RutasPatient />} />
            </Route>

            {/* 🔹 Cuidador */}
            <Route
              path="/cuidador/*"
              element={
                <ProtectedRoute requiredRole={4}>
                  <User />
                </ProtectedRoute>
              }
            >
              <Route path="*" element={<RutasCuidador />} />
            </Route>

            {/* 🔹 Staff */}
            <Route
              path="/staff/*"
              element={
                <ProtectedRoute requiredRole={5}>
                  <Staff />
                </ProtectedRoute>
              }
            >
              <Route path="*" element={<RutasStaff />} />
            </Route>

            {/* 🔹 Médico */}
            <Route
              path="/medico/*"
              element={
                <ProtectedRoute requiredRole={2}>
                  <Doctor />
                </ProtectedRoute>
              }
            >
              <Route path="*" element={<RutasMedico />} />
            </Route>

            {/* 🔹 Administrador */}
            <Route
              path="/administrador/*"
              element={
                <ProtectedRoute requiredRole={1}>
                  <Admin />
                </ProtectedRoute>
              }
            >
              <Route path="*" element={<RutasAdmin />} />
            </Route>

            {/* 🔹 Redirección general */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </RolProvider>
  );
};
export default App;
