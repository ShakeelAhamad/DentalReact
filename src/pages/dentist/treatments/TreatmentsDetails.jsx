import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    UserRound,
    Phone,
    Stethoscope,
    ClipboardList,
    FileText,
    CalendarCheck,
    LoaderCircle,
    AlertCircle,
    Hash,
} from "lucide-react";

import { toast } from "react-hot-toast";

import treatmentService from "../../../services/dentist/treatmentService";
import usePageTitle from "../../../hooks/usePageTitle";

function TreatmentDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    usePageTitle("Treatment Details");

    const [treatment, setTreatment] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch Treatment Details
    const fetchTreatment = useCallback(async () => {
        try {
            setLoading(true);

            const response = await treatmentService.getTreatmentById(id);

            if (response?.success === false) {
                throw new Error(
                    response.message || "Unable to load treatment record."
                );
            }

            const result = response?.data ?? response;
            const item = result?.data ?? result;

            if (!item || !item.id) {
                throw new Error("Treatment record not found.");
            }

            setTreatment(item);

        } catch (error) {
            console.error("Treatment details loading error:", error);

            setTreatment(null);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to load treatment details."
            );

        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTreatment();
    }, [fetchTreatment]);

    // Format Date
    const formatDate = (date) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) return "N/A";

        return parsedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "2-digit",
            year: "numeric",
        });
    };

    // Patient Information
    const patientName =
        treatment?.patientName ||
        treatment?.patientName ||
        treatment?.patientName ||
        "Patient";

    const patientPhone =
        treatment?.patientPhoneNumber ||
        treatment?.patientPhoneNumber ||
        treatment?.patientPhoneNumber ||
        "No phone";

    const treatmentDate =
        treatment?.treatmentDate || treatment?.treatmentDate;

    // Associated Appointment
    const appointmentId =
        treatment?.appointmentId ||
        treatment?.appointmentId;

    // Back Navigation
    const handleBack = () => {
        navigate("/dentist/treatments");
    };

    const handleAppointment = () => {
        navigate(`/dentist/appointments/${appointmentId}`);
    };

    // Full Page Loading
    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <LoaderCircle
                    size={40}
                    className="text-indigo-600 animate-spin"
                />

                <p className="mt-4 text-sm font-medium text-gray-600">
                    Loading treatment details...
                </p>
            </div>
        );
    }

    // Record Not Found
    if (!treatment) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">

                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertCircle size={30} className="text-red-500" />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-gray-800">
                    Treatment Record Not Found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    Unable to find the requested treatment record.
                </p>

                <button
                    onClick={handleBack}
                    className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
                >
                    <ArrowLeft size={16} />
                    Back to Treatment Records
                </button>

            </div>
        );
    }

    return (
        <div className="max-w-3xl space-y-6">

            {/* Treatment Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

                {/* Header */}
                <div className="flex justify-between items-start border-b border-gray-100 pb-4 gap-4">

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <Stethoscope
                                    size={19}
                                    className="text-indigo-600"
                                />
                            </div>

                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Treatment Record #{treatment.id}
                            </span>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900">
                            {treatment.treatment || "Treatment"}
                        </h2>

                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                            <CalendarDays size={14} />

                            Date of Treatment:

                            <strong className="text-gray-700">
                                {formatDate(treatmentDate)}
                            </strong>
                        </p>
                    </div>

                    {/* Status */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full whitespace-nowrap">
                        <CheckCircle2 size={14} />
                        Completed
                    </span>

                </div>

                {/* Patient Summary */}
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    {/* Patient Information */}
                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                            <UserRound
                                size={21}
                                className="text-indigo-600"
                            />
                        </div>

                        <div>
                            <span className="text-xs text-gray-400 block">
                                Patient
                            </span>

                            <strong className="text-gray-900 text-base">
                                {patientName}
                            </strong>

                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <Phone size={12} />
                                {patientPhone}
                            </div>
                        </div>

                    </div>

                    {/* Associated Appointment */}
                    {appointmentId && (
                        <div className="sm:text-right">

                            <span className="text-xs text-gray-400 block mb-1">
                                Associated Appointment
                            </span>

                            <button
                                onClick={handleAppointment}
                                className="inline-flex items-center gap-1 text-teal-600 font-semibold text-xs hover:text-teal-800 hover:underline"
                            >
                                <CalendarCheck size={14} />

                                Appointment #{appointmentId}

                                <span>→</span>
                            </button>

                        </div>
                    )}

                </div>

                {/* Clinical Information */}
                <div className="space-y-5">

                    {/* Diagnosis */}
                    <div>
                        <h3 className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            <ClipboardList size={15} />
                            Diagnosis
                        </h3>

                        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                            {treatment.diagnosis || "No diagnosis available."}
                        </div>
                    </div>

                    {/* Clinical Notes & Prescription */}
                    {treatment.treatmentDesc && (
                        <div>
                            <h3 className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                <FileText size={15} />
                                Clinical Notes & Prescription
                            </h3>

                            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                                {treatment.treatmentDesc}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 pt-4 flex flex-wrap items-center justify-between gap-3">

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Hash size={14} />
                        Record ID: {treatment.id}
                    </div>

                    <span className="text-xs text-teal-600 font-medium flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        Treatment Documented
                    </span>

                </div>

            </div>

            {/* Back Button */}
            <div>
                <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 font-medium transition cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    Back to Treatment Records
                </button>
            </div>

        </div>
    );
}

export default TreatmentDetails;