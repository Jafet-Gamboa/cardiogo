import Header from "../componentes/common/Header";
import DashboardUser from "../componentes/user/DashboardUser";
import InformationUser from "../componentes/user/InformationUser";

const User = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header role="cuidador" />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <DashboardUser />
        <InformationUser />
      </div>
    </div>
  );
};

export default User;
