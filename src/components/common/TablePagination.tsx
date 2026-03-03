interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (newPage: number) => void;
  isFetching?: boolean;
}

const TablePagination = ({
  page,
  pageSize,
  totalCount,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
  isFetching = false,
}: TablePaginationProps) => {
  const startEntry = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, totalCount);

  return (
    <footer className="flex flex-col md:flex-row justify-between items-center pt-4 px-2 gap-4">
      <span className="text-sm text-gray-700 dark:text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {startEntry}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {endEntry}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalCount}
        </span>{" "}
        Entries
      </span>

      <div className="inline-flex items-center">
        {isFetching && (
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
        )}

        <div className="inline-flex -space-x-px shadow-sm">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevious || isFetching}
            className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-3 h-3 rtl:rotate-180 mr-2"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            Prev
          </button>

          <div className="flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-gray-300 bg-blue-50 dark:border-gray-700 dark:bg-gray-700 dark:text-white font-medium">
            {page} <span className="mx-1 opacity-50">/</span> {totalPages || 1}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNext || isFetching}
            className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <svg
              className="w-3 h-3 rtl:rotate-180 ml-2"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default TablePagination;
