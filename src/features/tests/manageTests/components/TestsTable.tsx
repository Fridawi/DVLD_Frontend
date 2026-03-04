import { useNavigate } from "react-router-dom";
import {
  Edit,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle,
  User,
  StickyNote,
} from "lucide-react";
import {
  MenuButton,
  Menu,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import type { Test } from "../../../../types/tests";

type Props = {
  tests: Test[];
};

export default function TestsTable({ tests }: Props) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-x-auto overflow-visible shadow-sm rounded-xl border border-gray-100 dark:border-gray-700">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-4 whitespace-nowrap text-center">Test ID</th>
            <th className="px-6 py-4 whitespace-nowrap">Appointment ID</th>
            <th className="px-6 py-4 whitespace-nowrap">Result</th>
            <th className="px-6 py-4 whitespace-nowrap">Created By</th>
            <th className="px-6 py-4 whitespace-nowrap">Notes</th>
            <th className="px-6 py-4 text-center whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {tests.map((test) => (
            <tr
              key={test.testID}
              className="bg-white dark:bg-gray-800 hover:bg-blue-50/30 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-gray-900 dark:text-white">
                {test.testID}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                  {test.testAppointmentID}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {test.testResult ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Passed
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Failed
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                  <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                    <User size={14} />
                  </div>
                  ID: {test.createdByUserID}
                </div>
              </td>
              <td className="px-6 py-4 max-w-xs">
                <div className="flex items-start gap-1.5 text-gray-600 dark:text-gray-400 italic">
                  <StickyNote
                    size={14}
                    className="mt-0.5 shrink-0 opacity-50"
                  />
                  <span className="truncate">
                    {test.notes || "No notes provided"}
                  </span>
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
                                navigate(`/tests/manage/${test.testID}`)
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
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                navigate(`/tests/manage/edit/${test.testID}`)
                              }
                              className={`${
                                active
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 dark:text-gray-200"
                              } group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors`}
                            >
                              <Edit className="mr-2.5 h-4 w-4 opacity-70" />
                              Edit Test
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
