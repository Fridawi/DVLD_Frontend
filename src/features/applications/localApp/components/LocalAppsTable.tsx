import { useNavigate } from "react-router-dom";
import {
  Edit,
  Eye,
  MoreVertical,
  ClipboardCheck,
  Car,
  Award,
} from "lucide-react";
import {
  MenuButton,
  Menu,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import type { LocalDrivingLicenseApplication } from "../../../../types/localDrivingLicenseApplication";

type Props = {
  localApps: LocalDrivingLicenseApplication[];
};

export default function LocalAppsTable({ localApps }: Props) {
  const navigate = useNavigate();

  const testTypes = [
    { id: 1, name: "Vision Test", icon: Eye },
    { id: 2, name: "Written Test", icon: ClipboardCheck },
    { id: 3, name: "Street Test", icon: Car },
  ];

  return (
    <div className="relative overflow-x-auto overflow-visible shadow-md rounded-xl">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-4 whitespace-nowrap">ID</th>
            <th className="px-6 py-4 whitespace-nowrap">App.ID</th>
            <th className="px-6 py-4 whitespace-nowrap">Class Name</th>
            <th className="px-6 py-4 whitespace-nowrap">National No</th>
            <th className="px-6 py-4 whitespace-nowrap">Full Name</th>
            <th className="px-6 py-4 whitespace-nowrap">App. Date</th>
            <th className="px-6 py-4 whitespace-nowrap">Passed Tests</th>
            <th className="px-6 py-4 font-bold whitespace-nowrap">Status</th>
            <th className="px-6 py-4 text-center whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {localApps.map((localApp) => (
            <tr
              key={localApp.localDrivingLicenseApplicationID}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {localApp.localDrivingLicenseApplicationID}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap">
                {localApp.applicationID}
              </td>
              <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                {localApp.className}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap">
                {localApp.nationalNo}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap">
                {localApp.fullName}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap">
                {localApp.applicationDate}
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap">
                <span className="font-bold text-gray-900 dark:text-white">
                  {localApp.passedTestCount} / 3
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-bold ${
                    localApp.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {localApp.status}
                </span>
              </td>

              <td className="px-6 py-4 text-center whitespace-nowrap">
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
                      className="w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 dark:bg-gray-800 dark:divide-gray-700 dark:ring-gray-700"
                    >
                      <div className="px-1 py-1">
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                navigate(
                                  `/applications/local/${localApp.localDrivingLicenseApplicationID}`,
                                )
                              }
                              className={`${active ? "bg-blue-600 text-white" : "text-gray-900 dark:text-gray-200"} group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Show Details
                            </button>
                          )}
                        </MenuItem>

                        <div className="border-t border-gray-100 dark:border-gray-700 my-1 pt-1">
                          <p className="px-2 py-1 text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                            Schedule Tests
                          </p>
                          {testTypes.map((test) => {
                            const isPassed =
                              localApp.passedTestCount >= test.id;
                            const isCurrentTest =
                              localApp.passedTestCount === test.id - 1;
                            const isDisabled =
                              isPassed ||
                              !isCurrentTest ||
                              localApp.status === "Completed";

                            return (
                              <MenuItem key={test.id} disabled={isDisabled}>
                                {({ active, disabled }) => (
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/tests/appointments/schedule/${localApp.localDrivingLicenseApplicationID}/${test.id}`,
                                      )
                                    }
                                    disabled={disabled}
                                    className={`${
                                      active
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-900 dark:text-gray-200"
                                    } ${disabled ? "opacity-30 cursor-not-allowed" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                                  >
                                    <test.icon className="mr-2 h-4 w-4" />
                                    Schedule {test.name}
                                    {isPassed && (
                                      <span className="ml-auto text-[10px] bg-green-500 text-white px-1 rounded">
                                        Passed
                                      </span>
                                    )}
                                  </button>
                                )}
                              </MenuItem>
                            );
                          })}
                        </div>
                        <MenuItem
                          disabled={
                            localApp.passedTestCount !== 3 ||
                            localApp.status === "Completed"
                          }
                        >
                          {({ active, disabled }) => (
                            <button
                              onClick={() =>
                                navigate(
                                  `/licenses/manage/issue-first-time/${localApp.localDrivingLicenseApplicationID}`,
                                )
                              }
                              disabled={disabled}
                              className={`${active ? "bg-emerald-600 text-white" : "text-gray-900 dark:text-gray-200"} ${disabled ? "opacity-30 cursor-not-allowed" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors border-t border-gray-100 dark:border-gray-700`}
                            >
                              <Award className="mr-2 h-4 w-4 text-emerald-500 group-hover:text-white" />
                              Issue Driving License
                            </button>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                navigate(
                                  `/applications/local/edit/${localApp.localDrivingLicenseApplicationID}`,
                                )
                              }
                              className={`${active ? "bg-blue-600 text-white" : "text-gray-900 dark:text-gray-200"} group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors border-t border-gray-100 dark:border-gray-700 mt-1`}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Application
                            </button>
                          )}
                        </MenuItem>
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
