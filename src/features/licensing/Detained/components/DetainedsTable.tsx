import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  History,
  Unlock,
  IdCard,
  ShieldCheck,
  ShieldAlert,
  User,
  FileText,
  DollarSign,
} from "lucide-react";
import {
  MenuButton,
  Menu,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import type { DetainedLicense } from "../../../../types/Detaineds";

type Props = {
  detainedLicenses: DetainedLicense[];
};

export default function DetainedsTable({ detainedLicenses }: Props) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-x-auto overflow-visible shadow-md rounded-xl border border-gray-100 dark:border-gray-700">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-4 whitespace-nowrap">Detain/App ID</th>
            <th className="px-6 py-4 whitespace-nowrap">License ID</th>
            <th className="px-6 py-4 whitespace-nowrap">National No</th>
            <th className="px-6 py-4 whitespace-nowrap">Detain Info</th>
            <th className="px-6 py-4 whitespace-nowrap">Fine Fees</th>
            <th className="px-6 py-4 whitespace-nowrap">Status</th>
            <th className="px-6 py-4 whitespace-nowrap">Release Info</th>
            <th className="px-6 py-4 text-center whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {detainedLicenses.map((record) => (
            <tr
              key={record.detainID}
              className="bg-white dark:bg-gray-800 hover:bg-blue-50/30 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  {record.detainID}
                </div>
                {record.releaseApplicationID && (
                  <div className="text-[11px] mt-1 text-gray-400 flex items-center bg-gray-100 dark:bg-gray-700 w-fit px-1.5 py-0.5 rounded">
                    <FileText size={10} className="me-1" /> App:{" "}
                    {record.releaseApplicationID}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-600 dark:text-blue-400">
                {record.licenseID}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white font-medium">
                {record.nationalNo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-900 dark:text-white font-medium">
                  {new Date(record.detainDate).toLocaleDateString()}
                </div>
                <div className="text-[11px] text-gray-500 flex items-center mt-1">
                  <User size={11} className="me-1 text-gray-400" />{" "}
                  {record.createdByUserName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center font-bold text-rose-600 dark:text-rose-400">
                  <DollarSign size={14} className="mr-0.5" />
                  {record.fineFees.toFixed(2)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.isReleased ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Released
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Detained
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.releaseDate ? (
                  <>
                    <div className="text-gray-900 dark:text-white font-medium">
                      {new Date(record.releaseDate).toLocaleDateString()}
                    </div>
                    <div className="text-[11px] text-gray-500 flex items-center mt-1">
                      <User size={11} className="me-1 text-gray-400" />{" "}
                      {record.releasedByUserName}
                    </div>
                  </>
                ) : (
                  <span className="text-gray-300 dark:text-gray-600 italic">
                    Pending Release
                  </span>
                )}
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
                      className="w-56 mt-2 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 dark:bg-gray-800 dark:divide-gray-700 dark:ring-gray-700"
                    >
                      <div className="px-1.5 py-1.5">
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                navigate(`/licenses/manage/${record.licenseID}`)
                              }
                              className={`${
                                active
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 dark:text-gray-200"
                              } group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors`}
                            >
                              <IdCard className="mr-2.5 h-4 w-4 opacity-70" />
                              Show License Info
                            </button>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                navigate(`/drivers/${record.licenseID}/history`)
                              }
                              className={`${
                                active
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 dark:text-gray-200"
                              } group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors`}
                            >
                              <History className="mr-2.5 h-4 w-4 opacity-70" />
                              Driver History
                            </button>
                          )}
                        </MenuItem>
                      </div>

                      {!record.isReleased && (
                        <div className="px-1.5 py-1.5">
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() =>
                                  navigate(`release/${record.licenseID}`)
                                }
                                className={`${
                                  active
                                    ? "bg-emerald-600 text-white"
                                    : "text-emerald-600 dark:text-emerald-400"
                                } group flex w-full items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors`}
                              >
                                <Unlock className="mr-2.5 h-4 w-4" />
                                Release License
                              </button>
                            )}
                          </MenuItem>
                        </div>
                      )}
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
