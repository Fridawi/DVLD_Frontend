import { useNavigate } from "react-router-dom";
import { Edit, Eye, MoreVertical } from "lucide-react";
import {
  MenuButton,
  Menu,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useAppSelector } from "../../../../hooks/hooks";
import type { LicenseClass } from "../../../../types/licenseClass";

type Props = {
  licensesClass: LicenseClass[];
};

export default function LicensesClassTable({ licensesClass }: Props) {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="relative overflow-x-auto overflow-visible">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Class Name</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4">Minimum Allowed Age</th>
            <th className="px-6 py-4">Default Validity Length</th>
            <th className="px-6 py-4 font-bold">Fees</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {licensesClass.map((licenseClass) => (
            <tr
              key={licenseClass.licenseClassID}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {licenseClass.licenseClassID}
              </td>
              <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                {licenseClass.className}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">
                {licenseClass.classDescription}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">
                {licenseClass.minimumAllowedAge}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">
                {licenseClass.defaultValidityLength}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">
                {licenseClass.classFees.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
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
                      className="w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 dark:bg-gray-800 dark:divide-gray-700 dark:ring-gray-700"
                    >
                      <div className="px-1 py-1">
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
                                  : "text-gray-900 dark:text-gray-200"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
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
                                    : "text-gray-900 dark:text-gray-200"
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
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
