import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  AlertTriangle, 
  AlertCircle, 
  Activity, 
  Thermometer, 
  Heart, 
  Wind,
  MapPin,
  Clock,
  CheckCheck,
  Filter,
  Loader2,
  ExternalLink
} from "lucide-react";

function AlertModal({ onClose, notifications = [], loading = false, onMarkAllRead }) {
  const [filter, setFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [modalData, setModalData] = useState(null);

  // Filtrar notificaciones
  const filteredNotifications = notifications.filter(notif => {
    const matchesReadStatus = filter === "all" || 
      (filter === "unread" && !notif.leido) || 
      (filter === "read" && notif.leido);
    
    const matchesLevel = levelFilter === "all" || notif.alerta.nivel === levelFilter;
    
    return matchesReadStatus && matchesLevel;
  });

  // Obtener ícono según tipo de alerta
  const getAlertIcon = (tipo) => {
    if (tipo.includes("Ritmo") || tipo.includes("Cardiaco")) return Heart;
    if (tipo.includes("Temperatura")) return Thermometer;
    if (tipo.includes("Oxigenación")) return Wind;
    if (tipo.includes("Presión")) return Activity;
    return AlertCircle;
  };

  // Configuración de estilos por nivel
  const nivelConfig = {
    "Crítico": {
      color: "from-danger to-danger-dark",
      bg: "bg-danger-light",
      border: "border-danger",
      text: "text-danger-dark",
      badge: "bg-danger",
      icon: "text-danger"
    },
    "Moderado": {
      color: "from-yellow-400 to-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-400",
      text: "text-yellow-700",
      badge: "bg-yellow-500",
      icon: "text-yellow-600"
    },
    "Advertencia": {
      color: "from-success to-success-dark",
      bg: "bg-success-light",
      border: "border-success",
      text: "text-success-dark",
      badge: "bg-success",
      icon: "text-success"
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const unreadCount = notifications.filter(n => !n.leido).length;


  return (
    <>
      <div className="w-full h-full max-h-[80vh] overflow-y-auto overflow-x-hidden p-2 sm:p-4">
      <div className="max-w-6xl mx-auto pb-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-2 mb-3 text-white relative overflow-hidden shadow-lg"
        >
          <div className="relative flex flex-col sm:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-lg font-bold">Notificaciones</h2>
            </div>
            <p className="text-sm text-white/60 mt-1">
              {unreadCount > 0 ? `${unreadCount} sin leer` : "No hay notificaciones sin leer"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMarkAllRead}
                className="flex items-center gap-2 p-2 px-4 py-2 bg-success text-white rounded-xl font-semibold text-sm hover:bg-success-dark transition-all shadow-md"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Marcar todas como leídas</span>
                <span className="sm:hidden">Marcar leídas</span>
              </motion.button>
            )}
          </div>
        </motion.div>
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 bg-white space-y-3">
          {/* Estado de lectura */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="text-sm font-semibold text-slate-700">Estado:</span>
            <div className="flex gap-2">
              {["all", "unread", "read"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filter === f
                      ? "bg-primary text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f === "all" ? "Todas" : f === "unread" ? "Sin leer" : "Leídas"}
                </button>
              ))}
            </div>
          </div>

          {/* Nivel de alerta */}
          <div className="flex items-center gap-2 flex-wrap">
            <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="text-sm font-semibold text-slate-700">Nivel:</span>
            <div className="flex gap-2 flex-wrap">
              {["all", "Crítico", "Moderado", "Advertencia"].map((level) => (
                <button
                  key={level}
                  onClick={() => setLevelFilter(level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    levelFilter === level
                      ? "bg-primary text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {level === "all" ? "Todos" : level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-slate-600 font-medium">Cargando notificaciones...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-white-600 font-medium">No hay notificaciones</p>
              <p className="text-slate-500 text-sm">No se encontraron alertas con los filtros aplicados</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredNotifications.map((notif, index) => {
                  const styles = nivelConfig[notif.alerta.nivel] || nivelConfig["Advertencia"];
                  const Icon = getAlertIcon(notif.alerta.tipo);

                  return (
                    <motion.div
                      key={notif.alerta.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative rounded-xl border-2 ${styles.border} ${styles.bg} overflow-hidden group hover:shadow-md transition-all ${
                        !notif.leido ? "ring-2 ring-primary/30" : "opacity-80"
                      }`}
                    >
                      {/* Barra lateral de color */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${styles.color}`}></div>
                      
                      {/* Indicador de no leída */}
                      {!notif.leido && (
                        <div className="absolute top-3 right-3">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                          </span>
                        </div>
                      )}

                      <div className="p-4 pl-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* Header de la alerta */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-slate-800 text-sm">{notif.alerta.tipo}</h4>
                                  <span className={`${styles.badge} text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase`}>
                                    {notif.alerta.nivel}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Valores vitales */}
                            <div className="grid grid-cols-3 gap-2 mb-2 ml-10">
                              <div className="bg-white/70 rounded-lg p-2">
                                <div className="flex items-center gap-1 text-xs text-slate-600 mb-0.5">
                                  <Heart className="w-3 h-3" />
                                  <span>Ritmo</span>
                                </div>
                                <div className="font-bold text-sm text-slate-800">
                                  {notif.valor.ritmo_cardiaco} bpm
                                </div>
                              </div>
                              <div className="bg-white/70 rounded-lg p-2">
                                <div className="flex items-center gap-1 text-xs text-slate-600 mb-0.5">
                                  <Wind className="w-3 h-3" />
                                  <span>O₂</span>
                                </div>
                                <div className="font-bold text-sm text-slate-800">
                                  {notif.valor.oxigenacion}%
                                </div>
                              </div>
                              <div className="bg-white/70 rounded-lg p-2">
                                <div className="flex items-center gap-1 text-xs text-slate-600 mb-0.5">
                                  <Thermometer className="w-3 h-3" />
                                  <span>Temp</span>
                                </div>
                                <div className="font-bold text-sm text-slate-800">
                                  {notif.valor.temperatura}°C
                                </div>
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-10">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{formatDate(notif.alerta.fecha_hora)} • {formatTime(notif.alerta.fecha_hora)}</span>
                            </div>
                          </div>

                          {/* Botón de ubicación para alertas críticas */}
                          {notif.alerta.nivel === "Crítico" && notif.ubicacion && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setModalData(notif)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-danger rounded-lg text-danger font-semibold text-xs hover:bg-danger hover:text-white transition-all shadow-sm flex-shrink-0"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Ubicación</span>
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <p className="text-xs text-slate-500 text-center">
            Mostrando {filteredNotifications.length} de {notifications.length} notificaciones
          </p>
        </div>
      </div>
      </div>

      {/* Modal de Ubicación */}
      <AnimatePresence>
        {modalData && (
          <div className="fixed top-0 left-0 right-0 bottom-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setModalData(null)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-danger to-danger-dark p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Ubicación del Paciente</h2>
                      <p className="text-sm text-white/80">Alerta crítica</p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setModalData(null)}
                    className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 space-y-4">
                {/* Info de la alerta */}
                <div className="bg-danger-light border-l-4 border-danger rounded-xl p-4">
                  <p className="text-sm font-semibold text-danger-dark mb-1">{modalData.alerta.tipo}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                    <span>{modalData.valor.ritmo_cardiaco} bpm</span>
                    <span>{modalData.valor.temperatura}°C</span>
                    <span>{modalData.valor.oxigenacion}%</span>
                  </div>
                </div>

                {/* Coordenadas */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-600">Latitud:</span>
                    <span className="text-sm font-mono font-bold text-slate-800">{modalData.ubicacion.latitud}</span>
                  </div>
                  <div className="h-px bg-slate-200"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-600">Longitud:</span>
                    <span className="text-sm font-mono font-bold text-slate-800">{modalData.ubicacion.longitud}</span>
                  </div>
                </div>

                {/* Mapa preview (simulado) */}
                <div className="relative h-40 bg-slate-200 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-danger animate-bounce" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Botón de Google Maps */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${modalData.ubicacion.latitud},${modalData.ubicacion.longitud}`,
                      "_blank"
                    )
                  }
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Abrir en Google Maps</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.button>

                {/* Info adicional */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(modalData.alerta.fecha_hora)} • {formatTime(modalData.alerta.fecha_hora)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AlertModal;