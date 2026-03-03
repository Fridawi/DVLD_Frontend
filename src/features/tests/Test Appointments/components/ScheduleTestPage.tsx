import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Calendar as CalendarIcon,
  Save,
  DollarSign,
  AlertCircle,
  XCircle,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useGetLocalDrivingLicenseApplicationByIdQuery } from "../../../applications/localApp/LocalAppApiSlice";
import { useGetTestTypeByIdQuery } from "../../test Types/TestTypesApiSlice";
import {
  useAddTestAppointmentMutation,
  useGetTestAppointmentByIdQuery,
  useUpdateTestAppointmentMutation,
} from "../TestAppointmentApiSlice";

import PageHeader from "../../../../components/common/PageHeader";
import LocalAppCard from "../../../applications/localApp/components/LocalAppCard";
import type { SerializedError } from "../../../../types/auth";
import { toast } from "sonner";
import { useTitle } from "../../../../hooks/useTitle";

const scheduleTestSchema = z.object({
  appointmentDate: z
    .date({
      message: "That's not a valid date",
    })
    .refine((date) => !!date, {
      message: "Appointment date is required",
    }),
});

type FormValues = z.infer<typeof scheduleTestSchema>;

export default function ScheduleTestPage() {
  const { localAppID, testTypeID, appointmentID } = useParams();
  const isEditMode = Boolean(appointmentID);
  const navigate = useNavigate();

  const { data: localApp, isLoading: isLoadingApp } =
    useGetLocalDrivingLicenseApplicationByIdQuery(Number(localAppID));

  const { data: testType, isLoading: isLoadingType } = useGetTestTypeByIdQuery(
    Number(testTypeID),
  );

  const { data: existingAppointment, isLoading: isLoadingApt } =
    useGetTestAppointmentByIdQuery(Number(appointmentID), {
      skip: !isEditMode,
    });

  const [addTestAppointment, { isLoading: isAdding }] =
    useAddTestAppointmentMutation();
  const [updateTestAppointment, { isLoading: isUpdating }] =
    useUpdateTestAppointmentMutation();

  useTitle(isEditMode ? "Reschedule Test Appointment" : "Schedule New Test");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(scheduleTestSchema),
    defaultValues: {
      appointmentDate: new Date(),
    },
  });

  useEffect(() => {
    if (isEditMode && existingAppointment) {
      reset({
        appointmentDate: new Date(existingAppointment.appointmentDate),
      });
    }
  }, [existingAppointment, isEditMode, reset]);

  const isLocked = existingAppointment?.isLocked;
  const isRetake =
    localApp && localApp.passedTestCount < Number(testTypeID) && !isEditMode;
  const retakeFees = isRetake ? 5 : 0;
  const totalFees = (testType?.fees || 0) + retakeFees;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (isLocked) return;
    try {
      const date = data.appointmentDate;
      const offset = date.getTimezoneOffset() * 60000;
      const localISODate = new Date(date.getTime() - offset).toISOString();

      if (isEditMode) {
        await updateTestAppointment({
          testAppointmentID: Number(appointmentID),
          appointmentDate: localISODate,
        }).unwrap();
      } else {
        await addTestAppointment({
          testTypeID: Number(testTypeID),
          localDrivingLicenseApplicationID: Number(localAppID),
          appointmentDate: localISODate,
          paidFees: totalFees,
        }).unwrap();
      }
      navigate(-1);
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error?.data?.detail ?? "Failed to save appointment.");
    }
  };

  if (isLoadingApp || isLoadingType || (isEditMode && isLoadingApt)) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-600 font-medium animate-pulse">
            Loading Test Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <PageHeader
        title={isEditMode ? "Reschedule Test" : "Schedule Test"}
        breadcrumbs={[
          { label: "Local Applications", path: "/applications/local" },
          { label: "Appointments" },
        ]}
      />

      <LocalAppCard app={localApp!} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold dark:text-white text-lg">
                Test Information
              </h3>
            </div>
            {isLocked && (
              <span className="flex items-center gap-1 text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">
                <XCircle className="w-3 h-3" /> Locked
              </span>
            )}
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Test Type
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-200">
                {testType?.title ||
                  existingAppointment?.testTypeName ||
                  "Test Type Not Found"}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Appointment Date
              </label>
              <div className="relative">
                <Controller
                  control={control}
                  name="appointmentDate"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      disabled={isLocked}
                      minDate={new Date()}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select date"
                      className={`w-full p-3 bg-white dark:bg-gray-900 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all ${
                        errors.appointmentDate
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                  )}
                />
              </div>
              {errors.appointmentDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.appointmentDate.message}
                </p>
              )}
            </div>
          </div>

          {isRetake && (
            <div className="mx-6 mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-blue-600 w-5 h-5" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Retake System:</strong> An additional fee of $
                {retakeFees} is applied for re-tests.
              </p>
            </div>
          )}

          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 flex gap-3">
            <button
              type="submit"
              disabled={isAdding || isUpdating || isLocked}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isAdding || isUpdating ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEditMode ? "Update" : "Save Appointment"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-fit">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
            <h3 className="font-bold flex items-center gap-2 dark:text-white">
              <DollarSign className="w-4 h-4 text-green-600" /> Payment Details
            </h3>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Test Fees:</span>
              <span className="font-semibold dark:text-white">
                ${testType?.fees || 0}
              </span>
            </div>
            {isRetake && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Retake Application:</span>
                <span className="font-semibold dark:text-white">
                  ${retakeFees}
                </span>
              </div>
            )}
            <div className="pt-3 border-t dark:border-gray-700 flex justify-between items-center">
              <span className="font-bold dark:text-white">Total:</span>
              <span className="text-2xl font-black text-blue-600">
                ${totalFees}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
