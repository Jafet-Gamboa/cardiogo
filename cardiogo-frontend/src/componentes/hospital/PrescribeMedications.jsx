import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipboardList, User, Plus, Trash2, Save, CheckCircle, AlertCircle, Pill, FileText, Clock, Calendar } from "lucide-react";
import { useAlert } from "../common/useAlert";
import AlertModal from "../common/AlertModal";

const PrescriptionForm = ({ presetPatientId = "", presetPatientName = "" }) => {
  const baseURL = "http://localhost:5000/cardio-go/v1";
  const token = localStorage.getItem("accessToken");
  const doctorId = localStorage.getItem("userId");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json",
    },
  };

  const [medications, setMedications] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);

  const [patientId] = useState(() => {
    return presetPatientId || localStorage.getItem("selectedPatientId") || "";
  });
  const [patientName] = useState(() => {
    return (
      presetPatientName || localStorage.getItem("selectedPatientName") || ""
    );
  });

  const [indicacionesGenerales, setIndicacionesGenerales] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { alert, showAlert } = useAlert();

  const duracionesComunes = [
    "1 día",
    "3 días",
    "5 días",
    "7 días",
    "10 días",
    "14 días",
  ];
  const frecuenciasComunes = [
    "1 vez al día",
    "2 veces al día",
    "3 veces al día",
    "Cada 8 horas",
    "Cada 12 horas",
  ];
  const dosisComunes = [
    "1 tableta",
    "2 tabletas",
    "5 ml",
    "10 ml",
    "1 cápsula",
    "2 cápsulas",
  ];
  const defaultInstructions = [
    "Tomar con alimentos",
    "Antes de dormir",
    "Después de las comidas",
    "Evitar conducir",
    "No combinar con alcohol",
  ];

  useEffect(() => {
    if (!token) {
      setMensajeError("No se encontró el token. Inicia sesión nuevamente.");
      return;
    }

    axios
      .get(`${baseURL}/medicines/list`, axiosConfig)
      .then((res) => {
        if (res.data?.data) {
          setMedications(res.data.data);
        } else {
          setMensajeError("No se recibieron datos de medicamentos.");
        }
      })
      .catch((err) => {
        console.error(err);
        setMensajeError(
          err.response?.status === 401
            ? "Sesión expirada. Inicia sesión nuevamente."
            : "Error al cargar medicamentos."
        );
      });
  }, [token]);

  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => {
        localStorage.removeItem("selectedPatientId");
        localStorage.removeItem("selectedPatientName");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  const handleAddMedication = () => {
    setSelectedMedications([
      ...selectedMedications,
      {
        medicamento_id: "",
        dosis: "",
        frecuencia: "",
        duracion: "",
        indicaciones_adicionales: "",
      },
    ]);
  };

  const handleRemoveMedication = (index) => {
    const copy = [...selectedMedications];
    copy.splice(index, 1);
    setSelectedMedications(copy);
  };

  const handleMedicationChange = (index, field, value) => {
    const copy = [...selectedMedications];
    copy[index][field] = value;
    setSelectedMedications(copy);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  // VALIDACIONES
  if (!token) {
    setIsLoading(false);
    return showAlert("Inicia sesión nuevamente.", "error");
  }

  if (!doctorId || !patientId) {
    setIsLoading(false);
    return showAlert("No se encontró el ID del médico o del paciente.", "error");
  }

  if (selectedMedications.length === 0) {
    setIsLoading(false);
    return showAlert("Agrega al menos un medicamento.", "error");
  }

  const fechaActual = new Date().toISOString().split("T")[0];

  const payload = {
    fecha_emision: fechaActual,
    indicaciones: indicacionesGenerales,
    paciente_id: parseInt(patientId),
    medico_id: parseInt(doctorId),
    medicamentos: selectedMedications.map((m) => ({
      medicamento_id: parseInt(m.medicamento_id),
      dosis: m.dosis,
      frecuencia: m.frecuencia,
      duracion: m.duracion,
      indicaciones_adicionales:
        m.indicaciones_adicionales === "Otro"
          ? m.indicaciones_personalizada
          : m.indicaciones_adicionales,
    })),
  };

  try {
    const response = await axios.post(
      `${baseURL}/prescribe_medication/`,
      payload,
      axiosConfig
    );

    console.log("Receta registrada correctamente:", response.data);

    showAlert(`Receta registrada para ${patientName}.`, "success");

    // Reset formulario
    setSelectedMedications([]);
    setIndicacionesGenerales("");

  } catch (err) {
    console.error("Error:", err.response?.data || err.message);

    let errorMsg = "Error al registrar la receta. Inténtalo nuevamente.";

    if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMsg = err.response.data.error;
    }

    showAlert(errorMsg, "error");

  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="space-y-6">
      {/* Mensajes */}
      {mensajeExito && (
        <div className="p-4 bg-success-light border-l-4 border-success rounded-xl flex items-start gap-3 animate-fadeIn">
          <div className="bg-success text-white rounded-full p-1 mt-0.5">
            <CheckCircle className="w-4 h-4" />
          </div>
          <p className="text-success font-medium">{mensajeExito}</p>
        </div>
      )}
      {mensajeError && (
        <div className="p-4 bg-danger-light border-l-4 border-danger rounded-xl flex items-start gap-3 animate-fadeIn">
          <div className="bg-danger text-white rounded-full p-1 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <p className="text-danger font-medium">{mensajeError}</p>
        </div>
      )}
      <AlertModal alert={alert} />
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Sección: Paciente */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-light">
            <h3 className="text-base sm:text-lg font-bold text-gray-dark">
              Información del Paciente
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Paciente Seleccionado
            </label>
            <div className="relative group">
              <input
                type="text"
                value={patientName}
                readOnly
                className="w-full px-4 py-3 pl-11 bg-primary-light border-2 border-primary rounded-xl outline-none text-primary-dark font-semibold cursor-not-allowed"
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            </div>
            <input type="hidden" value={patientId} />
          </div>
        </div>

        {/* Sección: Indicaciones Generales */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-light">
            <h3 className="text-base sm:text-lg font-bold text-gray-dark">
              Indicaciones Generales
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Instrucciones para el paciente
            </label>
            <textarea
              value={indicacionesGenerales}
              onChange={(e) => setIndicacionesGenerales(e.target.value)}
              className="w-full px-4 py-3 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium resize-none"
              rows="4"
              placeholder="Escriba las indicaciones generales para el paciente..."
            />
          </div>
        </div>

        {/* Sección: Medicamentos */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-light">
            <h3 className="text-base sm:text-lg font-bold text-gray-dark">
              Medicamentos Recetados
            </h3>
            <button
              type="button"
              onClick={handleAddMedication}
              className="flex items-center gap-2 from-success to-success-dark bg-gradient-to-r hover:bg-success-dark text-white px-4 py-2 rounded-lg transition-all shadow-md text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>

          {selectedMedications.length === 0 ? (
            <div className="text-center py-12 bg-gray-light rounded-xl border-2 border-dashed border-gray-300">
              <Pill className="w-16 h-16 text-gray-medium mx-auto mb-4" />
              <p className="text-gray-medium font-medium mb-2">
                No hay medicamentos agregados
              </p>
              <p className="text-gray-medium text-sm">
                Haz clic en "Agregar" para comenzar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedMedications.map((m, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-light p-6 rounded-xl bg-white hover:border-primary/30 transition-all"
                >
                  {/* Header del medicamento */}
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-light">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
                        <Pill className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-primary-dark">
                        Medicamento #{index + 1}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(index)}
                      className="flex items-center gap-2 text-danger hover:bg-danger-light px-3 py-2 rounded-lg transition-all text-sm font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Seleccionar Medicamento */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                        <Pill className="w-4 h-4 text-primary" />
                        Medicamento <span className="text-danger">*</span>
                      </label>
                      <select
                        value={m.medicamento_id}
                        onChange={(e) =>
                          handleMedicationChange(index, "medicamento_id", e.target.value)
                        }
                        required
                        className="w-full px-4 py-3 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark appearance-none cursor-pointer"
                      >
                        <option value="">Seleccione un medicamento...</option>
                        {medications.map((med) => (
                          <option key={med.id} value={med.id}>
                            {`${med.nombre} (${med.principio.activo}, ${med.via.administracion}, ${med.forma.farmaceutica}, ${med.concentracion})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dosis */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Dosis <span className="text-danger">*</span>
                      </label>
                      <select
                        value={m.dosis}
                        onChange={(e) => handleMedicationChange(index, "dosis", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark appearance-none cursor-pointer"
                      >
                        <option value="">Seleccione...</option>
                        {dosisComunes.map((d, i) => (
                          <option key={i} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    {/* Frecuencia */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        Frecuencia <span className="text-danger">*</span>
                      </label>
                      <select
                        value={m.frecuencia}
                        onChange={(e) => handleMedicationChange(index, "frecuencia", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark appearance-none cursor-pointer"
                      >
                        <option value="">Seleccione...</option>
                        {frecuenciasComunes.map((f, i) => (
                          <option key={i} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>

                    {/* Duración */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Duración <span className="text-danger">*</span>
                      </label>
                      <select
                        value={m.duracion}
                        onChange={(e) => handleMedicationChange(index, "duracion", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark appearance-none cursor-pointer"
                      >
                        <option value="">Seleccione...</option>
                        {duracionesComunes.map((d, i) => (
                          <option key={i} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    {/* Indicaciones Adicionales */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Indicaciones Adicionales <span className="text-danger">*</span>
                      </label>
                      <select
                        value={m.indicaciones_adicionales || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleMedicationChange(index, "indicaciones_adicionales", value);
                          if (value !== "Otro") {
                            handleMedicationChange(index, "indicaciones_personalizada", "");
                          }
                        }}
                        className="w-full px-4 py-3 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark appearance-none cursor-pointer"
                      >
                        <option value="">Seleccione una indicación...</option>
                        {defaultInstructions.map((ins, i) => (
                          <option key={i} value={ins}>{ins}</option>
                        ))}
                        <option value="Otro">✏️ Escribir indicación personalizada</option>
                      </select>

                      {m.indicaciones_adicionales === "Otro" && (
                        <textarea
                          placeholder="Escriba una indicación personalizada..."
                          value={m.indicaciones_personalizada || ""}
                          onChange={(e) =>
                            handleMedicationChange(index, "indicaciones_personalizada", e.target.value)
                          }
                          className="w-full px-4 py-3 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium resize-none mt-2"
                          rows="3"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTÓN DE ENVÍO */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-primary to-primary-dark text-white py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Guardando Receta...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 sm:w-6 sm:h-6" />
              Guardar Receta
            </>
          )}
        </button>

        {/* Nota informativa */}
        <p className="text-center text-xs text-gray-medium mt-4">
          Los campos marcados con <span className="text-danger">*</span> son obligatorios
        </p>
      </form>
    </div>
  );
};

export default PrescriptionForm;