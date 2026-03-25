import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, Lock, Calendar, Users, CheckCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../../api/apiMethods";
import { useAlert } from "../common/useAlert";
import AlertModal from "../common/AlertModal";

const FormUser = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    telefono: "",
    password: "",
    sexo: "",
    fecha_nacimiento: "",
  });

  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [telefonoError, setTelefonoError] = useState("");
  const [errors, setErrors] = useState({});
  const [emailExist, setEmailExist] = useState(false);
  const [telefonoExist, setTelefonoExist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorsStep1, setErrorsStep1] = useState({});
  const { alert, showAlert } = useAlert();

  const envUrl = import.meta.env.VITE_API_URL;
  const baseURL = `${envUrl}/users`;
  const patientsURL = `${envUrl}/patients`;
  const token = localStorage.getItem("accessToken");
  const medicoId = localStorage.getItem("medicoId");

  // const handleDateChange = (e) => {
  //   let value = e.target.value.replace(/\D/g, "");
  //   if (value.length > 8) value = value.slice(0, 8);

  //   let formatted = value;
  //   if (value.length > 4)
  //     formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
  //   else if (value.length > 2)
  //     formatted = `${value.slice(0, 2)}/${value.slice(2)}`;

  //   setFormData({ ...formData, fecha_nacimiento: formatted });
  // };

//   const handleDateChange = (e) => {
//   let value = e.target.value.replace(/\D/g, ""); // solo números
//   if (value.length > 8) value = value.slice(0, 8);

//   let formatted = value;
//   if (value.length > 4)
//     formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
//   else if (value.length > 2)
//     formatted = `${value.slice(0, 2)}/${value.slice(2)}`;

//   // --- Validar año mínimo ---
//   if (value.length === 8) {
//     const year = parseInt(value.slice(4), 10);

//     if (year < 1930) {
//       // Puedes bloquear la entrada
//       //return;

//       setErrorsStep1({ ...errorsStep1, fecha_nacimiento: "El año debe ser 1930 o mayor" });
//       return;
//     }
//   }

//   setFormData({ ...formData, fecha_nacimiento: formatted });
// };

const handleDateChange = (e) => {
  let value = e.target.value.replace(/\D/g, ""); // solo números

  let error = null;

  if (value.length > 8) value = value.slice(0, 8);

  // Formateo progresivo DD/MM/YYYY
  let formatted = value;
  if (value.length > 4)
    formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
  else if (value.length > 2)
    formatted = `${value.slice(0, 2)}/${value.slice(2)}`;

  // ---- VALIDACIONES ----

  // Día
  if (value.length >= 2) {
    const day = parseInt(value.slice(0, 2), 10);
    if (day < 1 || day > 31) {
      error = "Día inválido";
    }
  }

  // Mes
  if (!error && value.length >= 4) {
    const month = parseInt(value.slice(2, 4), 10);
    if (month < 1 || month > 12) {
      error = "Mes inválido";
    }
  }

  // Año
  if (!error && value.length === 8) {
    const year = parseInt(value.slice(4), 10);
    if (year < 1930) {
      error = "El año debe ser desde 1930";
    } else {
      // Validación de fecha real
      const day = parseInt(value.slice(0, 2), 10);
      const month = parseInt(value.slice(2, 4), 10);
      const date = new Date(year, month - 1, day);

      const real =
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;

      if (!real) {
        error = "Fecha inválida";
      }
    }
  }

  // Guardar error
  setErrorsStep1((prev) => ({
    ...prev,
    fecha_nacimiento: error,
  }));

  // No actualizar el valor si hay error
  if (error) return;

  // Si todo está bien → actualizar formData
  setFormData({ ...formData, fecha_nacimiento: formatted });
};

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      let cleaned = value.replace(/\D/g, "");
      if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);

      setFormData({ ...formData, telefono: cleaned });

      if (cleaned.length !== 10) {
        setTelefonoError("El número debe tener exactamente 10 dígitos.");
      } else {
        setTelefonoError("");
      }

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //Validar email
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

    //Validacion de telefono existente
  useEffect(() => {
  const tel = formData.telefono;

  // No validar si no tiene 10 dígitos
  if (!tel || tel.length !== 10) {
    setTelefonoError(null);
    return;
  }

  setIsLoading(true);

  api.getUsers()
    .then((response) => {
      const data = response.data.data;

      const exists = data.some(
        (item) =>
          item.usuario &&
          item.usuario.telefono &&
          item.usuario.telefono === tel
      );

      if (exists) {
        setTelefonoError("Este número ya está registrado");
        setTelefonoExist(true);
      } else {
        setTelefonoError(null);
        setTelefonoExist(false);
      }
    })
    .catch(() => {
      setTelefonoExist(false);
    })
    .finally(() => {
      setIsLoading(false);
    });

  }, [formData.telefono]);


