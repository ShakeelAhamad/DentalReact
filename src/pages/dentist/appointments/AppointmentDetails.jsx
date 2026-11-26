
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    CalendarDays,
    Clock3,
    UserRound,
    Mail,
    Phone,
    Stethoscope,
    CheckCircle2,
    ClipboardPlus,
    ArrowLeft,
    LoaderCircle,
    Cake,
    VenusAndMars,
    FileText,
    Activity,
    AlertCircle,
    ClipboardList,
    CheckCircle,
    XCircle,
} from "lucide-react";

import toast from "react-hot-toast";
import appointmentService from "../../../services/dentist/appointmentService";
import usePageTitle from "../../../hooks/usePageTitle";

const statusStyles = {
  pending: {
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Clock3,
  },
  confirmed: {
    className: "bg-green-50 text-green-700 ring-green-200",
    icon: CheckCircle,
  },
  completed: {
    className: "bg-purple-50 text-purple-700 ring-purple-200",
    icon: CheckCircle,
  },
  cancelled: {
    className: "bg-red-50 text-red-700 ring-red-200",
    icon: XCircle,
  },
};

const getStatusStyle = (status) =>
statusStyles[String(status || "pending").toLowerCase()] ||
{
  className: "bg-gray-100 text-gray-700 ring-gray-200",
  icon: AlertCircle,
};

const formatDate = (value, options = {}) => {
    if (!value) return "N/A";

    // Preserve date-only values without UTC timezone shifting.
    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(value))
        ? new Date(`${value}T00:00:00`)
        : new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        ...options,
    });
};

