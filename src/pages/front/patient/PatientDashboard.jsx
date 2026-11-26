
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardView from "../../../components/ui/CardView";
import {
  CalendarDays,
  CheckCircle2,
  Stethoscope,
  ClipboardList,
  Clock3,
  Plus, 
  CalendarCheck,
  ChevronRight,
  CircleCheck,
  CircleX,
} from "lucide-react";

import { getPatientAppointments,myTreatments } from "../../../services/patients/appointmentService";
import pageTitle from "../../../hooks/usePageTitle";
const PatientDashboard = ({ patientName = "Sarah Johnson" }) => {
  pageTitle("Patient Dashboard");
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("dentalcare_user") || null);
  patientName = user?.fullName || patientName;
  const appointments = appointmentsData;
  

 // const treatments = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getStatus = (appointment) =>
    String(appointment.status || "Pending").toLowerCase();

  // Your data contains formatted dates such as:
  // "Tuesday, October 06, 2026"
  const getAppointmentDate = (appointment) => {
    const date = new Date(appointment.appointmentDate);

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
      color: "text-indigo-600",
      bg: "bg-indigo-50",
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
    if (!value) return "Date unavailable";

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (String(status || "Pending").toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "confirmed":
        return "bg-indigo-100 text-indigo-700";
      case "cancelled":
      case "canceled":
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

const statusIcons = {
  Pending: Clock3,
  Confirmed: CalendarCheck,
  Completed: CircleCheck,
  Cancelled: CircleX,
};

useEffect(() => {
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getPatientAppointments();
            setAppointmentsData(data);
            const treatmentsData = await myTreatments();
            setTreatments(treatmentsData?.data?.data || []); // Adjust based on the actual structure of the response
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
    <section className="py-20">
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 py-10">
        {/* Welcome banner */}
        <section className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-linear-to-r from-indigo-600 to-blue-700 p-6 text-white shadow-sm sm:flex-row sm:items-center sm:p-8">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Hello, {patientName}!
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
              Manage your dental appointments, view upcoming visits,
              and access your medical records.
            </p>
          </div>

          <Link
            to="/patient/book/appointments"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 shadow transition hover:bg-indigo-50"
          >
            <Plus size={18} />
            Book Appointment
          </Link>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat,idx) =>(
            <CardView
            key={idx}
            icon={stat.icon}
            title={stat.title}
            bg={stat.bg}
            color={stat.color}
            value={stat.value}
            />
          ))} 
        </section>

        {/* Appointment lists */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Upcoming appointments */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
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
                to="/patient/book/appointments/"
                aria-label="Book appointment"
                className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
              >
                <Plus size={22} />
              </Link>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="p-8 text-center">
                <CalendarDays
                  size={28}
                  className="mx-auto mb-3 text-indigo-500"
                />
                <p className="text-sm text-gray-500">
                  You have no upcoming appointments.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {upcomingAppointments.map((appointment) =>  {
                   const StatusIcon = statusIcons[appointment.status] || Clock3;
                 return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between gap-3 p-5 transition hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-900">
                        {appointment.serviceName}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {appointment.dentistName}  &bull; {appointment.dentistSpecialization}
                      </p>

                      <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                        <CalendarDays size={14} />
                        {formatDate(getAppointmentDate(appointment))}
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock3 size={14} />
                        {appointment.startTime} - {appointment.endTime}
                      </p>

                      <p className="mt-1 text-xs font-medium text-gray-600">
                        ${Number(appointment.servicePrice || 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="shrink-0 space-y-2 text-right">
                     
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(appointment.status)}`}
                      >
                        <StatusIcon size={13} />
                        {appointment.status} 
                      </span>

                      <Link
                        to={`/patient/appointments/${appointment.id}`}
                        className="flex items-center justify-end gap-1 text-xs font-medium text-indigo-600 hover:underline"
                      >
                        View Details
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past visits */}
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
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                View All
              </Link>
            </div>

            {pastAppointments.length === 0 ? (
              <div className="p-8 text-center">
                <ClipboardList
                  size={28}
                  className="mx-auto mb-3 text-purple-500"
                />
                <p className="text-sm text-gray-500">
                  You don't have any past visits yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 h-80 overflow-y-scroll">
                {pastAppointments.map((appointment) => {
                  const StatusIcon = statusIcons[appointment.status];
                  return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between gap-3 p-5 transition hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-900">
                        {appointment.serviceName}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {appointment.dentistName}
                      </p>

                      <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                        <CalendarDays size={14} />
                        {formatDate(getAppointmentDate(appointment))}
                      </p>
                    </div>

                    <div className="shrink-0 space-y-2 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(appointment.status)}`}
                      >
                        <StatusIcon size={13} />
                        {appointment.status}
                      </span>

                      <Link
                        to={`/patient/appointments/${appointment.id}`}
                        className="flex items-center justify-end gap-1 text-xs font-medium text-indigo-600 hover:underline"
                      >
                        View
                        <ChevronRight size={14} />
                      </Link>
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
    </section>
  );
};

export default PatientDashboard;
