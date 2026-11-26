
import api from "../config/api";

const homeService = {
    getHomeData: async () => {
        const response = await api.get("/home/getService");

        if (!response.data?.success) {
            throw new Error(
                response.data?.message || "Failed to load home data."
            );
        }
        return {
            services: response.data.services?.data || [],
            dentists: response.data.dentists?.data || [],
        };
    },
    getTimeSlots: async (payload) => {
        const response = await api.post(`/appointment/available-slots`,payload);
        return response.data;
    },
    createAppointment: async (payload) => {
        const response = await api.post(`/appointment/create`, payload);
        return response.data;
    }

};

export default homeService;
