
import api from "../config/api";

const appointmentService = {
  async getAppointments({
    status = "",
    date = "",
    pageNumber = 1,
    pageSize = 10,
  } = {}) {
    const response = await api.get("/admin/appointments", {
      params: {
        status: status || undefined,
        date: date || undefined,
        pageNumber,
        pageSize,
      },
    });

    const result = response.data;
    if (result?.success !== true) {
      throw new Error(
        result?.message || "Failed to retrieve appointments."
      );
    }

    return result.data;
  },

  async getAppointmentById(id) {
    const response = await api.get(`/admin/appointments/${id}`);
    return response.data;
  },
    // Update appointment status
  updateStatus: async (id, status) => {
    const response = await api.put(`admin/appointments/update-status/${id}?status=${status}`);
    return response.data;
  },

  // Delete appointment
  delete: async (id) => {
    const response = await api.delete(`admin/appointments/delete/${id}`);
    return response.data;
  },

  // Get appointment status counts
  getStatusCounts: async () => {
    const response = await api.get("admin/dashboard-stats");
    return response.data;
  }

};

export default appointmentService;