const handleSubmit = async (e) => {
  e.preventDefault();

  // VALIDACIONES INICIALES
  if (emailExist || errors.email) {
    showAlert(
      "El correo ya está registrado o el formato es incorrecto. Corrige el campo antes de continuar.",
      "error"
    );
    return;
  }

  if (telefonoExist || telefonoError) {
    showAlert(
      "El número de teléfono ya está registrado o el formato es incorrecto. Corrige el campo antes de continuar.",
      "error"
    );
    return;
  }

  if (formData.telefono.length !== 10) {
    showAlert("El teléfono debe tener exactamente 10 dígitos.", "error");
    return;
  }

  try {
    const [dia, mes, anio] = formData.fecha_nacimiento.split("/");
    const fechaISO = `${anio}-${mes}-${dia}`;

    const dataToSend = {
      ...formData,
      rol_id: 3,
      fecha_nacimiento: fechaISO,
    };

    const responseUser = await axios.post(baseURL, dataToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const usuarioId = responseUser.data?.data?.id;
    if (!usuarioId) throw new Error("No se recibió un ID de usuario del servidor.");

    const patientData = {
      usuario_id: usuarioId,
      sexo: formData.sexo,
      fecha_nacimiento: fechaISO,
      estado: "Activo",
      medico_id: medicoId,
    };

    await axios.post(patientsURL, patientData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    showAlert("Usuario y paciente registrados con éxito", "success");

    setTimeout(() => {
      if (onSuccess) onSuccess(); // Actualiza la tabla
      if (onClose) onClose(); // Cierra modal
    }, 800);

    setFormData({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      email: "",
      telefono: "",
      password: "",
      sexo: "",
      fecha_nacimiento: "",
    });

    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 1500);
    }

  } catch (error) {
    console.error("Error al registrar usuario o paciente:", error);

    let errorMsg = "Ocurrió un error al registrar los datos.";
    if (error.response?.data) {
      errorMsg =
        error.response.data.message ||
        error.response.data.error ||
        (typeof error.response.data === "string"
          ? error.response.data
          : errorMsg);
    } else if (error.request) {
      errorMsg = "No se recibió respuesta del servidor.";
    } else {
      errorMsg = `Error: ${error.message}`;
    }

    showAlert(errorMsg, "error");
  }
};

  return (
    <div className="">
      <AlertModal alert={alert} />
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
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
                  type="tel"
                  name="telefono"
                  placeholder="10 dígitos"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-primary/30"
                />
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
              </div>
              {telefonoError && (
                <p className="text-xs text-danger flex items-center gap-1">
                  {telefonoError}
                </p>
              )}
              {formData.telefono && formData.telefono.length === 10 && !telefonoError && (
                <p className="text-xs text-success flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Formato válido
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
                  className={`w-full px-4 py-3 pl-11 bg-gray-light border-2 rounded-xl outline-none transition-all text-primary-dark placeholder:text-gray-medium 
                    ${errors.email 
                      ? "border-danger bg-danger-light focus:border-danger" 
                      : "border-gray-light focus:border-primary focus:bg-white hover:border-primary/30"
                    }`}
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
              </div>

          {/*Error bonito */}
          {errors.email && (
            <p className="text-xs text-danger font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}

          {/*Email válido */}
          {formData.email &&
            !errors.email &&
            !emailExist && (
              <p className="text-xs text-success flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Correo válido
              </p>
          )}
        </div>

          </div>
        </div>

        {/* Sección: Datos Adicionales */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-light">
            <h3 className="text-base sm:text-lg font-bold text-gray-dark">
              Datos Adicionales
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

            {/* Fecha de Nacimiento */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Fecha de Nacimiento <span className="text-danger">*</span>
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="fecha_nacimiento"
                  placeholder="DD/MM/YYYY"
                  value={formData.fecha_nacimiento}
                  onChange={handleDateChange}
                  pattern="\d{2}/\d{2}/\d{4}"
                  maxLength={10}
                  required
                  className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-primary/30"
                />
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            {/* Sexo */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Sexo <span className="text-danger">*</span>
              </label>
              <div className="flex gap-4 p-4 bg-gray-light border-2 border-gray-light rounded-xl hover:border-primary/30 transition-all">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sexo"
                    value="Masculino"
                    checked={formData.sexo === "Masculino"}
                    onChange={handleChange}
                    required
                    className="w-4 h-4 text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-primary-dark font-medium">Masculino</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sexo"
                    value="Femenino"
                    checked={formData.sexo === "Femenino"}
                    onChange={handleChange}
                    required
                    className="w-4 h-4 text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-primary-dark font-medium">Femenino</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* BOTÓN DE ENVÍO */}
        <button
          type="submit"
          className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-primary to-primary-dark text-white py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
        >
          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          Registrar Paciente
        </button>

              {/* Mensajes */}
      {mensajeExito && (
        <div className="mb-6 p-4 bg-success-light border-l-4 border-success rounded-xl flex items-start gap-3 animate-fadeIn">
          <div className="bg-success text-white rounded-full p-1 mt-0.5">
            <CheckCircle className="w-4 h-4" />
          </div>
          <p className="text-success font-medium">{mensajeExito}</p>
        </div>
      )}
      {mensajeError && (
        <div className="mb-6 p-4 bg-danger-light border-l-4 border-danger rounded-xl flex items-start gap-3 animate-fadeIn">
          <div className="bg-danger text-white rounded-full p-1 mt-0.5">
            <CheckCircle className="w-4 h-4" />
          </div>
          <p className="text-danger font-medium">{mensajeError}</p>
        </div>
      )}

        {/* Nota informativa */}
        <p className="text-center text-xs text-gray-medium mt-4">
          Los campos marcados con <span className="text-danger">*</span> son obligatorios
        </p>
      </form>
    </div>
  );
};

export default FormUser;