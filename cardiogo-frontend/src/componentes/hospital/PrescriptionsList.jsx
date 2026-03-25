import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  Pill,
  UserCheck,
  Clock,
  ChevronRight,
  Search,
  CheckCircle,
  XCircle,
  ClipboardList
} from "lucide-react";

const PrescriptionsList = () => {
  const [recetas, setRecetas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const doctorId = localStorage.getItem("userId");
  const baseURL = "http://localhost:5000/cardio-go/v1";

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${baseURL}/prescribe_medication/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRecetas(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const filteredRecetas = recetas.filter((item) => {
    const normalizedPatient = normalizeText(item.paciente.nombre_completo);
    const normalizedSearch = normalizeText(searchTerm);
    const recetaId = item.receta.id.toString();

    return (
      normalizedPatient.includes(normalizedSearch) ||
      recetaId.includes(searchTerm)
    );
  });

  const formatUTCDate = (dateString) => {
    const d = new Date(dateString);

    const day = d.getUTCDate();
    const month = d.getUTCMonth();
    const year = d.getUTCFullYear();

    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    return `${day} de ${meses[month]} de ${year}`;
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
                <ClipboardList className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-dark">
                  Historial de Recetas
                </h2>
                <p className="text-gray-medium">
                  Total de recetas:{" "}
                  <span className="font-bold text-primary">
                    {recetas.length}
                  </span>
                </p>
              </div>
            </div>

            {/* Buscador */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-medium w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por paciente o ID..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-light"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-primary-light flex items-center justify-center mb-4 animate-pulse">
              <ClipboardList className="w-10 h-10 text-primary" />
            </div>
            <p className="text-gray-medium font-medium">Cargando recetas...</p>
          </motion.div>
        ) : filteredRecetas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-light"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-light flex items-center justify-center mb-4">
              <Search className="text-gray-medium w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-primary-dark mb-2">
              {searchTerm
                ? "No se encontraron recetas"
                : "No hay recetas disponibles"}
            </h3>
            <p className="text-gray-medium">
              {searchTerm
                ? "Intenta con otro término de búsqueda"
                : "Las recetas que emitas aparecerán aquí"}
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {filteredRecetas.map((item, index) => (
                <motion.div
                  key={item.receta.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl shadow-lg border border-gray-light hover:shadow-xl transition-all overflow-hidden"
                >
                  {/* Header de la tarjeta */}
                  <div className="bg-gradient-to-r from-primary to-primary-dark p-4 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 flex-1">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold truncate">
                            {item.paciente.nombre_completo}
                          </h3>
                          <p className="text-xs text-white/80 font-mono">
                            ID: #{item.receta.id}
                          </p>
                        </div>
                      </div>
                      {item.receta?.estado === "Activa" ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-success rounded-lg text-xs font-semibold whitespace-nowrap">
                          <CheckCircle className="w-3.5 h-3.5" /> Activa
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-danger rounded-lg text-xs font-semibold whitespace-nowrap">
                          <XCircle className="w-3.5 h-3.5" /> Inactiva
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-4 space-y-3">
                    {/* Medicamentos */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Pill className="w-4 h-4 text-primary" />
                        <span className="font-bold text-gray-dark text-xs">
                          Medicamentos Prescritos
                        </span>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <div className="space-y-1.5">
                          {item.medicamento.detalle_medicamentos
                            .split("\n")
                            .map((linea, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-xs text-gray-700"
                              >
                                <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                <span className="flex-1">{linea}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Indicaciones */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-success" />
                        <span className="font-bold text-gray-dark text-xs">
                          Indicaciones Generales
                        </span>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                        <p className="text-gray-700 text-xs leading-relaxed">
                          {item.receta.indicaciones_generales ||
                            "Sin indicaciones específicas"}
                        </p>
                      </div>
                    </div>

                    {/* Fecha de Emisión */}
                    <div className="pt-3 border-t border-gray-light">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-medium">
                            Fecha de Emisión
                          </p>
                          <p className="text-xs text-gray-dark font-semibold">
                            {formatUTCDate(item.receta.fecha_emision)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionsList;