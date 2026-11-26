
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    Clock3,
    UserRound,
    Phone,
    Stethoscope,
    Eye,
    ClipboardPlus,
    Filter,
    RotateCcw,
    LoaderCircle,
    CheckCircle2,
    Clock,
    CircleX,
    ListFilter,
} from "lucide-react";

import toast from "react-hot-toast";
import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import appointmentService from "../../../services/dentist/appointmentService";
import usePageTitle from "../../../hooks/usePageTitle";

const PAGE_SIZE = 10;

const statusFilters = [
    { label: "All", value: "", icon: ListFilter },
    { label: "Pending", value: "Pending", icon: Clock },
    { label: "Confirmed", value: "Confirmed", icon: CheckCircle2 },
    { label: "Completed", value: "Completed", icon: CheckCircle2 },
];

const statusStyles = {
    pending: {
        label: "Pending",
        icon: Clock,
        badge: "bg-amber-50 text-amber-700 border border-amber-200",
        dot: "bg-amber-500",
    },
    confirmed: {
        label: "Confirmed",
        icon: CheckCircle2,
        badge: "bg-teal-50 text-teal-700 border border-teal-200",
        dot: "bg-teal-500",
    },
    completed: {
        label: "Completed",
        icon: CheckCircle2,
        badge: "bg-purple-50 text-purple-700 border border-purple-200",
        dot: "bg-purple-500",
    },
    cancelled: {
        label: "Cancelled",
        icon: CircleX,
        badge: "bg-red-50 text-red-700 border border-red-200",
        dot: "bg-red-500",
    },
};

const getStatus = (status) => {
    return statusStyles[String(status || "").toLowerCase()] || {
        label: status || "Unknown",
        icon: Clock,
        badge: "bg-gray-100 text-gray-700 border border-gray-200",
        dot: "bg-gray-500",
    };
};

const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
};

const formatTime = (value) => {
    if (!value) return "—";

    // Already formatted: 12:00 PM
    if (/\b(AM|PM)\b/i.test(value)) {
        return value;
    }

    // Convert 24-hour format: 12:00:00
    const [hours, minutes] = value.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
};

