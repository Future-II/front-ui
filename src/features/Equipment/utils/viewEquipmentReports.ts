import { Report, ReportStatus, ProgressState } from '../types';

export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffDays = Math.floor(
        (startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const timeString = date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    if (diffDays === 0) return `Today, ${timeString}`;
    if (diffDays === 1) return `Yesterday, ${timeString}`;
    return `${diffDays} days ago, ${timeString}`;
}

export function getReportStatus(report: Report): ReportStatus {
    const incompleteCount = report.asset_data.filter(a => a.submitState === 0).length;
    if (incompleteCount === 0) return "green";
    if (incompleteCount === report.asset_data.length) return "orange";
    return "yellow";
}

export function sortReportsByDate(reports: Report[]): Report[] {
    return reports.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    });
}

export function shouldShowControls(state: ProgressState): boolean {
    const checkingStatuses = ['CHECKING', 'CHECK_STARTED', 'CHECK_COMPLETE'];
    return !checkingStatuses.includes(state.status) && state.actionType !== "check";
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));