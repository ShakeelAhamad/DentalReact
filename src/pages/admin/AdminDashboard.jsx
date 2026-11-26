
import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import CardView from "../../components/ui/CardView";
import appointmentService from "../../services/appointmentService";
import pageTitle from "../../hooks/usePageTitle";
import {
  CalendarDays,
  CheckCircle2,
  Stethoscope,
  ClipboardList,
  WineOff,
  Clock3,
  DatabaseCheck,
  CalendarClock,
  CircleCheck,
  CalendarCheck,
  ChevronRight,
  CircleCheckBig,
  CircleX,
  HourglassCog,
} from "lucide-react";
const Dashboard = () => {
  pageTitle("Admin Dashboard");
  const [appointments, setAppointments] = useState([]);
  const [stateData, setStateData] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    totalPatients: 0,
    totalDentists: 0,
    totalServices: 0,
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentService.getAppointments();
        const statsResponse = await appointmentService.getStatusCounts();
        setStateData({
          totalAppointments: statsResponse?.data?.totalAppointments || 0,
          pendingAppointments: statsResponse?.data?.pendingAppointments || 0,
          confirmedAppointments: statsResponse?.data?.confirmedAppointments || 0,
          completedAppointments: statsResponse?.data?.completedAppointments || 0,
          cancelledAppointments: statsResponse?.data?.cancelledAppointments || 0,
          totalPatients: statsResponse?.data?.totalPatients || 0,
          totalDentists: statsResponse?.data?.totalDentists || 0,
          totalServices: statsResponse?.data?.totalServices || 0,
        });
        if (response?.data?.length > 0) {
          setAppointments(response.data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);
  // const appointments = appointmentsData;
  const treatments = [];
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
      title: "Total Bookings",
      value: stateData.totalAppointments,
      icon: ClipboardList,
      color: "text-gray-800",
      bg: "bg-gray-100",
    },
    {
      title: "Pending Action",
      value: stateData.pendingAppointments,
      icon: CalendarDays,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Dentists",
      value: stateData.totalDentists,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Registered Patients",
      value: stateData.totalPatients,
      icon: Stethoscope,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Total",
      value: stateData.totalAppointments,
      icon: WineOff,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Pending",
      value: stateData.pendingAppointments,
      icon: Clock3,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Confirmed",
      value: stateData.confirmedAppointments,
      icon: DatabaseCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Completed",
      value: stateData.completedAppointments,
      icon: CircleCheckBig,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Total Services",
      value: stateData.totalServices,
      icon: HourglassCog,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      title: "Total Cancelled",
      value: stateData.cancelledAppointments,
      icon: CircleX,
      color: "text-red-600",
      bg: "bg-red-50",
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
    pending: Clock3,
    confirmed: CalendarCheck,
    completed: CircleCheck,
    cancelled: CircleX,
  };
  const currentDateTime = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <>
      <div>
        {/* card grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {stats.map((stat, idx) => (
            <CardView
              key={idx}
              icon={stat.icon}
              title={stat.title}
              bg={stat.bg}
              color={stat.color}
              value={stat.value}
            />
          ))}
        </div>
        {/* Appointment lists */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6'>
          {/* Upcoming appointments */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                  <Clock3 size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Today's Appointments (0)
                  </h2>

                </div>
              </div>

              <p className='mt-1 text-xs text-gray-400'>
                {currentDateTime}
              </p>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="p-8 text-center">
                <CalendarDays
                  size={28}
                  className="mx-auto mb-3 text-indigo-500"
                />
                <p className="text-sm text-gray-500">
                  You have no appointments scheduled for today.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {upcomingAppointments.map((appointment) => {
                  const status = appointment?.status?.trim()?.toLowerCase();
                  const StatusIcon = statusIcons[status] || Clock3;
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

          {/* Recent Appointments */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
                  <CalendarClock size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Recent Appointments
                  </h2>
                </div>
              </div>

              <Link
                to="/admin/appointments"
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
                  const status = appointment?.status?.trim()?.toLowerCase();
                  const StatusIcon = statusIcons[status];
                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between gap-3 p-5 transition hover:bg-gray-50"
                    >
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-gray-900">
                          {appointment.patientName}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {appointment.serviceName}
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
                          to={`/admin/appointments/${appointment.id}`}
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
        </div>
      </div>
    </>
  )
}

export default Dashboard