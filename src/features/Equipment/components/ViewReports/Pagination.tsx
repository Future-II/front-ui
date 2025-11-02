import React from 'react';

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface PaginationProps {
    pagination: PaginationData;
    currentPage: number;
    loading: boolean;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    pagination,
    currentPage,
    loading,
    onPageChange
}) => {
    if (pagination.totalPages <= 1) return null;

    const handlePrevious = () => {
        onPageChange(Math.max(1, currentPage - 1));
    };

    const handleNext = () => {
        onPageChange(currentPage + 1);
    };

    // Generate visible page numbers (current page and neighbors)
    const getVisiblePages = () => {
        const pages = [];
        const total = pagination.totalPages;
        const current = pagination.currentPage;
        
        // Always show first page
        if (current > 2) {
            pages.push(1);
            if (current > 3) pages.push('...');
        }
        
        // Show current page and neighbors
        for (let i = Math.max(1, current - 1); i <= Math.min(total, current + 1); i++) {
            pages.push(i);
        }
        
        // Always show last page
        if (current < total - 1) {
            if (current < total - 2) pages.push('...');
            pages.push(total);
        }
        
        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex flex-col items-center gap-4 mt-6 pb-4">
            {/* Loading indicator */}
            {loading && (
                <div className="flex items-center gap-2 text-indigo-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
                    <span className="text-sm">Loading reports...</span>
                </div>
            )}

            <div className="flex items-center gap-2">
                <button
                    onClick={handlePrevious}
                    disabled={!pagination.hasPrevPage || loading}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {visiblePages.map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-gray-500">...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page as number)}
                                    disabled={loading}
                                    className={`px-3 py-2 border rounded-md transition ${
                                        currentPage === page
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    disabled={!pagination.hasNextPage || loading}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalItems} total reports
            </div>
        </div>
    );
};

export default Pagination;