import { useNavigate } from "react-router-dom";
import {
  Eye,
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  History,
} from "lucide-react";
import {
  MenuButton,
  Menu,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import type { InternationalLicense } from "../../../../types/internationalLicenses";

type Props = {
  licenses: InternationalLicense[];
};

export default function InternationalLicensesTable({ licenses }: Props) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-x-auto overflow-visible">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-4">Int.Lic.ID</th>
            <th className="px-6 py-4">App.ID</th>
            <th className="px-6 py-4">L.Lic.ID</th>
            <th className="px-6 py-4">Issue Date</th>
            <th className="px-6 py-4">Expiration Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {licenses.map((license) => {
            const isExpired = new Date(license.expirationDate) < new Date();

            return (
              <tr
                key={license.internationalLicenseID}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {license.internationalLicenseID}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {license.applicationID}
                </td>
                <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                  {license.issuedUsingLocalLicenseID}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white">
                  {new Date(license.issueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white">
                  <span className={isExpired ? "text-red-500 font-medium" : ""}>
                    {new Date(license.expirationDate).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {license.isActive ? (
                    <span className="flex items-center text-green-600 dark:text-green-400">
                      <ShieldCheck className="w-4 h-4 mr-1" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600 dark:text-red-400">
                      <ShieldAlert className="w-4 h-4 mr-1" /> Inactive
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
                        className="w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 dark:bg-gray-800 dark:divide-gray-700 dark:ring-gray-700"
                      >
                        <div className="px-1 py-1">
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() =>
                                  navigate(`${license.internationalLicenseID}`)
                                }
                                className={`${
                                  active
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-900 dark:text-gray-200"
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Show License Info
                              </button>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/drivers/${license.issuedUsingLocalLicenseID}/history`,
                                  )
                                }
                                className={`${
                                  active
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-900 dark:text-gray-200"
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                              >
                                <History className="mr-2 h-4 w-4" />
                                Driver History
                              </button>
                            )}
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </Transition>
                  </Menu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
