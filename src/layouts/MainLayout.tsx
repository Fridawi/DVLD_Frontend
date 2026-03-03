import { Outlet } from "react-router-dom";
import Navbar from "../components/common/layout/Navbar";
import Sidebar from "../components/common/layout/Sidebar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <Sidebar />

      <main className="p-4 sm:ml-72 pt-20">
        <div className=" min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
