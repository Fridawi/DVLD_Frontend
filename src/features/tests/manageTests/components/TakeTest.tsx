import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  Save,
  ClipboardCheck,
  StickyNote,
} from "lucide-react";
import { useEffect } from "react";

import type { SerializedError } from "../../../../types/auth";
import PageHeader from "../../../../components/common/PageHeader";
import {
  useAddTestMutation,
  useGetTestByIdQuery,
  useUpdateTestMutation,
} from "../TestApiSlice";
import TestAppointmentCard from "../../Test Appointments/components/TestAppointmentCard";
import { useTitle } from "../../../../hooks/useTitle";

const testSchema = z.object({
  testResult: z.boolean({ error: "Required" }),
  notes: z.string().max(500).optional().or(z.literal("")),
});

type TestFormValues = z.infer<typeof testSchema>;

export default function AddEditTest() {
  const navigate = useNavigate();
  const { appointmentID, testID } = useParams<{
    appointmentID: string;
    testID: string;
  }>();
  const isEditMode = Boolean(testID);

  const { data: testData, isLoading: isLoadingTest } = useGetTestByIdQuery(
    Number(testID),
    { skip: !isEditMode },
  );

  const [addTest, { isLoading: isAdding }] = useAddTestMutation();
  const [updateTest, { isLoading: isUpdating }] = useUpdateTestMutation();

  useTitle(
    isEditMode ? "DVLD | Update Test Result" : "DVLD | Take Test Result",
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: { testResult: true, notes: "" },
  });

  const currentResult = useWatch({ control, name: "testResult" });

  useEffect(() => {
    if (isEditMode && testData) {
      reset({ testResult: testData.testResult, notes: testData.notes ?? "" });
    }
  }, [testData, isEditMode, reset]);

  const onSubmit: SubmitHandler<TestFormValues> = async (data) => {
    try {
      const payload = { testResult: data.testResult, notes: data.notes || "" };
      if (isEditMode) {
        await updateTest({
          id: Number(testID),
          updatedData: { ...payload, testID: Number(testID) },
        }).unwrap();
      } else {
        await addTest({
          ...payload,
          testAppointmentID: Number(appointmentID),
        }).unwrap();
      }
      toast.success("Saved successfully");
      navigate(-1);
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error.data?.detail || "Operation failed");
    }
  };

  if (isEditMode && isLoadingTest) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full px-2">
      <PageHeader
        title={isEditMode ? "Edit Test Result" : "Take Test"}
        breadcrumbs={[
          { label: "Appointments", path: ".." },
          { label: "Result" },
        ]}
      />

      <TestAppointmentCard
        appointmentId={Number(
          isEditMode ? testData?.testAppointmentID : appointmentID,
        )}
        testTypeID={testID}
      />

      <main className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm overflow-hidden w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-wider">
                Select Result
              </label>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setValue("testResult", true)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border-2 text-sm font-bold transition-all ${
                    currentResult === true
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-500"
                      : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <ClipboardCheck
                    size={18}
                    className={currentResult === true ? "text-emerald-600" : ""}
                  />{" "}
                  Passed
                </button>
                <button
                  type="button"
                  onClick={() => setValue("testResult", false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border-2 text-sm font-bold transition-all ${
                    currentResult === false
                      ? "border-rose-600 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-500"
                      : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <XCircle
                    size={18}
                    className={currentResult === false ? "text-rose-600" : ""}
                  />{" "}
                  Failed
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-wider flex items-center gap-1">
                <StickyNote size={14} className="text-blue-600" /> Examiner
                Notes
              </label>
              <textarea
                {...register("notes")}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition min-h-23 resize-none placeholder:text-slate-400"
                placeholder="Write observations..."
              />
              {errors.notes && (
                <p className="text-rose-600 text-[10px] font-black uppercase tracking-tight">
                  {errors.notes.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-3 py-2 text-[11px] font-black text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 transition-colors uppercase tracking-tight shrink-0"
            >
              <ArrowLeft size={14} />
              <span className="hidden xs:inline">Cancel</span>
            </button>

            <button
              type="submit"
              disabled={isAdding || isUpdating}
              className="px-6 sm:px-8 py-2.5 text-[11px] font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-100 dark:shadow-none flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95 uppercase tracking-wider shrink-0"
            >
              {isAdding || isUpdating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}

              <span className="whitespace-nowrap">
                {isAdding || isUpdating ? (
                  "Saving..."
                ) : (
                  <>
                    {isEditMode ? "Update" : "Save"}
                    <span className="hidden sm:inline ml-1">Result</span>
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

function XCircle({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}
