import { useState, useRef, useEffect } from "react";
import { Menu, LogOut, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { logOut } from "../../../features/auth/authSlice";
import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="px-4 py-2.5 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-2">
            <button
              type="button"
              className="sm:hidden text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link
              to="/dashboard"
              className="flex items-center gap-3 ms-2 md:me-24"
            >
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8"
                alt="DVLD Logo"
              />
              <span className="self-center text-xl font-bold whitespace-nowrap dark:text-white text-gray-900 tracking-tight">
                DVLD{" "}
                <span className="text-blue-600 dark:text-blue-500">System</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                type="button"
                className="flex items-center gap-2 text-sm focus:ring-4 focus:ring-blue-100 dark:focus:ring-gray-700 rounded-full p-0.5 transition-all"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-600"
                  src={`https://ui-avatars.com/api/?name=${user?.name || "Guest"}&background=0D8ABC&color=fff`}
                  alt="user avatar"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">
                      Signed in as
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {user?.name || "Guest User"}
                    </p>
                  </div>

                  <ul className="p-1.5 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      <Link
                        to={`/users/${user.id}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center w-full p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg gap-3 transition-colors"
                      >
                        <User className="size-4.5 text-blue-500" /> My Profile
                      </Link>
                    </li>
                  </ul>

                  <div className="p-1.5 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        dispatch(logOut());
                      }}
                      className="flex items-center w-full p-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg gap-3 font-semibold transition-colors"
                    >
                      <LogOut className="size-4.5" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
