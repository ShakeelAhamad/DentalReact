
import api from "../config/api";

const BASE_URL = "/admin/services";

const ServicesService = {
  // Get all services
  getAllService: async (params = {}) => {
    const response = await api.get(BASE_URL, { params });
    return response.data.data ?? response.data;
  },

  // Get service by ID
  getServiceById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data.data ?? response.data;
  },

  // Add new service
  addService: async (serviceData) => {
    const response = await api.post(`${BASE_URL}/create`, serviceData);
    return response.data;
  },

  // Update existing service
  updateService: async (id, serviceData) => {
    const response = await api.put(`${BASE_URL}/update/${id}`, serviceData);
    return response.data;
  },

  // Delete service
  deleteService: async (id) => {
    const response = await api.delete(`${BASE_URL}/delete/${id}`);
    return response.data;
  },
};

export default ServicesService;
