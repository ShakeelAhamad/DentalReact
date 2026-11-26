
import api from "../config/api";

const dentistService = {
    getDentists: async ({
        search = "",
        pageNumber = 1,
        pageSize = 5
    }) => {
        const response = await api.get("/admin/dentists", {
            params: {
                pageNumber,
                pageSize
            }
        });
        return response.data;
    },

    getDentistById: async (id) => {
        const response = await api.get(`admin/dentists/${id}`);
        return response.data;
    },
     // Create Dentist
    createDentist: async (payload) => {
        const response = await api.post(
            "/admin/dentists/create",
            payload
        );
        return response.data;
    },

    // Update Dentist
    updateDentist: async (id, payload) => {
        const response = await api.put(
            `/admin/dentists/update/${id}`,
            payload
        );
        return response.data;
    },
    deleteDentist: async (id) => {
        const response = await api.delete(
            `admin/dentists/delete/${id}`
        );
        return response.data;
    }
};

export default dentistService;
