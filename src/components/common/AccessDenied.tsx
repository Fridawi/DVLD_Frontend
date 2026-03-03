// components/common/AccessDenied.tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center animate-in fade-in duration-500">
      <h1 className="mb-4 text-7xl font-extrabold lg:text-9xl text-blue-600 dark:text-blue-500">
        403
      </h1>
      <p className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
        Access Denied.
      </p>
      <p className="mb-8 text-lg font-light text-gray-500 dark:text-gray-400 max-w-md">
        Sorry, you do not have sufficient permissions to access this page.
        Please contact the administrator if you believe this is an error.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-all dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 w-full sm:w-auto"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all w-full sm:w-auto shadow-lg shadow-blue-200 dark:shadow-none"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>
      </div>
    </div>
  );
}
