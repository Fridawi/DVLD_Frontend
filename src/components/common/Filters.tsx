import { useState } from "react";
import type { FilterOption } from "../../types/CommonTypes";

interface PeopleFiltersProps {
  filterOptions: FilterOption[];
  onSearch: (column: string, value: string) => void;
}

export default function Filters({
  filterOptions,
  onSearch,
}: PeopleFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterBy, setFilterBy] = useState(filterOptions[0]?.value || "");
  const [searchTerm, setSearchTerm] = useState("");

  const currentOption = filterOptions.find((opt) => opt.value === filterBy);

  const handleSelectFilter = (option: FilterOption) => {
    setFilterBy(option.value);
    setIsOpen(false);

    if (option.type === "select" && option.options?.length) {
      setSearchTerm(option.options[0].value);
    } else {
      setSearchTerm("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filterBy, searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("", "");
  };

  return (
    <form className="max-w-2xl w-full" onSubmit={handleSubmit}>
      <div className="flex shadow-sm rounded-lg relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center shrink-0 z-10 text-gray-900 bg-gray-100 border border-gray-300 hover:bg-gray-200 font-medium rounded-s-lg text-sm px-4 py-2.5 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
        >
          {currentOption?.label || "Filter By"}
          <svg className="w-2.5 h-2.5 ms-2.5" fill="none" viewBox="0 0 10 6">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            ></div>
            <div className="absolute top-12 left-0 z-20 bg-white border border-gray-200 rounded-lg shadow-xl w-48 dark:bg-gray-800 dark:border-gray-700">
              <ul className="p-1 text-sm text-gray-700 dark:text-gray-200">
                {filterOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => handleSelectFilter(option)}
                      className={`block w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
                        filterBy === option.value
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 font-semibold"
                          : "hover:bg-blue-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="relative w-full">
          {currentOption?.type === "select" ? (
            <select
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none cursor-pointer"
            >
              {currentOption.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder={`Search by ${currentOption?.label}...`}
            />
          )}

          {searchTerm && currentOption?.type !== "select" && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-400 hover:text-red-500"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <button
          type="submit"
          className="p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 flex items-center px-5 transition-all shadow-md active:scale-95"
        >
          <svg
            className="w-4 h-4 me-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </form>
  );
}
