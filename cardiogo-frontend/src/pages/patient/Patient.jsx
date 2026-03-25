import Header from "../componentes/common/Header";
import DashboardUser from "../componentes/user/DashboardUser";
import InformationPatient from "../../componentes/user/InformationPatient";
const Patient = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header role="paciente" />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <DashboardUser />
        <InformationPatient />
      </div>
    </div>
  );
};

export default Patient;
