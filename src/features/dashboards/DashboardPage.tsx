import {
  Users,
  Lock,
  CalendarCheck,
  ShieldCheck,
  Clock,
  TrendingUp,
  ArrowRightLeft,
  Unlock,
  FilePlus2,
  UserPlus,
} from "lucide-react";

import { useGetDriversQuery } from "../drivers/DriverApiSlice";
import { useGetAllLocalDrivingLicenseApplicationsQuery } from "../applications/localApp/LocalAppApiSlice";
import { useGetAllDetainedLicensesQuery } from "../licensing/Detained/DetainedApiSlice";
import { useGetTestAppointmentsQuery } from "../tests/Test Appointments/TestAppointmentApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";

import { StatsCard } from "./components/StatsCard";
import QuickActionButton from "./components/QuickActionButton";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const isAdmin = user?.role === "Admin";
  const { data: driversData } = useGetDriversQuery({
    pageNumber: 1,
    pageSize: 1,
  });
  const { data: localAppsData } = useGetAllLocalDrivingLicenseApplicationsQuery(
    { pageNumber: 1, pageSize: 5 },
  );
  const { data: activeDetainedData } = useGetAllDetainedLicensesQuery({
    pageNumber: 1,
    pageSize: 1,
    filterColumn: "isreleased",
    filterValue: "false",
  });
  const { data: appointmentsData } = useGetTestAppointmentsQuery({
    pageNumber: 1,
    pageSize: 5,
  });
  const { data: usersData } = useGetUsersQuery(
    {
      pageNumber: 1,
      pageSize: 1,
      filterColumn: "isactive",
      filterValue: "true",
    },
    { skip: !isAdmin },
  );

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            DVLD Management Command Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Real-time overview of licensing operations and appointments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <QuickActionButton
          label="New Person"
          icon={UserPlus}
          color="bg-blue-500"
          onClick={() => navigate("/people/add")}
        />
        <QuickActionButton
          label="Local App"
          icon={FilePlus2}
          color="bg-amber-500"
          onClick={() => navigate("/applications/local/add")}
        />
        <QuickActionButton
          label="Detain License"
          icon={Lock}
          color="bg-slate-700"
          onClick={() => navigate("/licenses/detaineds/detained")}
        />
        <QuickActionButton
          label="Release License"
          icon={Unlock}
          color="bg-green-500"
          onClick={() => navigate("/licenses/detaineds/release")}
        />
        <QuickActionButton
          label="Renew License"
          icon={ArrowRightLeft}
          color="bg-rose-500"
          onClick={() => navigate("/licenses/renew")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Drivers"
          value={driversData?.totalCount ?? 0}
          icon={Users}
          color="blue"
        />
        {isAdmin ? (
          <StatsCard
            title="Active Users"
            value={usersData?.totalCount ?? 0}
            icon={ShieldCheck}
            color="green"
          />
        ) : (
          <StatsCard
            title="System Status"
            value="Active"
            subValue="Node Online"
            icon={ShieldCheck}
            color="green"
          />
        )}
        <StatsCard
          title="Pending Tests"
          value={appointmentsData?.totalCount ?? 0}
          icon={CalendarCheck}
          color="amber"
        />
        <StatsCard
          title="Active Detains"
          value={activeDetainedData?.totalCount ?? 0}
          icon={Lock}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" /> Recent
              Applications
            </h3>
            <button
              onClick={() => navigate("/applications/local")}
              className="text-[10px] font-bold text-blue-600 hover:underline"
            >
              VIEW ALL
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 dark:bg-gray-700/50 text-gray-500 uppercase text-[10px]">
                <tr>
                  <th className="px-6 py-3 font-bold">Applicant</th>
                  <th className="px-6 py-3 text-center font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {localAppsData?.data.map((app) => (
                  <tr
                    key={app.localDrivingLicenseApplicationID}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white leading-tight">
                        {app.fullName}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {app.className}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock size={18} className="text-amber-500" /> Upcoming Tests
            </h3>
            <button
              onClick={() => navigate("/tests/appointments")}
              className="text-[10px] font-bold text-amber-600 hover:underline"
            >
              SCHEDULE
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 dark:bg-gray-700/50 text-gray-500 uppercase text-[10px]">
                <tr>
                  <th className="px-6 py-3 font-bold">Candidate</th>
                  <th className="px-6 py-3 text-center font-bold">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {appointmentsData?.data.map((appt) => (
                  <tr
                    key={appt.testAppointmentID}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white leading-tight">
                        {appt.fullName}
                      </div>
                      <div className="text-[10px] flex items-center gap-1 text-gray-400">
                        {appt.isLocked ? (
                          <Lock size={10} className="text-green-500" />
                        ) : (
                          <Clock size={10} />
                        )}
                        ID: {appt.testAppointmentID}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-800">
                        {appt.testTypeName.split(" ")[0]}{" "}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
