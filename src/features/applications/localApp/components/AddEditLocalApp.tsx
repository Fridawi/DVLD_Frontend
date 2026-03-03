import { useState, useEffect, type JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import {
  ArrowLeft,
  ChevronRight,
  Info,
  Save,
  FileText,
  Award,
  Loader2,
  Edit3,
} from "lucide-react";

import {
  useAddLocalDrivingLicenseApplicationMutation,
  useGetLocalDrivingLicenseApplicationByIdQuery,
  useUpdateLocalDrivingLicenseApplicationMutation,
} from "../LocalAppApiSlice";
import { useGetApplicationByIdQuery } from "../../ApplicationApiSlice";
import type { SerializedError } from "../../../../types/auth";
import PageHeader from "../../../../components/common/PageHeader";
import PersonSelectorCard from "../../../people/components/PersonSelectorCard";
import { useGetApplicationTypesQuery } from "../../applicationTypes/applicationTypesApiSlice";
import { useGetLicensesClassQuery } from "../../../licensing/licenses Class/LicensesClassApiSlice";
import type { LicenseClass } from "../../../../types/licenseClass";
import { useTitle } from "../../../../hooks/useTitle";

const addLocalAppSchema = z.object({
  personID: z.number({ error: "Person selection is required" }).min(1),
  licenseClassID: z
    .number({ error: "License class is required" })
    .min(1, "License class is required"),
  applicationTypeID: z
    .number({ error: "Application type is required" })
    .min(1, "Application type is required"),
});

type AddLocalAppFormValues = z.infer<typeof addLocalAppSchema>;

export default function AddEditLocalApp(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  console.log(id);
  const [step, setStep] = useState<1 | 2>(isEditMode ? 2 : 1);
  useTitle(isEditMode ? "Update Local Application" : "New Local Application");

  const { data: localAppData, isLoading: isLoadingLocal } =
    useGetLocalDrivingLicenseApplicationByIdQuery(Number(id), {
      skip: !isEditMode,
    });

  const { data: baseAppData, isLoading: isLoadingBase } =
    useGetApplicationByIdQuery(localAppData?.applicationID || 0, {
      skip: !localAppData,
    });

  const [addLocalApp, { isLoading: isAdding }] =
    useAddLocalDrivingLicenseApplicationMutation();
  const [updateLocalApp, { isLoading: isUpdating }] =
    useUpdateLocalDrivingLicenseApplicationMutation();

  const { data: appTypes } = useGetApplicationTypesQuery({
    pageNumber: 1,
    pageSize: 50,
  });
  const { data: licenseClasses } = useGetLicensesClassQuery({
    pageNumber: 1,
    pageSize: 50,
  });

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    reset,
    formState: { errors },
  } = useForm<AddLocalAppFormValues>({
    resolver: zodResolver(addLocalAppSchema),
    defaultValues: {
      personID: 0,
      applicationTypeID: 1,
      licenseClassID: 3,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (isEditMode && localAppData && baseAppData && licenseClasses?.data) {
      const currentClass = licenseClasses.data.find(
        (lc) => lc.className === localAppData.className,
      );

      reset({
        personID: baseAppData.applicantPersonID,
        applicationTypeID: baseAppData.applicationTypeID,
        licenseClassID: currentClass?.licenseClassID || 0,
      });
    }
  }, [isEditMode, localAppData, baseAppData, licenseClasses, reset]);

  const watchedPersonId = useWatch({ control, name: "personID" });

  const inputClass =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors disabled:opacity-50";
  const labelClass =
    "block mb-2 text-sm font-medium text-gray-900 dark:text-white";

  const goNext = async () => {
    const isValid = await trigger("personID");
    if (isValid && watchedPersonId > 0) setStep(2);
    else toast.error("Please select a person to continue");
  };

  const onSubmit: SubmitHandler<AddLocalAppFormValues> = async (data) => {
    try {
      if (isEditMode) {
        await updateLocalApp({
          id: Number(id),
          updatedData: {
            localDrivingLicenseApplicationID: Number(id),
            licenseClassID: data.licenseClassID,
          },
        }).unwrap();
        toast.success("Updated successfully");
      } else {
        await addLocalApp(data).unwrap();
        toast.success("Created successfully");
      }
      navigate("/applications/local");
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error?.data?.detail ?? "Operation failed");
    }
  };

  if (isEditMode && (isLoadingLocal || isLoadingBase)) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="size-10 animate-spin text-blue-600" />
        <p className="text-gray-500">Loading application data...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title={
          isEditMode
            ? "Update Local Application"
            : "New Local Driving License Application"
        }
        breadcrumbs={[
          { label: "Applications", path: "/applications/local" },
          { label: isEditMode ? "Update" : "New Application" },
        ]}
      />

      {!isEditMode && (
        <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4">
          <li
            className={`flex items-center ${step === 1 ? "text-blue-600" : "text-green-600"}`}
          >
            <span
              className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${step === 1 ? "border-blue-600" : "border-green-600"}`}
            >
              1
            </span>
            Person Selection <ChevronRight className="w-4 h-4 ms-2" />
          </li>
          <li
            className={`flex items-center ${step === 2 ? "text-blue-600" : ""}`}
          >
            <span
              className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${step === 2 ? "border-blue-600" : "border-gray-500"}`}
            >
              2
            </span>
            Application Details
          </li>
        </ol>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          {step === 1 && !isEditMode && (
            <div className="space-y-6">
              <div className="p-4 mb-4 text-blue-800 border-t-4 border-blue-300 bg-blue-50 dark:bg-gray-800 dark:text-blue-400 rounded-lg flex items-center gap-3">
                <Info size={18} />
                <span className="text-sm font-medium">
                  Select the applicant person from the list below.
                </span>
              </div>
              <PersonSelectorCard
                onPersonSelected={(id) =>
                  id && setValue("personID", id, { shouldValidate: true })
                }
              />
              <div className="flex justify-end pt-5">
                <button
                  onClick={goNext}
                  className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
                >
                  Next: Application Details{" "}
                  <ChevronRight className="w-4 h-4 ms-2" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    <FileText className="inline w-4 h-4 me-1" /> Application
                    Type
                  </label>
                  <select
                    {...register("applicationTypeID", { valueAsNumber: true })}
                    className={inputClass}
                    disabled={isEditMode}
                  >
                    <option value="">Select Type</option>
                    {appTypes?.data.map((type) => (
                      <option
                        key={type.applicationTypeID}
                        value={type.applicationTypeID}
                      >
                        {type.title} (Fees: {type.fees})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    <Award className="inline w-4 h-4 me-1" /> License Class
                  </label>
                  <select
                    {...register("licenseClassID", { valueAsNumber: true })}
                    className={inputClass}
                  >
                    <option value="">Select Class</option>
                    {licenseClasses?.data.map((lc: LicenseClass) => (
                      <option key={lc.licenseClassID} value={lc.licenseClassID}>
                        {lc.className}
                      </option>
                    ))}
                  </select>
                  {errors.licenseClassID && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.licenseClassID.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => (isEditMode ? navigate(-1) : setStep(1))}
                  type="button"
                  className="text-gray-500 bg-white border border-gray-200 rounded-lg text-sm font-medium px-5 py-2.5 inline-flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 me-2" />{" "}
                  {isEditMode ? "Back" : "Previous"}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(-1)}
                    type="button"
                    className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isAdding || isUpdating}
                    className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center disabled:opacity-50"
                  >
                    {isAdding || isUpdating ? (
                      <Loader2 className="w-4 h-4 me-2 animate-spin" />
                    ) : isEditMode ? (
                      <Edit3 className="w-4 h-4 me-2" />
                    ) : (
                      <Save className="w-4 h-4 me-2" />
                    )}
                    {isAdding || isUpdating
                      ? "Saving..."
                      : isEditMode
                        ? "Update Application"
                        : "Create Application"}
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
