import Header from "../../componentes/common/Header";
import InformationPatient from "../../componentes/user/InformationPatient";
import DashboardPatient from "../../componentes/user/DashboardPatient";
const Patient = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header role="paciente" />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <DashboardPatient />
        <InformationPatient />
      </div>
    </div>
  );
};

export default Patient;
