
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    CalendarDays,
    Clock3,
    UserRound,
    Stethoscope,
    ClipboardPlus,
    FileText,
    Activity,
    CheckCircle2,
    ArrowLeft,
    LoaderCircle,
    AlertCircle,
    Save,
    ClipboardList,
} from "lucide-react";

import toast from "react-hot-toast";
import treatmentService from "../../../services/dentist/treatmentService";
import usePageTitle from "../../../hooks/usePageTitle";

const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const formatDate = (value) => {
    if (!value) return "N/A";

    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(value))
        ? new Date(`${value}T00:00:00`)
        : new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-US", {
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

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

function TreatmentForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    usePageTitle("Document Treatment");

    const [appointment, setAppointment] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        appointmentId: Number(id),
        PatientId: Number(appointment?.patientId),
        treatmentDate: getToday(),
        treatment: "",
        diagnosis: "",
        notes: "",
    });

    // Fetch appointment details
    const fetchAppointment = useCallback(async () => {
        try {
            setLoading(true);

            const response =
                await treatmentService.getAppointmentById(id);

            if (response?.success === false) {
                throw new Error(
                    response.message || "Unable to load appointment."
                );
            }

            const result = response?.data ?? response;
            console.log(response)
            setAppointment(result);

            const serviceName =
                result.serviceName ||
                result.service?.name ||
                "";

            setFormData((prev) => ({
                ...prev,
                appointmentId: Number(result.id ?? id),
                PatientId: Number(result.PatientId),
                treatment: serviceName,
            }));

        } catch (error) {
            console.error("Appointment loading error:", error);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to load appointment details."
            );

            setAppointment(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchAppointment();
    }, [fetchAppointment]);

    // Input change handler
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // Submit treatment record
    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        if (!formData.treatmentDate ||
            !formData.treatment.trim() ||
            !formData.diagnosis.trim()) {
            toast.error("Please fill all required fields.");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                AppointmentId: Number(id),
                PatientId: Number(appointment.patientId),
                TreatmentDate: formData.treatmentDate,
                TreatmentDesc: formData.treatment.trim(),
                Diagnosis: formData.diagnosis.trim(),
                Notes: formData.notes.trim(),
            };

            const response =
                await treatmentService.create(payload,Number(id));

            if (response?.success === false) {
                throw new Error(
                    response.message || "Failed to save treatment."
                );
            }

            toast.success(
                response?.message ||
                "Treatment record saved successfully!"
            );

            navigate(`/dentist/appointments/${id}`);

        } catch (error) {
            console.error("Treatment submission error:", error);

            const responseData = error.response?.data;

            // ASP.NET Core validation errors
            if (responseData?.errors) {
                const validationErrors = {};

                Object.entries(responseData.errors).forEach(
                    ([key, messages]) => {
                        const fieldName =
                            key.charAt(0).toLowerCase() + key.slice(1);

                        validationErrors[fieldName] =
                            Array.isArray(messages)
                                ? messages[0]
                                : messages;
                    }
                );

                setErrors(validationErrors);
            }

            toast.error(
                responseData?.message ||
                responseData?.title ||
                error.message ||
                "Unable to save treatment record."
            );

        } finally {
            setSubmitting(false);
        }
    };

    // Reusable input styles
    const inputClass =
        "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

    const labelClass =
        "block text-sm font-medium text-gray-700 mb-1.5";

    // Loading screen
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <LoaderCircle
                    size={40}
                    className="animate-spin text-teal-600"
                />

                <p className="text-sm text-gray-500 mt-3">
                    Loading appointment details...
                </p>
            </div>
        );
    }

    // Appointment not found
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
                    Unable to load appointment information.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/dentist/appointments")}
                    className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold"
                >
                    Back to Appointments
                </button>
            </div>
        );
    }

    // Appointment summary data
    const patient =
        appointment.patient || {};

    const patientName =
        appointment.patientName ||
        patient.fullName ||
        patient.name ||
        patient.user?.name ||
        "Patient";

    const serviceName =
        appointment.serviceName ||
        appointment.service?.name ||
        "Service";

    const appointmentDate =
        appointment.appointmentDate;

    const startTime =
        appointment.startTime;

    return (
        <div className="max-w-3xl space-y-6">

            {/* Page Header */}
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <ClipboardPlus size={22} />
                </div>

                <div>
                    <h1 className="text-xl font-bold text-gray-900">
                        Document Treatment
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Record clinical treatment and diagnosis.
                    </p>
                </div>
            </div>

            {/* Appointment Summary */}
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-5">

                <div className="flex items-center gap-2 mb-4">
                    <Stethoscope
                        size={17}
                        className="text-teal-700"
                    />

                    <h3 className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
                        Treating Appointment Details
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">

                    {/* Patient */}
                    <div className="flex items-start gap-2">
                        <UserRound
                            size={17}
                            className="text-teal-700 mt-0.5 shrink-0"
                        />

                        <div>
                            <span className="text-teal-700 text-xs block mb-1">
                                Patient
                            </span>

                            <strong className="text-teal-950">
                                {patientName}
                            </strong>
                        </div>
                    </div>

                    {/* Service */}
                    <div className="flex items-start gap-2">
                        <Stethoscope
                            size={17}
                            className="text-teal-700 mt-0.5 shrink-0"
                        />

                        <div>
                            <span className="text-teal-700 text-xs block mb-1">
                                Requested Service
                            </span>

                            <strong className="text-teal-950">
                                {serviceName}
                            </strong>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-start gap-2">
                        <CalendarDays
                            size={17}
                            className="text-teal-700 mt-0.5 shrink-0"
                        />

                        <div>
                            <span className="text-teal-700 text-xs block mb-1">
                                Date & Time
                            </span>

                            <strong className="text-teal-950">
                                {formatDate(appointmentDate)}
                            </strong>

                            <p className="text-xs text-teal-800 mt-1 flex items-center gap-1">
                                <Clock3 size={12} />
                                {formatTime(startTime)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Treatment Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                <div className="flex items-center gap-2 mb-6">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <ClipboardList size={19} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-900 text-sm">
                            Treatment Information
                        </h2>

                        <p className="text-xs text-gray-400 mt-0.5">
                            Enter clinical treatment details below.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Appointment ID */}
                    <input
                        type="hidden"
                        name="appointmentId"
                        value={id}
                    />

                    {/* Treatment Date */}
                    <div>
                        <label className={labelClass}>
                            Treatment Date *
                        </label>

                        <div className="relative">
                            <CalendarDays
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="date"
                                name="treatmentDate"
                                value={formData.treatmentDate}
                                onChange={handleChange}
                                required
                                className={`${inputClass} pl-10`}
                            />
                        </div>

                        {errors.treatmentDate && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.treatmentDate}
                            </p>
                        )}
                    </div>

                    {/* Treatment */}
                    <div>
                        <label className={labelClass}>
                            Procedure / Treatment Performed *
                        </label>

                        <div className="relative">
                            <Activity
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                name="treatment"
                                value={formData.treatment}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Composite filling on tooth #14, Scaling and Polishing"
                                className={`${inputClass} pl-10`}
                            />
                        </div>

                        {errors.treatment && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.treatment}
                            </p>
                        )}
                    </div>

                    {/* Diagnosis */}
                    <div>
                        <label className={labelClass}>
                            Clinical Diagnosis *
                        </label>

                        <div className="relative">
                            <FileText
                                size={17}
                                className="absolute left-3 top-3 text-gray-400"
                            />

                            <textarea
                                name="diagnosis"
                                rows={4}
                                value={formData.diagnosis}
                                onChange={handleChange}
                                required
                                placeholder="Clinical findings and diagnosis details..."
                                className={`${inputClass} pl-10 resize-y`}
                            />
                        </div>

                        {errors.diagnosis && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.diagnosis}
                            </p>
                        )}
                    </div>

                    {/* Clinical Notes */}
                    <div>
                        <label className={labelClass}>
                            Clinical Notes & Prescriptions
                            <span className="text-gray-400 font-normal ml-1">
                                (Optional)
                            </span>
                        </label>

                        <div className="relative">
                            <ClipboardList
                                size={17}
                                className="absolute left-3 top-3 text-gray-400"
                            />

                            <textarea
                                name="notes"
                                rows={4}
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Post-procedure instructions, medication prescribed, follow-up recommendations..."
                                className={`${inputClass} pl-10 resize-y`}
                            />
                        </div>

                        {errors.notes && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.notes}
                            </p>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-gray-100">

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition whitespace-nowrap cursor-pointer"
                        >
                            {submitting ? (
                                <LoaderCircle
                                    size={17}
                                    className="animate-spin"
                                />
                            ) : (
                                <Save size={17} />
                            )}

                            {submitting
                                ? "Saving Treatment..."
                                : "Complete & Save Treatment Record"}
                        </button>

                        <button
                            type="button"
                            disabled={submitting}
                            onClick={() =>
                                navigate(`/dentist/appointments/${id}`)
                            }
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 font-medium rounded-lg text-sm transition cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TreatmentForm;
