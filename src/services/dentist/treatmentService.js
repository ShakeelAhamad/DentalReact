import api from "../../config/api";
const BASE_URL = "/dentist";
const treatmentService = {
    // Get appointment information for treatment summary
    getAppointmentById: async (appointmentId) => {
        const response = await api.get(
            `${BASE_URL}/appointments/${appointmentId}`
        );
        return response.data;
    },

    // Save treatment record
    create: async (data,appointmentId) => {
        const response = await api.post(
            `${BASE_URL}/appointments/${appointmentId}/create`,
            data
        );
        return response.data;
    },

    getAllTreatments: async (params = {}) => {
        const response = await api.get(`${BASE_URL}/treatments`, { params });
        return response.data;
    },

    getTreatmentById: async (id) => {
        const response = await api.get(`${BASE_URL}/treatments/${id}`);
        return response.data;
    },
};

export default treatmentService;