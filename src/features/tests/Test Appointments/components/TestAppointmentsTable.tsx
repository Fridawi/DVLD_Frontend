import { useNavigate } from "react-router-dom";
import {
  Edit,
  Eye,
  MoreVertical,
  Calendar,
  CheckCircle,
  Lock,
} from "lucide-react";
import {
  MenuButton,
  Menu,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import type { TestAppointment } from "../../../../types/testAppointments";

type Props = {
  appointments: TestAppointment[];
  testTypeID?: number;
};

export default function TestAppointmentsTable({
  appointments,
  testTypeID,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-x-auto overflow-visible">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-4">App.ID</th>
            <th className="px-6 py-4">Appointment Date</th>
            <th className="px-6 py-4 font-bold">Paid Fees</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {appointments.map((appointment) => (
            <tr
              key={appointment.testAppointmentID}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {appointment.testAppointmentID}
              </td>
              <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  {new Date(appointment.appointmentDate).toLocaleDateString(
                    "en-GB",
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                {appointment.paidFees.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </td>
              <td className="px-6 py-4 text-center">
                {appointment.isLocked ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    <Lock size={12} /> Locked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Open
                  </span>
                )}
              </td>

              <td className="px-6 py-4 text-center">
                <Menu as="div" className="relative inline-block text-left">
                  <MenuButton className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-50 text-gray-500 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all focus:outline-none dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-blue-400">
                    <MoreVertical className="w-5 h-5" />
                  </MenuButton>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems
                      modal={false}
                      anchor="bottom end"
                      className="w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 dark:bg-gray-800 dark:divide-gray-700 dark:ring-gray-700"
                    >
                      <div className="px-1 py-1">
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                navigate(
                                  `/tests/appointments/${appointment.testAppointmentID}`,
                                )
                              }
                              className={`${
                                active
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-900 dark:text-gray-200"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Appointment
                            </button>
                          )}
                        </MenuItem>

                        {!appointment.isLocked && (
                          <>
                            <MenuItem>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    const finalTestTypeID =
                                      testTypeID ||
                                      (appointment.testTypeName ===
                                      "Vision Test"
                                        ? 1
                                        : appointment.testTypeName ===
                                            "Written Test"
                                          ? 2
                                          : 3);

                                    navigate(
                                      `/tests/appointments/scheduleTest/${appointment.localDrivingLicenseApplicationID}/${finalTestTypeID}/${appointment.testAppointmentID}`,
                                    );
                                  }}
                                  className={`${
                                    active
                                      ? "bg-blue-600 text-white"
                                      : "text-gray-900 dark:text-gray-200"
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Appointment
                                </button>
                              )}
                            </MenuItem>
                            <MenuItem>
                              {({ active }) => (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/tests/manage/take/${appointment.testAppointmentID}`,
                                    )
                                  }
                                  className={`${
                                    active
                                      ? "bg-emerald-600 text-white"
                                      : "text-emerald-600 dark:text-emerald-400"
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm font-bold transition-colors`}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Take Test
                                </button>
                              )}
                            </MenuItem>
                          </>
                        )}
                      </div>
                    </MenuItems>
                  </Transition>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
