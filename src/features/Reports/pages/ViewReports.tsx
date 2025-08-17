import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock4,
  TrendingUp,
  Activity,
  Database,
  FileText,
  Filter as FilterIcon,
} from "lucide-react";
import Table from "../../../shared/components/Common/Table";
import { reportData } from "../components/reportData";
import { columns } from "../components/reportColumns";

const ViewReports: React.FC = () => {
  const [search, setSearch] = useState("");

  // NEW: filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "All statuses" | "Complete" | "Processing" | "Error"
  >("All statuses");
  const [typeFilter, setTypeFilter] = useState<
    "All types" | "PDF" | "XLSX" | "CSV" | "ZIP"
  >("All types");

  // NEW: close dropdown on outside click
  const filterRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // UPDATED: filtered respects search + filters
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return reportData.filter((r) => {
      // search text
      const matchSearch =
        !q ||
        [
          r.reportNumber,
          r.propNumber,
          r.fileName,
          r.propertyType,
          r.location,
          r.requester,
          r.company,
          r.status,
          r.readyText,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      // status filter
      const matchStatus =
        statusFilter === "All statuses" ? true : r.status === statusFilter;

      // file type filter
      const matchType = typeFilter === "All types" ? true : r.fileType === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [search, statusFilter, typeFilter]);

  const totals = useMemo(() => {
    const total = reportData.length;
    const completed = reportData.filter((d) => d.status === "Complete").length;
    const errors = reportData.filter((d) => d.status === "Error").length;
    const processing = reportData.filter((d) => d.status === "Processing").length;
    const totalSizeMB = reportData.reduce(
      (a, d) => a + (parseFloat(d.size) || 0),
      0
    );
    const totalDownloads = reportData.reduce((a, d) => a + d.downloadsCount, 0);
    const totalRecords = reportData.reduce((a, d) => a + d.recordsCount, 0);
    return {
      total,
      completed,
      errors,
      processing,
      totalSizeMB,
      totalDownloads,
      totalRecords,
    };
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">View Reports</h1>
        <p className="text-gray-600">
          Track and monitor real estate reports from Mekyas
        </p>
      </div>

      {/* KPIs Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total reports</span>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold">{totals.total}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Completed</span>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-green-600">
            {totals.completed}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">With errors</span>
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-red-600">
            {totals.errors}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Processing</span>
            <Clock4 className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-yellow-600">
            {totals.processing}
          </div>
        </div>
      </div>

      {/* KPIs Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total size</span>
            <TrendingUp className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {totals.totalSizeMB.toFixed(1)} MB
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total downloads</span>
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {totals.totalDownloads}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total records</span>
            <Database className="h-5 w-5 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {totals.totalRecords}
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white">
        {/* Card header: title + search + filter */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4">
          <h3 className="text-base font-semibold text-gray-900">
            Report details
          </h3>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports..."
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FilterIcon className="h-4 w-4" />
                Filter
              </button>

              {filterOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-md border border-gray-200 bg-white shadow-lg p-3 z-50">
                  <div className="text-xs font-semibold text-gray-500 mb-1">Status</div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full rounded-md border border-gray-300 px-2 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All statuses</option>
                    <option>Complete</option>
                    <option>Processing</option>
                    <option>Error</option>
                  </select>

                  <div className="text-xs font-semibold text-gray-500 mt-3 mb-1">File type</div>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                    className="w-full rounded-md border border-gray-300 px-2 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All types</option>
                    <option>PDF</option>
                    <option>XLSX</option>
                    <option>CSV</option>
                    <option>ZIP</option>
                  </select>

                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      className="text-sm text-gray-600 hover:text-gray-800"
                      onClick={() => {
                        setStatusFilter("All statuses");
                        setTypeFilter("All types");
                      }}
                    >
                      Reset
                    </button>
                    <button
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                      onClick={() => setFilterOpen(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table columns={columns} data={filtered} />
        </div>

        <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-500">
          Showing {filtered.length} of {reportData.length} reports
        </div>
      </div>
    </div>
  );
};

export default ViewReports;
