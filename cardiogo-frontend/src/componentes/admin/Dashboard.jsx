import React, { useState, useEffect } from "react";
import { 
  Users, 
  Stethoscope, 
  Pill, 
  AlertTriangle, 
  UserPlus, 
  X, 
  TrendingUp, 
  UserCog,
  Activity,
  Database,
  Target,
  BarChart3,
  List,
  Heart,
  Thermometer,
  Wind
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HighPersonal from "./HighPersonal";
import { api } from "../../api/apiMethods";

const Dashboard = () => {
  const [selectedPaciente, setSelectedPaciente] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [vistaActual, setVistaActual] = useState("graficas"); // "graficas" o "pacientes"
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [riesgosModelo, setRiesgosModelo] = useState({});
  const [cards, setCards] = useState([])

  const COLORS = ["#2D9CDB", "#27AE60", "#F59E0B", "#FF0000"];

  // // Cargar pacientes cuando se cambia a vista de pacientes
  // useEffect(() => {
  //   if (vistaActual === "pacientes") {
  //     cargarPacientes();
  //   }
  // }, [vistaActual]);

  useEffect(() => {
    setLoading(true);
  
    api.getCards()
      .then((response) => {
        const data = response.data.data;
        setCards(data)
      })
      .catch(() => {
        setCards(false);
      })
      .finally(() => {
        setLoading(false);
      });
    }, []);

  const cargarPacientes = async () => {
    setLoading(true);
    try {
      const data = await api.getSignosVitalesAdmin();
      if (data.data.status !== 0) return;

      const nuevosDatos = data.data.data;

      setPacientes(prev => {
        const mapa = new Map(prev.map(p => [p.paciente.id, p]));

        for (const nuevo of nuevosDatos) {
          const id = nuevo.paciente.id;
          const existente = mapa.get(id);

          if (!existente) {
            // Paciente nuevo → agregar
            mapa.set(id, nuevo);
          } else {
            // Comparar si los signos vitales cambiaron
            const s1 = existente.signos_vitales;
            const s2 = nuevo.signos_vitales;

            const cambiar =
              s1.ritmo_cardiaco !== s2.ritmo_cardiaco ||
              s1.oxigenacion !== s2.oxigenacion ||
              s1.temperatura !== s2.temperatura;

            if (cambiar) {
              mapa.set(id, { ...existente, signos_vitales: nuevo.signos_vitales });
            }
          }
        }

        return Array.from(mapa.values());
      });

      // Riesgo del modelo
      const nuevosRiesgos = {};
      for (const p of nuevosDatos) {
        if (!p?.signos_vitales) continue;

        const req = {
          RITMO_CARDIACO: Number(p.signos_vitales.ritmo_cardiaco),
          OXIGENACION: Number(p.signos_vitales.oxigenacion),
          TEMPERATURA: Number(p.signos_vitales.temperatura),
          EDAD: Number(p.paciente.edad),
        };

        try {
          const resp = await api.postPredecirRiesgo(req);
          if (resp.data?.data) {
            nuevosRiesgos[p.paciente.id] = resp.data?.data;
          }
        } catch {}
      }

      setRiesgosModelo(prev => ({ ...prev, ...nuevosRiesgos }));

    } catch (err) {
      console.error("Error cargar pacientes:", err);
    } finally {
      setLoading(false);
    }
  };

  const mapModeloAEstado = (resultadoModelo) => {
    const estado = resultadoModelo?.resultado || "";

    if (estado.includes("Alto")) {
      return { 
        estado: "Alto Riesgo",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        borderColor: "border-red-300" 
      };
    }

    if (estado.includes("Moderado")) {
      return { 
        estado: "Moderado",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-300" 
      };
    }

    if (estado.includes("Bajo")) {
      return { 
        estado: "Bajo Riesgo",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        borderColor: "border-green-300" 
      };
    }

    return { 
      estado: "Normal",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-300" 
    };
  };

  useEffect(() => {
    if (vistaActual === "pacientes") {
      cargarPacientes();

      const interval = setInterval(() => {
        cargarPacientes();
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [vistaActual]);

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Header mejorado con selector de vista */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard CardioGo</h1>
              <p className="text-slate-600 mt-1">Análisis predictivo de riesgo cardiovascular</p>
            </div>

            {/* Botón Agregar Usuario */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              <UserPlus className="w-5 h-5" />
              <span>Agregar Usuario</span>
            </motion.button>
          </div>

          {/* Selector de Vista */}
          <div className="flex gap-3 bg-white rounded-xl p-2 shadow-md border border-gray-light w-fit">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setVistaActual("graficas")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${
                vistaActual === "graficas"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Gráficas</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setVistaActual("pacientes")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${
                vistaActual === "pacientes"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <List className="w-4 h-4" />
              <span>Pacientes</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Tarjetas resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl shadow-lg p-6 border-2 border-primary/20 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-medium mb-1">Pacientes Totales</h3>
            <p className="text-4xl font-bold text-primary-dark">
              {cards[0]?.pacientes ?? 0}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-success/10 to-success/5 rounded-2xl shadow-lg p-6 border-2 border-success/20 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-success to-success-dark flex items-center justify-center shadow-md">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-medium mb-1">Recetas Medicadas</h3>
            <p className="text-4xl font-bold text-primary-dark">
              {cards[0]?.recetas ?? 0}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-vitals-temperatura-bg to-yellow-50 rounded-2xl shadow-lg p-6 border-2 border-vitals-temperatura-border/30 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-vitals-temperatura-border to-yellow-600 flex items-center justify-center shadow-md">
                <Pill className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-medium mb-1">Medicamentos</h3>
            <p className="text-4xl font-bold text-primary-dark">
              {cards[0]?.medicamentos ?? 0}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-danger-light to-danger-light/50 rounded-2xl shadow-lg p-6 border-2 border-danger/30 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-danger to-danger-dark flex items-center justify-center shadow-md">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-medium mb-1">Alertas Críticas</h3>
            <p className="text-4xl font-bold text-primary-dark">
              {cards[0]?.alertas_criticas ?? 0}
            </p>
          </motion.div>
        </div>

        {/* Gráficas de los Endpoints */}
        {vistaActual === "graficas" && (
          <div className="space-y-6">
          
          {/* Distribución de Estado de Riesgo */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-light hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <BarChart3 className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Distribución de Estado de Riesgo</h3>
                <p className="text-sm text-slate-600">Clasificación de pacientes según nivel de riesgo cardiovascular</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <img 
                src="http://127.0.0.1:5000/cardio-go/v1/dataset/grafica/distribucion_output" 
                alt="Distribución de Riesgo"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </motion.div>

          {/* Histogramas de Signos Vitales */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-light hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Activity className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Histogramas de Signos Vitales</h3>
                <p className="text-sm text-slate-600">Distribución de edad, ritmo cardíaco, oxigenación y temperatura</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <img 
                src="http://127.0.0.1:5000/cardio-go/v1/dataset/grafica/histogramas" 
                alt="Histogramas de Signos Vitales"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </motion.div>

          {/* Matriz de Correlación y Matriz de Confusión */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Matriz de Correlación */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center">
                  <Activity className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Matriz de Correlación</h3>
                  <p className="text-sm text-slate-600">Relaciones entre variables</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <img 
                  src="http://127.0.0.1:5000/cardio-go/v1/dataset/grafica/correlacion" 
                  alt="Matriz de Correlación"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </motion.div>

            {/* Matriz de Confusión */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                  <Target className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Matriz de Confusión</h3>
                  <p className="text-sm text-slate-600">Precisión del modelo predictivo</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <img 
                  src="http://127.0.0.1:5000/cardio-go/v1/dataset/grafica/matriz_confusion" 
                  alt="Matriz de Confusión"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </motion.div>
          </div>

          {/* Curva ROC */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <TrendingUp className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Curva ROC - Modelo Entrenado</h3>
                <p className="text-sm text-slate-600">Rendimiento del modelo de clasificación (AUC = 0.8948)</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <img 
                src="http://127.0.0.1:5000/cardio-go/v1/dataset/grafica/roc" 
                alt="Curva ROC"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </motion.div>

        </div>
        )}

        {/* Lista de Pacientes */}
        {vistaActual === "pacientes" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {pacientes.map((item, index) => {
                  const prediccionModelo = riesgosModelo[item.paciente.id];     // Datos que vienen del backend
                  const riesgo = mapModeloAEstado(prediccionModelo);            // Colores y estado visual

                  return (
                    <motion.div
                      key={item.paciente.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-light hover:shadow-xl transition-all"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">

                        {/* Info del Paciente */}
                        <div className="lg:col-span-3 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary-dark 
                                          flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                            {item.paciente.nombre_completo.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-lg font-bold text-slate-800 truncate">
                              {item.paciente.nombre_completo}
                            </h3>
                            <p className="text-sm text-slate-600">
                              Edad: {item.paciente.edad} años · ID: #{item.paciente.id}
                            </p>
                          </div>
                        </div>

                        {/* Signos Vitales */}
                        <div className="lg:col-span-7 grid grid-cols-3 gap-3">

                          {/* Ritmo Cardíaco */}
                          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Heart className="w-4 h-4 text-red-600 flex-shrink-0" />
                              <span className="text-xs font-semibold text-red-900">Ritmo Cardíaco</span>
                            </div>
                            <p className="text-3xl font-bold text-red-700">{item.signos_vitales.ritmo_cardiaco}</p>
                            <p className="text-xs text-red-600 mt-1">bpm</p>
                          </div>

                          {/* Oxigenación */}
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Wind className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <span className="text-xs font-semibold text-blue-900">Oxigenación</span>
                            </div>
                            <p className="text-3xl font-bold text-blue-700">{item.signos_vitales.oxigenacion}</p>
                            <p className="text-xs text-blue-600 mt-1">%</p>
                          </div>

                          {/* Temperatura */}
                          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Thermometer className="w-4 h-4 text-orange-600 flex-shrink-0" />
                              <span className="text-xs font-semibold text-orange-900">Temperatura</span>
                            </div>
                            <p className="text-3xl font-bold text-orange-700">{item.signos_vitales.temperatura}</p>
                            <p className="text-xs text-orange-600 mt-1">°C</p>
                          </div>

                        </div>

                        {/* Estado según modelo */}
                        <div className="lg:col-span-2 flex flex-col lg:flex-row items-center justify-between gap-4">
                          <div className={`px-6 py-4 rounded-xl ${riesgo.bgColor} border-2 ${riesgo.borderColor} 
                                          shadow-md text-center min-w-[140px]`}>
                            <p className="text-xs font-semibold text-slate-600 mb-1">Modelo Predictivo</p>

                            <p className={`text-xl font-bold ${riesgo.textColor}`}>
                              {prediccionModelo?.resultado ?? "Calculando..."}
                            </p>

                            {/* {prediccionModelo?.confianza && (
                              <p className="text-sm text-slate-700 mt-1">
                                Confianza: {prediccionModelo.confianza}
                              </p>
                            )} */}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
                {pacientes.length === 0 && !loading && (
                  <div className="text-center py-20">
                    <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg font-semibold">No hay pacientes registrados</p>
                    <p className="text-slate-400 text-sm">Agrega un nuevo paciente para comenzar</p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Modal del FormUser - Mejorado con Scroll */}
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
              <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-dark p-6 text-white z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <UserCog className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Registrar Personal</h2>
                      <p className="text-white/80 text-sm">Completa el formulario para agregar nuevo personal</p>
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
              <div>
                <HighPersonal onClose={() => setShowModal(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;