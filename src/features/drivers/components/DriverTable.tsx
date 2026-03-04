import { useNavigate } from "react-router-dom";
import { MoreVertical, User, History, UserCheck } from "lucide-react";
import {
  MenuButton,
  Menu,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import type { Driver } from "../../../types/drivers";

type Props = {
  drivers: Driver[];
};

export default function DriverTable({ drivers }: Props) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-x-auto overflow-visible">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-4 whitespace-nowrap">Driver ID</th>
            <th className="px-6 py-4 whitespace-nowrap">Person ID</th>
            <th className="px-6 py-4 whitespace-nowrap">National No</th>
            <th className="px-6 py-4 whitespace-nowrap">Full Name</th>
            <th className="px-6 py-4 whitespace-nowrap">Created By</th>
            <th className="px-6 py-4 whitespace-nowrap">Date</th>
            <th className="px-6 py-4 text-center whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {drivers.map((driver) => (
            <tr
              key={driver.driverID}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {driver.driverID}
              </td>
              <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {driver.personID}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white font-medium whitespace-nowrap">
                {driver.nationalNo}
              </td>
              <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                {driver.fullName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <UserCheck size={14} className="text-slate-400" />
                  {driver.createdByUserID}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap">
                {new Date(driver.createdDate).toLocaleDateString()}
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
                      className="w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 dark:bg-gray-800 dark:divide-gray-700 dark:ring-gray-700"
                    >
                      <div className="px-1 py-1">
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                navigate(`/drivers/${driver.driverID}`)
                              }
                              className={`${
                                active
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-900 dark:text-gray-200"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Show Person Info
                            </button>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                navigate(`/drivers/${driver.driverID}/history`)
                              }
                              className={`${
                                active
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-900 dark:text-gray-200"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                            >
                              <History className="mr-2 h-4 w-4" />
                              Show Driver History
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
