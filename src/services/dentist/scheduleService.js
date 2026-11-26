
import api from "../../config/api";

const BASE_URL = "/dentist/";

const scheduleService = {
    getAll: async (params = {}) => {
        const response = await api.get(BASE_URL, { params });
        return response?.data ?? response;
    },

    create: async (scheduleData) => {
        const response = await api.post(`${BASE_URL}schedule`, scheduleData);
        return response?.data ?? response;
    },

    delete: async (id) => {
        const response = await api.delete(`${BASE_URL}delete/${id}`);
        return response?.data ?? response;
    },
};

export default scheduleService;