const formatTime = (time) => {
  if (!time) return "N/A";
  // Already formatted: 12:00 PM
  if (/\b(AM|PM)\b/i.test(time)) {
    return time;
  }

  // Convert 24-hour format: 12:00:00
  const [hours, minutes] = time.split(":");

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const InfoItem = ({ label, value, className = "" }) => (
    <div className={className}>
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="font-medium text-gray-800 text-sm">
            {value || "N/A"}
        </p>
    </div>
);

function AppointmentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    usePageTitle("Appointment Details");

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Fetch appointment details
    const fetchAppointment = useCallback(async () => {
        try {
            setLoading(true);

            const response = await appointmentService.getById(id);

            if (response?.success === false) {
                throw new Error(
                    response.message || "Failed to load appointment."
                );
            }

            const result = response?.data ?? response;
            console.log(result);

            setAppointment(result);

        } catch (error) {
            console.error("Appointment details error:", error);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Unable to load appointment details."
            );

            setAppointment(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchAppointment();
    }, [fetchAppointment]);

    // Confirm appointment
    const handleConfirmAppointment = async () => {
        try {
            setUpdating(true);
            const response = await appointmentService.updateStatus(
                id,
                "Confirmed"
            );

            if (response?.success === false) {
                throw new Error(
                    response.message || "Unable to confirm appointment."
                );
            }

            toast.success(
                response?.message || "Appointment confirmed successfully!"
            );

            await fetchAppointment();

        } catch (error) {
            console.error("Confirm appointment error:", error);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to confirm appointment."
            );
        } finally {
            setUpdating(false);
        }
    };

    // Loading
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <LoaderCircle
                    size={40}
                    className="animate-spin text-indigo-600"
                />

                <p className="text-sm text-gray-500 mt-3">
                    Loading appointment details...
                </p>
            </div>
        );
    }

    // Not found
    if (!appointment) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
                <AlertCircle
                    size={40}
                    className="mx-auto text-red-400 mb-3"
                />

                <h2 className="text-lg font-semibold text-gray-800">
                    Appointment Not Found
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                    Unable to find the requested appointment.
                </p>

                <button
                    onClick={() => navigate("/dentist/appointments")}
                    className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                >
                    Back to Appointments
                </button>
            </div>
        );
    }

    // API data
    const patient = appointment || {};
    const service = appointment || {};
    const treatment = appointment.treatment || null;

    const patientName =
        appointment.patientName ||
        patient.fullName ||
        patient.name ||
        patient.user?.name ||
        "N/A";

    const patientEmail =
        appointment.patientEmail ||
        patient.email ||
        patient.user?.email ||
        "N/A";

    const patientPhone =
        appointment.patientPhone ||
        patient.phone ||
        patient.phoneNumber ||
        "N/A";

    const serviceName =
        appointment.serviceName ||
        service.name ||
        "N/A";

    const serviceDuration =
        appointment.serviceDuration ??
        service.duration ??
        "N/A";

    const appointmentDate =
        appointment.appointmentDate;

    const startTime = appointment.startTime;
    const endTime = appointment.endTime;

    const status = String(appointment.status || "").toLowerCase();

    const statusClass =
        statusStyles[status] ||
        "bg-gray-100 text-gray-700 border-gray-200";

    const canConfirm = status === "pending";

    const canStartTreatment = ![
        "completed",
        "cancelled",
    ].includes(status);

      const statusConfig = getStatusStyle(appointment.status);
      const StatusIcon = statusConfig.icon;

    return (
        <div className="max-w-5xl space-y-6">

            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-5">

                    <div>
                        <div className="flex flex-wrap items-center gap-3">

                            <h2 className="text-xl font-bold text-gray-900">
                                Appointment Overview
                            </h2>

                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border capitalize ${statusConfig.className}`}
                            >
                              <StatusIcon size={13} />
                                {appointment.status || "Unknown"}
                            </span>
                        </div>

                        <p className="text-sm text-gray-500 mt-2">
                            Appointment #{appointment.id ?? id}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                            Booked on{" "}
                            {formatDate(
                                appointment.bookedDate ||
                                appointment.bookedDate
                            )}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">

                        {canConfirm && (
                            <button
                                type="button"
                                disabled={updating}
                                onClick={handleConfirmAppointment}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer"
                            >
                                {updating ? (
                                    <LoaderCircle
                                        size={15}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <CheckCircle2 size={15} />
                                )}

                                {updating
                                    ? "Confirming..."
                                    : "Confirm Appointment"}
                            </button>
                        )}

                        {canStartTreatment && (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/dentist/treatments/create/${appointment.id ?? id}`
                                    )
                                }
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer"
                            >
                                <ClipboardPlus size={15} />
                                Start Treatment
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Service Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">

                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Stethoscope size={19} />
                        </div>

                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">
                            Service Information
                        </h3>
                    </div>

                    <div className="space-y-4">

                        <InfoItem
                            label="Procedure"
                            value={
                                <span className="text-base font-semibold text-gray-900">
                                    {serviceName}
                                </span>
                            }
                        />

                        <div>
                            <p className="text-xs text-gray-400 mb-1">
                                Scheduled Time
                            </p>

                            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                                <CalendarDays
                                    size={16}
                                    className="text-indigo-500 shrink-0"
                                />

                                <span>
                                    {formatDate(appointmentDate, {
                                        weekday: "long",
                                        month: "long",
                                        day: "2-digit",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-medium text-gray-800 mt-2">
                                <Clock3
                                    size={16}
                                    className="text-indigo-500 shrink-0"
                                />

                                <span>
                                    {formatTime(startTime)} - {formatTime(endTime)}
                                </span>
                            </div>
                        </div>

                        <InfoItem
                            label="Estimated Duration"
                            value={
                                serviceDuration === "N/A"
                                    ? "N/A"
                                    : `${serviceDuration} minutes`
                            }
                        />

                        {appointment.reason && (
                            <div>
                                <p className="text-xs text-gray-400 mb-2">
                                    Patient's Reason / Complaint
                                </p>

                                <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg text-xs text-gray-700 leading-relaxed">
                                    <div className="flex items-start gap-2">
                                        <FileText
                                            size={15}
                                            className="text-gray-400 shrink-0 mt-0.5"
                                        />

                                        {appointment.reason}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Patient Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">

                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <UserRound size={19} />
                        </div>

                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">
                            Patient Details
                        </h3>
                    </div>

                    {/* Patient Profile */}
                    <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shrink-0">
                            {patientName.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                            <h4 className="font-bold text-gray-900">
                                {patientName}
                            </h4>

                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 break-all">
                                <Mail size={12} className="shrink-0" />
                                {patientEmail}
                            </p>

                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <Phone size={12} />
                                {patientPhone}
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">

                        <div>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                                <Cake size={13} />
                                Date of Birth
                            </p>

                            <p className="font-medium text-gray-800 text-sm">
                                {formatDate(
                                    patient.patientDob ||
                                    patient.patientDob
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                                <VenusAndMars size={13} />
                                Gender
                            </p>

                            <p className="font-medium text-gray-800 text-sm capitalize">
                                {patient.patientGender || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Treatment Record */}
            {treatment && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                            <ClipboardList size={19} />
                        </div>

                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">
                            Treatment Record
                        </h3>
                    </div>

                    <div className="bg-teal-50 rounded-xl p-5 border border-teal-100 space-y-4">

                        <div>
                            <p className="text-xs font-semibold text-teal-900 mb-1">
                                Treatment
                            </p>

                            <p className="text-sm text-teal-950 font-medium">
                                {treatment.treatmentDesc || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-teal-900 mb-1">
                                Diagnosis
                            </p>

                            <p className="text-sm text-teal-950">
                                {treatment.diagnosis || "N/A"}
                            </p>
                        </div>

                        {treatment.notes && (
                            <div>
                                <p className="text-xs font-semibold text-teal-900 mb-1">
                                    Notes
                                </p>

                                <p className="text-sm text-teal-950">
                                    {treatment.notes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Back Button */}
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/dentist/appointments")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition"
                >
                    <ArrowLeft size={16} />
                    Back to Appointments
                </button>
            </div>
        </div>
    );
}

export default AppointmentDetails;
