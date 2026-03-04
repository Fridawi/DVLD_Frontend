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
  useAddTestTypeMutation,
  useGetTestTypeByIdQuery,
  useUpdateTestTypeMutation,
} from "../TestTypesApiSlice";
import { useTitle } from "../../../../hooks/useTitle";

const testTypeSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(3, "Description is required"),
  fees: z
    .number({ error: "Fees must be a number" })
    .min(0, "Fees cannot be negative"),
});
type TestTypeFormValues = z.infer<typeof testTypeSchema>;

export default function AddEditTestTypeForm() {
  const navigate = useNavigate();
  const { testTypeID } = useParams<{ testTypeID: string }>();
  const isEditMode = Boolean(testTypeID);

  const { data: testTypeData, isLoading: isLoadingTestType } =
    useGetTestTypeByIdQuery(Number(testTypeID), {
      skip: !isEditMode,
    });

  const [addTestType, { isLoading: isAdding }] = useAddTestTypeMutation();
  const [updateTestType, { isLoading: isUpdating }] =
    useUpdateTestTypeMutation();

  useTitle(isEditMode ? "DVLD | Update Test Type" : "DVLD | New Test Type");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TestTypeFormValues>({
    resolver: zodResolver(testTypeSchema),
    defaultValues: {
      title: "",
      description: "",
      fees: 0,
    },
  });

  useEffect(() => {
    if (testTypeData) {
      reset({
        title: testTypeData.title,
        description: testTypeData.description,
        fees: testTypeData.fees,
      });
    }
  }, [testTypeData, reset]);

  const onSubmit: SubmitHandler<TestTypeFormValues> = async (data) => {
    try {
      if (isEditMode) {
        await updateTestType({
          id: Number(testTypeID),
          updatedData: {
            testTypeID: Number(testTypeID),
            ...data,
          },
        }).unwrap();
        toast.success("Updated successfully!");
      } else {
        await addTestType({
          testTypeID: 0,
          title: data.title,
          description: data.description,
          fees: data.fees,
        }).unwrap();
        toast.success("Added successfully!");
      }
      navigate("/tests/types");
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error.data?.detail || "Operation failed");
    }
  };

  const inputClass =
    "block w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:opacity-50";
  const labelClass =
    "block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300";

  if (isEditMode && isLoadingTestType) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="size-10 animate-spin text-blue-600" />
        <p className="text-gray-500 animate-pulse">Loading test type data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={isEditMode ? "Edit Test Type" : "Add New Test Type"}
        breadcrumbs={[
          { label: "Test Types", path: "/tests/types" },
          {
            label: isEditMode ? "Edit Test Type" : "Add New Test Type",
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
              Test Type Information
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
              <label className={labelClass}>Description *</label>
              <input
                {...register("description")}
                className={inputClass}
                placeholder="Description"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
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

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-all active:scale-95 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Cancel</span>
            </button>

            <button
              type="submit"
              disabled={isAdding || isUpdating}
              className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-100 dark:shadow-none flex items-center gap-2 disabled:opacity-70 transition-all active:scale-95 shrink-0"
            >
              {isAdding || isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isEditMode ? (
                <Edit3 className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}

              <span className="whitespace-nowrap">
                {isAdding || isUpdating ? (
                  "Saving..."
                ) : isEditMode ? (
                  <>
                    Update <span className="hidden sm:inline">Test Type</span>
                  </>
                ) : (
                  <>
                    Save <span className="hidden sm:inline">Test Type</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
