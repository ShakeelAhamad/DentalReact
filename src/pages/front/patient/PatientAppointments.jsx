
import {useEffect,useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  UserRound,
  Wallet,
  Plus,
  ClipboardList,
  CalendarCheck,
  CircleCheck,
  CircleX,
  Clock3,
  ChevronRight,
  Filter,
} from "lucide-react";
import { getPatientAppointments } from "../../../services/patients/appointmentService";
import usePageTitle from "../../../hooks/usePageTitle";


import {
  appointmentFilters,
} from "../../../data/appointmentsData";

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-green-100 text-green-700",
  Completed: "bg-purple-100 text-purple-700",
  Cancelled: "bg-red-100 text-red-700",
};

const statusIcons = {
  Pending: Clock3,
  Confirmed: CalendarCheck,
  Completed: CircleCheck,
  Cancelled: CircleX,
};

const MyAppointments = () => {
  usePageTitle("My Appointments");
  const [activeFilter, setActiveFilter] = useState("All Bookings");
  const [searchTerm, setSearchTerm] = useState("");

  const [appointmentsData, setAppointmentsData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredAppointments = useMemo(() => {
    return appointmentsData.filter((appointment) => {
        const matchesStatus =
            activeFilter === "All Bookings" ||
            appointment.status === activeFilter;

        const searchText = searchTerm.toLowerCase().trim();

        const matchesSearch =
            appointment.serviceName.toLowerCase().includes(searchText) ||
            appointment.dentistName.toLowerCase().includes(searchText) ||
            appointment.dentistSpecialization.toLowerCase().includes(searchText);

        return matchesStatus && matchesSearch;
    });
}, [appointmentsData, activeFilter, searchTerm]);

  const formatDate = (date) => {
    if (!date) {
        return { month: "", day: "" };
    }

    let parsedDate;

    // Format: 2026-09-15
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        parsedDate = new Date(`${date}T12:00:00`);
    }
    // Format: Oct 06, 2026
    else {
        parsedDate = new Date(date);
    }

    // Handle invalid dates
    if (isNaN(parsedDate.getTime())) {
        return { month: "", day: "" };
    }

    return {
        month: parsedDate.toLocaleDateString("en-US", {
            month: "short",
        }),
        day: parsedDate.toLocaleDateString("en-US", {
            day: "2-digit",
        }),
    };
};


  const filterCounts = useMemo(() => {
    return {
        "All Bookings": appointmentsData.length,

        ...Object.fromEntries(
            appointmentFilters
                .filter((filter) => filter !== "All Bookings")
                .map((filter) => [
                    filter,
                    appointmentsData.filter(
                        (appointment) => appointment.status === filter
                    ).length,
                ])
        ),
    };
}, [appointmentsData]);

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


  useEffect(() => {
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getPatientAppointments();

            setAppointmentsData(data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to load appointments."
            );
        } finally {
            setLoading(false);
        }
    };

    fetchAppointments();
}, []);
  return (
    <section className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-25">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Appointments
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track your dental appointments.
            </p>
          </div>

          <a
            href="/patient/book/appointments"
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Book New Appointment
          </a>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-2">
          {appointmentFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${getFilterStyle(filter)}`}
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

              <span
                className={`rounded-full px-1.5 py-0.5 ${
                  activeFilter === filter
                    ? "bg-white/20"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {filterCounts[filter]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-md">
            <Filter
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search service, dentist..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredAppointments.length}
            </span>{" "}
            of {appointmentsData.length} appointments
          </p>
        </div>

        {/* Appointment list */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                    <span className="ml-3 text-sm text-gray-500">
                        Loading appointments...
                    </span>
                </div>
            ) : error ? (
                <div className="py-12 text-center">
                    <p className="text-sm text-red-600">{error}</p>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredAppointments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredAppointments.map((appointment) => {
                const { month, day } = formatDate(appointment.bookedDate);
                const StatusIcon = statusIcons[appointment.status];

                return (
                  <div
                    key={appointment.id}
                    className="flex flex-col justify-between gap-4 p-6 transition hover:bg-gray-50 md:flex-row md:items-center"
                  >
                    {/* Date and appointment details */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600">
                        <span className="text-xs uppercase">
                          {month}
                        </span>
                        <span className="text-lg leading-tight">
                          {day}
                        </span>
                      </div>

                      <div className="min-w-0 space-y-2">
                        <h3 className="text-base font-bold text-gray-900">
                          {appointment.serviceName}
                        </h3>

                        <p className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
                          <UserRound
                            size={15}
                            className="shrink-0 text-gray-400"
                          />
                          Dentist:
                          <strong className="text-gray-800">
                            {appointment.dentistName}
                          </strong>
                        </p>

                        <p className="text-sm text-gray-500">
                          {appointment.dentistSpecialization}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock size={14} />
                            {appointment.startTime} -{" "}
                            {appointment.endTime}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Wallet size={14} />
                            Estimated $
                            {Number(appointment.servicePrice || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status and action */}
                    <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3 md:justify-end md:border-0 md:pt-0">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[appointment.status]}`}
                      >
                        <StatusIcon size={13} />
                        {appointment.status}
                      </span>

                      <a
                        href={`/patient/appointments/${appointment.id}`}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
                      >
                        View Details
                        <ChevronRight size={14} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 rounded-full bg-indigo-50 p-4 text-indigo-600">
                <CalendarDays size={32} />
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                No appointments found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-gray-500">
                Try another status filter or search for a different
                dentist or service.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveFilter("All Bookings");
                  setSearchTerm("");
                }}
                className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyAppointments;
