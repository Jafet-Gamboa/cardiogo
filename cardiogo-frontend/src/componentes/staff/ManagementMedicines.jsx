import React, { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus, ChevronLeft, ChevronRight, Pill, X, Droplet, Syringe, TestTube, Package, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddMedicineModal from "../staff/AddMedicineModal";
import EditMedicineModal from "../staff/EditMedicineModal";
import { api } from "../../api/apiMethods";
import { useAlert } from "../common/useAlert";
import AlertModal from "../common/AlertModal";

const ManagementMedicines = ({ onSuccess, onClose }) => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { alert, showAlert } = useAlert();
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    nombreComercial: "",
    concentracion: "",
    via: "",
    principioActivo: "",
    formaFarmaceutica: "",
    contenidoEmpaque: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getMedicinesList();
        const payloadList = res?.data?.data ?? res?.data ?? [];
        const mapped = (payloadList || []).map((item) => ({
          id: item.id,
          nombreComercial: item.nombre ?? "",
          concentracion: item.concentracion ?? "",
          via: item.via?.administracion ?? item.via_administracion ?? "",
          principioActivo:
            item.principio?.activo ?? item.principio_activo ?? "",
          formaFarmaceutica:
            item.forma?.farmaceutica ?? item.forma_farmaceutica ?? "",
          contenidoEmpaque:
            item.contenido?.empaque ??
            item.contenido_empaque ??
            (typeof item.contenido === "number" ? item.contenido : "") ??
            "",
        }));
        setMedicamentos(mapped);
      } catch (err) {
        console.error("Error cargando medicamentos", err);
      }
    };

    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      nombreComercial: "",
      concentracion: "",
      via: "",
      principioActivo: "",
      formaFarmaceutica: "",
      contenidoEmpaque: "",
    });
    setSelectedId(null);
    setError("");
  };

  const handleAdd = async () => {
    if (
      !formData.nombreComercial ||
      !formData.concentracion ||
      !formData.via ||
      !formData.principioActivo ||
      !formData.formaFarmaceutica ||
      formData.contenidoEmpaque === "" ||
      formData.contenidoEmpaque === null ||
      formData.contenidoEmpaque === undefined
    ) {
      return { success: false, message: "Todos los campos son obligatorios." };
    }

    try {
      const payload = {
        nombre: formData.nombreComercial,
        concentracion: formData.concentracion,
        via_administracion: formData.via,
        principio_activo: formData.principioActivo,
        contenido_empaque: Number(formData.contenidoEmpaque),
        forma_farmaceutica: formData.formaFarmaceutica,
      };

      const res = await api.createMedicine(payload);
      const created = res?.data?.data ?? res?.data ?? {};

      const newMed = {
        id: created.id ?? created.medicaId ?? Date.now(),
        nombreComercial: created.nombre ?? payload.nombre,
        concentracion: created.concentracion ?? payload.concentracion,
        via: created.via_administracion ?? payload.via_administracion,
        principioActivo: created.principio_activo ?? payload.principio_activo,
        formaFarmaceutica: created.forma_farmaceutica ?? payload.forma_farmaceutica,
        contenidoEmpaque: created.contenido_empaque ?? payload.contenido_empaque,
      };

      setMedicamentos((prev) => [...prev, newMed]);
      resetForm();

      return { success: true, message: "Medicamento agregado exitosamente." };

    } catch (err) {
      console.error("Error al agregar medicamento:", err);
      return { success: false, message: "No se pudo guardar el medicamento." };
    }
  };

  const handleEdit = async () => {
    if (!selectedId) {
      return { success: false, message: "ID no válido para actualizar." };
    }

    if (
      !formData.nombreComercial ||
      !formData.concentracion ||
      !formData.via ||
      !formData.principioActivo ||
      !formData.formaFarmaceutica ||
      formData.contenidoEmpaque === "" ||
      formData.contenidoEmpaque === null ||
      formData.contenidoEmpaque === undefined
    ) {
      return { success: false, message: "Todos los campos son obligatorios." };
    }

    try {
      const payload = {
        nombre: formData.nombreComercial,
        concentracion: formData.concentracion,
        via_administracion: formData.via,
        principio_activo: formData.principioActivo,
        contenido_empaque: Number(formData.contenidoEmpaque),
        forma_farmaceutica: formData.formaFarmaceutica,
      };

      await api.putDataMedicina(selectedId, payload);

      const updatedMed = {
        id: selectedId,
        nombreComercial: payload.nombre,
        concentracion: payload.concentracion,
        via: payload.via_administracion,
        principioActivo: payload.principio_activo,
        formaFarmaceutica: payload.forma_farmaceutica,
        contenidoEmpaque: payload.contenido_empaque,
      };

      setMedicamentos((prev) =>
        prev.map((m) => (m.id === selectedId ? updatedMed : m))
      );

      resetForm();

      return { success: true, message: "Medicamento actualizado correctamente." };

    } catch (err) {
      console.error("Error al actualizar medicamento:", err);
      return { success: false, message: "No se pudo actualizar el medicamento." };
    }
  };

  const openEditForm = (med) => {
    setSelectedId(med.id);
    setFormData({
      nombreComercial: med.nombreComercial ?? "",
      concentracion: med.concentracion ?? "",
      via: med.via ?? "",
      principioActivo: med.principioActivo ?? "",
      formaFarmaceutica: med.formaFarmaceutica ?? "",
      contenidoEmpaque: med.contenidoEmpaque ?? "",
    });
    setError("");
    setShowEditModal(true);
  };

  // Filtrado y paginación
  const medicamentosFiltrados = medicamentos.filter((m) =>
    m.nombreComercial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(medicamentosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const medicamentosPaginados = medicamentosFiltrados.slice(startIndex, endIndex);

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
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-dark">
                  Gestión de Medicamentos
                </h2>
                <p className="text-gray-medium">Administra el catálogo de medicamentos</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* BUSCADOR */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-medium w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar medicamento..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* BOTÓN AGREGAR */}
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all shadow-md flex items-center justify-center gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Agregar
              </button>
            </div>
          </div>
        </motion.div>
<AlertModal alert={alert} />
        {medicamentosFiltrados.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-light"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-light flex items-center justify-center mb-4">
              <Pill className="w-10 h-10 text-gray-medium" />
            </div>
            <h3 className="text-xl font-bold text-primary-dark mb-2">
              {searchTerm ? "No se encontraron medicamentos" : "No hay medicamentos registrados"}
            </h3>
            <p className="text-gray-medium">
              {searchTerm ? "Intenta con otra búsqueda" : "Agrega medicamentos para comenzar"}
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
                        <th className="text-left p-4 font-bold text-gray-dark">
                          <div className="flex items-center gap-2">
                            <Pill className="w-4 h-4" />
                            Medicamento
                          </div>
                        </th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          <div className="flex items-center gap-2">
                            <Droplet className="w-4 h-4" />
                            Concentración
                          </div>
                        </th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          <div className="flex items-center gap-2">
                            <Syringe className="w-4 h-4" />
                            Vía
                          </div>
                        </th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          <div className="flex items-center gap-2">
                            <TestTube className="w-4 h-4" />
                            Principio Activo
                          </div>
                        </th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Forma
                          </div>
                        </th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            Contenido
                          </div>
                        </th>
                        <th className="text-center p-4 font-bold text-gray-dark">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {medicamentosPaginados.map((med, index) => (
                        <motion.tr
                          key={med.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-light hover:bg-primary-light transition-colors group"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Pill className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-bold text-primary-dark">
                                  {med.nombreComercial}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-light text-primary-dark font-semibold text-sm">
                              {med.concentracion}
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="text-primary-dark font-medium">
                              {med.via}
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="text-gray-medium">
                              {med.principioActivo}
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                              {med.formaFarmaceutica}
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="text-gray-medium font-medium">
                              {med.contenidoEmpaque}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => openEditForm(med)}
                                className="flex items-center gap-2 text-success hover:text-success-dark font-semibold transition-colors"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                                 Editar
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
              {medicamentosPaginados.map((med, index) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-light hover:border-primary transition-all"
                >
                  {/* Header del card */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md flex-shrink-0">
                      <Pill className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-primary-dark">
                        {med.nombreComercial}
                      </h3>
                    </div>
                  </div>

                  {/* Información */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-gray-medium" />
                      <span className="text-sm text-gray-medium">Concentración:</span>
                      <span className="font-semibold text-primary-dark">
                        {med.concentracion}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Syringe className="w-4 h-4 text-gray-medium" />
                      <span className="text-sm text-gray-medium">Vía:</span>
                      <span className="font-semibold text-primary-dark">
                        {med.via}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <TestTube className="w-4 h-4 text-gray-medium" />
                      <span className="text-sm text-gray-medium">Principio:</span>
                      <span className="font-semibold text-primary-dark">
                        {med.principioActivo}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-medium" />
                      <span className="text-sm text-gray-medium">Forma:</span>
                      <span className="font-semibold text-primary-dark">
                        {med.formaFarmaceutica}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-medium" />
                      <span className="text-sm text-gray-medium">Contenido:</span>
                      <span className="font-semibold text-primary-dark">
                        {med.contenidoEmpaque}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-light flex gap-2">
                      <button
                        onClick={() => openEditForm(med)}
                        className="flex-1 py-2 px-4 bg-success-light text-success rounded-lg hover:bg-success hover:text-white transition-all font-semibold flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* PAGINACIÓN */}
            {medicamentosFiltrados.length > itemsPerPage && (
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
                    {startIndex + 1}-{Math.min(endIndex, medicamentosFiltrados.length)}
                  </span>{" "}
                  de{" "}
                  <span className="font-bold text-primary">
                    {medicamentosFiltrados.length}
                  </span>{" "}
                  medicamentos
                </div>
              </>
            )}
          </>
        )}
      </div>
      {/* Modal AGREGAR */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-10"
            >
              <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-dark p-6 text-white z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Pill className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Agregar Medicamento</h2>
                      <p className="text-white/80 text-sm">Completa el formulario para registrar un nuevo medicamento</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              <div>
                <AddMedicineModal
                  formData={formData}
                  setFormData={setFormData}
                  onClose={() => setShowModal(false)}
                  onSubmit={handleAdd}
                  onSuccess={() => {
                    showAlert("Medicamento agregado", "success");
                    setShowModal(false);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal EDITAR */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setShowEditModal(false);
                resetForm();
              }}
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
            <div className="sticky top-0 bg-gradient-to-r from-success to-success-dark p-6 text-white z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Editar Medicamento</h2>
                    <p className="text-white/80 text-sm">Modifica los datos del medicamento seleccionado</p>
                  </div>
                </div>
                <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                <X className="w-5 h-5" />
                </motion.button>
            </div>
          </div>
            <div>
                <EditMedicineModal
                  formData={formData}
                  setFormData={setFormData}
                  onClose={() => setShowEditModal(false)}
                  onSubmit={handleEdit}
                  onSuccess={() => {
                    setShowEditModal(false);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ManagementMedicines;