function AppointmentsList() {
    const navigate = useNavigate();
    usePageTitle("Dentist Appointments");

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");

    const [appliedDate, setAppliedDate] = useState("");

    const [pageNumber, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);

            const params = {
                pageNumber: pageNumber,
                pageSize,
            };

            if (status) {
                params.status = status;
            }

            if (appliedDate) {
                params.date = appliedDate;
            }

            const response = await appointmentService.getAll(params);

            if (response?.success === false) {
                throw new Error(
                    response.message || "Unable to load appointments."
                );
            }

            // Expected API response:

            const result = response?.data ?? response;
            console.log(response.totalRecords);
            // const records = Array.isArray(response.data) ? response.data : response.data ?? [];
            const items = Array.isArray(result)
                ? result
                : result?.data ?? [];

            setAppointments(result);
            setTotalCount(response?.totalRecords ?? response?.totalRecords);

        } catch (error) {
            console.error("Appointments loading error:", error);
            setAppointments([]);
            setTotalCount(0)
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to load appointments."
            );
        } finally {
            setLoading(false);
        }
    }, [status, appliedDate, pageNumber, pageSize]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // Status filter
    const handleStatusChange = (value) => {
        setStatus(value);
        setPage(1);
    };

    // Date filter
    const handleDateFilter = (e) => {
        e.preventDefault();
        setAppliedDate(date);
        setPage(1);
    };

    // Reset filters
    const handleReset = () => {
        setStatus("");
        setDate("");
        setAppliedDate("");
        setPage(1);
    };

    // DataTable columns
    const columns = [
        {
            header: "Date & Time",
            key: "appointmentDate",
            render: (row) => (
                <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <CalendarDays size={17} />
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900">
                            {formatDate(row.appointmentDate)}
                        </p>

                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock3 size={12} />
                            {formatTime(row.startTime)}
                            {row.endTime && (
                                <> - {formatTime(row.endTime)}</>
                            )}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            header: "Patient",
            key: "patientName",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                        <UserRound size={17} />
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900">
                            {row.patientName || "Patient"}
                        </p>

                        {row.patientPhone && (
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                <Phone size={11} />
                                {row.patientPhone}
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            header: "Service",
            key: "serviceName",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Stethoscope size={16} className="text-gray-400" />
                    <span className="font-mediumtext-gray-700 whitespace-nowrap">
                        {row.serviceName || "Service"}
                    </span>
                </div>
            ),
        },
        {
            header: "Status",
            key: "status",
            render: (row) => {
                const config = getStatus(row.status);
                const StatusIcon = config.icon;

                return (
                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.badge}`}
                    >
                        <StatusIcon size={13} />
                        {config.label}
                    </span>
                );
            },
        },
        {
            header: "Actions",
            key: "id",
            render: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/dentist/appointments/${row.id}`)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
                    >
                        <Eye size={14} />
                        Details
                    </button>

                    {!["completed", "cancelled"].includes(
                        String(row.status).toLowerCase()
                    ) && (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`/dentist/treatments/create/${row.id}`)
                                }
                                className="inline-flex items-center gap-1.5 px-3 whitespace-nowrap py-2 rounded-lg text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition cursor-pointer"
                            >
                                <ClipboardPlus size={14} />
                                Treat Patient
                            </button>
                        )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">

            {/* Page Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">
                        My Appointments
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage and monitor your clinical appointments.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays size={17} className="text-indigo-600" />
                    Total Appointments:
                    <span className="font-bold text-gray-900">
                        {totalCount}
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col xl:flex-row justify-between gap-4">

                    {/* Status Tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                        {statusFilters.map((item) => {
                            const Icon = item.icon;
                            const active = status === item.value;

                            const colors = {
                                "": active
                                    ? "bg-slate-900 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",

                                Pending: active
                                    ? "bg-amber-500 text-white"
                                    : "bg-amber-50 text-amber-700 hover:bg-amber-100",

                                Confirmed: active
                                    ? "bg-teal-600 text-white"
                                    : "bg-teal-50 text-teal-700 hover:bg-teal-100",

                                Completed: active
                                    ? "bg-purple-600 text-white"
                                    : "bg-purple-50 text-purple-700 hover:bg-purple-100",
                            };

                            return (
                                <button
                                    key={item.value || "all"}
                                    type="button"
                                    onClick={() => handleStatusChange(item.value)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${colors[item.value]}`}
                                >
                                    <Icon size={14} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Date Filter */}
                    <form
                        onSubmit={handleDateFilter}
                        className="flex flex-wrap items-center gap-2"
                    >
                        <div className="relative">
                            <CalendarDays
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition"
                        >
                            <Filter size={14} />
                            Filter Date
                        </button>

                        {(status || date || appliedDate) && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition"
                            >
                                <RotateCcw size={13} />
                                Reset
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Table Heading */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Clinical Appointments
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                            View patient schedules and appointment status.
                        </p>
                    </div>

                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
                        {totalCount} Records
                    </span>
                </div>

                {/* Loader */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <LoaderCircle
                            size={35}
                            className="animate-spin text-indigo-600"
                        />

                        <p className="text-sm text-gray-500 mt-3">
                            Loading appointments...
                        </p>
                    </div>
                ) : (
                    <>
                        <DataTable
                            columns={columns}
                            data={appointments}
                            loading={false}
                            emptyMessage="No appointments found."
                        />

                        {/* Pagination */}
                        {!loading && totalCount > 0 && (
                            <div className="px-4 sm:px-5 pb-4">
                                <Pagination
                                    currentPage={pageNumber}
                                    totalRecords={totalCount}
                                    pageSize={pageSize}
                                    onPageChange={setPage}
                                    onPageSizeChange={(size) => {
                                        setPageSize(size);
                                        setPage(1);
                                    }}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default AppointmentsList;
