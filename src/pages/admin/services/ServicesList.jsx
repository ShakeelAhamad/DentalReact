
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  BriefcaseMedical,
  AlertCircle,
} from "lucide-react";

import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import ServicesService from "../../../services/servicesService";
import usePageTitle from "../../../hooks/usePageTitle";

const ServicesList = () => {
  const navigate = useNavigate();
  usePageTitle("Services");

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  ;

  const [pageNumber, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await ServicesService.getAllService({
        pageNumber: pageNumber,
        pageSize,
      });

      // Adjust according to your API response structure
      const data = response?.data ?? response;
      console.log(response);

      setServices(
        Array.isArray(data)
          ? data
          : data?.items ?? data?.services ?? []
      );
      setTotalCount(response?.totalRecords ?? response?.totalRecords);
    } catch (err) {
      console.error("Fetch services error:", err);
      setTotalCount(0)
      setError(
        err.response?.data?.message || "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [pageNumber, pageSize]);

  // Status
  const isActive = (status) =>
    status === true ||
    ["active", "true", "1"].includes(
      String(status).toLowerCase()
    );

  // Delete service
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      await ServicesService.deleteService(id);

      if (services.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchServices();
      }
    } catch (err) {
      console.error("Delete service error:", err);
      alert(
        err.response?.data?.message || "Unable to delete service."
      );
    }
  };

  // DataTable columns
  const columns = [
    {
      key: "name",
      header: "Service Name",
      render: (service) => (
        <div>
          <p className="font-medium text-gray-900">
            {service.name}
          </p>

          {service.description && (
            <p className="mt-1 max-w-md truncate text-xs text-gray-400">
              {service.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      render: (service) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Clock size={15} className="text-gray-400" />
          {service.duration} mins
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (service) => (
        <div className="flex items-center font-semibold text-gray-900">
          <IndianRupee size={15} />
          {Number(service.price ?? 0).toFixed(2)}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (service) =>
        isActive(service.status) ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
            <CheckCircle2 size={14} />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            <XCircle size={14} />
            Inactive
          </span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (service) => (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(`/admin/services/${service.id}/edit`)
            }
            title="Edit Service"
            className="text-indigo-600 transition hover:text-indigo-800 cursor-pointer"
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            onClick={() => handleDelete(service.id)}
            title="Delete Service"
            className="text-red-500 transition hover:text-red-700 cursor-pointer"
          >
            <Trash2 size={17} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Dental Services
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage services offered by the clinic.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/services/create")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 cursor-pointer"
        >
          <Plus size={18} />
          Add New Service
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Services Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-800">
            All Services ({totalCount})
          </h2>

          <BriefcaseMedical
            size={20}
            className="text-gray-400"
          />
        </div>

        <DataTable
          columns={columns}
          data={services}
          loading={loading}
          emptyMessage="No services found."
        />

        {/* Reusable Pagination */}
        {!loading && totalCount > 0 && (
          <div className="border-t border-gray-100 p-4">
            <Pagination
              currentPage={pageNumber}
              totalRecords={totalCount}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesList;
