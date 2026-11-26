
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    Clock,
    UserRound,
    Trash2,
    Save,
    Loader2,
    AlertCircle,
    CheckCircle2,
    XCircle,
} from "lucide-react";

import { toast } from "react-hot-toast";

import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import scheduleService from "../../../services/dentist/scheduleService";

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const initialForm = {
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "17:00",
};

const Schedule = () => {
    const [workingHours, setWorkingHours] = useState([]);

    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Pagination
    const [pageNumber, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    // ----------------------------------
    // Fetch Working Hours
    // ----------------------------------

    const fetchWorkingHours = useCallback(async () => {
        try {
            setLoading(true);

            const response = await scheduleService.getAll({
                pageNumber: pageNumber,
                pageSize,
            });

            if (response?.success === false) {
                throw new Error(
                    response.message || "Failed to load working hours."
                );
            }

            const result = response?.data ?? response;

            // Supports both paginated and simple array responses
            const items = Array.isArray(result)
                ? result
                : result?.items ??
                  result?.workingHours ??
                  result?.data ??
                  [];

            setWorkingHours(items);
            setTotalCount(result?.totalRecords ?? result?.totalRecords);
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                error.message ||
                "Unable to load working hours."
            );
            setTotalCount(0)
            setWorkingHours([]);
        } finally {
            setLoading(false);
        }
    }, [pageNumber, pageSize]);

    useEffect(() => {
        fetchWorkingHours();
    }, [fetchWorkingHours]);

    // ----------------------------------
    // Form Validation
    // ----------------------------------

    const validateForm = () => {
        const newErrors = {};

        if (!formData.dayOfWeek) {
            newErrors.dayOfWeek = "Please select a day.";
        }

        if (!formData.startTime) {
            newErrors.startTime = "Start time is required.";
        }

        if (!formData.endTime) {
            newErrors.endTime = "End time is required.";
        }

        if (
            formData.startTime &&
            formData.endTime &&
            formData.endTime <= formData.startTime
        ) {
            newErrors.endTime =
                "End time must be later than start time.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ----------------------------------
    // Handle Input Changes
    // ----------------------------------

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
            ...(name === "startTime" || name === "endTime"
                ? { endTime: "" }
                : {}),
        }));
    };

    // ----------------------------------
    // Create / Update Schedule
    // ----------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);

            const payload = {
                DayOfWeek: formData.dayOfWeek,
                StartTime: formData.startTime,
                EndTime: formData.endTime,
            };

            const response = await scheduleService.create(payload);

            if (response?.success === false) {
                throw new Error(
                    response.message || "Unable to save shift."
                );
            }

            toast.success(
                response?.message || "Working hours saved successfully."
            );

            setFormData(initialForm);
            setErrors({});

            await fetchWorkingHours();
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    };

    // ----------------------------------
    // Delete Working Hours
    // ----------------------------------

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this shift?")) {
            return;
        }

        try {
            setDeletingId(id);

            const response = await scheduleService.delete(id);

            if (response?.success === false) {
                throw new Error(
                    response.message || "Unable to remove shift."
                );
            }

            toast.success(
                response?.message || "Working hours removed successfully."
            );

            // Move to previous page if the current page becomes empty
            if (workingHours.length === 1 && currentPage > 1) {
                setCurrentPage((prev) => prev - 1);
            } else {
                await fetchWorkingHours();
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                error.message ||
                "Unable to remove working hours."
            );
        } finally {
            setDeletingId(null);
        }
    };

    // ----------------------------------
    // Format Time
    // ----------------------------------

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

    // ----------------------------------
    // DataTable Columns
    // ----------------------------------

    const columns = useMemo(
        () => [
            {
                header: "Day",
                key: "dayOfWeek",
                render: (row) => (
                    <span className="font-semibold text-gray-900">
                        {row.dayOfWeek || row.day_of_week}
                    </span>
                ),
            },
            {
                header: "Working Hours",
                key: "startTime",
                render: (row) => (
                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={15} className="text-teal-600" />

                        <span>
                            {formatTime(row.startTime || row.start_time)}
                            {" - "}
                            {formatTime(row.endTime || row.end_time)}
                        </span>
                    </div>
                ),
            },
            {
                header: "Status",
                key: "isAvailable",
                render: (row) => {
                    const available =
                        row.isAvailable ?? row.is_available ?? false;

                    return (
                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
                                available
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {available ? (
                                <CheckCircle2 size={13} />
                            ) : (
                                <XCircle size={13} />
                            )}

                            {available ? "Available" : "Unavailable"}
                        </span>
                    );
                },
            },
            {
                header: "Actions",
                key: "id",
                render: (row) => {
                    const id = row.id ?? row.Id;

                    return (
                        <button
                            type="button"
                            onClick={() => handleDelete(id)}
                            disabled={deletingId === id}
                            className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 disabled:opacity-50 text-xs font-semibold transition cursor-pointer"
                        >
                            {deletingId === id ? (
                                <Loader2 size={15} className="animate-spin" />
                            ) : (
                                <Trash2 size={15} />
                            )}

                            {deletingId === id ? "Removing..." : "Remove"}
                        </button>
                    );
                },
            },
        ],
        [deletingId]
    );

    // ----------------------------------
    // Render
    // ----------------------------------

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-teal-600" size={24} />

                        <h2 className="text-xl font-bold text-gray-900">
                            My Working Hours
                        </h2>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage your weekly availability and working shifts.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <UserRound size={17} className="text-teal-600" />
                    Dentist Schedule
                </div>
            </div>

            {/* Add / Update Schedule Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">

                <div className="flex items-center gap-2 mb-5">
                    <CalendarDays size={18} className="text-teal-600" />

                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                        Add / Update Shift
                    </h3>
                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start"
                >
                    {/* Day */}
                    <div>
                        <label
                            htmlFor="dayOfWeek"
                            className="block text-xs font-medium text-gray-700 mb-1.5"
                        >
                            Day of Week <span className="text-red-500">*</span>
                        </label>

                        <select
                            id="dayOfWeek"
                            name="dayOfWeek"
                            value={formData.dayOfWeek}
                            onChange={handleChange}
                            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${
                                errors.dayOfWeek
                                    ? "border-red-400"
                                    : "border-gray-300"
                            }`}
                        >
                            <option value="">Select Day</option>

                            {DAYS.map((day) => (
                                <option key={day} value={day}>
                                    {day}
                                </option>
                            ))}
                        </select>

                        {errors.dayOfWeek && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle size={13} />
                                {errors.dayOfWeek}
                            </p>
                        )}
                    </div>

                    {/* Start Time */}
                    <div>
                        <label
                            htmlFor="startTime"
                            className="block text-xs font-medium text-gray-700 mb-1.5"
                        >
                            Start Time <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="time"
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${
                                errors.startTime
                                    ? "border-red-400"
                                    : "border-gray-300"
                            }`}
                        />

                        {errors.startTime && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.startTime}
                            </p>
                        )}
                    </div>

                    {/* End Time */}
                    <div>
                        <label
                            htmlFor="endTime"
                            className="block text-xs font-medium text-gray-700 mb-1.5"
                        >
                            End Time <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="time"
                            id="endTime"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${
                                errors.endTime
                                    ? "border-red-400"
                                    : "border-gray-300"
                            }`}
                        />

                        {errors.endTime && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.endTime}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="pt-0 sm:pt-5">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-sm transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Shift
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Current Schedule List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h3 className="font-semibold text-gray-800">
                            Current Weekly Schedule
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                            Manage your weekly working shifts.
                        </p>
                    </div>

                    <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full">
                        {totalCount} Total Shifts
                    </span>
                </div>

                <div className="p-3 sm:p-5 overflow-x-auto">

                    <DataTable
                        columns={columns}
                        data={workingHours}
                        loading={loading}
                        error={null}
                        rowKey="id"
                    />

                    {!loading && workingHours.length === 0 && (
                        <div className="py-8 text-center">
                            <CalendarDays
                                size={35}
                                className="mx-auto text-gray-300 mb-2"
                            />

                            <p className="text-sm text-gray-500">
                                No working hours set yet.
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                Add a shift using the form above.
                            </p>
                        </div>
                    )}

                </div>

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
            </div>
        </div>
    );
};

export default Schedule;
