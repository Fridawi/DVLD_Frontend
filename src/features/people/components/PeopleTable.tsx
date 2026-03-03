import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import type { Person } from "../../../types/people";
import { useDeletePersonMutation } from "../peopleApiSlice";
import { toast } from "sonner";
import type { SerializedError } from "../../../types/auth";

interface PeopleTableProps {
  people: Person[];
}

function PeopleTable({ people }: PeopleTableProps) {
  const navigate = useNavigate();
  const [deletePerson, { isLoading: isDeleting }] = useDeletePersonMutation();

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await deletePerson(confirmDeleteId).unwrap();
      toast.success("Person deleted successfully");
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error.data?.detail || "Failed to delete person");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleCancelDelete = () => setConfirmDeleteId(null);

  return (
    <div className="relative overflow-x-auto overflow-visible">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">National No</th>
            <th className="px-6 py-4 font-bold">Full Name</th>
            <th className="px-6 py-4">Gender</th>
            <th className="px-6 py-4">Date of Birth</th>
            <th className="px-6 py-4">Phone</th>
            <th className="px-6 py-4">Nationality</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {people.map((person) => (
            <tr
              key={person.personID}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {person.personID}
              </td>
              <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                {person.nationalNo}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">
                {person.fullName}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    person.gendor === 0
                      ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                      : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                  }`}
                >
                  {person.genderName ||
                    (person.gendor === 0 ? "Male" : "Female")}
                </span>
              </td>
              <td className="px-6 py-4">
                {new Date(person.dateOfBirth).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">{person.phone}</td>
              <td className="px-6 py-4">{person.countryName}</td>
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
                                navigate(`/people/${person.personID}`)
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
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                navigate(`/people/edit/${person.personID}`)
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
                      </div>
                      <div className="px-1 py-1">
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                setConfirmDeleteId(person.personID)
                              }
                              className={`${
                                active
                                  ? "bg-red-600 text-white"
                                  : "text-red-600"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Confirm Deletion
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this person? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PeopleTable;
