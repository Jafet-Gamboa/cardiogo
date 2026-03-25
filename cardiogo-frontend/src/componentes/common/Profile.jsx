import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Phone, Mail, Edit, Save, X } from "lucide-react";
import { api } from "../../api/apiMethods";
import { useAlert } from "./useAlert";
import AlertModal from "./AlertModal";

const calcularEdad = (fecha) => {
  if (!fecha) return "—";
  const nacimiento = new Date(fecha);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
};

const ProfileUser = ({ onClose }) => {
  const [editando, setEditando] = useState(false);
  const [celular, setCelular] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [telefonoExist, setTelefonoExist] = useState(false);
  const [celularOriginal, setCelularOriginal] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");
  const { alert, showAlert } = useAlert();

  const usuarioId = localStorage.getItem("userId");
  const rolId = Number(localStorage.getItem("rolId"));

  const [data, setData] = useState({
    usuario: {},
    detalles: null,
    rol: null,
  });

  useEffect(() => {
  // 1. Si no cambió el número → NO validar
  if (celular === celularOriginal) {
    setTelefonoExist(false);
    return;
  }

  // 2. Si está incompleto → NO validar
  if (!celular || celular.length !== 10) {
    setTelefonoExist(false);
    return;
  }

  // 3. Validación real SOLO si lo cambió
  api
    .getUsers()
    .then((response) => {
      const usuarios = response.data.data || [];

      const exists = usuarios.some(
        (item) =>
          item.usuario &&
          item.usuario.telefono === celular &&
          item.usuario.id !== usuarioId
      );

      setTelefonoExist(exists);
    })
    .catch(() => setTelefonoExist(false));
  }, [celular, celularOriginal, usuarioId]);

  // Obtener datos del usuario al cargar el componente
  useEffect(() => {
    setIsLoading(true);

    api
      .getDatosUsuariosById(usuarioId)
      .then((response) => {
        const info = response?.data || {};

        setData({
          usuario: info.usuario || {},
          detalles: info.detalles || null,
          rol: info.rol || null,
        });

        setCelular(info?.usuario?.telefono || "");
        setCelularOriginal(info?.usuario?.telefono || "");
      })
      .catch((error) => console.error("Error al obtener datos:", error))
      .finally(() => setIsLoading(false));
  }, [usuarioId]);

const handleGuardar = async () => {
  setErrorTelefono("");

  if (!/^\d{10}$/.test(celular)) {
    setErrorTelefono("El número debe tener exactamente 10 dígitos.");
    showAlert("El número debe tener exactamente 10 dígitos", "error");
    return;
  }

  if (telefonoExist) {
    setErrorTelefono("Este número de teléfono ya está registrado.");
    showAlert("Este número ya está registrado", "error");
    return;
  }

  try {
    await api.putDataUsuario(usuarioId, { telefono: celular });
    setEditando(false);
    showAlert("Teléfono actualizado correctamente", "success");
  } catch (error) {
    console.error("Error al actualizar:", error);
    showAlert("Ocurrió un error al guardar. Intenta nuevamente", "error");
  }
};


  const datosPersonales = data.usuario;

  const rolTitulo = data.rol ? `Perfil de ${data.rol}` : "Perfil de Usuario";

  const mostrarDetalles = rolId === 3 || rolId === 4;

  const renderDetalles = () => {
    const d = data.detalles;
    if (!d) return null;

    // PACIENTE (rol 3)
    if (rolId === 3) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cuidador Asignado */}
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">
            Cuidador Asignado
          </label>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700">
            {d.cuidador_nombre_completo || "—"}
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">
            Teléfono
          </label>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700">
              {d.cuidador_telefono || "—"}
          </div>
        </div>

        {/* Médico Responsable */}
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">
            Médico Responsable
          </label>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700">
            {d.medico_nombre_completo || "—"}
          </div>
        </div>
      </div>
      );
    }

    // CUIDADOR (rol 4)
    if (rolId === 4) {
      return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Paciente Asignado */}
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">
            Paciente Asignado
          </label>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700">
            {d.paciente_nombre_completo || "—"}
          </div>
        </div>

        {/* Edad */}
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">
            Edad
          </label>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700">
            {calcularEdad(d.paciente_fecha_nacimiento)} años
          </div>
        </div>

        {/* Médico Responsable */}
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">
            Médico Responsable
          </label>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700">
            {d.medico_nombre_completo || "—"}
          </div>
        </div>
      </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full max-h-[80vh] overflow-y-auto p-2 sm:p-4">
      <div className="max-w-6xl mx-auto pb-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-2 mb-3 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{rolTitulo}</h2>
              </div>
            </div>
            <motion.button
  whileHover={{ scale: 1.1, rotate: 90 }}
  whileTap={{ scale: 0.9 }}
  onClick={onClose}
  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
>
  <X className="w-5 h-5" />
</motion.button>

          </div>
        </motion.div>
<AlertModal alert={alert} />
        {/* DATOS PERSONALES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 mb-4"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Datos Personales
            </h3>
            
            {!editando && (
              <button
                onClick={() => setEditando(true)}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Edit className="w-4 h-4" /> Editar
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Campo label="Nombre" value={datosPersonales?.nombre} />
            <Campo
              label="Apellido Paterno"
              value={datosPersonales?.apellido_paterno}
            />
            <Campo
              label="Apellido Materno"
              value={datosPersonales?.apellido_materno}
            />

            {/* Teléfono */}
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1 block">
                <Phone className="w-3 h-3" />
                Celular
              </label>

              {editando ? (
              <>
                <input
                  type="tel"
                  value={celular}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    if (v.length <= 10) setCelular(v);
                  }}
                  placeholder="10 dígitos"
                  className="w-full bg-white border-2 border-blue-500 rounded-lg p-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />

                {/* MENSAJE DE ERROR SI YA EXISTE */}
                {telefonoExist && (
                  <p className="text-red-500 text-xs mt-1">
                    {telefonoExist}
                  </p>
                )}

                {/* Mensaje cuando el número no tiene 10 dígitos */}
                {errorTelefono && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorTelefono}
                  </p>
                )}
              </>
            ) : (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700">
                {celular || "Sin número"}
              </div>
            )}
            </div>

            <Campo
              label="Correo Electrónico"
              value={datosPersonales?.email}
              icon={<Mail className="w-3 h-3" />}
              colSpan="md:col-span-2"
            />
          </div>

          {editando && (
            <div className="mt-6 flex gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={handleGuardar}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"></svg>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Guardar Cambios
              </button>
              <button
                onClick={() => {
                  setEditando(false);
                  setCelular(datosPersonales?.telefono || "");
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" /> Cancelar
              </button>
            </div>
          )}
        </motion.div>

        {mostrarDetalles && data.detalles && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow p-4 border border-slate-200"
          >
            <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-success" />
              Información Adicional
            </h3>

            {renderDetalles()}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const Campo = ({ label, value, icon, colSpan = "" }) => (
  <div className={colSpan}>
    <label className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1 block">
      {icon}
      {label}
    </label>
    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700">
      {value || "—"}
    </div>
  </div>
);

export default ProfileUser;
