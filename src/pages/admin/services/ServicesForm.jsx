
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  BriefcaseMedical,
  FileText,
  Clock,
  DollarSign,
  Activity,
  Loader2,
  CheckCircle,
} from "lucide-react";

import toast from "react-hot-toast";
import ServicesService from "../../../services/servicesService";
import usePageTitle from "../../../hooks/usePageTitle";

const ServiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  usePageTitle(isEdit ? "Edit Service" : "Add Service");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 30,
    price: "0.00",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  // Load existing service for edit
  useEffect(() => {
    if (!isEdit) return;

    let isMounted = true;

    const fetchService = async () => {
      try {
        setLoading(true);

        const response = await ServicesService.getServiceById(id);

        // Supports both wrapped and unwrapped API responses
        const service = response?.data ?? response;

        if (!service) {
          throw new Error("Service not found.");
        }

        if (isMounted) {
          setFormData({
            name: service.name ?? "",
            description: service.description ?? "",
            duration: service.duration ?? 30,
            price: service.price ?? "0.00",
            status:
              typeof service.status === "boolean"
                ? service.status
                  ? "active"
                  : "inactive"
                : String(service.status ?? "active").toLowerCase(),
          });
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            error.response?.data?.message || error.message || "Failed to load service."
          );
          navigate("/admin/services");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchService();

    return () => {
      isMounted = false;
    };
  }, [id, isEdit, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Service name is required.";
    }

    const duration = Number(formData.duration);

    if (
      formData.duration === "" ||
      !Number.isInteger(duration) ||
      duration < 5 ||
      duration > 480
    ) {
      newErrors.duration = "Duration must be between 5 and 480 minutes.";
    }

    const price = Number(formData.price);

    if (
      formData.price === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      newErrors.price = "Please enter a valid price.";
    }

    if (!["active", "inactive"].includes(formData.status)) {
      newErrors.status = "Please select a valid status.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        duration: Number(formData.duration),
        price: Number(formData.price),
        status: formData.status === "active",
      };

      let response;

      if (isEdit) {
        response = await ServicesService.updateService(id, payload);
      } else {
        response = await ServicesService.addService(payload);
      }

      if (response?.success === false) {
        toast.error(response.message || "Operation failed.");
        return;
      }

      toast.success(
        response?.message ||
        (isEdit
          ? "Service updated successfully!"
          : "Service created successfully!")
      );

      navigate("/admin/services");
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        const apiErrors = {};

        Object.entries(responseData.errors).forEach(([key, value]) => {
          apiErrors[key.toLowerCase()] = Array.isArray(value)
            ? value[0]
            : value;
        });

        setErrors(apiErrors);
      }

      toast.error(
        responseData?.message ||
        (isEdit
          ? "Failed to update service."
          : "Failed to create service.")
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border ${errors[field] ? "border-red-400" : "border-gray-200"
    } bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition
    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100`;

  // Full page loading while fetching existing service
  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
        <Loader2 size={42} className="animate-spin text-indigo-600" />
        <p className="mt-4 text-sm font-semibold text-gray-700">
          Loading service information...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Full page saving overlay */}
      {saving && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <Loader2 size={42} className="animate-spin text-indigo-600" />
          <p className="mt-4 text-sm font-semibold text-gray-700">
            {isEdit ? "Updating service..." : "Creating service..."}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Please wait while we save your information.
          </p>
        </div>
      )}

      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Services</span>
              <span>/</span>
              <span className="text-indigo-600">
                {isEdit ? "Edit" : "Create"}
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-gray-800">
              {isEdit ? "Update Service" : "Add New Service"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "Update the existing dental service information."
                : "Add a new dental service to your clinic."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/services")}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 cursor-pointer"
          >
            <ArrowLeft size={17} />
            Back to Services
          </button>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

          {/* Card Header */}
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <BriefcaseMedical size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-800">
                  Service Information
                </h2>
                <p className="text-xs text-gray-500">
                  {isEdit
                    ? "Modify your dental service details."
                    : "Enter the details of your dental service."}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">

            {/* Service Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Service Name <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <BriefcaseMedical
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="e.g. Teeth Whitening"
                  className={`${inputClass("name")} pl-10`}
                />
              </div>

              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <div className="relative">
                <FileText
                  size={17}
                  className="absolute left-3 top-3 text-gray-400"
                />

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={saving}
                  rows={4}
                  placeholder="Short description of the procedure..."
                  className={`${inputClass("description")} resize-none pl-10`}
                />
              </div>

              {errors.description && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Duration and Price */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Duration */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Clock
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    disabled={saving}
                    min="5"
                    max="480"
                    step="5"
                    className={`${inputClass("duration")} pl-10`}
                  />
                </div>

                {errors.duration && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.duration}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price ($) <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <DollarSign
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={saving}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className={`${inputClass("price")} pl-10`}
                  />
                </div>

                {errors.price && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.price}
                  </p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <Activity
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={saving}
                  className={`${inputClass("status")} appearance-none pl-10`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {errors.status && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.status}
                </p>
              )}
            </div>

            {/* Status Preview */}
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle size={17} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  Service Status
                </span>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${formData.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
                  }`}
              >
                {formData.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center">

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {saving ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Save size={17} />
                )}

                {isEdit ? "Update Service" : "Save Service"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/services")}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200 cursor-pointer"
              >
                <X size={17} />
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default ServiceForm;
