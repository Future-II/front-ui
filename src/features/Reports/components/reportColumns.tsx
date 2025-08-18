// src/features/reports/table/reportColumns.tsx
import React from "react";
import {
  FileText,
  FileSpreadsheet,
  Archive,
  CheckCircle2,
  XCircle,
  Clock4,
  ArrowDownToLine,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const FileBadge: React.FC<{ type: ReportRow["fileType"] }> = ({ type }) => {
  const styles: Record<
    ReportRow["fileType"],
    { icon: React.ReactNode; cls: string }
  > = {
    PDF: {
      icon: <FileText className="h-5 w-5 text-red-500" />,
      cls: "text-red-600",
    },
    XLSX: {
      icon: <FileSpreadsheet className="h-5 w-5 text-green-600" />,
      cls: "text-green-700",
    },
    CSV: {
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      cls: "text-blue-700",
    },
    ZIP: {
      icon: <Archive className="h-5 w-5 text-purple-600" />,
      cls: "text-purple-700",
    },
  };
  const s = styles[type];
  return (
    <div className="flex items-center gap-2">
      {s.icon}
      <span className={`text-sm font-medium ${s.cls}`}>{type}</span>
    </div>
  );
};

const StatusPill: React.FC<{ status: ReportRow["status"] }> = ({ status }) => {


  const { t } = useTranslation();
  if (status === "Complete") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {t("reportTable.status.Complete")}
      </span>
    );
  }
  if (status === "Error") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
        <XCircle className="h-3.5 w-3.5" />
        {t("reportTable.status.Error")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
      <Clock4 className="h-3.5 w-3.5" />
      {t("reportTable.status.Processing")}
    </span>
  );
};


interface ReportRow {
  reportNumber: string;
  propNumber: string;
  fileName: string;
  fileType: string;
  size: string;
  summary: string;
  propertyType: string;
  location: string;
  price: string;
  requester: string;
  company: string;
  status: string;
  uploadedAgo: string;
  processingMinutes?: number;
  lastModifiedAgo: string;
  recordsCount: number;
  downloadsCount: number;
  readyText: string;
}

export const useReportColumns = () => {
  const { t } = useTranslation();

  return [
    {
      header: t("reportTable.reportNumber"),
      accessor: "reportNumber",
      render: (_: unknown, row: ReportRow) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.reportNumber}</div>
          <div className="text-xs text-gray-500">{row.propNumber}</div>
        </div>
      ),
    },
    {
      header: t("reportTable.reportDetails"),
      accessor: "fileName",
      render: (_: unknown, row: ReportRow) => (
        <div className="flex items-start gap-3 min-w-0">
          <FileBadge type={row.fileType} />
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 break-words">
              {row.fileName}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {row.fileType} • {row.size}
            </div>
            <div className="mt-1 text-xs text-gray-600">{row.summary}</div>
          </div>
        </div>
      ),
    },
    {
      header: t("reportTable.propertyAndLocation"),
      accessor: "propertyType",
      render: (_: unknown, row: ReportRow) => (
        <div>
          <div className="text-sm font-medium text-gray-900 capitalize">
            {row.propertyType}
          </div>
          <div className="text-xs text-gray-600">{row.location}</div>
          <div className="mt-1 text-sm font-semibold text-emerald-600">
            {row.price}
          </div>
        </div>
      ),
    },
    {
      header: t("reportTable.requiredAndCompany"),
      accessor: "requester",
      render: (_: unknown, row: ReportRow) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.requester}</div>
          <div className="text-xs text-gray-600">{row.company}</div>
        </div>
      ),
    },
    {
      header: t("reportTable.reportStatus"),
      accessor: "status",
      render: (_: unknown, row: ReportRow) => (
        <div>
          <StatusPill status={row.status} />
          <div className="mt-1 text-xs text-gray-500">
            {t("reportTable.uploaded")}: {row.uploadedAgo}
          </div>
        </div>
      ),
    },
    {
      header: t("reportTable.timingAndPerformance"),
      accessor: "processingMinutes",
      render: (_: unknown, row: ReportRow) => (
        <div className="text-xs text-gray-600">
          <div>1/15/2024 10:30 AM</div>
          <div className="mt-1">
            <span className="text-gray-500">{t("reportTable.processing")}:</span>{" "}
            <span className="font-medium">{row.processingMinutes ?? 0}</span>{" "}
            {t("reportTable.minutes")}
          </div>
          <div className="mt-1 text-gray-500">
            {t("reportTable.lastModified")}: {row.lastModifiedAgo}
          </div>
        </div>
      ),
    },
    {
      header: t("reportTable.statistics"),
      accessor: "recordsCount",
      render: (_: unknown, row: ReportRow) => (
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 w-fit">
            {row.recordsCount}{" "}
            {row.recordsCount === 1
              ? t("reportTable.record")
              : t("reportTable.records")}
          </span>
          <span className="inline-flex items-center justify-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 w-fit">
            <ArrowDownToLine className="h-3.5 w-3.5" />
            {row.downloadsCount}{" "}
            {row.downloadsCount === 1
              ? t("reportTable.download")
              : t("reportTable.downloads")}
          </span>
        </div>
      ),
    },
    {
      header: t("reportTable.tracking"),
      accessor: "readyText",
      render: (_: unknown, row: ReportRow) => (
        <div className="flex flex-col gap-2">
          <button className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 w-fit">
            {t("reportTable.viewDetails")}
          </button>
          <span
            className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium w-fit ${
              row.readyText === "Ready to download"
                ? "border border-indigo-200 bg-indigo-50 text-indigo-700"
                : row.readyText === "Processing"
                ? "border border-yellow-200 bg-yellow-50 text-yellow-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {t(`reportTable.status.readyToDownload`)}
          </span>
        </div>
      ),
    },
  ];
};

