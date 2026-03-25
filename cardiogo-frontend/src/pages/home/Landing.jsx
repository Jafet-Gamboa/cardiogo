import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Activity, Bell, Users, Shield, TrendingUp, Clock, ArrowUp, Thermometer} from "lucide-react";
import logoImage from "../../assets/logoHorizontal.png";

export default function LandingPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

return (
  <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-slate-800 antialiased">
    {/* NAV */}
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="rounded-xl"
            >
              <img src={logoImage} alt="CardioGo Logo" className="w-28 h-auto" />
            </motion.div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#que-es" className="hover:text-primary transition-colors hover:scale-105 transform duration-200">¿Qué es?</a>
            <a href="#beneficios" className="hover:text-primary transition-colors hover:scale-105 transform duration-200">Beneficios</a>
            <a href="#caracteristicas" className="hover:text-primary transition-colors hover:scale-105 transform duration-200">Características</a>
            <a href="#como-funciona" className="hover:text-primary transition-colors hover:scale-105 transform duration-200">Cómo funciona</a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/login" 
              className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              Iniciar sesión
            </motion.a>
          </nav>

          <div className="md:hidden">
            <button className="text-slate-600 font-medium">Menú</button>
          </div>
        </div>
      </div>
    </header>

    {/* HERO */}
    <main>
      <section className="pt-12 pb-20 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-success/10 to-success/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-primary/20"
            >
              <Activity className="w-4 h-4" />
              <span>Tecnología de monitoreo en tiempo real</span>
            </motion.div>

            <h1 className="text-5xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-6">
              Monitoreo cardiovascular{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-primary-dark bg-clip-text text-transparent">
                remoto
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-xl mb-12">
              Conecta pacientes, cuidadores y hospitales para detectar emergencias a tiempo y brindar una respuesta inmediata.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <StatItem number="24/7" label="Monitoreo continuo" />
              <StatItem number="3min" label="Tiempo de alerta" />
              <StatItem number="100%" label="Confiable" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Floating card */}
            <div className="relative z-10">
              <div className="rounded-3xl shadow-2xl overflow-hidden border-2 border-slate-200/50 bg-white backdrop-blur-sm">
                <div className="bg-gradient-to-br from-white via-slate-50/50 to-primary/5 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-xl font-bold text-xl">
                        MF
                      </div>
                      <div>
                        <div className="text-xl font-bold text-slate-800">María Fernández</div>
                        <div className="text-sm text-slate-500 font-medium">Paciente ID: 0421</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-success/10 to-success/5 text-success-dark px-4 py-2 rounded-full text-xs font-bold border border-success/20">
                      <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse shadow-lg shadow-success/50"></div>
                      En línea
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <VitalCard 
                      color="ritmo"
                      icon={<Heart className="w-5 h-5" />}
                      label="Ritmo cardiaco"
                      value="78"
                      unit="bpm"
                    />
                    <VitalCard 
                      color="oxigenacion"
                      icon={<Activity className="w-5 h-5" />}
                      label="Oxigenación"
                      value="96"
                      unit="%"
                    />
                    <VitalCard 
                      color="temperatura"
                      icon={<TrendingUp className="w-5 h-5" />}
                      label="Temperatura"
                      value="36.7"
                      unit="°C"
                    />
                  </div>

                  <div className="bg-gradient-to-r from-success-light to-success-light/50 rounded-2xl p-5 border-l-4 border-success shadow-sm">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-success-dark mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-success-dark mb-1">Estado estable</div>
                        <div className="text-sm text-slate-600 font-medium">Sin eventos críticos • Última lectura: hace 3 min</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-success/20 to-success/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
          </motion.div>
        </div>
      </section>

      {/* QUÉ ES */}
      <section id="que-es" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-success/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              ¿Qué es CardioGo?
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Un sistema inteligente de monitoreo cardiovascular que conecta a todos los involucrados en el cuidado del paciente
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCardNew 
              icon={<Activity className="w-7 h-7" />}
              title="Supervisión continua"
              text="Vigilancia 24/7 de signos vitales en tiempo real"
              gradient="from-danger-light to-danger-light"
            />
            <FeatureCardNew 
              icon={<Bell className="w-7 h-7" />}
              title="Alertas inteligentes"
              text="Notificaciones instantáneas ante cualquier anomalía"
              gradient="from-orange-light to-orange-light"
            />
            <FeatureCardNew 
              icon={<TrendingUp className="w-7 h-7" />}
              title="Análisis predictivo"
              text="Identificación temprana de patrones de riesgo"
              gradient="from-success-light to-success-light"
            />
            <FeatureCardNew 
              icon={<Users className="w-7 h-7" />}
              title="Conexión total"
              text="Comunicación fluida entre paciente, familia y médicos"
              gradient="from-primary-light to-primary-light"
            />
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section id="beneficios" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h3 className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-gray-dark to-gray-medium bg-clip-text text-transparent">
              Beneficios que transforman vidas
            </h3>
            <p className="text-xl text-slate-600 leading-relaxed">
              Diseñado para brindar seguridad, tranquilidad y respuesta rápida cuando más se necesita
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <BenefitCardNew 
              icon={<Shield className="w-10 h-10" />}
              title="Seguridad 24/7"
              text="Monitoreo continuo que nunca duerme, para que tú puedas descansar tranquilo"
              color="primary"
            />
            <BenefitCardNew 
              icon={<Heart className="w-10 h-10" />}
              title="Tranquilidad familiar"
              text="Mantén a tus seres queridos cerca, sin importar la distancia física"
              color="danger"
            />
            <BenefitCardNew 
              icon={<Clock className="w-10 h-10" />}
              title="Respuesta inmediata"
              text="Cada segundo cuenta: alertas que salvan vidas en tiempo real"
              color="success"
            />
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS */}
      <section id="caracteristicas" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h3 className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Funcionalidades para cada rol
            </h3>
            <p className="text-xl text-slate-600 leading-relaxed">
              Herramientas diseñadas específicamente para pacientes, cuidadores y profesionales médicos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <RoleCard 
              title="Para pacientes"
              icon={<Heart className="w-7 h-7" />}
              color="primary"
              features={[
                "Monitoreo automático y pasivo",
                "Interfaz simple e intuitiva",
                "Sin configuraciones complejas",
                "Alertas solo cuando es necesario"
              ]}
            />
            <RoleCard 
              title="Para cuidadores"
              icon={<Users className="w-7 h-7" />}
              color="success"
              features={[
                "Dashboard en tiempo real",
                "Alertas push inmediatas",
                "Historial completo de eventos",
                "Comunicación directa con médicos"
              ]}
            />
            <RoleCard 
              title="Para hospitales"
              icon={<Activity className="w-7 h-7" />}
              color="danger"
              features={[
                "Gestión de múltiples pacientes",
                "Análisis de tendencias",
                "Notas médicas y recetas",
                "Reportes automatizados"
              ]}
            />
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h3 className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Flujo simple y efectivo
            </h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Desde la captura de datos hasta la atención médica, todo diseñado para actuar con rapidez
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCardNew 
              number={1}
              title="Captura"
              text="Dispositivos IoT registran signos vitales continuamente"
              icon={<Activity className="w-6 h-6" />}
            />
            <StepCardNew 
              number={2}
              title="Análisis"
              text="Algoritmos detectan patrones y anomalías en tiempo real"
              icon={<TrendingUp className="w-6 h-6" />}
            />
            <StepCardNew 
              number={3}
              title="Notificación"
              text="Alertas automáticas a cuidadores y personal médico"
              icon={<Bell className="w-6 h-6" />}
            />
            <StepCardNew 
              number={4}
              title="Acción"
              text="Respuesta coordinada para minimizar riesgos"
              icon={<Shield className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-28 bg-gradient-to-br from-primary via-primary-dark to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-white rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-4xl lg:text-5xl font-black text-white mb-8 leading-tight">
              Comienza a cuidar mejor hoy mismo
            </h3>
            <p className="text-xl lg:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Únete a CardioGo y brinda a tus pacientes o seres queridos la seguridad que merecen
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-lg">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-lg text-slate-800">CardioGo</div>
                <div className="text-sm text-slate-500">Monitoreo cardiovascular remoto</div>
              </div>
            </div>
            <div className="text-sm text-slate-600 text-center md:text-right">
              <div className="font-semibold">Proyecto académico • 2025</div>
              <div className="text-slate-500">Universidad Tecnológica de Tijuana</div>
            </div>
          </div>
        </div>
      </footer>
    </main>

    {/* SCROLL TO TOP BUTTON */}
    <AnimatePresence>
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-primary via-primary-dark to-blue-800 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center group"
          aria-label="Volver arriba"
        >
          <ArrowUp className="w-7 h-7 group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  </div>
);
}

