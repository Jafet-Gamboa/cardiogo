import React, { useState, useEffect } from "react";
import { X, UserCheck, Smartphone, MapPin, Briefcase, ChevronRight, ChevronLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../api/apiMethods";

const FormMultiStep = ({ infoPaciente, onClose }) => {
  const [step, setStep] = useState(1);

  // ------------------------- ERRORES -------------------------
  const [errorsStep1, setErrorsStep1] = useState({});
  const [errorsStep2, setErrorsStep2] = useState({});
  const [errorsStep3, setErrorsStep3] = useState({});
  const [errorsStep4, setErrorsStep4] = useState({});
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  // ------------------------- API -------------------------
  const envUrl = import.meta.env.VITE_API_URL;
  const baseURL = `${envUrl}`;
  const token = localStorage.getItem("accessToken");
  const personal_adm_id = localStorage.getItem("personalAdminId");

  // ------------------------- FECHA ACTUAL -------------------------
  const currentDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  };


  // ------------------------- FORM DATA -------------------------
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoP: "",
    apellidoM: "",
    telefono: "",
    correo: "",
    contraseña: "",

    numeroSerie: "",
    relacion: "",

    calle: "",
    numInt: "",
    numExt: "",
    cp: "",
    colonia: "",
    estadoCivil: "",
    ocupacion: "",
  });

  // ------------------------- VALIDACIONES -------------------------
