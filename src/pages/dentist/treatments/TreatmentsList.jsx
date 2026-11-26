import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    UserRound,
    Phone,
    Stethoscope,
    Eye,
    RefreshCw,
    FileText,
} from "lucide-react";
import { toast } from "react-hot-toast";

import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import treatmentService from "../../../services/dentist/treatmentService";
import usePageTitle from "../../../hooks/usePageTitle";


function TreatmentsList() {
    const navigate = useNavigate();
    usePageTitle("Treatments List");
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [pageNumber, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));


    const fetchTreatments = useCallback(async () => {
        try {
            setLoading(true);

            const params = {
                pageNumber: pageNumber,
                pageSize: pageSize,
            };

            const response = await treatmentService.getAllTreatments(params);

            if (response?.success === false) {
                throw new Error(
                    response.message || "Unable to load treatments."
                );
            }

            // Expected API response
            const result = response?.data ?? response;

            const items = Array.isArray(result)
                ? result
                : result?.data ?? [];

            setTreatments(items);
            setTotalCount(result?.totalRecords ?? result?.totalRecords);

        } catch (error) {
            console.error("Treatments loading error:", error);
            setTreatments([]);
            setTotalCount(0)
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to load treatment records."
            );
        } finally {
            setLoading(false);
        }
    }, [pageNumber,pageSize]);

    useEffect(() => {
        fetchTreatments();
    }, [fetchTreatments]);

    // Pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Refresh
    const handleRefresh = () => {
        fetchTreatments();
    };

    // View treatment
    const handleView = (id) => {
        navigate(`/dentist/treatments/${id}`);
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) return "N/A";

        return parsedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

    // Table columns
    const columns = [
        {
            key: "treatmentDate",
            header: "Treatment Date",
            render: (row) => (
                <div className="flex items-center gap-2 font-medium text-gray-900 whitespace-nowrap">
                    <CalendarDays size={16} className="text-gray-400" />
                    {formatDate(row.treatmentDate || row.createdAt)}
                </div>
            ),
        },
        {
            key: "patientName",
            header: "Patient",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                        <UserRound
                            size={17}
                            className="text-indigo-600"
                        />
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900">
                            {row.patientName ||
                                row.patientName ||
                                row.patientName ||
                                "Patient"}
                        </p>

                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <Phone size={12} />
                            {row.patientPhoneNumber ||
                                row.patientPhoneNumber ||
                                row.patientPhoneNumber ||
                                "N/A"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "treatmentDesc",
            header: "Procedure Done",
            render: (row) => (
                <div className="flex items-center gap-2 font-medium text-teal-700">
                    <Stethoscope size={16} />
                    {row.treatmentDesc || "N/A"}
                </div>
            ),
        },
        {
            key: "diagnosis",
            header: "Diagnosis",
            render: (row) => (
                <p
                    className="text-gray-600 max-w-xs truncate"
                    title={row.diagnosis || ""}
                >
                    {row.diagnosis || "N/A"}
                </p>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            render: (row) => (
                <div className="flex justify-end">
                    <button
                        onClick={() => handleView(row.id || row.treatmentId)}
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold text-xs transition cursor-pointer"
                    >
                        <Eye size={15} />
                        View Full Record
                        <span>→</span>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        All Documented Treatments ({totalCount})
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        View and manage your documented patient treatments.
                    </p>
                </div>

                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Full Page Loading */}
            {loading ? (
                <div className="min-h-[50vh] flex flex-col items-center justify-center">
                    <RefreshCw
                        size={36}
                        className="text-indigo-600 animate-spin"
                    />

                    <p className="mt-4 text-sm font-medium text-gray-500">
                        Loading treatment records...
                    </p>
                </div>
            ) : (
                <>
                    {/* Treatment DataTable */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                        {treatments.length > 0 ? (
                            <DataTable
                                columns={columns}
                                key={columns}
                                data={treatments}
                            />
                        ) : (
                            <div className="py-16 text-center">
                                <FileText
                                    size={36}
                                    className="mx-auto text-gray-300"
                                />

                                <h3 className="mt-4 text-sm font-semibold text-gray-700">
                                    No Treatment Records Found
                                </h3>

                                <p className="mt-1 text-xs text-gray-400">
                                    No treatment records have been documented yet.
                                </p>
                            </div>
                        )}
                    

                    {/* Pagination */}
                    {!loading && totalCount > 0 && (
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
                </>
            )}
        </div>
    );
}

export default TreatmentsList;