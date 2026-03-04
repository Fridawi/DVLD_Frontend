import { useNavigate } from "react-router-dom";
import {
  Edit,
  Eye,
  MoreVertical,
  DollarSign,
  Calendar,
  UserCheck,
} from "lucide-react";
import {
  MenuButton,
  Menu,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { useAppSelector } from "../../../../hooks/hooks";
import type { LicenseClass } from "../../../../types/licenseClass";

type Props = {
  licensesClass: LicenseClass[];
};

export default function LicensesClassTable({ licensesClass }: Props) {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="relative overflow-x-auto overflow-visible shadow-sm rounded-xl border border-gray-100 dark:border-gray-700">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-4 whitespace-nowrap">ID</th>
            <th className="px-6 py-4 whitespace-nowrap">Class Name</th>
            <th className="px-6 py-4 whitespace-nowrap">Description</th>
            <th className="px-6 py-4 whitespace-nowrap text-center">
              Min. Age
            </th>
            <th className="px-6 py-4 whitespace-nowrap text-center">
              Validity
            </th>
            <th className="px-6 py-4 whitespace-nowrap font-bold">Fees</th>
            <th className="px-6 py-4 text-center whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {licensesClass.map((licenseClass) => (
            <tr
              key={licenseClass.licenseClassID}
              className="bg-white dark:bg-gray-800 hover:bg-blue-50/30 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {licenseClass.licenseClassID}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-600 dark:text-blue-400">
                {licenseClass.className}
              </td>
              <td className="px-6 py-4 max-w-xs truncate text-gray-600 dark:text-gray-300">
                {licenseClass.classDescription}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 font-bold text-xs">
                  <UserCheck size={12} />
                  {licenseClass.minimumAllowedAge} Y
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-bold text-xs">
                  <Calendar size={12} />
                  {licenseClass.defaultValidityLength} Y
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center font-bold text-emerald-600 dark:text-emerald-400">
                  <DollarSign size={14} />
                  {licenseClass.classFees.toFixed(2)}
                </div>
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
                      className="w-48 mt-2 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 dark:bg-gray-800 dark:divide-gray-700 dark:ring-gray-700"
                    >
                      <div className="px-1.5 py-1.5">
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                navigate(
                                  `/licenses/classes/${licenseClass.licenseClassID}`,
                                )
                              }
                              className={`${
                                active
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 dark:text-gray-200"
                              } group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors`}
                            >
                              <Eye className="mr-2.5 h-4 w-4 opacity-70" />
                              Show Details
                            </button>
                          )}
                        </MenuItem>
                        {user?.role === "Admin" && (
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/licenses/classes/edit/${licenseClass.licenseClassID}`,
                                  )
                                }
                                className={`${
                                  active
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 dark:text-gray-200"
                                } group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors`}
                              >
                                <Edit className="mr-2.5 h-4 w-4 opacity-70" />
                                Edit Class
                              </button>
                            )}
                          </MenuItem>
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