const validateStep1 = () => {
  let e = {};

  if (!formData.nombre.trim()) e.nombre = "Requerido";
  if (!formData.apellidoP.trim()) e.apellidoP = "Requerido";

  if (!formData.telefono.trim()) e.telefono = "Requerido";
  else if (formData.telefono.length !== 10)
    e.telefono = "Debe contener 10 dígitos";

  // VALIDACIÓN DE CORREO
  if (!formData.correo.trim()) e.correo = "Requerido";
  else {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(formData.correo)) e.correo = "Correo inválido";
  }

  if (!formData.contraseña.trim()) e.contraseña = "Requerido";
  else if (formData.contraseña.length < 6)
    e.contraseña = "Mínimo 6 caracteres";

  setErrorsStep1(e);
  return Object.keys(e).length === 0;
};

  const validateStep2 = () => {
    let e = {};

    const serie = formData.numeroSerie.trim();
    if (!serie) e.numeroSerie = "Requerido";
    else if (!/^[A-Za-z0-9]{8}$/.test(serie))
      e.numeroSerie = "Debe contener 8 caracteres (letras o números)";

    if (numeroSerieExist)
      e.numeroSerie = "Este número de serie ya está registrado";

    if (!formData.relacion.trim()) e.relacion = "Requerido";

    setErrorsStep2(e);
    return Object.keys(e).length === 0;
  };


  const validateStep3 = () => {
    let e = {};

    if (!formData.calle.trim()) e.calle = "Requerido";
    if (!formData.numExt.trim()) e.numExt = "Requerido";

    const cp = formData.cp.trim();
    if (!cp) e.cp = "Requerido";
    else if (!/^\d{5}$/.test(cp)) e.cp = "El código postal debe tener 5 dígitos";

    if (!formData.colonia.trim()) e.colonia = "Requerido";

    setErrorsStep3(e);
    return Object.keys(e).length === 0;
  };

  const validateStep4 = () => {
    let errors = {};

    if (!formData.ocupacion) errors.ocupacion = "La ocupación es obligatoria";
    if (!formData.estadoCivil) errors.estadoCivil = "Seleccione estado civil";

    setErrorsStep4(errors);
    return Object.keys(errors).length === 0;
  };


  const [exist, setExist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingCuidadorId, setExistingCuidadorId] = useState(null);
  const [numeroSerieExist, setNumeroSerieExist] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const [telefonoExist, setTelefonoExist] = useState(false);
  const [patients, setPatients] = useState([]);

  //Para el refresh
  const fetchPatients = () => {
  setIsLoading(true);

  api.getPatiens()
    .then((response) => {
      const formatted = response.data.data.map((item) => ({
        medico: item.medico,
        paciente: item.paciente,
        usuario: item.usuario,
      }));

      setPatients(formatted);
    })
    .catch((error) => {
      console.error("Error al obtener usuarios:", error);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchPatients();
  }, []);


  // Verificar si el paciente ya tiene datos completos
  useEffect(() => {
    if (!infoPaciente?.paciente?.id) return;

    setIsLoading(true);

    api.getPatiensComplete(infoPaciente.paciente.id)
      .then((response) => {
        console.log("Array data:", response.data.data);
        const data = response.data.data;

        const hasDataComplete = data.some(
          (item) => item.direccionid && item.estadocivil && item.ocupacion && item.personaladmid
        );

        if (hasDataComplete) {
          setExist(true);

          //const cuidadorId = data[0].cuidador?.id;
          //setExistingCuidadorId(cuidadorId);

          //directo a Step 2 solo si ya tiene cuidador
          setStep(2);

        } else {
          setExist(false);
          setExistingCuidadorId(null);
          setStep(1);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setExist(false);
        setExistingCuidadorId(null);
        setStep(1);
      })
      .finally(() => setIsLoading(false));
  }, [infoPaciente]);

  // Verificar si el número de serie ya existe en el formulario
  useEffect(() => {
  if (!formData.numeroSerie || formData.numeroSerie.length < 8) return;

  setIsLoading(true);

  api.getDevices()
    .then((response) => {
      const data = response.data.data; // array de objetos

      console.log("Devices:", data);

      // Buscar si el número de serie ya existe
      const exists = data.some(
        (item) =>
          item.dispositivo &&
          item.dispositivo.numero_serie &&
          item.dispositivo.numero_serie.toLowerCase() === formData.numeroSerie.toLowerCase()
      );

      if (exists) {
        setErrorsStep2((prev) => ({
          ...prev,
          numeroSerie: "Este número de serie ya está registrado"
        }));

        setNumeroSerieExist(true);
      } else {
        setErrorsStep2((prev) => ({
          ...prev,
          numeroSerie: null
        }));

        setNumeroSerieExist(false);
      }
    })
    .catch((error) => {
      console.error("Error al obtener dispositivos:", error);
      setNumeroSerieExist(false);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [formData.numeroSerie]);

  //Validacion de correo existente
  useEffect(() => {
    if (!formData.correo) return;

    setIsLoading(true);

    api.getUsers()
      .then((response) => {
        const data = response.data.data;

        const exists = data.some(
          (item) =>
            item.usuario &&
            item.usuario.email &&
            item.usuario.email.toLowerCase() === formData.correo.toLowerCase()
        );

        if (exists) {
          setErrorsStep1((prev) => ({
            ...prev,
            correo: "Este correo ya está registrado"
          }));

          setEmailExist(true);
        } else {
          setErrorsStep1((prev) => ({
            ...prev,
            correo: null
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
  }, [formData.correo]);

  //Validacion de telefono existente
  useEffect(() => {
  // Si no hay 10 dígitos, no validar
  if (!formData.telefono || formData.telefono.length !== 10) return;

  setIsLoading(true);

  api.getUsers()
    .then((response) => {
      const data = response.data.data;

      const exists = data.some(
        (item) =>
          item.usuario &&
          item.usuario.telefono &&
          item.usuario.telefono === formData.telefono
      );

      if (exists) {
        setErrorsStep1((prev) => ({
          ...prev,
          telefono: "Este número ya está registrado",
        }));
        setTelefonoExist(true);
      } else {
        setErrorsStep1((prev) => ({
          ...prev,
          telefono: null,
        }));
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


  // ===============================================================
  //  INSERT DEL PASO 1  -> POST /users
  // ===============================================================
  const sendStep1 = async () => {
    try {
      const body = {
        nombre: formData.nombre,
        apellido_paterno: formData.apellidoP,
        apellido_materno: formData.apellidoM || null,
        telefono: formData.telefono,
        email: formData.correo,
        password: formData.contraseña,
        estado: "Activo",
        rol_id: 4,
      };
      console.log(body);
      const res = await fetch(`${baseURL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Paso 1 /users OK:", data);

      // Manejo si la API no devuelve data o id
      if (!data || !data.data || !data.data.id) {
        throw new Error("No se pudo obtener el id del usuario creado");
      }

      return data.data.id; // guarda el id del usuario creado
    } catch (error) {
      console.error("Error paso 1:", error);
      alert("Error al crear usuario: " + (error.message || error));
      return null;
    }
  };

  // ===============================================================
  // INSERT DEL PASO 2  -> POST /caregivers
  // ===============================================================
  const sendStep2 = async (usuarioId) => {
    try {
      const body = {
        relacion_paciente: formData.relacion,
        usuario_id: usuarioId,
        estado: "Activo",
      };
      console.log(body);
      const res = await fetch(`${baseURL}/caregivers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Paso 2 /caregivers:", data);

      if (!data || !data.data || !data.data.id) {
        throw new Error("No se pudo obtener el id del cuidador creado");
      }

      return data.data.id; // regresamos id del cuidador
    } catch (error) {
      console.error("Error paso 2:", error);
      alert("Error al crear cuidador: " + (error.message || error));
      return null;
    }
  };

  // ===============================================================
  //  INSERT DEL PASO 3  -> POST /addresses
  // ===============================================================
    const sendStep3 = async () => {
    try {
      const body = {
        calle: formData.calle,
        numero_interior: formData.numInt || null,
        numero_exterior: formData.numExt,
        codigo_postal: formData.cp,
        colonia: formData.colonia,
        estado: "Activo",
      };

      const res = await fetch(`${baseURL}/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data?.data?.id)
        throw new Error("No regresó id de dirección");

      return data.data.id; // EL direccion_id
    } catch (err) {
      alert("Error paso 3: " + err.message);
      return null;
    }
  };

  // ===============================================================
  //  INSERT PASO 4 -> POST /caregiver_patient
  // ===============================================================
  const sendStep4 = async (cuidadorId, pacienteId) => {
    try {
      console.log("ID cuidador:", cuidadorId);
      console.log("ID paciente:", pacienteId);
      const body = {
        cuidador_id: cuidadorId,
        paciente_id: pacienteId,
        fecha_asignacion: currentDate(),
        estado: "Activo",
      };
      console.log(body);
      const response = await fetch(`${baseURL}/caregiver_patient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("ERROR:", data);
        alert(data.message || "Error al asignar cuidador a paciente");
        return false;
      }

      console.log("Insert OK:", data);
      console.log("Asignación creada correctamente");
      return true;
    } catch (error) {
      console.error("Error general:", error);
      alert("Error al registrar asignación: " + (error.message || error));
      return false;
    }
  };

  // Insert a dispositivos
  const sendDevice = async (pacienteId, cuidadorId) => {
    try {
      const body = {
         numero_serie: formData.numeroSerie,
          modelo: "SmartCare X1",
          marca: "HealthTech",
          estado: "Activo",
          paciente_id: pacienteId,
          cuidador_id: cuidadorId,
      };

      const res = await fetch(`${baseURL}/devices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log("Dispositivo registrado:", data);
      return true;
    } catch (error) {
      console.error("Error al registrar dispositivo:", error);
      alert("Error al registrar dispositivo: " + (error.message || error));
      return false;
    }
  };

  // ------------------------- PORTAL MODAL -------------------------
  // Helper para obtener el id del paciente desde infoPaciente (soporta varias formas)
  const getPacienteIdFromInfo = () => {
    if (!infoPaciente) return null;
    // soporta: infoPaciente.paciente.id || infoPaciente.idPaciente || infoPaciente.id
    return (
      infoPaciente?.paciente?.id ||
      infoPaciente?.idPaciente ||
      infoPaciente?.id ||
      null
    );
  };

    const steps = [
    { number: 1, title: "Cuidador", icon: UserCheck },
    { number: 2, title: "Dispositivo", icon: Smartphone },
    { number: 3, title: "Dirección", icon: MapPin },
    { number: 4, title: "Otros Datos", icon: Briefcase },
  ];

  return(
  <div className="p-6">
        {/* Información del paciente */}
        <div className="grid grid-cols-2 gap-4 mb-6 bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl border border-gray-200">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Paciente</label>
            <p className="mt-1 text-sm font-bold text-gray-800">
              {infoPaciente?.nombrePaciente || infoPaciente?.paciente?.nombre_completo || ""}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Doctor Asignado</label>
            <p className="mt-1 text-sm font-bold text-gray-800">
              {infoPaciente?.doctor || infoPaciente?.medico?.nombre_completo || ""}
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;

              return (
                <React.Fragment key={s.number}>
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isCompleted
                          ? "#10b981"
                          : isActive
                          ? "#3b82f6"
                          : "#e5e7eb",
                      }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "text-white"
                          : isActive
                          ? "text-white"
                          : "text-gray-400"
                      } shadow-lg`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </motion.div>
                    <p
                      className={`mt-2 text-xs font-medium ${
                        isActive ? "text-primary" : "text-gray-500"
                      }`}
                    >
                      {s.title}
                    </p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-2 rounded-full bg-gray-200 overflow-hidden">
                      <motion.div
                        initial={false}
                        animate={{
                          width: step > s.number ? "100%" : "0%",
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-success"
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Mensajes */}
        <AnimatePresence>
          {mensajeError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-danger-light border border-danger rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
              <p className="text-sm text-danger font-medium">{mensajeError}</p>
            </motion.div>
          )}

          {mensajeExito && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-success-light border border-success rounded-xl flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-sm text-success font-medium">{mensajeExito}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* <h3 className="text-xl font-bold mb-4">
          {step === 1 && "Agregar cuidador – Datos personales"}
          {step === 2 && "Vincular dispositivo"}
          {step === 3 && "Actualizar paciente – Dirección"}
          {step === 4 && "Actualizar paciente – Otros datos"}
        </h3> */}

      {/* PASO 1 */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Sección: Información Personal */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-light">
                <h3 className="text-base sm:text-lg font-bold text-gray-dark">
                  Información del Cuidador
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-primary" />
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Ej: Juan"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className={`w-full px-4 py-3 pl-11 bg-gray-light border-2 rounded-xl outline-none transition-all text-primary-dark placeholder:text-gray-medium ${
                        errorsStep1.nombre
                          ? "border-danger bg-danger-light focus:border-danger"
                          : "border-gray-light focus:border-primary focus:bg-white hover:border-primary/30"
                      }`}
                    />
                    <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                  </div>
                  {errorsStep1.nombre && (
                    <p className="text-xs text-danger font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsStep1.nombre}
                    </p>
                  )}
                </div>

                {/* Apellido Paterno */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-dark">
                    Apellido Paterno <span className="text-danger">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Ej: Pérez"
                      value={formData.apellidoP}
                      onChange={(e) => setFormData({ ...formData, apellidoP: e.target.value })}
                      className={`w-full px-4 py-3 pl-11 bg-gray-light border-2 rounded-xl outline-none transition-all text-primary-dark placeholder:text-gray-medium ${
                        errorsStep1.apellidoP
                          ? "border-danger bg-danger-light focus:border-danger"
                          : "border-gray-light focus:border-primary focus:bg-white hover:border-primary/30"
                      }`}
                    />
                    <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                  </div>
                  {errorsStep1.apellidoP && (
                    <p className="text-xs text-danger font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsStep1.apellidoP}
                    </p>
                  )}
                </div>

                {/* Apellido Materno */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-dark">
                    Apellido Materno 
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Ej: García"
                      value={formData.apellidoM}
                      onChange={(e) => setFormData({ ...formData, apellidoM: e.target.value })}
                      className={`w-full px-4 py-3 pl-11 bg-gray-light border-2 rounded-xl outline-none transition-all text-primary-dark placeholder:text-gray-medium ${
                        errorsStep1.apellidoM
                          ? "border-danger bg-danger-light focus:border-danger"
                          : "border-gray-light focus:border-primary focus:bg-white hover:border-primary/30"
                      }`}
                    />
                    <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                  </div>
                  {errorsStep1.apellidoM && (
                    <p className="text-xs text-danger font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsStep1.apellidoM}
                    </p>
                  )}
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Teléfono */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    Teléfono <span className="text-danger">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      minLength={10}
                      maxLength={10}
                      placeholder="10 dígitos"
                      value={formData.telefono}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, telefono: onlyNums });
                      }}
                      className={`w-full px-4 py-3 pl-11 bg-gray-light border-2 rounded-xl outline-none transition-all text-primary-dark placeholder:text-gray-medium ${
                        errorsStep1.telefono
                          ? "border-danger bg-danger-light focus:border-danger"
                          : "border-gray-light focus:border-primary focus:bg-white hover:border-primary/30"
                      }`}
                    />
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                  </div>
                  {errorsStep1.telefono && (
                    <p className="text-xs text-danger font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsStep1.telefono}
                    </p>
                  )}
                  {formData.telefono && formData.telefono.length === 10 && !errorsStep1.telefono && (
                    <p className="text-xs text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Formato válido
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    Correo Electrónico <span className="text-danger">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      className={`w-full px-4 py-3 pl-11 bg-gray-light border-2 rounded-xl outline-none transition-all text-primary-dark placeholder:text-gray-medium ${
                        errorsStep1.correo
                          ? "border-danger bg-danger-light focus:border-danger"
                          : "border-gray-light focus:border-primary focus:bg-white hover:border-primary/30"
                      }`}
                    />
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                  </div>
                    {errorsStep1.correo && (
                      <p className="text-xs text-danger font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errorsStep1.correo}
                      </p>
                    )}

                    {formData.correo && (
                      <>
                        {/* Formato inválido */}
                        {errorsStep1.correo === "Correo inválido" && (
                          <p className="text-xs text-danger flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Formato inválido agrega "@ejemplo.com"
                          </p>
                        )}

                        {/*Formato válido y correo no existente */}
                        {!errorsStep1.correo && !emailExist && (
                          <p className="text-xs text-success flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Correo disponible
                          </p>
                        )}
                      </>
                    )}
                </div>
              </div>
            </div>

            {/* Sección: Credenciales */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-light">
                <h3 className="text-base sm:text-lg font-bold text-gray-dark">
                  Credenciales de Acceso
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Contraseña */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    Contraseña <span className="text-danger">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="password"
                      maxLength={20}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.contraseña}
                      onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                      className={`w-full px-4 py-3 pl-11 bg-gray-light border-2 rounded-xl outline-none transition-all text-primary-dark placeholder:text-gray-medium ${
                        errorsStep1.contraseña
                          ? "border-danger bg-danger-light focus:border-danger"
                          : "border-gray-light focus:border-primary focus:bg-white hover:border-primary/30"
                      }`}
                    />
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                  </div>
                  {errorsStep1.contraseña && (
                    <p className="text-xs text-danger font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsStep1.contraseña}
                    </p>
                  )}
                </div>
              </div>
            </div>
                <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  
                if (!validateStep1()) return;

                if (emailExist || errorsStep1.correo) {
                  setMensajeError("El correo ya está registrado");
                  return;
                }

                if (telefonoExist || errorsStep1.telefono) {
                  setMensajeError("El teléfono ya está registrado");
                  return;
                }

                //Si todo pasó, limpiar error ANTES de avanzar
                setMensajeError("");
                setStep(2);
              }}
                className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-primary to-primary-dark text-white py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                Siguiente
                <ChevronRight className="w-5 h-5" />
              </motion.button>
              
              {/* Nota informativa */}
              <p className="text-center text-xs text-gray-medium mt-4">
                Los campos marcados con <span className="text-danger">*</span> son obligatorios
              </p>
          </motion.div>
        )}

      {/* PASO 2 */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Sección: Información del Dispositivo */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-light">
                <h3 className="text-base sm:text-lg font-bold text-gray-dark">
                  Vinculación de Dispositivo
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Número de Serie */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    Número de Serie <span className="text-danger">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="8 caracteres"
                      maxLength={8}
                      value={formData.numeroSerie}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 8);
                        setFormData({
                          ...formData,
                          numeroSerie: value,
                        });
                      }}
                      className={`w-full px-4 py-3 pl-11 bg-gray-light border-2 rounded-xl outline-none transition-all text-primary-dark placeholder:text-gray-medium uppercase ${
                        errorsStep2.numeroSerie
                          ? "border-danger bg-danger-light focus:border-danger"
                          : "border-gray-light focus:border-primary focus:bg-white hover:border-primary/30"
                      }`}
                    />
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                  </div>
                  {errorsStep2.numeroSerie && (
                    <p className="text-xs text-danger font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsStep2.numeroSerie}
                    </p>
                  )}
                  {formData.numeroSerie && formData.numeroSerie.length === 8 && !errorsStep2.numeroSerie && !numeroSerieExist && (
                    <p className="text-xs text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Número de serie válido
                    </p>
                  )}
                </div>

                {/* Relación */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-primary" />
                    Relación con el Paciente <span className="text-danger">*</span>
                  </label>
                  <div className="relative group">
                    <select
                      value={formData.relacion}
                      onChange={(e) => setFormData({ ...formData, relacion: e.target.value })}
                      className={`w-full px-4 py-3 pl-11 pr-10 bg-gray-light border-2 rounded-xl outline-none transition-all text-primary-dark appearance-none cursor-pointer ${
                        errorsStep2.relacion
                          ? "border-danger bg-danger-light focus:border-danger"
                          : "border-gray-light focus:border-primary focus:bg-white hover:border-primary/30"
                      }`}
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Madre">Madre</option>
                      <option value="Padre">Padre</option>
                      <option value="Hermano">Hermano</option>
                      <option value="Hermana">Hermana</option>
                      <option value="Hijo">Hijo</option>
                      <option value="Hija">Hija</option>
                      <option value="Cuidador">Cuidador</option>
                      <option value="Otro">Otro</option>
                    </select>
                    <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium pointer-events-none group-focus-within:text-primary transition-colors" />
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
                  {errorsStep2.relacion && (
                    <p className="text-xs text-danger font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsStep2.relacion}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Información del dispositivo</p>
                  <p className="text-xs text-blue-700">
                    El número de serie debe tener exactamente 8 caracteres (letras o números). 
                    Este dispositivo se vinculará al paciente y al cuidador que estás registrando.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(1)}
                className="flex px-6 py-3 rounded-xl bg-gray-light text-primary-dark font-semibold hover:bg-gray-medium/20 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                Regresar
              </motion.button>

              <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Limpia el error antes de validar
                setMensajeError("");
                if (!validateStep2()) return;

                if (numeroSerieExist || errorsStep2.numeroSerie) {
                  setMensajeError("El número de serie ya está registrado.");
                  return;
                }
                setStep(3);
              }}
              className="flex px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            </div>
          </motion.div>
        )}

      {/* PASO 3 */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Sección: Dirección del Paciente */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-light">
                <h3 className="text-base sm:text-lg font-bold text-gray-dark">
                  Dirección del Paciente
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Calle - Ancho completo */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Calle <span className="text-danger">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Ej: Av. Revolución"
                      maxLength={100}
                      value={formData.calle}
                      onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
                      className={`w-full px-4 py-3 pl-11 bg-gray-light border-2 rounded-xl outline-none transition-all text-primary-dark placeholder:text-gray-medium ${
                        errorsStep3.calle
                          ? "border-danger bg-danger-light focus:border-danger"
                          : "border-gray-light focus:border-primary focus:bg-white hover:border-primary/30"
                      }`}
                    />
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                  </div>
                  {errorsStep3.calle && (
                    <p className="text-xs text-danger font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsStep3.calle}
                    </p>
                  )}
                </div>

                {/* Números Interior y Exterior */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Número Exterior */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Número Exterior <span className="text-danger">*</span>
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Ej: 123"
                        maxLength={10}
                        value={formData.numExt}
                        onChange={(e) => setFormData({ ...formData, numExt: e.target.value })}
                        className={`w-full px-4 py-3 pl-11 bg-gray-light border-2 rounded-xl outline-none transition-all text-primary-dark placeholder:text-gray-medium ${
                          errorsStep3.numExt
                            ? "border-danger bg-danger-light focus:border-danger"
                            : "border-gray-light focus:border-primary focus:bg-white hover:border-primary/30"
                        }`}
                      />
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                    </div>
                    {errorsStep3.numExt && (
                      <p className="text-xs text-danger font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errorsStep3.numExt}
                      </p>
                    )}
                  </div>

                  {/* Número Interior */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Número Interior
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Ej: A, 201 (opcional)"
                        maxLength={10}
                        value={formData.numInt}
                        onChange={(e) => setFormData({ ...formData, numInt: e.target.value })}
                        className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none transition-all text-primary-dark placeholder:text-gray-medium focus:border-primary focus:bg-white hover:border-primary/30"
                      />
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Código Postal y Colonia */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Código Postal */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Código Postal <span className="text-danger">*</span>
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="5 dígitos"
                        maxLength={5}
                        value={formData.cp}
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/\D/g, "");
                          setFormData({ ...formData, cp: onlyNums.slice(0, 5) });
                        }}
                        className={`w-full px-4 py-3 pl-11 bg-gray-light border-2 rounded-xl outline-none transition-all text-primary-dark placeholder:text-gray-medium ${
                          errorsStep3.cp
                            ? "border-danger bg-danger-light focus:border-danger"
                            : "border-gray-light focus:border-primary focus:bg-white hover:border-primary/30"
                        }`}
                      />
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                    </div>
                    {errorsStep3.cp && (
                      <p className="text-xs text-danger font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errorsStep3.cp}
                      </p>
                    )}
                    {formData.cp && formData.cp.length === 5 && !errorsStep3.cp && (
                      <p className="text-xs text-success flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Código postal válido
                      </p>
                    )}
                  </div>

                  {/* Colonia */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Colonia <span className="text-danger">*</span>
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Ej: Centro"
                        maxLength={100}
                        value={formData.colonia}
                        onChange={(e) => setFormData({ ...formData, colonia: e.target.value })}
                        className={`w-full px-4 py-3 pl-11 bg-gray-light border-2 rounded-xl outline-none transition-all text-primary-dark placeholder:text-gray-medium ${
                          errorsStep3.colonia
                            ? "border-danger bg-danger-light focus:border-danger"
                            : "border-gray-light focus:border-primary focus:bg-white hover:border-primary/30"
                        }`}
                      />
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                    </div>
                    {errorsStep3.colonia && (
                      <p className="text-xs text-danger font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errorsStep3.colonia}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-purple-900 mb-1">Dirección del paciente</p>
                  <p className="text-xs text-purple-700">
                    Esta dirección se utilizará como domicilio principal del paciente. 
                    Asegúrate de que la información sea correcta y completa.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(2)}
                className="flex px-6 py-3 rounded-xl bg-gray-light text-primary-dark font-semibold hover:bg-gray-medium/20 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                Regresar
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setMensajeError("");
                  const ok = validateStep3();
                  if (!ok) {
                    setMensajeError("Faltan campos por completar o hay errores");
                    return;
                  }
                  setStep(4);
                }}
                className="flex px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Siguiente
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

      {/* PASO 4 */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Sección: Información Adicional del Paciente */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-light">
                <h3 className="text-base sm:text-lg font-bold text-gray-dark">
                  Información Adicional del Paciente
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ocupación */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    Ocupación <span className="text-danger">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Ej: Jubilado, Empleado, Estudiante"
                      maxLength={50}
                      value={formData.ocupacion}
                      onChange={(e) =>
                        setFormData({ ...formData, ocupacion: e.target.value })
                      }
                      className={`w-full px-4 py-3 pl-11 bg-gray-light border-2 rounded-xl outline-none transition-all text-primary-dark placeholder:text-gray-medium ${
                        errorsStep4.ocupacion
                          ? "border-danger bg-danger-light focus:border-danger"
                          : "border-gray-light focus:border-primary focus:bg-white hover:border-primary/30"
                      }`}
                    />
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-primary transition-colors" />
                  </div>
                  {errorsStep4.ocupacion && (
                    <p className="text-xs text-danger font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsStep4.ocupacion}
                    </p>
                  )}
                </div>

                {/* Estado Civil */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-primary" />
                    Estado Civil <span className="text-danger">*</span>
                  </label>
                  <div className="relative group">
                    <select
                      value={formData.estadoCivil}
                      onChange={(e) =>
                        setFormData({ ...formData, estadoCivil: e.target.value })
                      }
                      className={`w-full px-4 py-3 pl-11 pr-10 bg-gray-light border-2 rounded-xl outline-none transition-all text-primary-dark appearance-none cursor-pointer ${
                        errorsStep4.estadoCivil
                          ? "border-danger bg-danger-light focus:border-danger"
                          : "border-gray-light focus:border-primary focus:bg-white hover:border-primary/30"
                      }`}
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Soltero">Soltero(a)</option>
                      <option value="Casado">Casado(a)</option>
                      <option value="Divorciado">Divorciado(a)</option>
                      <option value="Viudo">Viudo(a)</option>
                      <option value="Unión libre">Unión libre</option>
                    </select>
                    <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium pointer-events-none group-focus-within:text-primary transition-colors" />
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
                  {errorsStep4.estadoCivil && (
                    <p className="text-xs text-danger font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsStep4.estadoCivil}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Resumen de la información */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-900 mb-2">Resumen de la información</p>
                  <div className="space-y-1 text-xs text-green-700">
                    <p><strong>Cuidador:</strong> {formData.nombre} {formData.apellidoP} {formData.apellidoM}</p>
                    <p><strong>Relación:</strong> {formData.relacion || "No especificada"}</p>
                    <p><strong>Dispositivo:</strong> {formData.numeroSerie || "No especificado"}</p>
                    <p><strong>Dirección del Paciente:</strong> {formData.calle} #{formData.numExt}, {formData.colonia}, CP {formData.cp}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nota informativa final */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">Último paso</p>
                  <p className="text-xs text-amber-700">
                    Al hacer clic en "Guardar Cambios", se registrará el cuidador, se vinculará el dispositivo 
                    y se actualizará toda la información del paciente. Este proceso puede tardar unos segundos.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(3)}
                className="flex px-6 py-3 rounded-xl bg-gray-light text-primary-dark font-semibold hover:bg-gray-medium/20 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                Regresar
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  const ok1 = validateStep1();
                  const ok2 = validateStep2();
                  const ok3 = validateStep3();
                  const ok4 = validateStep4();

                  setMensajeError("");
                  setMensajeExito("");

                  if (!ok1 || !ok2 || !ok3 || !ok4) {
                    setMensajeError("Faltan campos o hay errores en el formulario");
                    return;
                  }

                  const usuarioId = await sendStep1();
                  if (!usuarioId) return;

                  const cuidadorId = await sendStep2(usuarioId);
                  if (!cuidadorId) return;

                  const addressRes = await sendStep3();
                  if (!addressRes) return;

                  const pacienteId = getPacienteIdFromInfo();
                  if (!pacienteId) {
                    setMensajeError("No se encontró el id del paciente.");
                    return;
                  }

                  const deviceOk = await sendDevice(pacienteId, cuidadorId);

                  const okAssign = await sendStep4(cuidadorId, pacienteId);
                  if (!okAssign) return;

                  try {
                    await api.putDataPatient(pacienteId, {
                      personal_adm_id: personal_adm_id,
                      direccion_id: addressRes,
                      estado_civil: formData.estadoCivil,
                      ocupacion: formData.ocupacion,
                    });

                    setMensajeExito("Paciente actualizado correctamente");
                    fetchPatients();
                    setTimeout(() => {
                      onClose();
                    }, 1500);
                  } catch (e) {
                    setMensajeError("Error al actualizar paciente: " + e.message);
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-success to-success-dark hover:from-success-dark hover:to-success text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                Guardar Cambios
              </motion.button>
            </div>
          </motion.div>
        )}
  </div>
  );
};

export default FormMultiStep;