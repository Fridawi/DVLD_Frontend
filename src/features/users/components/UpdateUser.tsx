import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, UserCheck, ShieldAlert } from "lucide-react";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../usersApiSlice";
import PageHeader from "../../../components/common/PageHeader";
import type { SerializedError } from "../../../types/auth";
import type { UserUpdate } from "../../../types/users";
import { useAppSelector } from "../../../hooks/hooks";
import { useTitle } from "../../../hooks/useTitle";

const editUserSchema = z
  .object({
    personID: z.number(),
    userName: z
      .string()
      .min(5, "Username must be at least 5 characters")
      .max(20),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100)
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
    role: z.string().max(20),
    isActive: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UpdateUserFormValues = z.infer<typeof editUserSchema>;

export default function UpdateUser() {
  const navigate = useNavigate();
  const { userID } = useParams<{ userID: string }>();
  const id = Number(userID);

  const { user: currentUser } = useAppSelector((state) => state.auth);
  const isAdmin = currentUser?.role === "Admin";
  const isOwner = currentUser?.id === id;

  const { data: userData, isLoading: isLoadingUser } = useGetUserByIdQuery(id, {
    skip: !id,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useTitle(userData ? `Edit User: ${userData.userName}` : "Edit User");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (currentUser && !isAdmin && !isOwner) {
      toast.error("You are not authorized to edit this profile");
      navigate("/dashboard");
    }
  }, [currentUser, isAdmin, isOwner, navigate]);

  useEffect(() => {
    if (userData) {
      reset({
        personID: userData.personID,
        userName: userData.userName,
        role: userData.role,
        isActive: userData.isActive,
      });
    }
  }, [userData, reset]);

  const onSubmit: SubmitHandler<UpdateUserFormValues> = async (data) => {
    try {
      const updatePayload: UserUpdate = {
        userID: id,
        userName: data.userName,
        role: data.role,
        isActive: data.isActive,
        personID: data.personID,
      };

      if (data.password && data.password.trim() !== "") {
        updatePayload.password = data.password;
      }

      await updateUser({
        id: id,
        updatedData: updatePayload,
      }).unwrap();

      toast.success("User updated successfully!");
      navigate(isAdmin ? "/users" : "/dashboard");
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error.data?.detail || "Update failed");
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="size-10 animate-spin text-blue-600" />
        <p className="text-gray-500 animate-pulse">Fetching user details...</p>
      </div>
    );
  }

  const inputClass =
    "block w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:opacity-50";
  const labelClass =
    "block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit User"
        breadcrumbs={[
          { label: "Users", path: "/users" },
          { label: "Edit User" },
        ]}
      />

      <main className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <UserCheck className="text-blue-600 size-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Update Information
            </h3>
            <p className="text-sm text-gray-500">
              Modify the user details below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Username *</label>
              <input
                {...register("userName")}
                className={inputClass}
                placeholder="Username"
              />
              {errors.userName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.userName.message}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  {...register("password")}
                  className={inputClass}
                  placeholder="New Password"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Confirm Password</label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className={inputClass}
                  placeholder="Confirm New Password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role *
                </label>
                {!isAdmin && (
                  <span className="text-[10px] flex items-center gap-1 text-amber-600 font-bold bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">
                    <ShieldAlert size={10} /> Read Only
                  </span>
                )}
              </div>
              <select
                {...register("role")}
                className={inputClass}
                disabled={!isAdmin}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="flex flex-col justify-end">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Status
              </label>
              <label
                className={`flex items-center justify-between px-3 py-2.25 rounded-lg border transition ${
                  !isAdmin
                    ? "bg-gray-100/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-70 cursor-not-allowed"
                    : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                }`}
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active
                </span>
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="w-5 h-5 accent-blue-600 rounded"
                  disabled={!isAdmin}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition"
            >
              <ArrowLeft className="size-4" /> Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-8 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-70 transition-all active:scale-95"
            >
              {isUpdating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {isUpdating ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
