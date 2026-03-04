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
    setSearchTerm(
      option.type === "select" ? option.options?.[0]?.value || "" : "",
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filterBy, searchTerm);
  };

  return (
    <form className="w-full max-w-3xl" onSubmit={handleSubmit}>
      <div
        className="flex items-stretch bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1 transition-all duration-200 
                      focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500"
      >
        <div className="relative flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all shrink-0"
          >
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="hidden sm:inline-block max-w-25 truncate">
              {currentOption?.label || "Filter"}
            </span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute top-full left-0 z-20 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
                <div className="p-1">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelectFilter(option)}
                      className={`flex w-full items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                        filterBy === option.value
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 my-auto mx-1" />

        <div className="grow relative flex items-center">
          {currentOption?.type === "select" ? (
            <select
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full bg-transparent border-none text-sm text-gray-900 dark:text-white focus:ring-0 focus:outline-none cursor-pointer px-3"
            >
              {currentOption.options?.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="dark:bg-gray-800"
                >
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search by ${currentOption?.label.toLowerCase()}...`}
                className="w-full h-full bg-transparent border-none text-sm text-gray-900 dark:text-white focus:ring-0 focus:outline-none placeholder-gray-400 px-3"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors mr-1"
                >
                  <svg
                    className="w-4 h-4 text-gray-400"
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
            </>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 md:px-6 rounded-lg flex items-center justify-center transition-all active:scale-95 shadow-sm"
        >
          <svg
            className="w-4 h-4 md:mr-2"
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
          <span className="hidden md:inline-block font-bold text-sm">
            Search
          </span>
        </button>
      </div>
    </form>
  );
}