/* ------------------------ COMPONENTS ------------------------ */

/* ------------------------ STAT ITEM ------------------------ */

function StatItem({ number, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <div className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-2">
        {number}
      </div>
      <div className="text-sm text-slate-600 font-medium">{label}</div>
    </motion.div>
  );
}

/* ------------------------ VITAL CARD ------------------------ */
function VitalCard({ color, icon, label, value, unit }) {
  const colorMap = {
    ritmo: {
      bg: "bg-gradient-to-br from-vitals-ritmo-bg to-vitals-ritmo-bg",
      border: "border-vitals-ritmo-border",
      iconBg: "bg-vitals-ritmo-bg",
      iconColor: "text-vitals-ritmo-border",
      valueColor: "text-vitals-ritmo-border"
    },
    oxigenacion: {
      bg: "bg-gradient-to-br from-vitals-oxigenacion-bg to-vitals-oxigenacion-bg",
      border: "border-vitals-oxigenacion-border",
      iconBg: "bg-vitals-oxigenacion-bg",
      iconColor: "text-vitals-oxigenacion-border",
      valueColor: "text-vitals-oxigenacion-border"
    },
    temperatura: {
      bg: "bg-gradient-to-br from-vitals-temperatura-bg to-vitals-temperatura-bg",
      border: "border-vitals-temperatura-border",
      iconBg: "bg-vitals-temperatura-bg",
      iconColor: "text-vitals-temperatura-border",
      valueColor: "text-vitals-temperatura-border"
    }
  };

  const colorClasses = colorMap[color];

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`${colorClasses.bg} ${colorClasses.border} border-l-4 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`${colorClasses.iconBg} ${colorClasses.iconColor} w-10 h-10 rounded-xl flex items-center justify-center shadow-sm`}>
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <span className="text-xs font-semibold text-gray-dark uppercase tracking-wide">{label}</span>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-3xl font-black ${colorClasses.valueColor}`}>{value}</span>
          <span className="text-sm font-semibold text-gray-medium">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------ FEATURE CARD ------------------------ */
