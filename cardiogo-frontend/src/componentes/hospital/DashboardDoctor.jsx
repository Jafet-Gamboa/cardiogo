import React, { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Search, Users, Activity, AlertTriangle, User, TrendingUp, X, Bell, Heart, Droplet, Thermometer, Stethoscope  } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../api/apiMethods";

const DashboardDoctor = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [vistaActual, setVistaActual] = useState("general");
  const [pacientesRiesgo, setPacientesRiesgo] = useState(0);
  const [alertasHoy, setAlertasHoy] = useState(0);
  const [dispositivosActivos, setDispositivosActivos] = useState(0);

  // GENERAL
  const [pacientesCriticosData, setPacientesCriticosData] = useState([]);
  const [actividadSistema, setActividadSistema] = useState([]);
  const [distribucionEdadData, setDistribucionEdadData] = useState([]);
  const [tiposAlertasData, setTiposAlertasFrecuentesData] = useState([]);

  // INDIVIDUAL
  const [evolucionRitmoData, setEvolucionRitmoData] = useState([]);
  const [evolucionOxigenacionData, setEvolucionOxigenacionData] = useState([]);
  const [evolucionTemperaturaData, setEvolucionTemperaturaData] = useState([]);
  const [tendenciasAlertasData, setTendenciasAlertasData] = useState([]);
  const [variacionRitmo24hData, setVariacionRitmo24hData] = useState([]);

  const [pacientes, setPacientes] = useState([]);

  const normalizeText = (text) => {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const pacientesFiltrados = useMemo(() => {
    if (!searchTerm) return [];

    const normalizedSearch = normalizeText(searchTerm);

    return pacientes.filter((p) => {
      const nombre = normalizeText(
        p.nombre ||
        p.nombreCompleto ||
        p.nombre_completo ||
        p.nombres ||
        ""
      );

      const id = normalizeText(p.id || p.idPaciente || "");

      return (
        nombre.includes(normalizedSearch) ||
        id.includes(normalizedSearch)
      );
    });
  }, [searchTerm, pacientes]);

  const handleSelectPaciente = (paciente) => {
    setSelectedPaciente(paciente);
    setSearchTerm("");
    setVistaActual("individual");
  };

  const handleClearPaciente = () => {
    setSelectedPaciente(null);
    setVistaActual("general");
    setSearchTerm("");
  };

  const medicoId = localStorage.getItem("medicoId");

  // --- CARGAR DATOS GENERALES ---
  useEffect(() => {
    if (!medicoId) return;

    api.getPacientesDelMedico(medicoId).then((res) => {
      setPacientes(res.data?.data ?? []);
    });

    api.getPacientesEnRiesgo(medicoId).then(setPacientesRiesgo);
    api.getAlertasHoy(medicoId).then(setAlertasHoy);
    api.getDispositivosActivos(medicoId).then(setDispositivosActivos);

    api.getPacientesCriticos(medicoId).then(setPacientesCriticosData);
    api.getActividadSistema(medicoId).then(setActividadSistema);
    api.getDistribucionEdad(medicoId).then(setDistribucionEdadData);
    api.getTiposAlertasFrecuentes(medicoId).then(setTiposAlertasFrecuentesData);

  }, [medicoId]);

  // --- CARGAR DATOS INDIVIDUALES ---
  useEffect(() => {
    if (!selectedPaciente) return;
    const id = selectedPaciente.id;
    api.getEvolucionRitmo(medicoId, id).then(setEvolucionRitmoData);
    api.getEvolucionOxigenacion(medicoId, id).then(setEvolucionOxigenacionData);
    api.getEvolucionTemperatura(medicoId, id).then(setEvolucionTemperaturaData);
    api.getAlertasPorDia(medicoId, id).then(setTendenciasAlertasData);
    api.getRitmoPorHora(medicoId, id).then(setVariacionRitmo24hData);

  }, [selectedPaciente]);
  const pacientesCriticos = useMemo(() => {
    if (!pacientesCriticosData?.data) return [];
    return pacientesCriticosData.data.data.map(item => ({
      paciente: item.paciente.nombre_completo,
      score: item.paciente.score
    }));
  }, [pacientesCriticosData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg">
          <p className="font-semibold text-gray-800 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const tiposAlertasFormateado = useMemo(() => {
    const raw = tiposAlertasData?.data?.data ?? [];

    return raw.map((item) => ({
      tipo: item.tipo?.alerta ?? "",
      cantidad: item.cantidad,
      color: "#FF8A00" // si quieres color fijo o dinámico
    }));
  }, [tiposAlertasData]);

  // const datosFormateados = rawData.map(item => ({
  //   ...item,
  //   fecha: new Date(item.fecha).toLocaleDateString("es-MX", {
  //     day: "2-digit",
  //     month: "short"
  //   })
  // }));

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
    });
  };

  const actividadSistemaFormateada = useMemo(() => {
    const raw = actividadSistema?.data?.data ?? [];
    return raw.map(item => ({
      ...item,
      dia: formatFecha(item.dia),
    }));
  }, [actividadSistema]);

  const evolucionOxigenacionFormateada = useMemo(() => {
    const raw = evolucionOxigenacionData?.data?.data ?? [];
    return raw.map(item => ({
      ...item,
      fecha: formatFecha(item.fecha),
    }));
  }, [evolucionOxigenacionData]);

  const evolucionRitmoFormateada = useMemo(() => {
    const raw = evolucionRitmoData?.data?.data ?? [];
    return raw.map(item => ({
      ...item,
      fecha: formatFecha(item.fecha),
    }));
  }, [evolucionRitmoData]);

  const evolucionTemperaturaFormateada = useMemo(() => {
    const raw = evolucionTemperaturaData?.data?.data ?? [];
    return raw.map(item => ({
      ...item,
      fecha: formatFecha(item.fecha),
    }));
  }, [evolucionTemperaturaData]);

  const tendenciasAlertasFormateada = useMemo(() => {
    const raw = tendenciasAlertasData?.data?.data ?? [];
    return raw.map(item => ({
      ...item,
      fecha: formatFecha(item.fecha),
    }));
  }, [tendenciasAlertasData]);

  const variacion24hFormateada = useMemo(() => {
    const raw = variacionRitmo24hData?.data?.data ?? [];
    return raw.map(item => ({
      ...item,
      hora: item.hora
        ? new Date(item.hora).toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
    }));
  }, [variacionRitmo24hData]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              Panel de Control Médico
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              Monitoreo integral de pacientes y métricas de salud
            </p>
          </div>
        </div>
      </motion.div>

      {/* BUSCADOR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-slate-200 mb-6 md:mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          {/* Buscador */}
          <div className="flex-1 w-full">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por paciente..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
              />
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              
              {/* Resultados de búsqueda */}
              <AnimatePresence>
                {searchTerm && pacientesFiltrados.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-20 w-full mt-2 bg-white rounded-xl border-2 border-slate-200 shadow-xl max-h-60 overflow-y-auto"
                  >
                    {pacientesFiltrados.map((paciente, index) => (
                      <motion.button
                        key={paciente.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelectPaciente(paciente)}
                        className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors border-b border-slate-100 last:border-b-0 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 group-hover:text-primary transition-colors">
                              {paciente.nombre}
                            </div>
                            <div className="text-sm text-slate-600">
                              {paciente.edad} años • {paciente.genero === "M" ? "Masculino" : "Femenino"}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* No se encontraron resultados */}
              <AnimatePresence>
                {searchTerm && pacientesFiltrados.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-20 w-full mt-2 bg-white rounded-xl border-2 border-slate-200 shadow-xl p-4 text-center"
                  >
                    <User className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-600 font-medium">No se encontraron pacientes</p>
                    <p className="text-sm text-slate-500 mt-1">Intenta con otro nombre</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Paciente seleccionado */}
          <AnimatePresence>
            {selectedPaciente && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 px-4 py-3 rounded-xl shadow-md"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
                <span className="font-semibold text-slate-800">{selectedPaciente.nombre}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClearPaciente}
                  className="ml-2 p-1.5 hover:bg-primary/20 rounded-full transition-colors"
                >
                  <X size={16} className="text-slate-700" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botones de vista */}
          <div className="flex gap-2 w-full lg:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setVistaActual("general")}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                vistaActual === "general"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg"
                  : "bg-slate-200 text-slate-800 hover:bg-slate-300"
              }`}
            >
              <TrendingUp size={18} /> 
              <span>General</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: selectedPaciente ? 1.02 : 1 }}
              whileTap={{ scale: selectedPaciente ? 0.98 : 1 }}
              onClick={() => {
                if (selectedPaciente) {
                  setVistaActual("individual");
                }
              }}
              disabled={!selectedPaciente}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                vistaActual === "individual" && selectedPaciente
                  ? "bg-gradient-to-r from-success to-success-dark text-white shadow-lg"
                  : "bg-slate-200 text-slate-800 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              <User size={18} /> 
              <span>Individual</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-gradient-to-br from-orange to-orange-dark rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="text-4xl opacity-80" size={40} />
            <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
              <span className="text-xs font-bold">24h</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold opacity-90 mb-1">Pacientes en Riesgo</h3>
          <p className="text-4xl font-bold">{pacientesRiesgo?.data?.data?.pacientes_en_riesgo ?? 0}</p>
          <p className="text-xs opacity-80 mt-1">Con alertas en últimas 24h</p>
        </div>

        <div className="bg-gradient-to-br from-danger to-danger-dark rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Bell className="text-4xl opacity-80" size={40} />
            <div className="bg-white bg-opacity-20 rounded-full px-2 py-1 animate-pulse">
              <span className="text-xs font-bold">HOY</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold opacity-90 mb-1">Alertas de Hoy</h3>
          <p className="text-4xl font-bold">{alertasHoy?.data?.data?.alertas_hoy ?? 0}</p>
          <p className="text-xs opacity-80 mt-1">Requieren atención</p>
        </div>

        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Activity className="text-4xl opacity-80" size={40} />
            <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
              <span className="text-xs font-bold">ACTIVO</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold opacity-90 mb-1">Monitoreo Continuo</h3>
          <p className="text-4xl font-bold">{dispositivosActivos?.data?.data?.dispositivos_activos ?? 0}</p>
          <p className="text-xs opacity-80 mt-1">Dispositivos conectados</p>
        </div>
      </div>

      {/* GRAFICAS */}
      {vistaActual === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-danger-light p-3 rounded-xl">
                <AlertTriangle className="text-danger" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Pacientes en Estado Crítico
                </h3>
                <p className="text-sm text-gray-600">Score de riesgo - Hoy</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pacientesCriticos} layout="vertical">
                <defs>
                  <linearGradient id="colorCritico" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ffe6ecff" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#750000" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <XAxis type="number" stroke="#828282" domain={[0, 10]} />
                <YAxis 
                  type="category" 
                  dataKey="paciente" 
                  stroke="#828282"
                  width={120}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" fill="url(#colorCritico)" radius={[0, 10, 10, 0]} name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary-light p-3 rounded-xl">
                <Activity className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Actividad del Sistema
                </h3>
                <p className="text-sm text-gray-600">Lecturas por día</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={actividadSistemaFormateada ?? []}>
                <defs>
                  <linearGradient id="colorLecturas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D9CDB" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2D9CDB" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="dia" stroke="#828282" />
                <YAxis stroke="#828282" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="lecturas"
                  stroke="#2D9CDB"
                  strokeWidth={3}
                  fill="url(#colorLecturas)"
                  name="Lecturas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-success-light p-3 rounded-xl">
                <Users className="text-success-dark" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Distribución por Edad
                </h3>
                <p className="text-sm text-gray-600">Rangos etarios</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={distribucionEdadData?.data?.data ?? []}>
                <defs>
                  <linearGradient id="colorEdad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#27AE60" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#00753B" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="rango" stroke="#828282" />
                <YAxis stroke="#828282" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cantidad" fill="url(#colorEdad)" radius={[10, 10, 0, 0]} name="Pacientes" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-light p-3 rounded-xl">
                <AlertTriangle className="text-orange-dark" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Tipos de Alertas Más Frecuentes
                </h3>
                <p className="text-sm text-gray-600">Últimos 30 días</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={tiposAlertasFormateado}>
                <XAxis 
                  dataKey="tipo" 
                  stroke="#828282"
                  angle={-15}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis stroke="#828282" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cantidad" radius={[10, 10, 0, 0]} name="Alertas">
                  {tiposAlertasFormateado.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>  
        </div>
      )}

      {vistaActual === "individual" && selectedPaciente && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pink-100 p-3 rounded-xl">
                <Heart className="text-pink-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Evolución de Ritmo Cardíaco
                </h3>
                <p className="text-sm text-gray-600">Últimos 7 días - {selectedPaciente.nombre}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={evolucionRitmoFormateada ?? []}>
                <defs>
                  <linearGradient id="colorRitmo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E91E63" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#E91E63" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="fecha" stroke="#828282" />
                <YAxis stroke="#828282" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="#E91E63"
                  strokeWidth={3}
                  fill="url(#colorRitmo)"
                  name="Ritmo (lpm)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Droplet className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Evolución de Oxigenación
                </h3>
                <p className="text-sm text-gray-600">Últimos 7 días - {selectedPaciente.nombre}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={evolucionOxigenacionFormateada ?? []}>
                <defs>
                  <linearGradient id="colorOxigenacion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D9CDB" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2D9CDB" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="fecha" stroke="#828282" />
                <YAxis stroke="#828282" domain={[95, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="#2D9CDB"
                  strokeWidth={3}
                  fill="url(#colorOxigenacion)"
                  name="Oxigenación (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Thermometer className="text-yellow-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Evolución de Temperatura
                </h3>
                <p className="text-sm text-gray-600">Últimos 7 días - {selectedPaciente.nombre}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={evolucionTemperaturaFormateada ?? []}>
                <defs>
                  <linearGradient id="colorTemperatura" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F1C40F" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F1C40F" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="fecha" stroke="#828282" />
                <YAxis stroke="#828282" domain={[36, 37.5]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="#F1C40F"
                  strokeWidth={3}
                  fill="url(#colorTemperatura)"
                  name="Temperatura (°C)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-3 rounded-xl">
                <AlertTriangle className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Tendencias de Alertas
                </h3>
                <p className="text-sm text-gray-600">Últimos 7 días</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={tendenciasAlertasFormateada ?? []}>
                <XAxis dataKey="fecha" stroke="#828282" />
                <YAxis stroke="#828282" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="cantidad"
                  stroke="#FF6B35"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#FF6B35" }}
                  name="Alertas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-50 p-3 rounded-xl">
                <Activity className="text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Variación de Ritmo Cardíaco 24 Horas
                </h3>
                <p className="text-sm text-gray-600">Patrón circadiano - Hoy</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={variacion24hFormateada ?? []}>
                <XAxis dataKey="hora" stroke="#828282" />
                <YAxis stroke="#828282" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="ritmo"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#6366F1" }}
                  name="Ritmo (lpm)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDoctor;