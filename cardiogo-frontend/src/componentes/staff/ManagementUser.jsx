import React, { useState, useEffect } from "react";
import { Search, Edit, UserCheck, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FormMultiStep from "./FormMultiStep";
import { api } from "../../api/apiMethods";

const ManagementUser = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [hasAllData, setHasAllData] = useState(false);
  const [incompletePatients, setIncompletePatients] = useState({});

  useEffect(() => {
    setIsLoading(true);

    api.getPatiens()
      .then((response) => {
        const formatted = response.data.data.map((item) => ({
          medico: item.medico,
          paciente: item.paciente,
          usuario: item.usuario
        }));

        setPatients(formatted);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (patients.length > 0) {
      const formatted = patients.map((item, index) => ({
        id: index + 1,
        nombrePaciente: item.usuario.nombre_completo,
        doctor: item.medico.nombre_completo,
        medico: item.medico,
        paciente: item.paciente
      }));

      setUsuarios(formatted);
    }
  }, [patients]);

  useEffect(() => {
    const loadCompleteStatus = async () => {
      let result = {};

      for (const item of patients) {
        const id = item.paciente?.id;
        if (!id) continue;

        try {
          const response = await api.getPatiensComplete(id);
          const data = response.data.data;

          const isComplete =
            data.direccionid === 1 &&
            data.estadocivil === 1 &&
            data.ocupacion === 1 &&
            data.personaladmid === 1;

          // false = completo, true = incompleto
          result[id] = !isComplete;
        } catch (e) {
          console.log("Error al validar:", e);
          result[id] = true; // por seguridad, permitir actualizar
        }
      }

      setIncompletePatients(result);
    };

    if (patients.length > 0) loadCompleteStatus();
  }, [patients]);

  const openEditForm = (item) => {
    setSelectedUser(item);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  // Filtrado
  const filteredUsers = usuarios.filter((item) =>
    item.nombrePaciente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pacientesPaginados = filteredUsers.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPage = (num) => {
    setCurrentPage(num);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
                <p className="text-gray-medium">Administra los pacientes registrados</p>
              </div>
            </div>

            {/* BUSCADOR */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-medium w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar paciente..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
        ) : filteredUsers.length === 0 ? (
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
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Doctor Asignado
                          </div>
                        </th>
                        <th className="text-center p-4 font-bold text-gray-dark">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {pacientesPaginados.map((item, index) => (
                        <motion.tr
                          key={item.id}
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
                                {String(item.nombrePaciente || "P").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-primary-dark">
                                  {item.nombrePaciente}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="text-gray-medium">
                              {item.doctor}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex justify-center">
                              {incompletePatients[item.paciente.id] ? (
                                <button
                                  onClick={() => openEditForm(item)}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-danger-light text-danger font-semibold text-xs"
                                >
                                  <Edit className="w-4 h-4" />
                                  Actualizar
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-success-light text-success font-semibold text-xs">
                                  <CheckCircle className="w-3 h-3" />
                                  Completo
                                </span>
                              )}
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
              {pacientesPaginados.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-light hover:border-primary transition-all"
                >
                  {/* Header del card */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {String(item.nombrePaciente || "P").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-primary-dark">
                        {item.nombrePaciente}
                      </h3>
                    </div>
                  </div>

                  {/* Información */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-medium" />
                      <span className="text-sm text-gray-medium">Doctor:</span>
                      <span className="font-semibold text-primary-dark text-sm">
                        {item.doctor}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-light">
                      {incompletePatients[item.paciente.id] ? (
                        <button
                          onClick={() => openEditForm(item)}
                          className="w-full py-2 px-4 bg-danger-light text-danger rounded-lg hover:bg-danger hover:text-white transition-all font-semibold flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Actualizar Información
                        </button>
                      ) : (
                        <div className="w-full py-2 px-4 bg-success-light text-success rounded-lg font-semibold text-center">
                          ✓ Información Completa
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* PAGINACIÓN */}
            {filteredUsers.length > itemsPerPage && (
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
                    {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)}
                  </span>{" "}
                  de{" "}
                  <span className="font-bold text-primary">
                    {filteredUsers.length}
                  </span>{" "}
                  pacientes
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* MODAL MEJORADO */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
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
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Actualizar Paciente</h2>
                      <p className="text-white/80 text-sm">Completa la información del paciente</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeModal}
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Contenido del Modal */}
              <div>
                <FormMultiStep
                  infoPaciente={selectedUser}
                  onClose={closeModal}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ManagementUser;