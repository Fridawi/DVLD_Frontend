import { useParams, useNavigate } from "react-router-dom";
import { Plus, Calendar, Info, ShieldCheck } from "lucide-react";
import { useGetLocalDrivingLicenseApplicationByIdQuery } from "../../../applications/localApp/LocalAppApiSlice";
import { useGetTestTypeByIdQuery } from "../../test Types/TestTypesApiSlice";
import {
  useGetAppointmentsByLocalAppAndTestTypeQuery,
  useHasActiveAppointmentQuery,
} from "../TestAppointmentApiSlice";
import PageHeader from "../../../../components/common/PageHeader";
import LocalAppCard from "../../../applications/localApp/components/LocalAppCard";
import ApplicationCard from "../../../applications/components/ApplicationDetails";
import TestAppointmentsTable from "./TestAppointmentsTable";
import { toast } from "sonner";
import { useTitle } from "../../../../hooks/useTitle";

export default function LocalAppTestAppointmentsPage() {
  const { localAppID, testTypeID } = useParams();
  const navigate = useNavigate();

  const { data: localApp, isLoading: isLoadingApp } =
    useGetLocalDrivingLicenseApplicationByIdQuery(Number(localAppID));
  const { data: testType } = useGetTestTypeByIdQuery(Number(testTypeID));

  const { data: pagedResult, isLoading: isLoadingAppointments } =
    useGetAppointmentsByLocalAppAndTestTypeQuery({
      localAppID: Number(localAppID),
      testTypeID: Number(testTypeID),
    });

  const { data: hasActive, isLoading: isLoadingActiveCheck } =
    useHasActiveAppointmentQuery({
      localAppID: Number(localAppID),
      testTypeID: Number(testTypeID),
    });

  const appointments = pagedResult?.data || [];

  useTitle(testType ? `${testType.title} Appointments` : "Test Appointments");

  const handleAddNewAppointment = () => {
    if (hasActive) {
      toast("Active appointment already exists.", {
        icon: "⏳",
      });
      return;
    }

    if (localApp && localApp.passedTestCount >= Number(testTypeID)) {
      toast("Test already passed.", {
        icon: "✅",
      });
      return;
    }

    navigate(`/tests/appointments/scheduleTest/${localAppID}/${testTypeID}`);
  };

  if (isLoadingApp || isLoadingAppointments || isLoadingActiveCheck) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 p-6 lg:p-10 bg-gray-50/30 dark:bg-transparent min-h-screen">
      <PageHeader
        title={`${testType?.title || "Test"} Appointments Management`}
        breadcrumbs={[
          { label: "Local Applications", path: "/applications/local" },
          { label: "Appointments History" },
        ]}
      />

      <div className="flex flex-col gap-8 w-full">
        <div className="w-full transform transition-all">
          <LocalAppCard app={localApp!} />
        </div>
        <div className="w-full transform transition-all">
          <ApplicationCard applicationId={localApp!.applicationID} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden w-full">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-gray-800">
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <Calendar className="w-7 h-7 text-blue-600" />
              Test Appointments History
            </h3>
            <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
              Manage and view scheduling records for this specific test type.
            </p>
          </div>

          <button
            onClick={handleAddNewAppointment}
            className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-200 dark:shadow-none active:scale-95 text-lg"
          >
            <Plus className="w-6 h-6" />
            Add New Appointment
          </button>
        </div>

        <div className="p-4">
          {appointments.length > 0 ? (
            <TestAppointmentsTable appointments={appointments} />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <div className="p-6 rounded-full bg-gray-50 dark:bg-gray-900 mb-4">
                <Info size={60} className="opacity-20" />
              </div>
              <p className="text-xl font-medium">
                No appointments found for this test type.
              </p>
              <p className="text-sm mt-1 text-gray-400">
                Click the button above to schedule the first one.
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Total Records:
            <span className="text-blue-600 dark:text-blue-400 text-lg ml-1">
              {appointments.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
