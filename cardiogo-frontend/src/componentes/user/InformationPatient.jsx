import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pill, Clock, Calendar, FileText, AlertCircle } from "lucide-react";
import { api } from "../../api/apiMethods";

const InformationPatient = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMed, setSelectedMed] = useState(null);
  const paciente_id = localStorage.getItem("pacienteId");

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

  const esActiva = (fechaVencimiento) => {
    const hoy = new Date();
    const hoyUTC = new Date(
      Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate())
    );

    const f = new Date(fechaVencimiento);
    const fechaVUTC = new Date(
      Date.UTC(f.getUTCFullYear(), f.getUTCMonth(), f.getUTCDate())
    );

    return fechaVUTC >= hoyUTC;
  };

  useEffect(() => {
    setIsLoading(true);

    api
      .getMedicamentosByPacienteId(paciente_id)
      .then((response) => {
        const data = response?.data?.data || [];

        const meds = data.map((item) => ({
          id: item.medicamento.id,
          nombre: item.medicamento.nombre,
          dosis: item.medicamento.dosis,
          frecuencia: item.medicamento.frecuencia,
          duracion: item.medicamento.duracion,
          indicaciones: item.medicamento.indicaciones_adicionales,
          paciente: item.paciente.nombre,
          medico: item.medico.nombre,
          recetaId: item.receta.id,
          fechaEmisionRaw: item.receta.fecha_emision,
          fechaVencimientoRaw: item.receta.fecha_vencimiento,
          fechaEmision: formatUTCDate(item.receta.fecha_emision),
          fechaVencimiento: formatUTCDate(item.receta.fecha_vencimiento),
        }));

        const medsActivos = meds.filter((m) => esActiva(m.fechaVencimientoRaw));

        setMedicamentos(medsActivos);
      })
      .catch((error) => {
        console.error("Error al obtener los medicamentos:", error);
      })
      .finally(() => setIsLoading(false));
  }, [paciente_id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando medicamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-dark">
                Medicamentos Recetados
              </h2>
              <p className="text-gray-medium">
                Listado de medicamentos activos
              </p>
            </div>
          </div>
        </motion.div>

        {medicamentos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-light"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-light flex items-center justify-center mb-4">
              <Pill className="w-10 h-10 text-gray-medium" />
            </div>
            <h3 className="text-xl font-bold text-primary-dark mb-2">
              No hay medicamentos activos
            </h3>
            <p className="text-gray-medium">
              Cuando se receten nuevos medicamentos activos, aparecerán aquí.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-light"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-light border-b-2 border-gray-light">
                        <th className="text-left p-4 font-bold text-gray-dark">
                          <div className="flex items-center gap-2">
                            <Pill className="w-4 h-4" />
                            Medicamento
                          </div>
                        </th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Dosis
                          </div>
                        </th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Frecuencia
                          </div>
                        </th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Duración
                          </div>
                        </th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          Indicaciones
                        </th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          Fecha de Emisión
                        </th>
                        <th className="text-left p-4 font-bold text-gray-dark">
                          Fecha de Vencimiento
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {medicamentos.map((med, index) => (
                        <motion.tr
                          key={`${med.recetaId}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelectedMed(med)}
                          className="border-b border-gray-light hover:bg-primary-light transition-colors cursor-pointer group"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Pill className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-bold text-primary-dark">
                                  {med.nombre}
                                </p>
                                <p className="text-xs text-gray-medium">
                                  Receta #{med.recetaId}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-light text-primary-dark font-semibold text-sm">
                              {med.dosis}
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="text-primary-dark font-medium">
                              {med.frecuencia}
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                              {med.duracion}
                            </span>
                          </td>

                          <td className="p-4">
                            <p className="text-gray-medium text-sm line-clamp-2">
                              {med.indicaciones}
                            </p>
                          </td>

                          <td className="p-4">
                            <span className="text-primary-dark font-medium">
                              {med.fechaEmision}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-primary-dark font-medium">
                              {med.fechaVencimiento}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
              {medicamentos.map((med, index) => (
                <motion.div
                  key={`${med.recetaId}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedMed(med)}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-light hover:border-primary transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md flex-shrink-0">
                      <Pill className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-primary-dark">
                        {med.nombre}
                      </h3>
                      <p className="text-xs text-gray-medium">
                        Receta #{med.recetaId}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-medium" />
                      <span className="text-sm text-gray-medium">Dosis:</span>
                      <span className="font-semibold text-primary-dark">
                        {med.dosis}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-medium" />
                      <span className="text-sm text-gray-medium">
                        Frecuencia:
                      </span>
                      <span className="font-semibold text-primary-dark">
                        {med.frecuencia}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-medium" />
                      <span className="text-sm text-gray-medium">
                        Duración:
                      </span>
                      <span className="font-semibold text-primary-dark">
                        {med.duracion}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-light">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-primary-dark mb-1">
                            Indicaciones:
                          </p>
                          <p className="text-sm text-gray-medium">
                            {med.indicaciones}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InformationPatient;
