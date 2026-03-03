import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { useAddUserMutation } from "../usersApiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import type { SerializedError } from "../../../types/auth";
import PageHeader from "../../../components/common/PageHeader";
import { ArrowLeft, ChevronRight, Info, Save } from "lucide-react";
import PersonSelectorCard from "../../people/components/PersonSelectorCard";
import { useTitle } from "../../../hooks/useTitle";

const addUserSchema = z
  .object({
    personID: z.number({ error: "Person selection is required" }).min(1),
    userName: z
      .string()
      .min(5, "Username must be at least 5 characters")
      .max(20),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    role: z.string(),
    isActive: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type AddUserFormValues = z.infer<typeof addUserSchema>;

export default function AddUser(): JSX.Element {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [addUser, { isLoading: isAdding }] = useAddUserMutation();

  useTitle("Create New User");

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: { role: "User", isActive: true },
    mode: "onChange",
  });

  const watchedPersonId = useWatch({
    control,
    name: "personID",
  });

  const inputClass =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors";
  const labelClass =
    "block mb-2 text-sm font-medium text-gray-900 dark:text-white";

  const goNext = async () => {
    const isValid = await trigger("personID");
    if (isValid && watchedPersonId) setStep(2);
    else toast.error("Please select a person to continue");
  };

  const onSubmit: SubmitHandler<AddUserFormValues> = async (data) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...userData } = data;

      await addUser(userData).unwrap();
      toast.success("User created successfully");
      navigate("/users");
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error?.data?.detail ?? "Failed to create user");
    }
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Create New User"
        breadcrumbs={[
          { label: "Users", path: "/users" },
          { label: "Add New User" },
        ]}
      />

      <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4">
        <li
          className={`flex items-center ${step === 1 ? "text-blue-600 dark:text-blue-500" : "text-green-600 dark:text-green-500"}`}
        >
          <span
            className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${step === 1 ? "border-blue-600 dark:border-blue-500" : "border-green-600 dark:border-green-500"}`}
          >
            1
          </span>
          Personal <span className="hidden sm:inline-flex sm:ms-2">Info</span>
          <ChevronRight className="w-4 h-4 ms-2 sm:ms-4" />
        </li>
        <li
          className={`flex items-center ${step === 2 ? "text-blue-600 dark:text-blue-500" : ""}`}
        >
          <span
            className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${step === 2 ? "border-blue-600" : "border-gray-500"}`}
          >
            2
          </span>
          Account{" "}
          <span className="hidden sm:inline-flex sm:ms-2">Settings</span>
        </li>
      </ol>

      <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="p-4 mb-4 text-blue-800 border-t-4 border-blue-300 bg-blue-50 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-800 rounded-lg flex items-center gap-3">
                <Info size={18} />
                <span className="text-sm font-medium">
                  Search and select the person who will be granted this user
                  account.
                </span>
              </div>

              <PersonSelectorCard
                onPersonSelected={(id) =>
                  id && setValue("personID", id, { shouldValidate: true })
                }
              />

              {watchedPersonId && (
                <div className="flex p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 border border-green-300 dark:border-green-800">
                  Person ID &nbsp;<strong>#{watchedPersonId}</strong>&nbsp; has
                  been linked.
                </div>
              )}

              <div className="flex justify-end border-t border-gray-200 dark:border-gray-700 pt-5">
                <button
                  onClick={goNext}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all"
                >
                  Next: Account Details
                  <ChevronRight className="w-4 h-4 ms-2" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-2">
                <div>
                  <label className={labelClass}>Username</label>
                  <input
                    {...register("userName")}
                    className={inputClass}
                    placeholder="john_doe"
                  />
                  {errors.userName && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">
                      {errors.userName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>User Role</label>
                  <select {...register("role")} className={inputClass}>
                    <option value="User">Standard User</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <input
                    autoComplete="new-password"
                    type="password"
                    {...register("password")}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <input
                    autoComplete="new-password"
                    type="password"
                    {...register("confirmPassword")}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start mb-6">
                <div className="flex items-center h-5">
                  <input
                    id="active"
                    type="checkbox"
                    {...register("isActive")}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                  />
                </div>
                <label
                  htmlFor="active"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Enable this account immediately
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  onClick={() => setStep(1)}
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 inline-flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 me-2" /> Previous
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(-1)}
                    type="button"
                    className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isAdding}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
                  >
                    {isAdding ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="w-4 h-4 me-2" /> Save User
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
