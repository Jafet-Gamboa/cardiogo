import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Edit, CheckCircle, AlertCircle, X, User, Mail, Phone, Shield, UserCog, Save } from "lucide-react";
import { api } from "../../api/apiMethods";
import { useAlert } from "../common/useAlert";
import AlertModal from "../common/AlertModal";

const ManagementPersonal = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [rolFiltro, setRolFiltro] = useState("todos");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  // const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [telefonoError, setTelefonoError] = useState("");
  const [telefonoSuccess, setTelefonoSuccess] = useState("");
  const [originalTelefono, setOriginalTelefono] = useState("");
  const { alert, showAlert } = useAlert();


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

  const normalize = (str) =>
    str
      ? str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      : "";

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.getUsers();

        const datosNormalizados = response.data.data.map((item) => ({
          id: item.usuario.id,
          nombre: item.usuario.nombre,
          apellido_paterno: item.usuario.apellido_paterno,
          apellido_materno: item.usuario.apellido_materno,
          email: item.usuario.email,
          estado: item.usuario.estado,
          telefono: item.usuario.telefono,
          rol: item.rol.descripcion.toLowerCase(),
        }));

        setUsuarios(datosNormalizados);
      } catch (err) {
        setError("Error al cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const goToPage = (page) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

// FILTRO
const usuariosFiltrados = usuarios.filter((u) => {
  const nombreCompleto = normalize(
    `${u.nombre} ${u.apellido_paterno} ${u.apellido_materno}`
  );

  const coincideBusqueda = nombreCompleto.includes(normalize(searchTerm));
  const coincideRol =
    rolFiltro === "todos" ? true : normalize(u.rol) === normalize(rolFiltro);
  const coincideEstado =
    estadoFiltro === "todos"
      ? true
      : normalize(u.estado) === normalize(estadoFiltro);

  return coincideBusqueda && coincideRol && coincideEstado;
});


  // PAGINACIÓN (DEBE IR DESPUÉS)
const totalPages = Math.ceil(usuariosFiltrados.length / itemsPerPage) || 1;
const startIndex = (currentPage - 1) * itemsPerPage;
const currentUsers = usuariosFiltrados.slice(startIndex, startIndex + itemsPerPage);

  // const showAlert = (message, type = "success") => {
  //   setAlert({ show: true, message, type });
  //   setTimeout(() => {
  //     setAlert({ show: false, message: "", type: "" });
  //   }, 3000);
  // };

  const handleEdit = (usuario) => {
    setShowModal(false); // cerrar primero si ya estaba abierto

    setTimeout(() => {
      setUsuarioEdit({ ...usuario });
      setOriginalTelefono(usuario.telefono);
      setShowModal(true);
    }, 10); // esperar un ciclo para reconstruir componente
  };

  // const handleSave = async () => {
  //   // Validación estricta
  //   if (!usuarioEdit.telefono || usuarioEdit.telefono.length !== 10) {
  //     showAlert("El teléfono debe tener 10 dígitos", "error");
  //     return;
  //   }

  //   try {
  //     const payload = {
  //       nombre: usuarioEdit.nombre,
  //       apellido_paterno: usuarioEdit.apellido_paterno,
  //       apellido_materno: usuarioEdit.apellido_materno,
  //       telefono: usuarioEdit.telefono,
  //       email: usuarioEdit.email,
  //       estado: usuarioEdit.estado,
  //     };

  //     const response = await api.putUsers(usuarioEdit.id, payload);

  //     if (response.data.status === 0) {
  //       setUsuarios((prev) =>
  //         prev.map((u) =>
  //           u.id === usuarioEdit.id ? { ...u, ...usuarioEdit } : u
  //         )
  //       );
  //       setShowModal(false);
  //       showAlert("Usuario actualizado exitosamente", "success");
  //     } else {
  //       showAlert("Error al actualizar usuario", "error");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     showAlert("Error al actualizar usuario", "error");
  //   }
  // };

  const handleSave = async () => {
    // Validación estricta
    if (!usuarioEdit.telefono || usuarioEdit.telefono.length !== 10) {
      showAlert("El teléfono debe tener 10 dígitos", "error");
      return;
    }

    try {
      const payload = {
        nombre: usuarioEdit.nombre,
        apellido_paterno: usuarioEdit.apellido_paterno,
        apellido_materno: usuarioEdit.apellido_materno,
        telefono: usuarioEdit.telefono,
        email: usuarioEdit.email,
        estado: usuarioEdit.estado,
      };

      const response = await api.putUsers(usuarioEdit.id, payload);

    if (response.data.status === 0) {
        setUsuarios((prev) =>
          prev.map((u) =>
            u.id === usuarioEdit.id ? { ...u, ...usuarioEdit } : u
          )
        );
      setShowModal(false);
      showAlert("Usuario actualizado exitosamente", "success");
    } else {
      showAlert("Error al actualizar usuario", "error");
    }
  } catch (err) {
    console.error(err);
    showAlert("Error al actualizar usuario", "error");
  }
};


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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  <AlertModal alert={alert} />

  return (
    <div className="max-w-7xl mx-auto">
      {/* ALERTA MEJORADA */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-[9999] max-w-md"
          >
            <div
              className={`flex items-center gap-3 px-5 py-4 rounded-xl text-white shadow-2xl backdrop-blur-sm border-2
              ${
                alert.type === "success"
                  ? "bg-gradient-to-r from-success to-success-dark border-success-light"
                  : "bg-gradient-to-r from-danger to-danger-dark border-danger-light"
              }`}
            >
              {alert.type === "success" ? (
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
              )}
              <p className="font-semibold flex-1">{alert.message}</p>
              <button
                onClick={() => setAlert({ show: false, message: "", type: "" })}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
          </div>
        </motion.div>

        {/* FILTROS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-light"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Filtro Rol */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-dark">
                Rol
              </label>
              <div className="relative">
                <select
                  value={rolFiltro}
                  onChange={(e) => setRolFiltro(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm sm:text-base text-primary-dark cursor-pointer appearance-none pr-10"
                >
                  <option value="todos">Todos los roles</option>
                  <option value="médico">Médico</option>
                  <option value="paciente">Paciente</option>
                  <option value="cuidador">Cuidador</option>
                  <option value="personal administrativo">Administrativo</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filtro Estado */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-dark">
                Estado
              </label>
              <div className="relative">
                <select
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm sm:text-base text-primary-dark cursor-pointer appearance-none pr-10"
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

            {/* Búsqueda */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <label className="block text-xs sm:text-sm font-semibold text-gray-dark">
                Buscar
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm sm:text-base text-primary-dark placeholder:text-gray-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-medium" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* TABLA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-light"
        >
          {/* Vista de tabla para desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-light to-white border-b-2 border-gray-light">
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
                      Correo
                    </div>
                  </th>
                  <th className="text-left p-4 font-bold text-gray-dark">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Estado
                    </div>
                  </th>
                  <th className="text-left p-4 font-bold text-gray-dark">
                    <div className="flex items-center gap-2">
                      <UserCog className="w-4 h-4" />
                      Rol
                    </div>
                  </th>
                  <th className="text-center p-4 font-bold text-gray-dark">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((u, index) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-light hover:bg-primary/5 transition-colors"
                  >
                    <td className="p-4 text-gray-medium font-semibold">
                      {startIndex + index + 1}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-semibold">
                          {String(u.nombre || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-primary-dark">
                          {u.nombre} {u.apellido_paterno} {u.apellido_materno}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-primary-dark">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          u.estado.toLowerCase() === "activo"
                            ? "bg-success-light text-success-dark"
                            : "bg-gray-light text-gray-medium"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${u.estado.toLowerCase() === "activo" ? "bg-success" : "bg-gray-medium"}`}></div>
                        {u.estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-primary-dark">{u.rol}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(u)}
                          className="flex items-center gap-2 text-success hover:text-success-dark font-semibold transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista de cards para móvil y tablet */}
          <div className="lg:hidden divide-y divide-gray-light">
            {currentUsers.map((u, index) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-primary/5 transition-colors"
              >
                {/* Header con número y estado */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-medium">
                    #{startIndex + index + 1}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                    ${
                      u.estado.toLowerCase() === "activo"
                        ? "bg-success-light text-success-dark"
                        : "bg-gray-light text-gray-medium"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${u.estado.toLowerCase() === "activo" ? "bg-success" : "bg-gray-medium"}`}></div>
                    {u.estado}
                  </span>
                </div>

                {/* Nombre con avatar */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary-dark text-base truncate">
                      {u.nombre} {u.apellido_paterno} {u.apellido_materno}
                    </h3>
                    <p className="text-sm text-gray-medium capitalize mt-0.5">
                      {u.rol}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 mb-4 text-sm text-primary-dark">
                  <Mail className="w-4 h-4 text-gray-medium flex-shrink-0" />
                  <span className="truncate">{u.email}</span>
                </div>

                {/* Botón de acción */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEdit(u)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-success/10 text-success hover:bg-success/20 rounded-xl font-semibold transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar Usuario
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Mensaje de no encontrados */}
          {usuariosFiltrados.length === 0 && (
            <div className="text-center py-12 px-4">
              <User className="w-16 h-16 text-gray-light mx-auto mb-4" />
              <p className="text-gray-medium font-medium">No se encontraron usuarios</p>
              <p className="text-sm text-gray-medium mt-1">Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Paginación mejorada */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={handlePrevPage}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            currentPage === 1
              ? "border-gray-light text-gray-medium cursor-not-allowed"
              : "border-gray-medium text-gray-medium hover:bg-gray-light"
          }`}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => goToPage(num)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              num === currentPage
                ? "bg-primary text-white shadow-md"
                : "text-primary-dark hover:bg-gray-light border border-gray-light"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={handleNextPage}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            currentPage === totalPages || totalPages === 0
              ? "border-gray-light text-gray-medium cursor-not-allowed"
              : "border-gray-medium text-gray-medium hover:bg-gray-light"
          }`}
        >
          &gt;
        </button>
        
      </div>
      {/* Contador de resultados */}
        <div className="mt-4 text-sm text-gray-medium">
          Mostrando <span className="font-bold text-primary">{usuariosFiltrados.length}</span> de {usuarios.length} usuarios
        </div>

      {/* MODAL DE EDICIÓN */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
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
                      <UserCog className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Editar Usuario</h2>
                      <p className="text-white/80 text-sm">
                        Actualiza la información del usuario
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
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
                            value={usuarioEdit.nombre}
                            onChange={(e) =>
                              setUsuarioEdit({ ...usuarioEdit, nombre: e.target.value })
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
                            placeholder="Apellido paterno"
                            value={usuarioEdit.apellido_paterno}
                            onChange={(e) =>
                              setUsuarioEdit({
                                ...usuarioEdit,
                                apellido_paterno: e.target.value,
                              })
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
                            placeholder="Apellido materno"
                            value={usuarioEdit.apellido_materno}
                            onChange={(e) =>
                              setUsuarioEdit({
                                ...usuarioEdit,
                                apellido_materno: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-success/30"
                          />
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-success transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Contacto */}
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
                            inputMode="numeric"
                            placeholder="10 dígitos"
                            value={usuarioEdit.telefono}
                            onChange={handleTelefonoChange}

                            className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-success/30"
                          />
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-success transition-colors" />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                          <Mail className="w-4 h-4 text-success" />
                          Correo Electrónico <span className="text-danger">*</span>
                        </label>

                        <div className="relative group">
                          <input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={usuarioEdit.email}
                            onChange={(e) =>
                              setUsuarioEdit({ ...usuarioEdit, email: e.target.value })
                            }
                            className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-success/30"
                          />
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-success transition-colors" />
                        </div>
                      </div>

                      {/* Estado */}
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                          <Shield className="w-4 h-4 text-success" />
                          Estado <span className="text-danger">*</span>
                        </label>

                        <div className="relative group">
                          <select
                            value={usuarioEdit.estado}
                            onChange={(e) =>
                              setUsuarioEdit({ ...usuarioEdit, estado: e.target.value })
                            }
                            className="w-full px-4 py-3 pl-11 pr-10 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all appearance-none cursor-pointer text-primary-dark hover:border-success/30"
                          >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                          </select>

                          <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-success transition-colors" />

                          {/* Icono del select */}
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

                {/* Botón Guardar */}
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full mt-6 bg-gradient-to-r from-success to-success-dark text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  <Save className="w-6 h-6" />
                  Guardar Cambios
                </button>

                <p className="text-center text-xs text-gray-medium mt-4">
                  Los campos marcados con <span className="text-danger">*</span> son obligatorios
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ManagementPersonal;