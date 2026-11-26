
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
}) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const startRecord =
    totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalRecords === 0) return null;

  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

      {/* Record information */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span>
          Showing <strong>{startRecord}</strong> to{" "}
          <strong>{endRecord}</strong> of{" "}
          <strong>{totalRecords}</strong> records
        </span>

        {/* Page size */}
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-gray-200 px-2 py-1.5 outline-none focus:border-indigo-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Pagination buttons */}
      <div className="flex flex-wrap items-center gap-1">

        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          <ChevronLeft size={15} />
          Previous
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold cursor-pointer ${
              currentPage === page
                ? "bg-indigo-600 text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          Next
          <ChevronRight size={15} />
        </button>

      </div>
    </div>
  );
}

export default Pagination;
