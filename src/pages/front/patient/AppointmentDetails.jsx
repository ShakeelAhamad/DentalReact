
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Wallet,
  UserRound,
  GraduationCap,
  BriefcaseMedical,
  FileText,
  Ban,
  CheckCircle2,
  Info,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import { getById,cancelAppointment } from "../../../services/patients/appointmentService";
import { appointmentStatusStyles } from "../../../data/appointmentsData";
import usePageTitle from "../../../hooks/usePageTitle";
import toast from "react-hot-toast";

const AppointmentDetails = () => {
  const { id } = useParams();
  usePageTitle("Appointment Details");

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelled, setCancelled] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [treatmentRecord, setTreatmentRecord] = useState(null);

  // Fetch appointment details
  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setError("");
      setAppointment(null);

      const response = await getById(id);
console.log("Fetched appointment data:", response);
      // Support common API response formats
      const data =
        response?.data?.data ??
        response?.data ??
        response;
 
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Appointment details not found.");
      }

      // Normalize API response fields
      const dentist = data.dentist || data.Dentist || {};
      const service = data.service || data.Service || {};
     

      const normalizedAppointment = {
        id: data.id ?? data.appointmentId ?? data.Id,

        serviceName:
          data.serviceName ||
          service.name ||
          service.serviceName ||
          service.Name ||
          "Dental Service",

        servicePrice: Number(
          data.servicePrice ??
          service.price ??
          service.Price ??
          0
        ),

        serviceDuration:
          data.serviceDuration ??
          service.duration ??
          service.durationMinutes ??
          service.Duration ??
          0,

        appointmentDate:
          data.appointmentDate ||
          data.bookedDate ||
          data.date ||
          data.AppointmentDate,

        bookedDate:
          data.bookedDate ||
          data.createdAt ||
          data.created_at ||
          data.CreatedAt,

        startTime: data.startTime || data.StartTime || "",
        endTime: data.endTime || data.EndTime || "",

        notes:
          data.notes ||
          data.note ||
          data.reason ||
          data.Note ||
          data.Reason ||
          "",

        status: data.status || data.Status || "Pending",

        dentistName:
          data.dentistName ||
          dentist.fullName ||
          dentist.name ||
          dentist.FullName ||
          "Dentist",

        dentistSpecialization:
          data.dentistSpecialization ||
          dentist.specialization ||
          dentist.Specialization ||
          "General Dentistry",

        dentistQualification:
          data.dentistQualification ||
          dentist.qualification ||
          dentist.Qualification ||
          "",

        experience:
          data.experience ||
          dentist.experience ||
          dentist.Experience ||
          "",

        bio:
          data.bio ||
          dentist.bio ||
          dentist.Bio ||
          "",
      };

      const treatmentRecord = data.treatmentRecord ? data.treatmentRecord : null;
      setTreatmentRecord(treatmentRecord);

      if (!normalizedAppointment.id) {
        throw new Error("Invalid appointment details received.");
      }

      setAppointment(normalizedAppointment);
    } catch (err) {
      console.error("Appointment details error:", err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.title ||
        err.message ||
        "Unable to load appointment details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id || !/^\d+$/.test(id)) {
      setError("Invalid appointment ID.");
      setLoading(false);
      return;
    }

    fetchAppointment();
    // Avoid updating state after component unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  

  // Date formatting
  const formatDate = (date, options = {}) => {
    if (!date) return "N/A";

    const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? new Date(`${date}T12:00:00`)
      : new Date(date);

    if (isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-IN", options);
  };

  // Currency formatting
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(price) || 0);
  };

  // Time formatting
  const formatTime = (time) => {
    if (!time) return "N/A";

    // Supports 24-hour API time, such as 09:00:00
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(Number(hours), Number(minutes), 0, 0);

      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    return time;
  };
  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (confirmed) {
      setCancelled(true);
      setCancelling(true);
    }
     try {
        setCancelling(true);
        await cancelAppointment(appointment.id);

        toast.success("Appointment cancelled successfully!");

        // Refresh appointment details from API
        await fetchAppointment();

    } catch (error) {
        toast.error(
            error.response?.data?.message ||
            error.response?.data?.title ||
            "Unable to cancel appointment. Please try again."
        );
    } finally {
        setCancelling(false);
    }
  };

  // Loading UI
  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <LoaderCircle
            size={42}
            className="mx-auto animate-spin text-indigo-600"
          />

          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading appointment details...
          </p>
        </div>
      </section>
    );
  }

  // Error UI
  if (error) {
    return (
      <section className="px-4 py-20">
        <div className="mx-auto max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <Info
            size={42}
            className="mx-auto mb-4 text-red-500"
          />

          <h2 className="text-xl font-bold text-gray-900">
            Unable to Load Appointment
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-600">
            {error}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={fetchAppointment}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

            <Link
              to="/patient/appointments"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              Back to Appointments
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Appointment not found
  if (!appointment) {
    return (
      <section className="px-4 py-20">
        <div className="mx-auto max-w-lg rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <Info
            size={42}
            className="mx-auto mb-4 text-gray-400"
          />

          <h2 className="text-xl font-bold text-gray-900">
            Appointment Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            The requested appointment does not exist.
          </p>

          <Link
            to="/patient/appointments"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <ArrowLeft size={16} />
            Back to Appointments
          </Link>
        </div>
      </section>
    );
  }

 let status = appointment.status;
  const statusStyle =
    appointmentStatusStyles[status] ||
    "bg-gray-100 text-gray-700";

  const dentistInitial = appointment.dentistName
    .replace(/^Dr\.\s*/i, "")
    .charAt(0)
    .toUpperCase();

   status = cancelled ? "Cancelled" : appointment.status;
  const canCancel =
    !cancelled &&
    ["Pending", "Confirmed"].includes(appointment.status);

  return (
    <section className="px-4 py-20 sm:py-25">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* Appointment details card */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">

          {/* Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {appointment.serviceName}
                </h1>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {status}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Appointment Reference #{appointment.id}
                {" "}• Booked on{" "}
                {formatDate(appointment.bookedDate, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            {canCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 sm:self-center cursor-pointer"
            >
              {cancelling ? (
                    <>
                        <LoaderCircle size={15} className="animate-spin" />
                        Cancelling...
                    </>
                ) : (
                    <>
                        <Ban size={15} />
                        Cancel Appointment
                    </>
                )}

            </button>
          )}
          </div>

          {/* Main information */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">

            <div className="space-y-6">

              {/* Date and time */}
              <div>
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <CalendarDays size={15} />
                  Date & Time
                </span>

                <strong className="block text-base text-gray-900">
                  {formatDate(appointment.appointmentDate, {
                    weekday: "long",
                    month: "long",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </strong>

                <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-gray-600">
                  <Clock size={15} className="text-gray-400" />
                  {formatTime(appointment.startTime)} -{" "}
                  {formatTime(appointment.endTime)}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Duration: {appointment.serviceDuration} minutes
                </p>
              </div>

              {/* Consultation fee */}
              <div>
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <Wallet size={15} />
                  Consultation Fee
                </span>

                <strong className="text-xl font-bold text-gray-900">
                  {formatPrice(appointment.servicePrice)}
                </strong>
              </div>

              {/* Visit notes */}
              <div>
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <FileText size={15} />
                  Notes / Reason for Visit
                </span>

                <p className="rounded-lg bg-gray-50 p-3 text-sm leading-6 text-gray-700">
                  {appointment.notes || "No notes provided."}
                </p>
              </div>
            </div>

            {/* Dentist information */}
            <div className="space-y-4 rounded-xl bg-indigo-50 p-5">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                <UserRound size={15} />
                Your Dentist
              </span>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-base font-bold text-white">
                  {dentistInitial || "D"}
                </div>

                <div className="min-w-0">
                  <h2 className="break-words text-base font-bold text-gray-900">
                    {appointment.dentistName}
                  </h2>

                  <p className="mt-1 text-xs font-medium text-indigo-700">
                    {appointment.dentistSpecialization}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs leading-5 text-gray-600">
                <GraduationCap
                  size={16}
                  className="mt-0.5 shrink-0 text-indigo-600"
                />
                
                <span>
                  {appointment.dentistQualification ||
                    "Qualification not available"}
                </span>
              </div>
              { appointment.experience && (
              <div className="flex items-start gap-2 text-xs leading-5 text-gray-600">
                <BriefcaseMedical
                  size={16}
                  className="mt-0.5 shrink-0 text-indigo-600"
                />

                <span>
                  {appointment.experience ||
                    "Experience not available"} years of practice
                </span>
              </div>
              )}

              {appointment.bio && (
                <p className="border-t border-indigo-100 pt-3 text-xs leading-6 text-gray-600">
                  {appointment.bio}
                </p>
              )}
            </div>
          </div>

          {/* Status messages */}
          {status === "Cancelled" && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <Ban size={18} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Appointment cancelled
                </p>

                <p className="mt-1 text-xs leading-5">
                  This appointment has been cancelled.
                </p>
              </div>
            </div>
          )}

          {status === "Confirmed" && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-semibold">
                  Appointment confirmed
                </p>

                <p className="mt-1 text-xs">
                  Your appointment has been confirmed.
                </p>
              </div>
            </div>
          )}

          {status === "Pending" && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-700">
              <Info size={18} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Appointment pending
                </p>

                <p className="mt-1 text-xs">
                  Your appointment is waiting for confirmation.
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Treatment & Doctor's Notes */}
        {treatmentRecord && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900">Treatment & Doctor's Notes</h2>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">Completed Visit</span>
            </div>

            <div className="space-y-4 text-sm">
                <div>
                    <span className="text-gray-400 text-xs uppercase font-semibold block">Procedure Performed</span>
                    <p className="text-gray-900 font-bold text-base mt-0.5">
                        {treatmentRecord.treatmentDesc || "N/A"}
                    </p>
                </div>

                <div>
                    <span className="text-gray-400 text-xs uppercase font-semibold block">Doctor's Diagnosis</span>
                    <div className="bg-gray-50 p-4 rounded-xl text-gray-800 mt-1 whitespace-pre-line">
                      {treatmentRecord.diagnosis || "No diagnosis provided."}
                    </div>
                </div>
                {treatmentRecord.notes && (
                  <div>
                      <span className="text-gray-400 text-xs uppercase font-semibold block">Post-Care Instructions & Prescription</span>
                      <div className="bg-gray-50 p-4 rounded-xl text-gray-800 mt-1 whitespace-pre-line">
                          {treatmentRecord.notes}
                      </div>
                  </div>
                )}
                
            </div>
        </div>
        )}
        {/* Back link */}
        <Link
          to="/patient/appointments"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to My Appointments
        </Link>
      </div>
    </section>
  );
};

export default AppointmentDetails;
