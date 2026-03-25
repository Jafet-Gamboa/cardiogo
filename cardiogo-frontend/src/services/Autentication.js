import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
  const _apiURL = `${apiURL}/auth/login`;

  try {
    const response = await axios.post(_apiURL, {
      email: email,
      password: password,
    });
    localStorage.setItem("accessToken", response.data.data.access_token);
    localStorage.setItem("refreshToken", response.data.data.refresh_token);
    localStorage.setItem("userId", response.data.data.user_id);
    localStorage.setItem("rolId", response.data.data.rol_id);
    switch (response.data.data.rol_id) {
      case 2:
        localStorage.setItem("medicoId", response.data.data.medico_id);
        break;
      case 3:
        localStorage.setItem("pacienteId", response.data.data.paciente_id);
        break;
      case 4:
        localStorage.setItem("cuidadorId", response.data.data.cuidador_id);
        break;
      case 5:
        localStorage.setItem(
          "personalAdminId",
          response.data.data.personal_adm_id
        );
        break;
    }
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login fallido");
  }
};

export const registroUsuario = async (
  nombre,
  apellidoPaterno,
  apellidoMaterno,
  telefono,
  email,
  password,
  rolId
) => {
  const _apiURL = `${apiURL}/users/`;
  try {
    const response = await axios.post(_apiURL, {
      nombre: nombre,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      telefono: telefono,
      email: email,
      password: password,
      rol_id: rolId,
    });
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Registro de usuario fallido"
    );
  }
};

export const registroPaciente = async (
  fechaNacimiento,
  estadoCivil,
  ocupacion,
  sexo,
  usuarioId,
  personalAdmId,
  direccionId
) => {
  const _apiURL = `${apiURL}/patients/`;
  try {
    const response = await axios.post(_apiURL, {
      fecha_nacimiento: fechaNacimiento,
      estado_civil: estadoCivil,
      ocupacion: ocupacion,
      sexo: sexo,
      usuario_id: usuarioId,
      personal_adm_id: personalAdmId,
      direccion_id: direccionId,
    });
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Registro de paciente fallido"
    );
  }
};

export const registroCuidador = async (relacionPaciente, usuarioId) => {
  const _apiURL = `${apiURL}/caregivers/`;
  try {
    const response = await axios.post(_apiURL, {
      relacion_paciente: relacionPaciente,
      usuario_id: usuarioId,
    });
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Registro de cuidador fallido"
    );
  }
};

export const registroPersonal = async (telefonoInterno, usuarioId) => {
  const _apiURL = `${apiURL}/administrative_staff/`;
  try {
    const response = await axios.post(_apiURL, {
      telefono_interno: telefonoInterno,
      usuario_id: usuarioId,
    });
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Registro de personal administrativo fallido"
    );
  }
};

export const registroMedico = async (
  especialidad,
  cedulaProfesional,
  usuarioId
) => {
  const _apiURL = `${apiURL}/doctors/`;
  try {
    const response = await axios.post(_apiURL, {
      especialidad: especialidad,
      cedula_profesional: cedulaProfesional,
      usuario_id: usuarioId,
    });
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Registro de medico fallido"
    );
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("rolId");
  localStorage.removeItem("medicoId");
  localStorage.removeItem("pacienteId");
  localStorage.removeItem("cuidadorId");
  localStorage.removeItem("personalAdminId");
  localStorage.removeItem("selectedPatientId");
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const getUserId = () => {
  return localStorage.getItem("userId");
};

const AuthService = {
  login,
  logout,
  registroUsuario,
  registroPaciente,
  registroCuidador,
  registroPersonal,
  registroMedico,
  getAccessToken,
  getRefreshToken,
  getUserId,
};

export default AuthService;
