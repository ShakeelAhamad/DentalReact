
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock,
  RefreshCw,
  Eye,
  Filter,
  ClipboardList,
  CalendarCheck,
  CircleCheck,
  CircleX,
  Clock3
} from "lucide-react";

import appointmentService from "../../../services/appointmentService";
import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import pageTitle from "../../../hooks/usePageTitle";
import {
  appointmentFilters,
} from "../../../data/appointmentsData";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusIcons = {
  pending: Clock3,
  confirmed: CalendarCheck,
  completed: CircleCheck,
  cancelled: CircleX,
};

const formatDate = (value) => {
  if (!value) return "—";

  // Parse a date-only value in local time to avoid timezone shifts.
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
};

const formatTime = (value) => {
  if (!value) return "—";

  // Already formatted: 12:00 PM
  if (/\b(AM|PM)\b/i.test(value)) {
    return value;
  }

  // Convert 24-hour format: 12:00:00
  const [hours, minutes] = value.split(":");

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

function Appointments() {
  pageTitle("Appointments");
  const [appointments, setAppointments] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All Bookings");
  const [status, setStatus] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [pageNumber, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await appointmentService.getAppointments({
        status,
        date: appliedDate,
        pageNumber,
        pageSize,
      });
      // Supports either a paginated response or a plain array.
      const records = Array.isArray(data.data) ? data.data : data.data ?? [];
      setAppointments(records);
      setTotalCount(
        Array.isArray(data) ? data.totalRecords : data.totalRecords ?? records.totalRecords
      );
    } catch (err) {
      setAppointments([]);
      setTotalCount(0);
      toast.error(err.response?.data?.message ||
        "Unable to load appointments. Please check your API connection.");
      setError(
        err.response?.data?.message ||
        "Unable to load appointments. Please check your API connection."
      );
    } finally {
      setLoading(false);
    }
  }, [status, appliedDate, pageNumber, pageSize]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const changeStatus = (value) => {
    if (value === "All Bookings") {
      setStatus("");
    } else {
      setStatus(value);
    }
    setActiveFilter(value);
    setPage(1);
  };

  const applyDateFilter = (event) => {
    event.preventDefault();
    setAppliedDate(dateInput);
    setPage(1);
  };

  const resetFilters = () => {
    setStatus("");
    setDateInput("");
    setAppliedDate("");
    setPage(1);
  };

  const getFilterStyle = (filter) => {
    if (activeFilter === filter) {
      return "bg-indigo-600 text-white border-indigo-600";
    }

    const colors = {
      Pending: "text-amber-700 hover:bg-amber-50",
      Confirmed: "text-green-700 hover:bg-green-50",
      Completed: "text-purple-700 hover:bg-purple-50",
      Cancelled: "text-red-700 hover:bg-red-50",
    };

    return `bg-white border-gray-200 ${colors[filter] || "text-gray-600 hover:bg-gray-50"}`;
  };


  const columns = [
    {
      key: "appointmentDate",
      header: "Date & Time",
      render: (app) => (
        <>
          <div className="font-semibold text-gray-900">
            {formatDate(app.appointmentDate)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
            <Clock size={13} />
            {formatTime(app.startTime)} - {formatTime(app.endTime)}
          </div>
        </>
      ),
    },
    {
      key: "patientName",
      header: "Patient",
      render: (app) => (
        <>
          <div className="font-semibold text-gray-900">
            {app.patientName ?? "Patient"}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {app.patientPhone ?? ""}
          </div>
        </>
      ),
    },
    {
      key: "dentistName",
      header: "Dentist",
      render: (app) => (
        <>
          <div className="font-medium text-gray-800">
            {app.dentistName ?? "Dentist"}
          </div>
          <div className="mt-1 text-xs text-teal-600">
            {app.dentistSpecialization ?? ""}
          </div>
        </>
      ),
    },
    {
      key: "serviceName",
      header: "Service",
      render: (app) => (
        <>
          <div className="font-medium text-gray-800">
            {app.serviceName ?? "General"}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            ${Number(app.servicePrice ?? 0).toFixed(2)}
          </div>
        </>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (app) => {
        const normalizedStatus = String(
          app.status ?? "pending"
        ).toLowerCase();

        const StatusIcon = statusIcons[normalizedStatus] ?? Clock3;

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[normalizedStatus] ??
              "bg-gray-100 text-gray-600"
              }`}
          >
            <StatusIcon size={13} />
            {normalizedStatus.charAt(0).toUpperCase() +
              normalizedStatus.slice(1)}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (app) => (
        <Link
          to={`/admin/appointments/${app.id}`}
          className="inline-flex items-center gap-1.5 whitespace-nowrap font-semibold text-blue-600 hover:text-blue-800"
        >
          <Eye size={15} />
          View / Manage
        </Link>
      ),
    },
  ];


  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Appointments
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Clinic Appointment Bookings
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAppointments}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg
                     border border-gray-200 bg-white px-4 py-2 text-sm
                     font-medium text-gray-700 hover:bg-gray-50
                     disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">

        {/* Filter Heading */}
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Filter size={17} />
          Filter appointments
        </div>

        {/* Responsive Filter Content */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-2">

            {appointmentFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => changeStatus(filter)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition cursor-pointer ${getFilterStyle(filter)}`}
              >
                {filter === "All Bookings" && (
                  <ClipboardList size={14} />
                )}

                {filter === "Pending" && <Clock3 size={14} />}

                {filter === "Confirmed" && (
                  <CalendarCheck size={14} />
                )}

                {filter === "Completed" && (
                  <CircleCheck size={14} />
                )}

                {filter === "Cancelled" && (
                  <CircleX size={14} />
                )}

                {filter}
              </button>
            ))}

          </div>

          {/* Date Filter */}
          <form
            onSubmit={applyDateFilter}
            className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto] lg:flex lg:items-center"
          >

            {/* Date Input */}
            <div className="relative min-w-0 sm:min-w-[200px]">
              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="date"
                value={dateInput}
                onChange={(event) => setDateInput(event.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Apply Filter */}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer"
            >
              <Filter size={14} />
              Filter
            </button>

            {/* Reset Filter */}
            {(status || appliedDate) && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Reset
              </button>
            )}

          </form>

        </div>
      </div>

      <div className="space-y-4 bg-white">
        {/* Table Heading */}
        <div className="flex items-center justify-between rounded-xl px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Appointment List
          </h2>

          <span className="text-xs text-gray-500">
            {totalCount} records
          </span>
        </div>

        {/* Reusable Table */}
        <DataTable
          columns={columns}
          data={appointments}
          loading={loading}
          error={error}
          rowKey="id"
          emptyMessage="No appointments found."
          loadingMessage="Loading appointments..."
          minWidth="900px"
        />

        {/* Reusable Pagination */}
        {!loading && !error && (
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
        )}

      </div>

    </div>
  );
}

export default Appointments;
