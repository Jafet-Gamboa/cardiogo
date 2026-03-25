import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Lock,
  UserCog,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Check,
} from "lucide-react";
import { api } from "../../api/apiMethods";

const HighPersonal = ({ addPersonal }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    telefono: "",
    email: "",
    password: "",
    rol_id: "",
  });

  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [errors, setErrors] = useState({});
  const [emailExist, setEmailExist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });

    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 3000);
  };

  //validación de correo existente
  useEffect(() => {
  if (!formData.email || formData.email.length < 5) return;

  setIsLoading(true);

  api.getUsers()
    .then((response) => {
      const data = response.data.data;

      const exists = data.some(
        (item) =>
          item.usuario &&
          item.usuario.email &&
          item.usuario.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (exists) {
        setErrors((prev) => ({
          ...prev,
          email: "Este correo ya está registrado",
        }));
        setEmailExist(true);
      } else {
        setErrors((prev) => ({
          ...prev,
          email: null,
        }));
        setEmailExist(false);
      }
    })
    .catch(() => {
      setEmailExist(false);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [formData.email]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDACIÓN ESTRICTA DEL TELÉFONO
    if (!formData.telefono || formData.telefono.length !== 10) {
      showAlert("El teléfono debe tener exactamente 10 dígitos", "error");
      return;
    }

    try {
      const response = await api.addPersonal(formData);

      if (response?.data?.status === 0) {
        if (addPersonal) addPersonal(formData);

        showAlert("Personal registrado exitosamente", "success");
      } else {
        showAlert("Error al registrar personal", "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Error en la API", "error");
    }

    setFormData({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      telefono: "",
      email: "",
      password: "",
      rol_id: "",
    });
  };

  return (
    <div className="relative w-full">
      {/* ALERTA MEJORADA */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-4 right-4 sm:top-5 sm:left-auto sm:right-5 z-[9999] sm:max-w-md"
          >
            <div
              className={`rounded-xl shadow-2xl overflow-hidden ${
                alert.type === "success"
                  ? "bg-success-light border-2 border-success"
                  : "bg-danger-light border-2 border-danger"
              }`}
            >
              <div className="p-4 flex items-center gap-3">
                {alert.type === "success" ? (
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-danger flex-shrink-0" />
                )}
                <p
                  className={`font-semibold text-sm sm:text-base ${
                    alert.type === "success"
                      ? "text-success-dark"
                      : "text-danger-dark"
                  }`}
                >
                  {alert.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORMULARIO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Contenido del Formulario */}
        <div className="bg-white rounded-b-2xl shadow-xl p-4 sm:p-6 lg:p-8">
          <div className="space-y-6 sm:space-y-8">
            {/* Sección: Información Personal */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-light">
                <h3 className="text-base sm:text-lg font-bold text-gray-dark">
                  Información Personal
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Ej: Juan"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-primary/30"
                    />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
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
                      name="apellido_paterno"
                      placeholder="Ej: Pérez"
                      value={formData.apellido_paterno}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-primary/30"
                    />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
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
                      name="apellido_materno"
                      placeholder="Ej: García"
                      value={formData.apellido_materno}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-primary/30"
                    />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
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
                    <Phone className="w-4 h-4 text-primary" />
                    Teléfono <span className="text-danger">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      minLength={10}
                      maxLength={10}
                      required
                      className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-primary/30"
                      placeholder="10 dígitos"
                      value={formData.telefono}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, telefono: onlyNums });
                      }}
                    />
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                  </div>
                  {formData.telefono && formData.telefono.length === 10 && (
                    <p className="text-xs text-success flex items-center gap-1">
                      <Check className="w-3 h-3" /> Formato válido
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Correo Electrónico <span className="text-danger">*</span>
                  </label>

                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-primary/30"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                  </div>

                  {/* Mensaje de error */}
                  {errors.email && (
                    <p className="text-danger text-sm">{errors.email}</p>
                  )}
                </div>

              </div>
            </div>

            {/* Sección: Credenciales y Acceso */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-light">
                <h3 className="text-base sm:text-lg font-bold text-gray-dark">
                  Credenciales y Acceso
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Contraseña */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Contraseña <span className="text-danger">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="password"
                      name="password"
                      maxLength={20}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-primary/30"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                  </div>
                </div>

                {/* Rol */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                    <UserCog className="w-4 h-4 text-primary" />
                    Rol del Usuario <span className="text-danger">*</span>
                  </label>
                  <div className="relative group">
                    <select
                      name="rol_id"
                      value={formData.rol_id}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-11 pr-10 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark appearance-none cursor-pointer hover:border-primary/30"
                    >
                      <option value="">Selecciona un rol</option>
                      <option value="1">Administrador</option>
                      <option value="2">Médico</option>
                      <option value="5">Personal Administrativo</option>
                    </select>
                    <UserCog className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium pointer-events-none group-focus-within:text-primary transition-colors" />
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
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={handleSubmit}
            className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-primary to-primary-dark text-white py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            Registrar Personal
          </motion.button>

          {/* Nota informativa */}
          <p className="text-center text-xs text-gray-medium mt-4">
            Los campos marcados con <span className="text-danger">*</span> son obligatorios
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default HighPersonal;