import React, { useState, useEffect } from "react";
import { Search, Edit, X, Users, Mail, Phone, User, Check, Save, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../api/apiMethods";

const ManagementPersonal = () => {
  const [cuidadores, setCuidadores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const itemsPerPage = 8;
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoP: "",
    apellidoM: "",
    telefono: "",
    correo: "",
    contraseña: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [telefonoError, setTelefonoError] = useState("");
  const [telefonoSuccess, setTelefonoSuccess] = useState("");
  const [originalTelefono, setOriginalTelefono] = useState("");
  const [originalCorreo, setOriginalCorreo] = useState("");

  const cargarCuidadores = async () => {
    try {
      const response = await api.getCuidadores();
      const data = response?.data?.data || [];
      setCuidadores(data);
    } catch (err) {
      console.error("Error al cargar cuidadores:", err);
    }
  };

  useEffect(() => {
    cargarCuidadores();
  }, []);

  // ---- VALIDACIÓN DE CORREO ----
  useEffect(() => {
    if (!formData.correo) return;

    const correo = formData.correo.trim();

    // Validar formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setEmailError("Ingresa un correo válido");
      setEmailSuccess("");
      return;
    }

    // Si no cambió → OK
    if (correo === originalCorreo) {
      setEmailError("");
      //setEmailSuccess("Correo sin cambios");
      return;
    }

    // Buscar existencia entre cuidadores
    const exists = cuidadores.some(
      (c) =>
        c.cuidador.email &&
        c.cuidador.email.toLowerCase() === correo.toLowerCase() &&
        c.cuidador.usuario_id !== formData.usuarioId
    );

    if (exists) {
      setEmailError("Este correo ya está registrado");
      setEmailSuccess("");
    } else {
      setEmailError("");
      setEmailSuccess("Correo disponible");
    }
  }, [formData.correo, cuidadores]);

  // // ---- VALIDACIÓN DE TELÉFONO ----
  // useEffect(() => {
  //   const tel = formData.telefono?.trim();

  //   if (!/^\d{10}$/.test(tel)) {
  //     setTelefonoError("El teléfono debe tener 10 dígitos");
  //     setTelefonoSuccess("");
  //     return;
  //   }

  //   // Si no cambió → OK
  //   if (tel === originalTelefono) {
  //     setTelefonoError("");
  //     //setTelefonoSuccess("Teléfono sin cambios");
  //     return;
  //   }

  //   // Buscar existencia entre cuidadores
  //   const exists = cuidadores.some(
  //     (c) =>
  //       c.cuidador.telefono === tel &&
  //       c.cuidador.usuario_id !== formData.usuarioId
  //   );

  //   if (exists) {
  //     setTelefonoError("Este número ya está registrado");
  //     setTelefonoSuccess("");
  //   } else {
  //     setTelefonoError("");
  //     setTelefonoSuccess("Número disponible");
  //   }
  // }, [formData.telefono, cuidadores]);

  const handleTelefonoChange = (e) => {
      let value = e.target.value;
  
      // Eliminar cualquier cosa que no sea número
      value = value.replace(/\D/g, "");
  
      // Limitar a máximo 10 dígitos
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
  
      // Actualizar usuarioEdit (TU ESTADO REAL)
      setUsuarioEdit((prev) => ({
        ...prev,
        telefono: value,
      }));
    };
  
  
    useEffect(() => {
      if (!usuarioEdit) return;
  
      const tel = usuarioEdit.telefono?.trim() || "";
  
      // Validar solo 10 dígitos exactos
      if (!/^\d{10}$/.test(tel)) {
        setTelefonoError("El teléfono debe tener 10 dígitos");
        setTelefonoSuccess("");
        return;
      }
  
      // Si no cambió
      if (tel === originalTelefono) {
        setTelefonoError("");
        setTelefonoSuccess("Teléfono sin cambios");
        return;
      }
  
      // Verificar si ya existe (comparando con otros usuarios)
      const exists = usuarios.some(
        (u) => u.telefono === tel && u.id !== usuarioEdit.id
      );
  
      if (exists) {
        setTelefonoError("Este número ya está registrado");
        setTelefonoSuccess("");
      } else {
        setTelefonoError("");
        setTelefonoSuccess("Número disponible");
      }
    }, [usuarioEdit?.telefono, usuarios]);

  const normalize = (str) =>
    str
      ? str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      : "";

  useEffect(() => {
    setIsLoading(true);
    api
      .getCuidadores()
      .then((response) => {
        const data = response?.data?.data || [];
        setCuidadores(data);
      })
      .catch((error) => {
        console.error("Error al obtener los cuidadores:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const openEditForm = (cuidador) => {
    setFormData({
      nombre: cuidador.nombre || "",
      apellidoP: cuidador.apellido_paterno || "",
      apellidoM: cuidador.apellido_materno || "",
      telefono: cuidador.telefono || "",
      correo: cuidador.email || "",
      estado: cuidador.estado,
      cuidadorId: cuidador.id,
      usuarioId: cuidador.usuario_id,
      rolId: 4, // Rol de cuidador
    });

     //  valores originales
      setOriginalTelefono(cuidador.telefono || "");
      setOriginalCorreo(cuidador.email || "");

      setTelefonoError("");
      setTelefonoSuccess("");
      setEmailError("");
      setEmailSuccess("");

    setShowForm(true);
    setStep(1);
  };

  const handleGuardar = async () => {

    if (telefonoError || emailError) {
      setMensaje({
        tipo: "error",
        texto: "Corrige los errores antes de guardar."
      });
      return;
    }

    try {
      await api.putDataUsuario(formData.usuarioId, {
        nombre: formData.nombre,
        apellido_paterno: formData.apellidoP,
        apellido_materno: formData.apellidoM,
        telefono: formData.telefono,
        estado: formData.estado,
        email: formData.correo,
      });
      await cargarCuidadores();
      setMensaje({ tipo: "success", texto: "Datos actualizados exitosamente" });
      setShowForm(false);

    } catch (error) {
      //console.error("Error al actualizar:", error);
        setMensaje({
          tipo: "error",
          texto: "Hubo un error al guardar los datos.",
        });
    }
  };


  // Filtrado
  const cuidadoresFiltrados = cuidadores.filter((item) => {
    const nombreCompleto = `${item.cuidador.nombre} ${item.cuidador.apellido_paterno} ${item.cuidador.apellido_materno}`.toLowerCase();

    const coincideEstado =
    estadoFiltro === "todos"
      ? true
      : normalize(item.cuidador.estado) === normalize(estadoFiltro);

    return nombreCompleto.includes(searchTerm.toLowerCase()) && coincideEstado;
  });

  // Paginación
  const totalPages = Math.ceil(cuidadoresFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const cuidadoresPaginados = cuidadoresFiltrados.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPage = (num) => {
    setCurrentPage(num);
  };

  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

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
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-dark">
                  Gestión de Cuidadores
                </h2>
                <p className="text-gray-medium">Administra los cuidadores registrados</p>
              </div>
            </div>

            {/* Filtro Estado */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-dark">
                {/* Estado */}
              </label>
              <div className="relative">
                <select
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                  className="w-full px-3 sm:px-8 py-2.5 sm:py-3 bg-gray-light border-2 border-gray-medium rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm sm:text-base text-primary-dark cursor-pointer appearance-none pr-10"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* BUSCADOR */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-medium w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
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
              <Users className="w-10 h-10 text-gray-medium" />
            </div>
            <p className="text-gray-medium">Cargando cuidadores...</p>
          </motion.div>
        ) : cuidadoresFiltrados.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-light"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-light flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-gray-medium" />
            </div>
            <h3 className="text-xl font-bold text-primary-dark mb-2">
              {searchTerm ? "No se encontraron cuidadores" : "No hay cuidadores registrados"}
            </h3>
            <p className="text-gray-medium">
              {searchTerm ? "Intenta con otra búsqueda" : "Los cuidadores aparecerán aquí cuando se registren"}
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
                            <User className="w-4 h-4" />
                            Nombre Completo
                          </div>
                        </th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Correo Electrónico
                          </div>
                        </th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Teléfono
                          </div>
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
                      {cuidadoresPaginados.map((item, index) => (
                        <motion.tr
                          key={index}
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
                                {String(item.cuidador.nombre || "U").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-primary-dark">
                                  {item.cuidador.nombre} {item.cuidador.apellido_paterno}{" "}
                                  {item.cuidador.apellido_materno}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="text-gray-medium flex items-center gap-2">
                              {item.cuidador.email}
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="text-gray-medium flex items-center gap-2">
                              {item.cuidador.telefono || "No registrado"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                              ${
                                item.cuidador.estado.toLowerCase() === "activo"
                                  ? "bg-success-light text-success-dark"
                                  : "bg-gray-light text-gray-medium"
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full ${item.cuidador.estado.toLowerCase() === "activo" ? "bg-success" : "bg-gray-medium"}`}></div>
                              {item.cuidador.estado}
                            </span>
                          </td>
                          {/* <td className="p-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-lg font-semibold text-sm ${
                                item.cuidador.estado === "activo"
                                  ? "bg-success-light text-success"
                                  : "bg-gray-light text-gray-medium"
                              }`}
                            >
                              {item.cuidador.estado || "activo"}
                            </span>
                          </td> */}

                          <td className="p-4">
                            <div className="flex justify-center">
                              <button
                                onClick={() => openEditForm(item.cuidador)}
                                className="flex items-center gap-2 text-success hover:text-success-dark font-semibold transition-colors"
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
              {cuidadoresPaginados.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-light hover:border-primary transition-all"
                >
                  {/* Header del card */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {String(item.cuidador.nombre || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-primary-dark">
                        {item.cuidador.nombre} {item.cuidador.apellido_paterno}
                      </h3>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-lg font-semibold text-xs ${
                        item.cuidador.estado === "activo"
                          ? "bg-success-light text-success"
                          : "bg-gray-light text-gray-medium"
                      }`}
                    >
                      {item.cuidador.estado || "activo"}
                    </span>
                  </div>

                  {/* Información */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-medium">Email:</span>
                      <span className="font-semibold text-primary-dark text-sm">
                        {item.cuidador.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-medium">Teléfono:</span>
                      <span className="font-semibold text-primary-dark">
                        {item.cuidador.telefono || "No registrado"}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-light">
                      <button
                        onClick={() => openEditForm(item.cuidador)}
                        className="w-full py-2 px-4 bg-success-light text-success rounded-lg hover:bg-success hover:text-white transition-all font-semibold flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar Cuidador
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* PAGINACIÓN */}
            {cuidadoresFiltrados.length > itemsPerPage && (
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
                    {startIndex + 1}-{Math.min(endIndex, cuidadoresFiltrados.length)}
                  </span>{" "}
                  de{" "}
                  <span className="font-bold text-primary">
                    {cuidadoresFiltrados.length}
                  </span>{" "}
                  cuidadores
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* MODAL EDITAR */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
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
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Editar Cuidador</h2>
                      <p className="text-white/80 text-sm">Modifica los datos del cuidador seleccionado</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowForm(false)}
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Contenido del Modal */}
              <div className="p-6 sm:p-8">
                <div className="space-y-6 sm:space-y-8">
                  {/* Sección: Información Personal */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-light">
                      <h3 className="text-base sm:text-lg font-bold text-gray-dark">
                        Información Personal
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                      {/* Nombre */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                          <User className="w-4 h-4 text-success" />
                          Nombre <span className="text-danger">*</span>
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            placeholder="Nombre"
                            value={formData.nombre}
                            onChange={(e) =>
                              setFormData({ ...formData, nombre: e.target.value })
                            }
                            className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-success/30"
                          />
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-success transition-colors" />
                        </div>
                      </div>

                      {/* Apellido Paterno */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary-dark">
                          Apellido Paterno <span className="text-danger">*</span>
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            placeholder="Apellido Paterno"
                            value={formData.apellidoP}
                            onChange={(e) =>
                              setFormData({ ...formData, apellidoP: e.target.value })
                            }
                            className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-success/30"
                          />
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-success transition-colors" />
                        </div>
                      </div>

                      {/* Apellido Materno */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary-dark">
                          Apellido Materno <span className="text-danger">*</span>
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            placeholder="Apellido Materno"
                            value={formData.apellidoM}
                            onChange={(e) =>
                              setFormData({ ...formData, apellidoM: e.target.value })
                            }
                            className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-success/30"
                          />
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-success transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Información de Contacto */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-light">
                      <h3 className="text-base sm:text-lg font-bold text-gray-dark">
                        Información de Contacto
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {/* Teléfono */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                          <Phone className="w-4 h-4 text-success" />
                          Teléfono <span className="text-danger">*</span>
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            placeholder="10 dígitos"
                            maxLength={10}
                            value={formData.telefono}
                            onChange={handleTelefonoChange}
                            className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-success/30"
                          />
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-success transition-colors" />
                        </div>
                        {telefonoError && (
                          <p className="text-danger text-xs font-semibold mt-1">
                            <AlertCircle className="inline w-4 h-4 mr-1" />
                            {telefonoError}
                          </p>
                        )}

                        {telefonoSuccess && (
                          <p className="text-success text-xs font-semibold mt-1">
                            <CheckCircle2 className="inline w-4 h-4 mr-1" />
                            {telefonoSuccess}
                          </p>
                        )}
                      </div>

                      {/* Correo */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                          <Mail className="w-4 h-4 text-success" />
                          Correo Electrónico <span className="text-danger">*</span>
                        </label>
                        <div className="relative group">
                          <input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                            value={formData.correo}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormData({ ...formData, correo: value });

                              // Validar email
                              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                              if (value.trim() === "") {
                                setEmailError("El correo no puede estar vacío");
                                setEmailSuccess("");
                              } else if (!emailRegex.test(value)) {
                                setEmailError("Ingresa un correo válido");
                                setEmailSuccess("");
                              } else {
                                setEmailError("");
                                setEmailSuccess("Correo válido");
                              }
                            }}
                            className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-success/30"
                          />
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-success transition-colors" />
                        </div>
                        {emailError && (
                          <p className="text-danger text-xs font-semibold mt-1"><AlertCircle className="inline w-4 h-4 mr-1" />{emailError}</p>
                        )}

                        {emailSuccess && !emailError && (
                          <p className="text-success text-xs font-semibold mt-1"><CheckCircle2 className="inline w-4 h-4 mr-1" />{emailSuccess}</p>
                        )}
                      </div>

                      {/* Estado */}
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                          <Check className="w-4 h-4 text-success" />
                          Estado <span className="text-danger">*</span>
                        </label>
                        <div className="relative group">
                          <select
                            value={formData.estado}
                            onChange={(e) =>
                              setFormData({ ...formData, estado: e.target.value })
                            }
                            className="w-full px-4 py-3 pl-11 pr-10 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all text-primary-dark appearance-none cursor-pointer hover:border-success/30"
                          >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                          </select>
                          <Check className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium pointer-events-none group-focus-within:text-success transition-colors" />
                          <svg
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTÓN DE ENVÍO */}
                <button
                  type="button"
                  onClick={handleGuardar}
                  className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-success to-success-dark text-white py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  <Save className="w-5 h-5 sm:w-6 sm:h-6" />
                  Guardar Cambios
                </button>

                {mensaje.texto && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    borderRadius: "8px",
                    color: mensaje.tipo === "error" ? "#721c24" : "#155724",
                    backgroundColor: mensaje.tipo === "error" ? "#f8d7da" : "#d4edda",
                    border: "1px solid",
                    borderColor: mensaje.tipo === "error" ? "#f5c6cb" : "#c3e6cb",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  {mensaje.texto}
                </div>
              )}


                {/* Nota informativa */}
                <p className="text-center text-xs text-gray-medium mt-4">
                  Los campos marcados con <span className="text-danger">*</span> son obligatorios
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ManagementPersonal;