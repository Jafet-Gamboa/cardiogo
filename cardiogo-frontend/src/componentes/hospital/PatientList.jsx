import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, FileText, List, ChevronLeft, ChevronRight, UserCheck, X, ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FormUser from "./FormUser";
import PrescriptionForm from "./PrescribeMedications";
import { api } from "../../api/apiMethods";

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

const [shouldReload, setShouldReload] = useState(false);

useEffect(() => {
  setIsLoading(true);
  api
    .getPatiens()
    .then((response) => {
      const formatted = response.data.data.map((item) => ({
        nombreCompleto: `${item.usuario.nombre_completo} `,
        idPaciente: `${item.paciente.id}`,
        estado: item.paciente.estado,
      }));
      setPatients(formatted);
      setCurrentPage(1);
    })
    .catch((error) => {
      console.error("Error al obtener usuarios:", error);
    })
    .finally(() => {
      setIsLoading(false);
    });
}, [shouldReload]);  // <-- se vuelve a ejecutar cuando esto cambie


  const normalizeText = (text) => {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const filteredPatients = patients.filter((p) => {
    const normalizedName = normalizeText(p.nombreCompleto);
    const normalizedSearch = normalizeText(searchTerm);
    const normalizedId = String(p.idPaciente || "").toLowerCase();

    return (
      normalizedName.includes(normalizedSearch) ||
      normalizedId.includes(normalizedSearch)
    );
  });

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pacientesPaginados = filteredPatients.slice(startIndex, endIndex);

  const goToPage = (page) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleOpenPrescription = (patientId, patientName) => {
    setSelectedPatientId(patientId);
    setSelectedPatientName(patientName);
    setShowPrescriptionModal(true);
  };

  const handleGoToPrescriptionPage = (patientId) => {
    localStorage.setItem("selectedPatientId", patientId);
    navigate("/medico/managementReceta");
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-dark">
                  Gestión de Pacientes
                </h2>
                <p className="text-gray-medium">
                  Total de pacientes: <span className="font-bold text-primary">{patients.length}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* BUSCADOR */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-medium w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar paciente o ID..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* BOTÓN AGREGAR */}
              <button
                onClick={() => setShowUserModal(true)}
                className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all shadow-md flex items-center justify-center gap-2 font-semibold"
              >
                <UserPlus className="w-5 h-5" />
                Agregar
              </button>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-light"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-light flex items-center justify-center mb-4 animate-pulse">
              <UserCheck className="w-10 h-10 text-gray-medium" />
            </div>
            <p className="text-gray-medium">Cargando pacientes...</p>
          </motion.div>
        ) : filteredPatients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-light"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-light flex items-center justify-center mb-4">
              <UserCheck className="w-10 h-10 text-gray-medium" />
            </div>
            <h3 className="text-xl font-bold text-primary-dark mb-2">
              {searchTerm ? "No se encontraron pacientes" : "No hay pacientes registrados"}
            </h3>
            <p className="text-gray-medium">
              {searchTerm ? "Intenta con otra búsqueda" : "Los pacientes aparecerán aquí cuando se registren"}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Vista Desktop - Tabla */}
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-light"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-light border-b-2 border-gray-light">
                        <th className="text-left p-4 font-bold text-gray-dark">#</th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4" />
                            Paciente
                          </div>
                        </th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          ID
                        </th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          Estado
                        </th>
                        <th className="text-center p-4 font-bold text-gray-dark">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {pacientesPaginados.map((patient, index) => (
                        <motion.tr
                          key={patient.idPaciente}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-light hover:bg-primary-light transition-colors group"
                        >
                          <td className="p-4 text-gray-medium font-semibold">
                            {startIndex + index + 1}
                          </td>
                          
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-semibold">
                                {String(patient.nombreCompleto || "P").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-primary-dark">
                                  {patient.nombreCompleto}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-light text-gray-dark font-mono text-sm">
                              #{patient.idPaciente}
                            </span>
                          </td>

                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-lg font-semibold text-sm ${
                                patient.estado === "Activo"
                                  ? "bg-success-light text-success"
                                  : "bg-gray-light text-gray-medium"
                              }`}
                            >
                              {patient.estado}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() =>
                                  handleOpenPrescription(
                                    patient.idPaciente,
                                    patient.nombreCompleto
                                  )
                                }
                                className="flex items-center gap-2 px-3 py-2 bg-primary-light text-primary rounded-lg hover:bg-primary hover:text-white transition-all font-semibold text-sm"
                              >
                                <FileText className="w-4 h-4" />
                                Nueva Receta
                              </button>
                              <button
                                onClick={() =>
                                  handleGoToPrescriptionPage(patient.idPaciente)
                                }
                                className="flex items-center gap-2 px-3 py-2 bg-success-light text-success rounded-lg hover:bg-success hover:text-white transition-all font-semibold text-sm"
                              >
                                <List className="w-4 h-4" />
                                Ver Recetas
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            {/* Vista Mobile/Tablet - Cards */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
              {pacientesPaginados.map((patient, index) => (
                <motion.div
                  key={patient.idPaciente}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-light hover:border-primary transition-all"
                >
                  {/* Header del card */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {String(patient.nombreCompleto || "P").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-primary-dark">
                        {patient.nombreCompleto}
                      </h3>
                      <p className="text-xs text-gray-medium font-mono">
                        ID: #{patient.idPaciente}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-lg font-semibold text-xs ${
                        patient.estado === "Activo"
                          ? "bg-success-light text-success"
                          : "bg-gray-light text-gray-medium"
                      }`}
                    >
                      {patient.estado}
                    </span>
                  </div>

                  {/* Botones de acción */}
                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        handleOpenPrescription(
                          patient.idPaciente,
                          patient.nombreCompleto
                        )
                      }
                      className="w-full py-2 px-4 bg-primary-light text-primary rounded-lg hover:bg-primary hover:text-white transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Nueva Receta
                    </button>
                    <button
                      onClick={() =>
                        handleGoToPrescriptionPage(patient.idPaciente)
                      }
                      className="w-full py-2 px-4 bg-success-light text-success rounded-lg hover:bg-success hover:text-white transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <List className="w-4 h-4" />
                      Ver Recetas
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* PAGINACIÓN */}
            {filteredPatients.length > itemsPerPage && (
              <>
                <div className="flex justify-center items-center mt-8 space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={handlePrevPage}
                    className={`p-2 rounded-lg border transition-all ${
                      currentPage === 1
                        ? "border-gray-light text-gray-medium cursor-not-allowed opacity-50"
                        : "border-primary text-primary hover:bg-primary-light"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => goToPage(num)}
                      className={`px-4 py-2 rounded-lg transition-all font-medium ${
                        num === currentPage
                          ? "bg-primary text-white shadow-md"
                          : "text-primary-dark hover:bg-primary-light border border-gray-light"
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={handleNextPage}
                    className={`p-2 rounded-lg border transition-all ${
                      currentPage === totalPages || totalPages === 0
                        ? "border-gray-light text-gray-medium cursor-not-allowed opacity-50"
                        : "border-primary text-primary hover:bg-primary-light"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* CONTADOR DE RESULTADOS */}
                <div className="mt-6 text-center text-sm text-gray-medium">
                  Mostrando{" "}
                  <span className="font-bold text-primary">
                    {startIndex + 1}-{Math.min(endIndex, filteredPatients.length)}
                  </span>{" "}
                  de{" "}
                  <span className="font-bold text-primary">
                    {filteredPatients.length}
                  </span>{" "}
                  pacientes
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* MODAL AGREGAR USUARIO */}
      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowUserModal(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-10"
            >
              {/* Header del Modal */}
              <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-dark p-6 text-white z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Agregar Nuevo Paciente</h2>
                      <p className="text-white/80 text-sm">Complete los datos del paciente</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowUserModal(false)}
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              <div className="p-6">
                <FormUser onClose={() => setShowUserModal(false)}
                onSuccess={() => {
                setShowUserModal(false);
                setShouldReload(prev => !prev);  // <- cambia y ejecuta useEffect
            }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL PRESCRIPCIÓN */}
      <AnimatePresence>
        {showPrescriptionModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPrescriptionModal(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-10"
            >
              {/* Header del Modal */}
              <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-dark p-6 text-white z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Nueva Receta Médica</h2>
                      <p className="text-white/80 text-sm">Paciente: {selectedPatientName}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPrescriptionModal(false)}
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              <div className="p-6">
                <PrescriptionForm
                  presetPatientId={selectedPatientId}
                  presetPatientName={selectedPatientName}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PatientList;