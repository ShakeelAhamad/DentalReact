
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Users,
  Eye,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import patientsService from "../../../services/patientsService";
import usePageTitle from "../../../hooks/usePageTitle";



function PatientsList() {
  const [patients, setPatients] = useState([]);
  usePageTitle("Patients List");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Patient name
  const getPatientName = (patient) => {
    return patient.user?.name || patient.fullName || "Unknown";
  };

  // Patient email
  const getPatientEmail = (patient) => {
    return patient.user?.email || patient.email || "No email available";
  };

  // Patient avatar
  const PatientAvatar = ({ name }) => (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
      <span className="text-sm font-bold">
        {name?.trim()?.charAt(0)?.toUpperCase() || "P"}
      </span>
    </div>
  );

  // Fetch patients
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await patientsService.getAll({
        pageNumber: page,
        pageSize,
        search,
      });
      console.log(response)
      const items = response.data || response.data || [];

      setPatients(items);
      setTotalCount(
        response.totalRecords ?? response.totalRecords ?? response.totalRecords
      );
    } catch (err) {
      console.error("Patients loading error:", err);

      const message =
        err.response?.data?.message || "Failed to load patients.";

      setError(message);
      setPatients([]);
      setTotalCount(0);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Search
  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  };

  // Clear search
  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  // DataTable columns
  const columns = [
    {
      key: "patient",
      header: "Patient",
      render: (patient) => {
        const name = getPatientName(patient);

        return (
          <div className="flex min-w-0 items-center gap-3">
            <PatientAvatar name={name} />

            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900">
                {name}
              </p>

              <p className="truncate text-xs text-gray-500">
                {getPatientEmail(patient)}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "phone",
      header: "Phone",
      render: (patient) => (
        <span className="whitespace-nowrap">
          {patient.phoneNumber || "N/A"}
        </span>
      ),
    },
    {
      key: "dateOfBirth",
      header: "Date of Birth",
      render: (patient) => (
        <span className="whitespace-nowrap">
          {formatDate(patient.dateOfBirth)}
        </span>
      ),
    },
    {
      key: "gender",
      header: "Gender",
      render: (patient) => (
        <span className="capitalize">
          {patient.gender || "N/A"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (patient) => (
        <Link
          to={`/admin/patients/${patient.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
        >
          <Eye size={15} />
          View Profile
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Patients
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Registered Clinic Patients
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
          <Users size={22} className="text-indigo-600" />

          <div>
            <p className="text-xs text-gray-500">
              Total Patients
            </p>

            <p className="text-lg font-bold text-gray-900">
              {totalCount}
            </p>
          </div>
        </div>
      </div>



      {/* Desktop DataTable */}
      <div className="bg-white">
        {/* Search */}
        <div className="flex flex-col gap-4 border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">
              All Patients
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Search and manage registered patients.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex w-full gap-2 sm:max-w-md"
          >
            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search name, email or phone..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
            >
              <Search size={16} />
              Search
            </button>
          </form>
        </div>
        <div className="overflow-hidden border border-gray-100 bg-white shadow-sm">
          <DataTable
            columns={columns}
            data={patients}
            loading={loading}
            error={error}
            rowKey="id"
            emptyMessage="No patients found."
            loadingMessage="Loading patients..."
            minWidth="900px"
          />
        </div>
        {/* Reusable Pagination */}
        {!loading && !error && (
          <div className="border border-gray-100 bg-white px-4 py-3 shadow-sm">
            <Pagination
              currentPage={page}
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
}

export default PatientsList;
