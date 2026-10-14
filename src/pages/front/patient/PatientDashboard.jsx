import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Stethoscope,
  ClipboardList,
  Clock3,
  Plus,
  ArrowUpRight,
  CalendarCheck,
  ChevronRight,
} from "lucide-react";

const PatientDashboard = ({
  patientName = "Patient",
  appointments = [],
  treatments = [],
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getStatus = (appointment) =>
    String(appointment.status || "Pending").toLowerCase();

  const getAppointmentDate = (appointment) => {
    const value = appointment.appointmentDate || appointment.date;
    if (!value) return null;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const isUpcoming = (appointment) => {
    const date = getAppointmentDate(appointment);
    const status = getStatus(appointment);

    return (
      date &&
      date >= today &&
      !["completed", "cancelled", "canceled", "rejected"].includes(status)
    );
  };

  const completedAppointments = appointments.filter(
    (appointment) => getStatus(appointment) === "completed"
  );

  const upcomingAppointments = appointments
    .filter(isUpcoming)
    .sort(
      (a, b) =>
        (getAppointmentDate(a)?.getTime() || 0) -
        (getAppointmentDate(b)?.getTime() || 0)
    );

  const pastAppointments = appointments
    .filter((appointment) => {
      const date = getAppointmentDate(appointment);
      return (
        date &&
        (date < today || getStatus(appointment) === "completed")
      );
    })
    .sort(
      (a, b) =>
        (getAppointmentDate(b)?.getTime() || 0) -
        (getAppointmentDate(a)?.getTime() || 0)
    );

  const stats = [
    {
      title: "Upcoming",
      value: upcomingAppointments.length,
      icon: CalendarDays,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Completed",
      value: completedAppointments.length,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Treatments",
      value: treatments.length,
      icon: Stethoscope,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Total Bookings",
      value: appointments.length,
      icon: ClipboardList,
      color: "text-gray-800",
      bg: "bg-gray-100",
    },
  ];

  const formatDate = (value) => {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getServiceName = (appointment) =>
    appointment.service?.name ||
    appointment.serviceName ||
    appointment.service?.serviceName ||
    "Dental Appointment";

  const getDentistName = (appointment) => {
    const name =
      appointment.dentist?.fullName ||
      appointment.dentistName ||
      appointment.dentist?.user?.username;

    if (!name) return "Dentist not assigned";

    return name.startsWith("Dr.") ? name : `Dr. ${name}`;
  };

  const getStatusStyle = (status) => {
    switch (String(status || "Pending").toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getAppointmentId = (appointment) =>
    appointment.id ?? appointment.appointmentId;

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
    <div className="space-y-8 py-25">
      {/* Welcome Banner */}
      <section className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-sm sm:flex-row sm:items-center sm:p-8">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Hello, {patientName}!
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
            Manage your dental appointments, view upcoming visits, and access
            your medical records.
          </p>
        </div>

        <Link
          to="/patient/appointments/book"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-600 shadow transition hover:bg-blue-50"
        >
          <Plus size={18} />
          Book Appointment
        </Link>
      </section>

      {/* Dynamic Statistics */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {stat.title}
                </span>

                <div className={`rounded-lg p-2 ${stat.bg}`}>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>

              <p className={`mt-3 text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Appointments and Past Visits */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <CalendarCheck size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Upcoming Appointments
                </h2>
                <p className="mt-1 text-xs text-gray-400">
                  Your next dental visits
                </p>
              </div>
            </div>

            <Link
              to="/patient/appointments/book"
              aria-label="Book appointment"
              className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
            >
              <Plus size={22} />
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                <CalendarDays size={27} />
              </div>

              <p className="text-sm text-gray-500">
                You have no upcoming appointments.
              </p>

              <Link
                to="/patient/appointments/book"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
              >
                Book Your First Appointment
                <ArrowUpRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {upcomingAppointments.map((appointment) => {
                const id = getAppointmentId(appointment);

                return (
                  <div
                    key={id ?? `${getServiceName(appointment)}-${getAppointmentDate(appointment)?.getTime()}`}
                    className="flex items-center justify-between gap-3 p-5 transition hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-900">
                        {getServiceName(appointment)}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {getDentistName(appointment)}
                      </p>

                      <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                        <CalendarDays size={14} />
                        {formatDate(getAppointmentDate(appointment))}
                      </p>
                    </div>

                    <div className="shrink-0 space-y-2 text-right">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusStyle(appointment.status)}`}
                      >
                        {appointment.status || "Pending"}
                      </span>

                      {id != null && (
                        <Link
                          to={`/patient/appointments/${id}`}
                          className="flex items-center justify-end gap-1 text-xs font-medium text-blue-600 hover:underline"
                        >
                          View Details
                          <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Visits */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
                <Clock3 size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Past Visits
                </h2>
                <p className="mt-1 text-xs text-gray-400">
                  Your appointment history
                </p>
              </div>
            </div>

            <Link
              to="/patient/appointments"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </Link>
          </div>

          {pastAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-purple-500">
                <ClipboardList size={27} />
              </div>

              <p className="text-sm text-gray-500">
                You don't have any past visits yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pastAppointments.map((appointment) => {
                const id = getAppointmentId(appointment);

                return (
                  <div
                    key={id ?? `${getServiceName(appointment)}-${getAppointmentDate(appointment)?.getTime()}`}
                    className="flex items-center justify-between gap-3 p-5 transition hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-900">
                        {getServiceName(appointment)}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {getDentistName(appointment)}
                      </p>

                      <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                        <CalendarDays size={14} />
                        {formatDate(getAppointmentDate(appointment))}
                      </p>
                    </div>

                    <div className="shrink-0 space-y-2 text-right">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusStyle(appointment.status)}`}
                      >
                        {appointment.status || "Pending"}
                      </span>

                      {id != null && (
                        <Link
                          to={`/patient/appointments/${id}`}
                          className="flex items-center justify-end gap-1 text-xs font-medium text-blue-600 hover:underline"
                        >
                          View
                          <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
    </div>
  );
};

export default PatientDashboard;
