import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, UserPlus, ArrowLeft, Edit3, Save } from "lucide-react";
import { useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  useAddApplicationTypeMutation,
  useUpdateApplicationTypeMutation,
  useGetApplicationTypeByIdQuery,
} from "../applicationTypesApiSlice";
import type { SerializedError } from "../../../../types/auth";
import PageHeader from "../../../../components/common/PageHeader";

const applicationTypeSchema = z.object({
  title: z.string().min(3, "Title is required"),
  fees: z
    .number({ error: "Fees must be a number" })
    .min(0, "Fees cannot be negative"),
});
type ApplicationTypeFormValues = z.infer<typeof applicationTypeSchema>;

export default function AddEditApplicationTypeForm() {
  const navigate = useNavigate();
  const { applicationTypeID } = useParams<{ applicationTypeID: string }>();
  const isEditMode = Boolean(applicationTypeID);

  const { data: applicationTypeData, isLoading: isLoadingApplicationType } =
    useGetApplicationTypeByIdQuery(Number(applicationTypeID), {
      skip: !isEditMode,
    });

  const [addApplicationType, { isLoading: isAdding }] =
    useAddApplicationTypeMutation();
  const [updateApplicationType, { isLoading: isUpdating }] =
    useUpdateApplicationTypeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationTypeFormValues>({
    resolver: zodResolver(applicationTypeSchema),
    defaultValues: {
      title: "",
      fees: 0,
    },
  });

  useEffect(() => {
    if (applicationTypeData) {
      reset({
        title: applicationTypeData.title,
        fees: applicationTypeData.fees,
      });
    }
  }, [applicationTypeData, reset]);

  const onSubmit: SubmitHandler<ApplicationTypeFormValues> = async (data) => {
    try {
      if (isEditMode) {
        await updateApplicationType({
          id: Number(applicationTypeID),
          updatedData: {
            applicationTypeID: Number(applicationTypeID),
            ...data,
          },
        }).unwrap();
        toast.success("Updated successfully!");
      } else {
        await addApplicationType({
          applicationTypeID: 0,
          title: data.title,
          fees: data.fees,
        }).unwrap();
        toast.success("Added successfully!");
      }
      navigate("/applications/types");
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error.data?.detail || "Operation failed");
    }
  };

  const inputClass =
    "block w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:opacity-50";
  const labelClass =
    "block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300";

  if (isEditMode && isLoadingApplicationType) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="size-10 animate-spin text-blue-600" />
        <p className="text-gray-500 animate-pulse">
          Loading application type data...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={
          isEditMode ? "Edit Application Type" : "Add New Application Type"
        }
        breadcrumbs={[
          { label: "Application Types", path: "/applications/types" },
          {
            label: isEditMode
              ? "Edit Application Type"
              : "Add New Application Type",
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
              Application Type Information
            </h3>
            <p className="text-sm text-gray-500">
              Please fill in all required fields marked with *
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                {...register("title")}
                className={inputClass}
                placeholder="Title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Fees *</label>
              <input
                {...register("fees", { valueAsNumber: true })}
                className={inputClass}
                placeholder="Fees"
              />
              {errors.fees && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fees.message}
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
                  ? "Update Application Type"
                  : "Save Application Type"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
