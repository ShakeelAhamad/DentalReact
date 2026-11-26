import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  VenusAndMars,
  Clock,
  Stethoscope,
  ClipboardList,
  FileText,
  Activity,
  CalendarCheck,
  AlertCircle,
  LoaderCircle,
  ChevronRight,
  Clock3,
  CircleCheck,
  CircleX
} from "lucide-react";

import patientsService from "../../../services/patientsService";
import pageTitle from "../../../hooks/usePageTitle";

const PatientsDetails = () => {
  const { id } = useParams();
  pageTitle("Patient Details");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await patientsService.getById(id);
      console.log("OK", data);
      if (data) {
        setPatient(data);
      } else {
        setError("Patient not found.");
      }

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load patient details."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
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
  };

  const getStatusStyle = (status) => {
    const styles = {
      confirmed: "bg-green-50 text-green-700 ring-green-600/20",
      pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
      completed: "bg-purple-50 text-purple-700 ring-purple-600/20",
      cancelled: "bg-red-50 text-red-700 ring-red-600/20",
    };

    return styles[String(status || "").toLowerCase()] ||
      "bg-gray-100 text-gray-600 ring-gray-500/20";
  };
  const statusIcons = {
    pending: Clock3,
    confirmed: CalendarCheck,
    completed: CircleCheck,
    cancelled: CircleX,
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-9 w-9 animate-spin text-indigo-600" />
          <p className="text-sm text-gray-500">
            Loading patient details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="rounded-xl border border-red-100 bg-white p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />

        <h3 className="text-lg font-semibold text-gray-800">
          Patient Not Found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          {error || "Unable to find patient information."}
        </p>

        <Link
          to="/admin/patients"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <ArrowLeft size={16} />
          Back to Patients
        </Link>
      </div>
    );
  }

  // Adjust these mappings according to your actual API response.
  const appointments = patient.appointments || [];
  const treatmentRecords = patient.treatments || [];

  const fullName = patient.fullName || patient.fullName || "Unknown Patient";

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-gray-50 p-2">
        <Icon size={17} className="text-gray-500" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400">{label}</p>
        <p className="mt-1 wrap-break-word text-sm font-semibold text-gray-800">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/admin/patients" className="hover:text-indigo-600">
              Patients
            </Link>

            <ChevronRight size={15} />

            <span className="font-medium text-gray-700">Patient Details</span>
          </div>

          <h1 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
            Patient Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View patient information, appointments and medical history.
          </p>
        </div>

        <Link
          to="/admin/patients"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      {/* Patient Profile Card */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        <div className="p-5 sm:p-6">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div className="flex min-w-0 items-center gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold uppercase text-indigo-700">
                {fullName.charAt(0)}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-gray-900">
                  {fullName}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">

                  <span className="flex items-center gap-1.5">
                    <Mail size={14} />
                    {patient.email || "No email"}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Phone size={14} />
                    {patient.phoneNumber || patient.phone || "No phone"}
                  </span>

                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 px-4 py-3 sm:text-right">
              <p className="text-xs font-medium text-gray-400">
                Member Since
              </p>

              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-700 sm:justify-end">
                <CalendarDays size={15} className="text-indigo-500" />
                {formatDate(patient.CreatedAt || patient.createdAt)}
              </p>
            </div>

          </div>

          {/* Patient Information */}
          <div className="mt-7 grid grid-cols-1 gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">

            <InfoItem
              icon={CalendarDays}
              label="Date of Birth"
              value={formatDate(patient.dateOfBirth || patient.date_of_birth)}
            />

            <InfoItem
              icon={VenusAndMars}
              label="Gender"
              value={patient.gender}
            />

            <InfoItem
              icon={MapPin}
              label="Address"
              value={patient.address}
            />

            <InfoItem
              icon={Phone}
              label="Contact Number"
              value={patient.phoneNumber || patient.phone}
            />

          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-indigo-50 p-3">
            <CalendarCheck className="h-6 w-6 text-indigo-600" />
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Appointments</p>
            <h3 className="mt-1 text-2xl font-bold text-gray-900">
              {appointments.length}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-purple-50 p-3">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>

          <div>
            <p className="text-sm text-gray-500">Treatment Records</p>
            <h3 className="mt-1 text-2xl font-bold text-gray-900">
              {treatmentRecords.length}
            </h3>
          </div>
        </div>

      </div>

      {/* Appointment History */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-gray-800">
              <CalendarCheck size={19} className="text-indigo-600" />
              Appointment History
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              {appointments.length} appointments found
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[750px] text-left text-sm">

            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Date & Time</th>
                <th className="px-5 py-4 font-semibold">Dentist</th>
                <th className="px-5 py-4 font-semibold">Service</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {appointments.length > 0 ? (
                appointments.map((app) => {
                  const normalizedStatus = String(
                    app.status ?? "pending"
                  ).toLowerCase();

                  const StatusIcon = statusIcons[normalizedStatus] ?? Clock3;
                  return (
                    <tr
                      key={app.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          {formatDate(app.appointmentDate || app.appointment_date)}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={12} />
                          {formatTime(app.startTime || app.start_time)}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {app.dentistName || app.name || "N/A"}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {app.serviceName || "N/A"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full gap-1.5 px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${getStatusStyle(app.status)}`}
                        >
                          <StatusIcon size={14} />
                          {app.status || "Unknown"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/admin/appointments/${app.id}`}
                          className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          Details
                          <ChevronRight size={15} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center">
                    <CalendarDays className="mx-auto mb-3 h-9 w-9 text-gray-300" />

                    <p className="font-medium text-gray-600">
                      No appointment history
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      This patient has no appointments yet.
                    </p>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Medical & Treatment Records */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800">
            <ClipboardList size={19} className="text-indigo-600" />
            Medical & Treatment Records
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            {treatmentRecords.length} medical records found
          </p>
        </div>

        <div className="divide-y divide-gray-100">

          {treatmentRecords.length > 0 ? (
            treatmentRecords.map((record) => (
              <div key={record.id} className="space-y-4 p-5 sm:p-6">

                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-50 p-2.5">
                      <Activity size={19} className="text-purple-600" />
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {record.treatment || "Treatment"}
                      </h4>

                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <CalendarDays size={13} />
                        {formatDate(record.treatmentDate || record.treatmentDate)}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <Stethoscope size={14} />
                    {record.dentistName || record.dentistName || "Dentist"}
                  </span>

                </div>

                <div className="space-y-3 rounded-xl bg-gray-50 p-4">

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Diagnosis
                    </p>

                    <p className="text-sm text-gray-700">
                      {record.diagnosis || "No diagnosis available."}
                    </p>
                  </div>

                  {record.treatmentDesc && (
                    <div className="border-t border-gray-200 pt-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Clinical Notes
                      </p>

                      <p className="whitespace-pre-wrap text-sm text-gray-700">
                        {record.treatmentDesc}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-12 text-center">
              <FileText className="mx-auto mb-3 h-9 w-9 text-gray-300" />

              <p className="font-medium text-gray-600">
                No treatment records
              </p>

              <p className="mt-1 text-xs text-gray-400">
                No medical or treatment records have been logged yet.
              </p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default PatientsDetails;
