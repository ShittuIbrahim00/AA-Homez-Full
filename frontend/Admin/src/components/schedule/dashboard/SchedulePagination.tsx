import React from "react";

interface SchedulePaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  displayedSchedules: number;
}

const SchedulePagination: React.FC<SchedulePaginationProps> = ({
  page,
  totalPages,
  setPage,
  displayedSchedules,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="text-xs sm:text-sm text-gray-600">
          Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              const newPage = Math.max(page - 1, 1);
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={page === 1}
            className={`p-1.5 sm:p-2 rounded-lg ${
              page === 1 
                ? "text-gray-300 cursor-not-allowed" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            aria-label="Previous page"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          {/* Page numbers */}
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            // Show first, last, current, and nearby pages
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= page - 1 && pageNum <= page + 1)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setPage(pageNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    page === pageNum
                      ? "bg-orange-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label={`Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            }
            
            // Show ellipsis for skipped pages
            if (pageNum === page - 2 || pageNum === page + 2) {
              return (
                <span key={pageNum} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                  ...
                </span>
              );
            }
            
            return null;
          })}
          
          <button
            onClick={() => {
              const newPage = Math.min(page + 1, totalPages);
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={page === totalPages}
            className={`p-1.5 sm:p-2 rounded-lg ${
              page === totalPages 
                ? "text-gray-300 cursor-not-allowed" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            aria-label="Next page"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-600">
          {displayedSchedules} items
        </div>
      </div>
    </div>
  );
};

export default SchedulePagination;