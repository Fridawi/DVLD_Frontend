import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import type { User } from "../../../types/users";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import {
  useDeleteUserMutation,
  useToggleStatusMutation,
} from "../usersApiSlice";
import type { SerializedError } from "../../../types/auth";
import { useState } from "react";
import { toast } from "sonner";

interface UsersTableProps {
  users: User[];
}
export default function UsersTable({ users }: UsersTableProps) {
  const navigate = useNavigate();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [toggleStatus, { isLoading: isToggling }] = useToggleStatusMutation();

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmToggleId, setConfirmToggleId] = useState<number | null>(null);

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await deleteUser(confirmDeleteId).unwrap();
      toast.success("User deleted successfully");
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error.data?.detail || "Failed to delete user");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleConfirmToggle = async () => {
    if (!confirmToggleId) return;

    try {
      await toggleStatus(confirmToggleId).unwrap();
      toast.success("User status toggled successfully");
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error.data?.detail || "Failed to toggle user status");
    } finally {
      setConfirmToggleId(null);
    }
  };

  const toggleUserStatus = (userID: number) => {
    setConfirmToggleId(userID);
  };
  const handleCancelToggle = () => setConfirmToggleId(null);

  const handleCancelDelete = () => setConfirmDeleteId(null);
  return (
    <div className="relative overflow-x-auto overflow-visible">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">User Name</th>
            <th className="px-6 py-4 font-bold">Role</th>
            <th className="px-6 py-4">Is Active</th>
            <th className="px-6 py-4">Person ID</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {users.map((user) => (
            <tr
              key={user.userID}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {user.userID}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">
                {user.userName}
              </td>
              <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                {user.role}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    user.isActive
                      ? "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                      : "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4">{user.personID}</td>
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
                              onClick={() => navigate(`/users/${user.userID}`)}
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
                                navigate(`/users/edit/${user.userID}`)
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
                              onClick={() => setConfirmDeleteId(user.userID)}
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

                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={() => toggleUserStatus(user.userID)}
                              className={`${
                                active
                                  ? "bg-blue-600 text-white"
                                  : "text-blue-600"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Toggle Status
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
              Are you sure you want to delete this user? This action cannot be
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
      {confirmToggleId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Confirm Toggle Status
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Are you sure you want to toggle the status of this user?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancelToggle}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmToggle}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {isToggling ? "Toggling..." : "Toggle Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
