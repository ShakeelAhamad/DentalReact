import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Plus,
  Clock3,
  Stethoscope,
  ClipboardList,
  CheckCircle2,
  Clock,
  CircleCheck,
  ChevronRight,
  CalendarX,
  DollarSign,
} from "lucide-react";

const PatientAppointments = ({ appointments = [] }) => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { label: "All Bookings", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
  ];

  const getStatus = (appointment) =>
    String(appointment.status || "Pending").toLowerCase();

  const getAppointmentId = (appointment) =>
    appointment.id ?? appointment.appointmentId;

  const getAppointmentDate = (appointment) => {
    const value = appointment.appointmentDate || appointment.date;
    if (!value) return null;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const formatDate = (date) => {
    if (!date) return { month: "--", day: "--", full: "Date unavailable" };

    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      day: date.toLocaleDateString("en-US", { day: "2-digit" }),
      full: date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };
  };

  const getServiceName = (appointment) =>
    appointment.service?.name ||
    appointment.service?.serviceName ||
    appointment.serviceName ||
    "Dental Appointment";

  const getDentistName = (appointment) => {
    const name =
      appointment.dentist?.fullName ||
      appointment.dentistName ||
      appointment.dentist?.user?.username;

    if (!name) return "Not assigned";

    return name.startsWith("Dr.") ? name : `Dr. ${name}`;
  };

  const getSpecialization = (appointment) =>
    appointment.dentist?.specialization ||
    appointment.specialization ||
    "Dental Care";

  const getStartTime = (appointment) =>
    appointment.startTime || appointment.time || "";

  const getEndTime = (appointment) => appointment.endTime || "";

  const formatTime = (time) => {
    if (!time) return "";

    // Supports TimeOnly values such as "11:00:00".
    const match = String(time).match(/^(\d{1,2}):(\d{2})/);

    if (!match) return time;

    const hours = Number(match[1]);
    const minutes = match[2];
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;

    return `${formattedHour}:${minutes} ${period}`;
  };

  const getPrice = (appointment) =>
    appointment.service?.price ??
    appointment.estimatedPrice ??
    appointment.price ??
    null;

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") {
      return "Price unavailable";
    }

    const amount = Number(price);

    return Number.isFinite(amount)
      ? `Estimated $${amount.toFixed(2)}`
      : `Estimated ${price}`;
  };

  const statusStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-purple-100 text-purple-700";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const StatusIcon = ({ status }) => {
    if (status === "completed") return <CircleCheck size={14} />;
    if (status === "confirmed") return <CheckCircle2 size={14} />;
    if (status === "cancelled" || status === "canceled") {
      return <CalendarX size={14} />;
    }
    return <Clock size={14} />;
  };

  const filteredAppointments = useMemo(() => {
    return [...appointments]
      .filter((appointment) => {
        if (activeFilter === "all") return true;
        return getStatus(appointment) === activeFilter;
      })
      .sort((a, b) => {
        const dateA = getAppointmentDate(a)?.getTime() ?? 0;
        const dateB = getAppointmentDate(b)?.getTime() ?? 0;
        return dateB - dateA;
      });
  }, [appointments, activeFilter]);

  const counts = useMemo(() => {
    return appointments.reduce(
      (result, appointment) => {
        const status = getStatus(appointment);
        result.all += 1;

        if (result[status] !== undefined) {
          result[status] += 1;
        }

        return result;
      },
      {
        all: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
      }
    );
  }, [appointments]);

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Appointments
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your dental appointments.
          </p>
        </div>

        <Link
          to="/patient/appointments/book"
          className="inline-flex self-start items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Book New Appointment
        </Link>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                isActive
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {filter.label}
              <span
                className={`ml-2 rounded-md px-1.5 py-0.5 ${
                  isActive ? "bg-white/20" : "bg-gray-100"
                }`}
              >
                {counts[filter.value]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Appointment List */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {filteredAppointments.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CalendarDays size={30} />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              No appointments found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
              {activeFilter === "all"
                ? "You haven't booked any dental appointments yet."
                : `You don't have any ${activeFilter} appointments.`}
            </p>

            {activeFilter === "all" && (
              <Link
                to="/patient/appointments/book"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={17} />
                Book Your First Appointment
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredAppointments.map((appointment, index) => {
              const id = getAppointmentId(appointment);
              const date = formatDate(getAppointmentDate(appointment));
              const status = getStatus(appointment);
              const startTime = formatTime(getStartTime(appointment));
              const endTime = formatTime(getEndTime(appointment));
              const price = getPrice(appointment);

              return (
                <div
                  key={
                    id ??
                    `${getServiceName(appointment)}-${getAppointmentDate(appointment)?.getTime() ?? index}`
                  }
                  className="flex flex-col justify-between gap-4 p-5 transition hover:bg-gray-50 sm:p-6 md:flex-row md:items-center"
                >
                  {/* Appointment Information */}
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                      <span className="text-xs uppercase">
                        {date.month}
                      </span>
                      <span className="text-lg leading-tight">
                        {date.day}
                      </span>
                    </div>

                    <div className="min-w-0 space-y-1.5">
                      <h3 className="text-base font-bold text-gray-900">
                        {getServiceName(appointment)}
                      </h3>

                      <p className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
                        <Stethoscope
                          size={14}
                          className="shrink-0 text-gray-400"
                        />
                        Dentist:
                        <strong className="font-semibold text-gray-800">
                          {getDentistName(appointment)}
                        </strong>
                        <span className="text-gray-500">
                          ({getSpecialization(appointment)})
                        </span>
                      </p>

                      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays size={13} />
                          {date.full}
                        </span>

                        {(startTime || endTime) && (
                          <span className="inline-flex items-center gap-1">
                            <Clock3 size={13} />
                            Time: {startTime || "--"}
                            {endTime ? ` - ${endTime}` : ""}
                          </span>
                        )}
                      </p>

                      <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <DollarSign size={13} />
                        {formatPrice(price)}
                      </p>
                    </div>
                  </div>

                  {/* Status and Action */}
                  <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3 md:shrink-0 md:justify-end md:border-t-0 md:pt-0">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles(status)}`}
                    >
                      <StatusIcon status={status} />
                      {appointment.status || "Pending"}
                    </span>

                    {id != null ? (
                      <Link
                        to={`/patient/appointments/${id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
                      >
                        View Details
                        <ChevronRight size={14} />
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Details unavailable
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Summary */}
      <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
        <div className="rounded-lg bg-white p-2 text-blue-600">
          <ClipboardList size={21} />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-800">
            {filteredAppointments.length} appointment
            {filteredAppointments.length !== 1 ? "s" : ""} displayed
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            Use the filters above to view appointments by status.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;