import api from "../../config/api";

const BASE_URL = "/dentist/appointments";

const DentistService = {
    // Get all dentists
    getAll: async (params = {}) => {
        const response = await api.get(BASE_URL, { params });
        const result = response.data;
        if (result?.success !== true) {
            throw new Error(
                result?.message || "Failed to retrieve appointments."
            );
        }
        return result.data;
    },
    // Get dentist by ID
    getById: async (id) => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    // Delete dentist
    updateStatus: async (id, status) => {
        const response = await api.put(
            `${BASE_URL}/${id}/status?status=${status}`
        );
        return response.data;
    },
    // Get status counts
    getStatusCounts: async () => {
        const response = await api.get(`${BASE_URL}/stats`);
        return response.data;
    },
};

export default DentistService;