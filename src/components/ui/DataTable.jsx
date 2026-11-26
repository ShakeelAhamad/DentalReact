
import { RefreshCw, Database } from "lucide-react";

function DataTable({
  columns = [],
  data = [],
  loading = false,
  error = "",
  rowKey = "id",
  emptyMessage = "No records found.",
  loadingMessage = "Loading records...",
  minWidth = "800px",
}) {
  return (
    <div className="overflow-hidden bg-white">

      <div className="overflow-x-auto">
        <table
          className="w-full text-left"
          style={{ minWidth }}
        >

          {/* Table Header */}
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-5 py-4 font-semibold ${
                    column.headerClassName || ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">

            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center"
                >
                  <RefreshCw
                    size={22}
                    className="mx-auto mb-3 animate-spin text-indigo-600"
                  />
                  <p className="text-gray-500">
                    {loadingMessage}
                  </p>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-red-600"
                >
                  {error}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center"
                >
                  <Database
                    size={30}
                    className="mx-auto mb-3 text-gray-300"
                  />
                  <p className="font-medium text-gray-700">
                    {emptyMessage}
                  </p>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row[rowKey] ?? index}
                  className="transition hover:bg-gray-50"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-5 py-4 ${
                        column.className || ""
                      }`}
                    >
                      {column.render
                        ? column.render(row, index)
                        : row[column.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>

    </div>
  );
}

export default DataTable;
