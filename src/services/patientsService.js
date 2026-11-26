
import api from "../config/api";

const BASE_URL = "/admin/patients";

const PatientsService = {
  getAll: async (params = {}) => {
    const response = await api.get(BASE_URL, { params });

    return response.data.data ?? response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data.data ?? response.data;
  },
};

export default PatientsService;
