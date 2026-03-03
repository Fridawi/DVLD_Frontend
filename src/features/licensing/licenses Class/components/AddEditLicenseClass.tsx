import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, UserPlus, ArrowLeft, Edit3, Save } from "lucide-react";
import { useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

import type { SerializedError } from "../../../../types/auth";
import PageHeader from "../../../../components/common/PageHeader";
import {
  useAddLicenseClassMutation,
  useGetLicenseClassByIdQuery,
  useUpdateLicenseClassMutation,
} from "../LicensesClassApiSlice";
import { useTitle } from "../../../../hooks/useTitle";

const licenseClassSchema = z.object({
  className: z.string().min(3, "Class Name is required"),
  classDescription: z.string().min(3, "Class Description is required"),
  minimumAllowedAge: z
    .number({ error: "Minimum Allowed Age must be a number" })
    .min(0, "Minimum Allowed Age cannot be negative"),
  defaultValidityLength: z
    .number({ error: "Default Validity Length must be a number" })
    .min(0, "Default Validity Length cannot be negative"),
  classFees: z
    .number({ error: "Class Fees must be a number" })
    .min(0, "Class Fees cannot be negative"),
});
type LicenseClassFormValues = z.infer<typeof licenseClassSchema>;

export default function AddEditLicenseClassForm() {
  const navigate = useNavigate();
  const { licenseClassID } = useParams<{ licenseClassID: string }>();
  const isEditMode = Boolean(licenseClassID);

  const { data: licenseClassData, isLoading: isLoadingLicenseClass } =
    useGetLicenseClassByIdQuery(Number(licenseClassID), {
      skip: !isEditMode,
    });

  useTitle(
    isEditMode
      ? `Edit Class: ${licenseClassData?.className || licenseClassID}`
      : "Add New License Class",
  );

  const [addLicenseClass, { isLoading: isAdding }] =
    useAddLicenseClassMutation();
  const [updateLicenseClass, { isLoading: isUpdating }] =
    useUpdateLicenseClassMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LicenseClassFormValues>({
    resolver: zodResolver(licenseClassSchema),
    defaultValues: {
      className: "",
      classDescription: "",
      minimumAllowedAge: 0,
      defaultValidityLength: 0,
      classFees: 0,
    },
  });

  useEffect(() => {
    if (licenseClassData) {
      reset({
        className: licenseClassData.className,
        classDescription: licenseClassData.classDescription,
        minimumAllowedAge: licenseClassData.minimumAllowedAge,
        defaultValidityLength: licenseClassData.defaultValidityLength,
        classFees: licenseClassData.classFees,
      });
    }
  }, [licenseClassData, reset]);

  const onSubmit: SubmitHandler<LicenseClassFormValues> = async (data) => {
    try {
      if (isEditMode) {
        await updateLicenseClass({
          id: Number(licenseClassID),
          updatedData: {
            licenseClassID: Number(licenseClassID),
            ...data,
          },
        }).unwrap();
        toast.success("Updated successfully!");
      } else {
        await addLicenseClass({
          licenseClassID: 0,
          className: data.className,
          classDescription: data.classDescription,
          minimumAllowedAge: data.minimumAllowedAge,
          defaultValidityLength: data.defaultValidityLength,
          classFees: data.classFees,
        }).unwrap();
        toast.success("Added successfully!");
      }
      navigate("/licenses/classes");
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error.data?.detail || "Operation failed");
    }
  };

  const inputClass =
    "block w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:opacity-50";
  const labelClass =
    "block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300";

  if (isEditMode && isLoadingLicenseClass) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="size-10 animate-spin text-blue-600" />
        <p className="text-gray-500 animate-pulse">
          Loading license Class data...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={isEditMode ? "Edit License Class" : "Add New License Class"}
        breadcrumbs={[
          { label: "Licenses Class", path: "/licenses/classes" },
          {
            label: isEditMode ? "Edit License Class" : "Add New License Class",
          },
        ]}
      />

      <main className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <UserPlus className="text-blue-600 size-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              License Class Information
            </h3>
            <p className="text-sm text-gray-500">
              Please fill in all required fields marked with *
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label className={labelClass}>Class Name *</label>
            <input
              {...register("className")}
              className={inputClass}
              placeholder="Class Name"
            />
            {errors.className && (
              <p className="text-red-500 text-xs mt-1">
                {errors.className.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              {...register("classDescription")}
              className={`${inputClass} min-h-25`}
              placeholder="Class Description"
            />
            {errors.classDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.classDescription.message}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Minimum Allowed Age *</label>
              <input
                {...register("minimumAllowedAge", { valueAsNumber: true })}
                className={inputClass}
                placeholder="Age"
              />
              {errors.minimumAllowedAge && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.minimumAllowedAge.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Default Validity Length *</label>
              <input
                {...register("defaultValidityLength", { valueAsNumber: true })}
                className={inputClass}
                placeholder="Years"
              />
              {errors.defaultValidityLength && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.defaultValidityLength.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Class Fees *</label>
              <input
                {...register("classFees", { valueAsNumber: true })}
                className={inputClass}
                placeholder="Fees"
              />
              {errors.classFees && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.classFees.message}
                </p>
              )}
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
              disabled={isAdding || isUpdating}
              className="px-8 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-70 transition-all active:scale-95"
            >
              {isAdding || isUpdating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isEditMode ? (
                <Edit3 className="size-4" />
              ) : (
                <Save className="size-4" />
              )}

              {isAdding || isUpdating
                ? "Saving..."
                : isEditMode
                  ? "Update License Class"
                  : "Save License Class"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
