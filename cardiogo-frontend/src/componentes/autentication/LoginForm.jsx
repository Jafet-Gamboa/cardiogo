import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { RolContext } from "../../context/RolContext";
import AuthService from "../../services/Autentication";
import Health from "../../assets/health.png";
import Logo from "../../assets/logoVertical.png";
import { requestNotificationPermission, getFcmToken } from "../../services/Fcm";
import { api } from "../../api/apiMethods";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { setUsuario } = useContext(AuthContext);
  const { setRol } = useContext(RolContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await AuthService.login(email, password);
      setUsuario({ id: response.data.data.user_id, email: email });
      setRol(response.data.data.rol_id);

      const permission = await requestNotificationPermission();

      if (permission) {
        const fcmToken = await getFcmToken();

        if (fcmToken) {
          const saveTokenResponse = await api.registerFCMToken({
            user_id: response.data.data.user_id,
            token: fcmToken,
          });

          if (saveTokenResponse?.data?.status === 0) {
            localStorage.setItem("fcmToken", fcmToken);
          } else {
            console.warn("No se pudo guardar el token FCM en localStorage");
          }
          if (response.data.data.rol_id === 4) {
            const pacienteResp = await api.getPatientIdByCaregiver(
              response.data.data.user_id
            );

            if (pacienteResp.data.status === 0) {
              const paciente_id = pacienteResp.data.data.paciente.id;

              const topicName = `paciente_${paciente_id}_alertas`;

              await api.subscribeToTopic({
                token: fcmToken,
                paciente_id: paciente_id,
              });
            }
          }
        }
      }
      setUsuario({ id: response.data.data.user_id, email: email });
      setRol(response.data.data.rol_id);
      switch (response.data.data.rol_id) {
        case 1:
          navigate("/administrador");
          break;
        case 2:
          navigate("/medico");
          break;
        case 3:
          navigate("/paciente");
          break;
        case 4:
          navigate("/cuidador");
          break;
        case 5:
          navigate("/staff");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-primary/5 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-success/10 rounded-full blur-3xl"></div>
      </div>

      {/* Botón de Regreso a Landing */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-200/50 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Volver</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-200/50">
          {/* Columna izquierda - Formulario */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 relative">
            {/* Logo con animación */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 justify-center">
                <img src={Logo} alt="Logo CardioGo" className="w-16 h-16" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
                Bienvenido de nuevo
              </h1>
              <p className="text-slate-600">
                Ingresa tus credenciales para continuar
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleLogin}
              className="space-y-6 w-full max-w-sm"
            >
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 pl-12 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-800 placeholder:text-slate-400"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 pl-12 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-800 placeholder:text-slate-400"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 bg-danger-light border-l-4 border-danger rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
                  <p className="text-sm text-danger-dark font-medium">
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </motion.form>
          </div>

          {/* Columna derecha - Imagen con overlay */}
          <div className="hidden md:flex w-1/2 relative overflow-hidden">
            <img
              src={Health}
              alt="Ilustración de salud"
              className="w-full h-full object-cover"
            />
            {/* Overlay con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-primary-dark/90 flex flex-col items-center justify-center text-white p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                {/* Contenido opcional aquí */}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;