function FeatureCardNew({ icon, title, text, gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`relative bg-gradient-to-br ${gradient} p-8 rounded-3xl border border-white/50 shadow-lg hover:shadow-2xl transition-all group overflow-hidden`}
    >
      {/* Efecto de brillo al hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-primary-dark mb-6 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h4 className="text-xl font-bold mb-3 text-slate-800">{title}</h4>
        <p className="text-slate-600 leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}

/* ------------------------ BENEFIT CARD ------------------------ */
function BenefitCardNew({ icon, title, text, color }) {
  const colorMap = {
    primary: {
      gradient: "from-primary via-primary-light to-primary-light",
      border: "border-primary-dark",
      iconBg: "bg-gradient-to-br from-primary to-primary-dark",
      glow: "group-hover:shadow-primary"
    },
    danger: {
      gradient: "from-danger via-danger-light to-danger-light",
      border: "border-danger-dark",
      iconBg: "bg-gradient-to-br from-danger to-danger-dark",
      glow: "group-hover:shadow-danger"
    },
    success: {
      gradient: "from-success via-success-light to-success-light",
      border: "border-success-dark",
      iconBg: "bg-gradient-to-br from-success to-success-dark",
      glow: "group-hover:shadow-success"
    }
  };

  const colorClasses = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -12, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative bg-gradient-to-br ${colorClasses.gradient} bg-white p-10 rounded-3xl border-2 ${colorClasses.border} shadow-xl hover:shadow-2xl ${colorClasses.glow} transition-all text-center overflow-hidden`}
    >
      {/* Efecto de fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10">
        <div className={`w-20 h-20 mx-auto ${colorClasses.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-2xl text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          {icon}
        </div>
        <h4 className="text-2xl font-bold mb-4 text-slate-800">{title}</h4>
        <p className="text-slate-600 leading-relaxed text-lg">{text}</p>
      </div>
    </motion.div>
  );
}

/* ------------------------ ROLE CARD ------------------------ */
function RoleCard({ title, icon, color, features }) {
  const colorMap = {
    primary: {
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      glow: "group-hover:shadow-blue-500/30"
    },
    success: {
      gradient: "from-green-500 via-green-600 to-green-700",
      glow: "group-hover:shadow-green-500/30"
    },
    danger: {
      gradient: "from-red-500 via-red-600 to-red-700",
      glow: "group-hover:shadow-red-500/30"
    }
  };

  const colorClasses = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`group bg-white rounded-3xl shadow-xl hover:shadow-2xl ${colorClasses.glow} transition-all overflow-hidden border-2 border-slate-100`}
    >
      {/* Header con gradiente */}
      <div className={`bg-gradient-to-r ${colorClasses.gradient} p-8 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <h4 className="text-2xl font-bold">{title}</h4>
        </div>
      </div>

      {/* Lista de características */}
      <div className="p-8">
        <ul className="space-y-4">
          {features.map((feature, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-4 group/item"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md group-hover/item:scale-110 transition-transform">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <span className="text-slate-700 font-medium leading-relaxed">{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/* ------------------------ STEP CARD ------------------------ */
function StepCardNew({ number, title, text, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border-2 border-slate-100 group overflow-hidden"
    >
      {/* Número en la esquina */}
      <div className="absolute -top-5 -right-5 w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary-dark to-blue-800 text-white flex items-center justify-center font-black text-2xl shadow-2xl group-hover:scale-110 transition-transform">
        {number}
      </div>

      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-md">
          {icon}
        </div>
        <h4 className="text-xl font-bold mb-3 text-slate-800">{title}</h4>
        <p className="text-slate-600 leading-relaxed">{text}</p>
      </div>

      {/* Línea de conexión (excepto el último) */}
      <div className="hidden md:block absolute top-1/2 -right-8 w-16 h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
    </motion.div>
  );
}