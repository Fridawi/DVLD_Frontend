import { Outlet } from "react-router-dom";
import Navbar from "../components/common/layout/Navbar";
import Sidebar from "../components/common/layout/Sidebar";
import { useState } from "react";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="p-4 sm:ml-72 pt-20">
        <div className=" min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
