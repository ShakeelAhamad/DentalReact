
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  UserRound,
  Stethoscope,
  ClipboardList,
  CreditCard,
  Phone,
  Mail,
  Trash2,
  CheckCircle,
  Clock3,
  XCircle,
  AlertCircle,
  RefreshCw,
  Activity,
  Save,
} from "lucide-react";

import appointmentService from "../../../services/appointmentService";
import pageTitle from "../../../hooks/usePageTitle";

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

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
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

function InfoItem({ label, children }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <div className="text-sm font-medium text-gray-800">
        {children || "N/A"}
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-800 mb-5">
        <Icon size={17} className="text-indigo-600" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function ProfileCard({
  title,
  name,
  email,
  phone,
  specialization,
  icon: Icon,
  color = "blue",
  image,
  prefix = "",
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    teal: "bg-teal-100 text-teal-700",
  };

  return (
    <SectionCard title={title} icon={Icon}>
      <div className="flex items-center gap-3">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${colors[color]}`}
          >
            {name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">
            {name || "N/A"}
          </h4>

          {specialization && (
            <p className="text-xs text-teal-600 font-medium mt-1">
              {specialization}
            </p>
          )}

          {email && (
            <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Mail size={12} />
              {email}
            </p>
          )}

          {phone && (
            <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Phone size={12} />
              {phone}
            </p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  pageTitle(`Appointment #${id} Details`);

  const [appointment, setAppointment] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch appointment details
  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAppointmentById(id);
      //const response = await api.get(`/admin/appointments/${id}`);
      const data = response.data.data ?? response.data;
      console.log(data);
      setAppointment(data);
      setStatus(data.status?.toLowerCase() || "pending");
    } catch (error) {
      console.error("Failed to fetch appointment:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to load appointment details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  // Update appointment status
  const handleStatusUpdate = async () => {
    if (!appointment) return;

    try {
      setUpdating(true);
      await appointmentService.updateStatus(
        appointment.id,
        status
      );

      setAppointment((prev) => ({
        ...prev,
        status,
      }));
      // Replace with your toast notification
      toast.success("Appointment status updated successfully!");
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to update appointment status."
      );
    } finally {
      setUpdating(false);
    }
  };

  // Delete appointment
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await appointmentService.delete(appointment.id);
      toast.success("Appointment deleted successfully!");
      navigate("/admin/appointments");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to delete appointment."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-80">
        <RefreshCw className="animate-spin text-indigo-600" size={30} />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="bg-white rounded-xl p-10 text-center border border-gray-100">
        <AlertCircle size={35} className="mx-auto text-red-400 mb-3" />
        <h3 className="font-semibold text-gray-800">
          Appointment not found
        </h3>
        <button
          onClick={() => navigate("/admin/appointments")}
          className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 cursor-pointer"
        >
          Back to Appointments
        </button>
      </div>
    );
  }

  const statusConfig = getStatusStyle(appointment.status);
  const StatusIcon = statusConfig.icon;

  const patient = appointment.patient;
  const dentist = appointment.dentist;
  const service = appointment.service;
  const treatment = appointment.treatmentRecord;

  return (
    <div className="max-w-5xl space-y-6">

      {/* Header & Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-5">

        <div>
          <div className="flex items-center flex-wrap gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              Appointment #{appointment.id}
            </h2>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ring-1 ring-inset ${statusConfig.className}`}
            >
              <StatusIcon size={13} />
              {appointment.status?.charAt(0).toUpperCase() +
                appointment.status?.slice(1)}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1.5">
            <CalendarDays size={14} />
            Booked on {formatDateTime(appointment.bookedDate || appointment.bookedDate)}
          </p>
        </div>

        {/* Status Updater */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={handleStatusUpdate}
            disabled={updating || status === appointment.status?.toLowerCase()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            {updating ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Service Information */}
        <SectionCard title="Service & Time" icon={ClipboardList}>
          <div className="space-y-5">
            <InfoItem label="Service">
              <span className="text-base font-semibold">
                {appointment?.serviceName}
              </span>
            </InfoItem>

            <InfoItem label="Appointment Date">
              <span className="flex items-center gap-2">
                <CalendarDays size={15} className="text-indigo-500" />
                {formatDate(appointment.appointmentDate || appointment.appointment_date)}
              </span>
            </InfoItem>

            <InfoItem label="Appointment Time">
              <span className="flex items-center gap-2">
                <Clock size={15} className="text-indigo-500" />
                {formatTime(appointment.startTime || appointment.startTime)}
                {" - "}
                {formatTime(appointment.endTime || appointment.endTime)}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                {appointment?.serviceDuration} minutes
              </p>
            </InfoItem>

            <InfoItem label="Consultation Fee">
              <span className="flex items-center gap-2 text-base font-bold text-gray-900">
                <CreditCard size={16} className="text-indigo-500" />
                ${Number(appointment?.servicePrice || 0).toFixed(2)}
              </span>
            </InfoItem>

            {appointment.reason && (
              <InfoItem label="Patient's Reason / Note">
                <p className="bg-gray-50 border border-gray-100 p-3 rounded-lg text-xs leading-relaxed text-gray-700 font-normal">
                  {appointment.reason}
                </p>
              </InfoItem>
            )}
          </div>
        </SectionCard>

        {/* Patient & Dentist */}
        <div className="space-y-6">
          <ProfileCard
            title="Patient Information"
            name={appointment?.patientName}
            email={appointment?.patientEmail}
            phone={appointment?.patientPhone}
            image={patient?.user?.profileImage || patient?.user?.profile_image}
            icon={UserRound}
            color="blue"
          />

          <ProfileCard
            title="Assigned Dentist"
            name={appointment?.dentistName}
            email={appointment?.dentistEmail}
            phone={appointment?.dentistPhone}
            specialization={appointment?.dentistSpecialization || "General Dentistry"}
            image={dentist?.user?.profileImage || dentist?.user?.profile_image}
            icon={Stethoscope}
            color="teal"
            prefix="Dr. "
          />
        </div>
      </div>

      {/* Treatment Record */}
      {treatment && (
        <SectionCard title="Treatment Record" icon={Activity}>
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 space-y-4">
            <InfoItem label="Treatment">
              <span className="text-purple-950">
                {treatment.treatment}
              </span>
            </InfoItem>

            <InfoItem label="Diagnosis">
              <span className="text-purple-950">
                {treatment.diagnosis}
              </span>
            </InfoItem>

            {treatment.notes && (
              <InfoItem label="Notes">
                <span className="text-purple-950 font-normal">
                  {treatment.notes}
                </span>
              </InfoItem>
            )}
          </div>
        </SectionCard>
      )}

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <button
          onClick={() => navigate("/admin/appointments")}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Appointments
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-50 transition cursor-pointer"
        >
          {deleting ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
          {deleting ? "Deleting..." : "Delete Appointment"}
        </button>
      </div>
    </div>
  );
}
