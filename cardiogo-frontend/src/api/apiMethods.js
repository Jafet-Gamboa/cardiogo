import axiosInstance from "./axiosConfig";

export const api = {
  // Métodos Get
  getPatiens: () => axiosInstance.get("/patients"),
  getVitalSigns: () => axiosInstance.get("/vital_signs"),
  getVitalSignsById: (patientId) =>
    axiosInstance.get(`/vital_signs/${patientId}`),
  getVitalSignsByCuidadorId: (cuidadorId) =>
    axiosInstance.get(`/devices/cuidador/${cuidadorId}`),
  getVitalSignsByPacienteId: (paciente_id) =>
    axiosInstance.get(`/devices/paciente/${paciente_id}`),
  getNormalSignsPacienteJ: (id) => axiosInstance.get(`/normal_signs/paciente/${id}`),
  getNormalSignsCuidador: (id) => axiosInstance.get(`/normal_signs/cuidador/${id}`),
  getNormalSigns: () => axiosInstance.get(`/normal_signs`),
  getNormalSignsPaciente: (paciente_id) =>
    axiosInstance.get(`/normal_signs/${paciente_id}`),
  getMedicinesList: () => axiosInstance.get("/medicines/list"),
  getMedicinesByCuidadorId: (cuidadorId) =>
    axiosInstance.get(`/prescriptions/cuidador/${cuidadorId}`),
  getDataByCuidadorId: (cuidadorId) =>
    axiosInstance.get(`/caregivers/${cuidadorId}`),
  getDatosUsuariosById: (userId) => axiosInstance.get(`/users/datos/${userId}`),
  getCuidadores: () => axiosInstance.get(`/caregivers`),
  getPatientsWithDocs: () => axiosInstance.get(`/doctor_device`),
  getUsers: () => axiosInstance.get("/users"),
  getCards: () => axiosInstance.get("/users/cards"),
  getPatientIdByCaregiver: (userId) =>
    axiosInstance.get(`/caregivers/patient/${userId}`),
  getPaciente_cuidador: (nombre) =>
    axiosInstance.get(`caregiver_patient/buscar/${nombre}`),
  getPatiensById: (paciente_id) =>
    axiosInstance.get(`/patients/${paciente_id}`),
  getRecetasByPacienteId: (paciente_id) =>
    axiosInstance.get(`/prescribe_medication/paciente/${paciente_id}`),
  getMedicamentosByPacienteId: (paciente_id) =>
    axiosInstance.get(`/prescriptions/paciente/${paciente_id}`),
  getDevices: () => axiosInstance.get("/devices/only"),
  getPatiensComplete: (paciente_id) =>
    axiosInstance.get(`/patients/pacienteCompleto/${paciente_id}`),
  getPaciente_cuidadorById: (paciente_id) =>
    axiosInstance.get(`caregiver_patient/buscarById/${paciente_id}`),
  getAlertsCount: (endpoint, userId) =>
    axiosInstance.get(`/alerts/${endpoint}/count/${userId}`),
  getAlertsUnread: (endpoint, userId) =>
    axiosInstance.get(`/alerts/${endpoint}/no_leido/${userId}`),
  getAlertsRead: (endpoint, userId) =>
    axiosInstance.get(`/alerts/${endpoint}/leido/${userId}`),
  getPacientesDelMedico: (medicoId) =>
    axiosInstance.get(`/doctors/pacientes/${medicoId}`),
  getPacientesEnRiesgo: (doctorId) =>
    axiosInstance.get(`/doctors/${doctorId}/dashboard/pacientes_en_riesgo`),
  getAlertasHoy: (doctorId) =>
    axiosInstance.get(`/doctors/${doctorId}/dashboard/alertas_hoy`),
  getDispositivosActivos: (doctorId) =>
    axiosInstance.get(`/doctors/${doctorId}/dashboard/dispositivos_activos`),
  getPacientesCriticos: (doctorId) =>
    axiosInstance.get(`/doctors/${doctorId}/dashboard/pacientes_criticos`),
  getActividadSistema: (doctorId) =>
    axiosInstance.get(`/doctors/${doctorId}/dashboard/actividad_sistema`),
  getDistribucionEdad: (doctorId) =>
    axiosInstance.get(`/doctors/${doctorId}/dashboard/distribucion_edad`),
  getTiposAlertasFrecuentes: (doctorId) =>
    axiosInstance.get(`/doctors/${doctorId}/dashboard/tipos_alerta_frecuentes`),
  getEvolucionRitmo: (doctorId, pacienteId) =>
    axiosInstance.get(
      `/doctors/${doctorId}/pacientes/${pacienteId}/evolucion_ritmo`
    ),
  getEvolucionOxigenacion: (doctorId, pacienteId) =>
    axiosInstance.get(
      `/doctors/${doctorId}/pacientes/${pacienteId}/evolucion_oxigenacion`
    ),
  getEvolucionTemperatura: (doctorId, pacienteId) =>
    axiosInstance.get(
      `/doctors/${doctorId}/pacientes/${pacienteId}/evolucion_temperatura`
    ),
  getAlertasPorDia: (doctorId, pacienteId) =>
    axiosInstance.get(
      `/doctors/${doctorId}/pacientes/${pacienteId}/alertas_por_dia`
    ),
  getRitmoPorHora: (doctorId, pacienteId) =>
    axiosInstance.get(
      `/doctors/${doctorId}/pacientes/${pacienteId}/ritmo_por_hora`
    ),
  getSignosVitalesAdmin: () => axiosInstance.get(`/vital_signs/pacientes`),
  getDatosEmpleados: (userId) => axiosInstance.get(`/users/datos/${userId}`),
  // Métodos Put
  putDataCuidador: (cuidadorId, data) =>
    axiosInstance.put(`/caregivers/${cuidadorId}`, data),
  putDataUsuario: (usuarioId, data) =>
    axiosInstance.put(`/users/${usuarioId}?dinamico=true`, data),
  putDataMedicina: (medicinaId, data) =>
    axiosInstance.put(`/medicines/${medicinaId}?dinamico=true`, data),
  putUsers: (userId, data) =>
    axiosInstance.put(`/users/${userId}?dinamico=true`, data),
  putDataPatient: (pacienteId, data) =>
    axiosInstance.put(`/patients/${pacienteId}?dinamico=true`, data),
  markAlertAsRead: (endpoint, alertaId) =>
    axiosInstance.put(`/alerts/${endpoint}/${alertaId}`),
  // Métodos Post
  createMedicine: (data) => axiosInstance.post("/medicines", data),
  registerFCMToken: (data) => axiosInstance.post("/notifications", data),
  subscribeToTopic: (data) =>
    axiosInstance.post("/notifications/subscribe/paciente", data),
  addPersonal: (data) => axiosInstance.post("/users", data),
  postPredecirRiesgo: (data) =>
    axiosInstance.post(`/dataset/predecir`, data),
};
