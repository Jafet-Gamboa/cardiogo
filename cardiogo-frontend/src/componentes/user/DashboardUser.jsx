import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Thermometer,
  Droplet,
  Activity,
  X,
  TrendingUp,
  User,
  Wifi,
  Dot,
} from "lucide-react";
import { api } from "../../api/apiMethods";

const DashboardUser = () => {
  const [modalData, setModalData] = useState(null);
  const [vitalSigns, setVitalSigns] = useState(null);
  const [normalSigns, setNormalSigns] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const cuidadorId = localStorage.getItem("userId");
  const cuidadorId2 = localStorage.getItem("cuidadorId");

  const fetchVitalSigns = () => {
    if (!cuidadorId) return;
    api
      .getVitalSignsByCuidadorId(cuidadorId)
      .then((response) => {
        const data = response?.data?.data || {};
        setVitalSigns(data);
      })
    .catch((error) => {
      console.error("Error al obtener los signos vitales:", error);
    });
  };
  
    useEffect(() => {
      fetchVitalSigns(); // primera carga
  
      const interval = setInterval(() => {
        fetchVitalSigns(); // actualización cada 15s
      }, 15000);
  
      return () => clearInterval(interval); // limpieza
    }, [cuidadorId]);

  // useEffect(() => {
  //   if (!cuidadorId) return;
  //   setIsLoading(true);
  //   api
  //     .getVitalSignsByCuidadorId(cuidadorId)
  //     .then((response) => {
  //       // Evita errores si la respuesta no tiene el formato esperado
  //       const data = response?.data?.data || {};
  //       setVitalSigns(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error al obtener los signos vitales:", error);
  //     })
  //     .finally(() => setIsLoading(false));
  // }, [cuidadorId]);

  useEffect(() => {
    setIsLoading(true);
    api
      .getNormalSignsCuidador(cuidadorId2)
      .then((response) => {
        const data = response?.data?.data || [];
        setNormalSigns(data);
      })
      .catch((error) => {
        console.error("Error al obtener los rangos normales:", error);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">
            Cargando datos del paciente...
          </p>
        </div>
      </div>
    );
  }

  if (!vitalSigns || !normalSigns) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
        <div className="bg-danger-light border-l-4 border-danger rounded-xl p-6 max-w-md">
          <h3 className="text-danger-dark font-bold text-lg mb-2">
            Error al cargar datos
          </h3>
          <p className="text-slate-700">
            No se encontraron datos de signos vitales o valores normales.
          </p>
        </div>
      </div>
    );
  }

  const parseValue = (v) => {
    if (v === null || v === undefined) return "—";
    const num = parseFloat(v);
    if (isNaN(num)) return v; // si es texto
    return Number.isInteger(num) ? num : parseFloat(num.toFixed(1));
  };

  const cards = [
    {
      titulo: "Ritmo Cardíaco",
      icon: Heart,
      color: "ritmo",
      data: {
        valor: parseValue(vitalSigns.ritmo_cardiaco?.valor),
        unidad: normalSigns?.ritmo?.unidad || "bpm",
        estado: vitalSigns.ritmo_cardiaco?.estado || "—",
        min: parseValue(normalSigns?.ritmo?.min),
        max: parseValue(normalSigns?.ritmo?.max),
      },
    },
    {
      titulo: "Oxigenación",
      icon: Activity,
      color: "oxigenacion",
      data: {
        valor: parseValue(vitalSigns.oxigenacion?.valor),
        unidad: normalSigns?.oxigenacion?.unidad || "%",
        estado: vitalSigns.oxigenacion?.estado || "—",
        min: parseValue(normalSigns?.oxigenacion?.min),
        max: parseValue(normalSigns?.oxigenacion?.max),
      },
    },
    {
      titulo: "Temperatura",
      icon: Thermometer,
      color: "temperatura",
      data: {
        valor: parseValue(vitalSigns.temperatura?.valor),
        unidad: normalSigns?.temperatura?.unidad || "°C",
        estado: vitalSigns.temperatura?.estado || "—",
        min: parseValue(normalSigns?.temperatura?.min),
        max: parseValue(normalSigns?.temperatura?.max),
      },
    },
  ];

  const colorConfig = {
    ritmo: {
      bg: "bg-vitals-ritmo-bg",
      border: "border-vitals-ritmo-border",
      text: "text-vitals-ritmo-border",
      gradient: "from-vitals-ritmo-border to-pink-600",
    },
    oxigenacion: {
      bg: "bg-vitals-oxigenacion-bg",
      border: "border-vitals-oxigenacion-border",
      text: "text-vitals-oxigenacion-border",
      gradient: "from-vitals-oxigenacion-border to-blue-600",
    },
    temperatura: {
      bg: "bg-vitals-temperatura-bg",
      border: "border-vitals-temperatura-border",
      text: "text-vitals-temperatura-border",
      gradient: "from-vitals-temperatura-border to-yellow-600",
    },
  };

  const getEstadoBadge = (estado) => {
    if (estado === "Normal") {
      return (
        <span className="inline-flex items-center gap-1.5 bg-success-light text-success-dark px-3 py-1 rounded-full text-sm font-semibold">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          Normal
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 bg-danger-light text-danger-dark px-3 py-1 rounded-full text-sm font-semibold">
        <div className="w-2 h-2 bg-danger rounded-full animate-pulse"></div>
        Alerta
      </span>
    );
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Header del Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-dark">
                {vitalSigns?.paciente?.nombre_completo || "—"}
              </h2>
              <p className="text-gray-medium flex items-baseline gap-2">
                <Wifi className="w-4 h-4" /> Dispositivo:{" "}
                <span className="font-mono font-semibold">
                  {vitalSigns?.dispositivo?.numero_serie || "—"}
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tarjetas de Signos Vitales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const config = colorConfig[card.color];

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setModalData(card)}
                className={`cursor-pointer ${config.bg} ${config.border} border-2 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all group`}
              >
                {/* Header del card */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-8 h-8 rounded-2xl bg-white shadow-md flex items-center justify-center ${config.text} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {getEstadoBadge(card.data.estado)}
                </div>

                {/* Título */}
                <h4 className="text-lg font-bold text-slate-800 mb-3">
                  {card.titulo}
                </h4>

                {/* Valor principal */}
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-slate-900">
                    {card.data.valor}
                  </span>
                  <span className="text-xl font-semibold text-slate-600">
                    {card.data.unidad}
                  </span>
                </div>

                {/* Rango normal */}
                <div className="mt-4 pt-4 border-t border-slate-300">
                  <p className="text-xs text-slate-600 mb-1 font-medium">
                    Rango normal
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {card.data.min} - {card.data.max} {card.data.unidad}
                  </p>
                </div>

                {/* Indicador hover */}
                <div className="mt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Ver detalles</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal de Detalles */}
      <AnimatePresence>
        {modalData && (
          <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setModalData(null)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto z-10"
            >
              {/* Header del Modal */}
              <div
                className={`bg-gradient-to-r ${
                  colorConfig[modalData.color].gradient
                } text-white p-6 relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {React.createElement(modalData.icon, {
                      className: "w-8 h-8",
                    })}
                    <div>
                      <h3 className="text-xl font-bold">{modalData.titulo}</h3>
                      <p className="text-white/80 text-sm mt-1">
                        Detalles del signo vital
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setModalData(null)}
                    className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Valor destacado */}
                <div className="relative mt-6 text-center">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-extrabold">
                      {modalData.data.valor}
                    </span>
                    <span className="text-xl font-semibold opacity-90">
                      {modalData.data.unidad}
                    </span>
                  </div>
                  <div className="mt-3">
                    {getEstadoBadge(modalData.data.estado)}
                  </div>
                </div>
              </div>

              {/* Contenido del Modal */}
              <div className="p-4 space-y-2">
                {/* Barra de progreso visual */}
                <div>
                  <h4 className="font-bold text-slate-800 mb-3 text-center text-sm">
                    Nivel Actual
                  </h4>

                  <div
                    className="relative w-full h-6 rounded-full shadow-inner overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(to right, #FF0000 0%, #FFA500 25%, #27AE60 50%, #FFA500 75%, #FF0000 100%)",
                    }}
                  >
                    {(() => {
                      const val = parseFloat(modalData.data.valor);
                      const min = parseFloat(modalData.data.min);
                      const max = parseFloat(modalData.data.max);

                      if (isNaN(val) || isNaN(min) || isNaN(max) || max === min)
                        return null;

                      const porcentaje = ((val - min) / (max - min)) * 100;
                      const pos = Math.min(Math.max(porcentaje, 0), 100);

                      return (
                        <motion.div
                          initial={{ left: "50%" }}
                          animate={{ left: `${pos}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="absolute -translate-x-1/2"
                          style={{ top: "-0px" }}
                        >
                          <Dot
                            className="w-6 h-6 text-slate-800 drop-shadow-lg"
                            strokeWidth={3}
                          />
                        </motion.div>
                      );
                    })()}
                  </div>

                  <div className="flex justify-between text-xs text-slate-600 mt-2 font-semibold">
                    <span>{modalData.data.min}</span>
                    <span className="text-slate-800">
                      Óptimo:{" "}
                      {(
                        (parseFloat(modalData.data.min) +
                          parseFloat(modalData.data.max)) /
                        2
                      ).toFixed(1)}
                    </span>
                    <span>{modalData.data.max}</span>
                  </div>
                </div>

                {/* Grid de valores */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-3 text-center border border-primary/20">
                    <p className="text-xs font-semibold text-slate-600 mb-1">
                      Actual
                    </p>
                    <span className="text-2xl font-bold text-slate-900 flex items-baseline justify-center gap-2">
                      {modalData.data.valor}
                      <p className="text-xs font-medium text-slate-600 mt-0.5">
                        {modalData.data.unidad}
                      </p>
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl p-3 text-center border border-slate-200">
                    <p className="text-xs font-semibold text-slate-600 mb-1">
                      Mínimo
                    </p>
                    <span className="text-2xl font-bold text-slate-900 flex items-baseline justify-center gap-2">
                      {modalData.data.min}
                      <p className="text-xs font-medium text-slate-600 mt-0.5">
                        {modalData.data.unidad}
                      </p>
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl p-3 text-center border border-slate-200">
                    <p className="text-xs font-semibold text-slate-600 mb-1">
                      Máximo
                    </p>
                    <span className="text-2xl font-bold text-slate-900 flex items-baseline justify-center gap-2">
                      {modalData.data.max}
                      <p className="text-xs font-medium text-slate-600 mt-0.5">
                        {modalData.data.unidad}
                      </p>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardUser;
