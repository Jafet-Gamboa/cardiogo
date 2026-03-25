import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, LogOut, Menu, X, Heart, ChevronDown } from "lucide-react";
import AlertModal from "./Alerts";
import ProfileUser from "./Profile";
import { logout } from "../../services/Autentication";
import { api } from "../../api/apiMethods";

function Header({ role: propRole }) {
  const [role, setRole] = useState(propRole || "cuidador");
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [openAlerts, setOpenAlerts] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedAlerts, setLoadedAlerts] = useState(false);

  const getEndpointByRolId = () => {
    const rolId = localStorage.getItem("rolId");
    return rolId === "3" ? "paciente" : rolId === "4" ? "cuidador" : null;
  };

  // Función para obtener las alertas
  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const endpoint = getEndpointByRolId();
      if (!endpoint) return;

      // 1. NO LEIDAS (COUNT)
      const countRes = await api.getAlertsCount(endpoint, userId);

      if (
        countRes.data.status === 0 &&
        Array.isArray(countRes.data.data) &&
        countRes.data.data.length > 0 &&
        countRes.data.data[0].total !== undefined
      ) {
        setUnreadCount(countRes.data.data[0].total);
      } else {
        setUnreadCount(0);
      }

      // 2. LISTA NO LEIDAS
      let unreadList = [];
      const unreadRes = await api.getAlertsUnread(endpoint, userId);

      if (unreadRes.data.status === 0 && Array.isArray(unreadRes.data.data)) {
        unreadList = unreadRes.data.data.map(a => ({
          ...a,
          leido: false
        }));
      }

      // 3. LISTA LEIDAS
      let readList = [];
      const readRes = await api.getAlertsRead(endpoint, userId);

      if (readRes.data.status === 0 && Array.isArray(readRes.data.data)) {
        readList = readRes.data.data.map(a => ({
          ...a,
          leido: true
        }));
      }

      // 4. COMBINAR SIN ERRORES
      setNotifications([...unreadList, ...readList]);

    } catch (err) {
      console.error("Error al obtener alertas:", err);
      setUnreadCount(0);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const endpoint = getEndpointByRolId();
      if (!endpoint) return;

      const unreadAlerts = notifications.filter(n => !n.leido);

      for (const alert of unreadAlerts) {
        await api.markAlertAsRead(endpoint, alert.alerta.id);
      }

      await fetchAlerts();

    } catch (err) {
      console.error("Error al marcar como leídas:", err);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  useEffect(() => {
    const rolId = localStorage.getItem("rolId");
    if (!loadedAlerts && (rolId === "3" || rolId === "4")) {
      fetchAlerts();
      setLoadedAlerts(true);
    }
  }, [loadedAlerts]);


  const menuOptions = {
    medico: [
      { name: "Pacientes", link: "/medico" },
      { name: "Panel", link: "/medico/dashboard" },
      { name: "Listado de Recetas", link: "/medico/listRecetas" },
    ],
    cuidador: [],
    administrativo: [
      { name: "Pacientes", link: "/staff/gestion-pacientes" },
      { name: "Cuidadores", link: "/staff/gestion-cuidadores" },
      { name: "Medicamentos", link: "/staff/gestion-medicamentos" },
    ],
    administrador: [
      { name: "Panel", link: "/administrador" },
      { name: "Gestión de Usuarios", link: "/administrador/gestion-usuarios" },
    ],
  };

  const currentMenu = menuOptions[role] || [];

  return (
    <>
    <header className="w-full bg-white shadow-md sticky top-0 z-40 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">CardioGo</div>
              <div className="text-xs text-slate-500 font-medium">Sistema de monitoreo cardiovascular</div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          {currentMenu.length > 0 && (
            <nav className="hidden md:flex items-center gap-1">
              {currentMenu.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.link}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-primary hover:bg-primary/5 transition-all relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300"></span>
                </motion.a>
              ))}
            </nav>
          )}

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Botón de alertas */}
            {["3", "4"].includes(localStorage.getItem("rolId")) && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpenAlerts(true)}
              className="relative p-3 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-primary/20"
              disabled={loading}
            >
              <Bell className={`w-6 h-6 text-slate-600 group-hover:text-primary transition-colors ${loading ? 'animate-pulse' : ''}`} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-danger to-danger-dark text-white text-xs font-bold min-w-[22px] h-[22px] flex items-center justify-center rounded-full shadow-lg ring-2 ring-white"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              )}
            </motion.button>
            )}

            {/* Perfil Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setOpenProfileMenu(!openProfileMenu)}
                className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-xl hover:bg-slate-50 transition-all border border-slate-200 hover:border-primary/30 hover:shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-bold text-slate-800">Usuario</div>
                  <div className="text-xs text-slate-500 capitalize font-medium">{role}</div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openProfileMenu ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {openProfileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenProfileMenu(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-20"
                    >
                      <div className="p-4 bg-gradient-to-r from-primary/10 to-primary-dark/10 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Sesión activa</p>
                        <p className="text-base font-bold text-slate-800 capitalize mt-1">{role}</p>
                      </div>
                      
                      <ul className="py-2">
                        <li>
                          <button
                            onClick={() => {
                              setOpenProfile(true);
                              setOpenProfileMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-primary/5 hover:text-primary transition-all group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                              <User className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold">Mi Perfil</span>
                          </button>
                        </li>
                        <li className="border-t border-slate-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-danger hover:bg-danger/5 transition-all group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-danger/10 group-hover:bg-danger/20 flex items-center justify-center transition-colors">
                              <LogOut className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold">Cerrar sesión</span>
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-slate-50 transition-all border border-slate-200"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-600" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-slate-200 overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {currentMenu.map((item) => (
                  <a
                    key={item.name}
                    href={item.link}
                    className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-primary/5 hover:text-primary transition-all"
                  >
                    {item.name}
                  </a>
                ))}

                <div className="border-t border-slate-200 pt-3 mt-3 space-y-2">
                  {["3", "4"].includes(localStorage.getItem("rolId")) && (
                  <button
                    onClick={() => {
                      setOpenAlerts(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-primary/5 hover:text-primary transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <Bell className="w-5 h-5" />
                      Notificaciones
                    </span>
                    {unreadCount > 0 && (
                      <span className="bg-danger text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>
                  )}

                  <button
                    onClick={() => {
                      setOpenProfile(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-primary/5 hover:text-primary transition-all"
                  >
                    <User className="w-5 h-5" />
                    Mi Perfil
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-danger hover:bg-danger/5 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
    {/* ---------- MODAL DE ALERTAS ---------- */}
      <AnimatePresence>
        {openAlerts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setOpenAlerts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-2">
                <AlertModal 
                  onClose={() => {
                    setOpenAlerts(false);
                    fetchAlerts();
                  }}
                  notifications={notifications}
                  loading={loading}
                  onMarkAllRead={markAllAsRead}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- MODAL PERFIL ---------- */}
      <AnimatePresence>
        {openProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setOpenProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-2">
                <ProfileUser onClose={() => setOpenProfile(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}

export default Header;