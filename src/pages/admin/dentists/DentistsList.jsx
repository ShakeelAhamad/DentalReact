
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    UserRound,
    Plus,
    Pencil,
    Trash2,
    Phone,
    Mail,
    GraduationCap,
    BriefcaseMedical,
    RefreshCw
} from "lucide-react";

import dentistService from "../../../services/dentistService";
import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import usePageTitle from "../../../hooks/usePageTitle";

const DentistList = () => {
    const [dentists, setDentists] = useState([]);
    const [search, setSearch] = useState("");
    usePageTitle("Dentists List");

    const [pageNumber, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    // Fetch dentists
    const fetchDentists = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await dentistService.getDentists({
                search,
                pageNumber,
                pageSize
            });
            console.log(response);
            const records = Array.isArray(response.data.data)
                ? response.data.data
                : [];

            setDentists(records);
            setTotalCount(
                response.data.totalRecords ?? response.data.totalCount ?? 0
            );

        } catch (err) {
            console.error(err);

            setDentists([]);
            setTotalCount(0);
            toast.error(err.response?.data?.message ||
                "Unable to load dentists. Please check your API connection.");
            setError(
                err.response?.data?.message ||
                "Unable to load dentists. Please check your API connection."
            );
        } finally {
            setLoading(false);
        }
    }, [search, pageNumber, pageSize]);

    useEffect(() => {
        fetchDentists();
    }, [fetchDentists]);

    // Search
    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    // Delete dentist
    const handleDelete = async (dentist) => {
        const id = dentist.userId ?? dentist.id;

        const confirmed = window.confirm(
            `Are you sure you want to delete ${dentist.fullName ?? dentist.name}?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(id);

            await dentistService.deleteDentist(id);

            // If last record on page, move to previous page
            if (dentists.length === 1 && pageNumber > 1) {
                setPage((current) => current - 1);
            } else {
                fetchDentists();
            }

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message ||
                "Unable to delete dentist.");
            setError(
                err.response?.data?.message ||
                "Unable to delete dentist."
            );
        } finally {
            setDeletingId(null);
        }
    };

    // Dentist status
    const getStatus = (status) => {
        const active =
            status === true ||
            status === 1 ||
            String(status).toLowerCase() === "active";

        return active ? "Active" : "Inactive";
    };

    // Table columns
    const columns = [
        {
            key: "fullName",
            header: "Dentist",
            render: (dentist) => (
                <div className="flex items-center gap-3">
                    {dentist.profileImage ? (
                        <img
                            src={dentist.profileImage}
                            alt={dentist.fullName}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                            <UserRound size={20} />
                        </div>
                    )}

                    <div className="min-w-0">
                        <div className="font-semibold text-gray-900">
                            {dentist.fullName ?? dentist.name ?? "Unknown"}
                        </div>

                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                            <Mail size={12} />
                            {dentist.email ?? "N/A"}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: "specialization",
            header: "Specialization",
            render: (dentist) => (
                <div>
                    <div className="flex items-center gap-1.5 font-medium text-gray-800">
                        <BriefcaseMedical
                            size={14}
                            className="text-indigo-500"
                        />
                        {dentist.specialization ?? "General"}
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                        <GraduationCap size={13} />
                        {dentist.qualification ?? "N/A"}
                    </div>
                </div>
            )
        },
        {
            key: "experience",
            header: "Experience",
            render: (dentist) => (
                <span className="font-medium text-gray-700">
                    {dentist.experience
                        ? `${dentist.experience} Years`
                        : "N/A"}
                </span>
            )
        },
        {
            key: "phone",
            header: "Phone",
            render: (dentist) => (
                <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={14} className="text-gray-400" />
                    {dentist.phoneNumber ?? "N/A"}
                </div>
            )
        },
        {
            key: "status",
            header: "Status",
            render: (dentist) => {
                const status = getStatus(dentist.status);
                const active = status === "Active";

                return (
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                        }`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${
                                active ? "bg-green-500" : "bg-red-400"
                            }`}
                        />
                        {status}
                    </span>
                );
            }
        },
        {
            key: "actions",
            header: "Actions",
            headerClassName: "text-right",
            className: "text-right",
            render: (dentist) => {
                const id = dentist.id ?? dentist.id;
                return (
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            to={`/admin/dentists/${id}/edit`}
                            title="Edit dentist"
                            className="text-indigo-600 hover:text-indigo-800"
                        >
                            <Pencil size={17} />
                        </Link>

                        <button
                            type="button"
                            disabled={deletingId === id}
                            onClick={() => handleDelete(dentist)}
                            title="Delete dentist"
                            className="text-red-500 hover:text-red-700 disabled:opacity-50 cursor-pointer"
                        >
                            <Trash2 size={17} />
                        </button>
                    </div>
                );
            }
        }
    ];

    return (
        <div className="space-y-6">

            {/* Page Heading */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Dentists
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage Dental Practitioners
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={fetchDentists}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>

                    <Link
                        to="/admin/dentists/create"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 cursor-pointer"
                    >
                        <Plus size={17} />
                        Register Dentist
                    </Link>
                </div>
            </div>

            {/* Dentist List */}
            <div className="space-y-4 bg-white">

                {/* Table Heading */}
                <div className="flex flex-col gap-3 rounded-xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-semibold text-gray-900">
                            All Dentists
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            {totalCount} registered dentists
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <UserRound
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search dentists..."
                            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                </div>

                {/* Reusable Table */}
                <DataTable
                    columns={columns}
                    data={dentists}
                    loading={loading}
                    error={error}
                    rowKey="userId"
                    emptyMessage="No dentists registered yet."
                    loadingMessage="Loading dentists..."
                    minWidth="900px"
                />

                {/* Reusable Pagination */}
                {!loading && !error && (
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
                )}
            </div>
        </div>
    );
};

export default DentistList;
