import { Outlet, useLocation } from "react-router-dom";
import Header from "../../componentes/common/Header";
import ManagementUser from "../../componentes/staff/ManagementUser";

const Staff = () => {
  const location = useLocation();

  // Si estamos en /staff exacto, mostrar ambos módulos
  const showHomeModules = location.pathname === "/staff";

  return (
    <div className="min-h-screen bg-gray-100">
      <Header role="administrativo" />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {showHomeModules && (
          <>
            <ManagementUser />
          </>
        )}

        {/* Aquí se renderizan las rutas hijas */}
        <Outlet />
      </div>
    </div>
  );
};

export default Staff;
