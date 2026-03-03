import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Loader2,
  UserPlus,
  ArrowLeft,
  Image as ImageIcon,
  Edit3,
  Save,
} from "lucide-react";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import PageHeader from "../../../components/common/PageHeader";
import { useGetCountriesQuery } from "../../countries/countriesApiSlice";
import {
  useAddPersonMutation,
  useUpdatePersonMutation,
  useGetPersonByIdQuery,
} from "../peopleApiSlice";
import type { SerializedError } from "../../../types/auth";
import { useTitle } from "../../../hooks/useTitle";

const GENDER_MALE = 0;
const DEFAULT_COUNTRY_ID = 80;

const personSchema = z.object({
  fullName: z.string().min(5, "Full name is required"),
  nationalNo: z.string().min(5, "National Number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(7, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gendor: z.number().int(),
  nationalityCountryID: z.number().int().min(1, "Please select a country"),
  imageFile: z.any().optional(),
});

type PersonFormValues = z.infer<typeof personSchema>;

export default function AddEditPersonForm() {
  const navigate = useNavigate();
  const { personID } = useParams<{ personID: string }>();
  const isEditMode = Boolean(personID);

  const { data: countries, isLoading: isLoadingCountries } =
    useGetCountriesQuery();
  const { data: personData, isLoading: isLoadingPerson } =
    useGetPersonByIdQuery(Number(personID), {
      skip: !isEditMode,
    });

  useTitle(
    isEditMode
      ? `Edit Person: ${personData?.fullName || personID}`
      : "Add New Person",
  );

  const [addPerson, { isLoading: isAdding }] = useAddPersonMutation();
  const [updatePerson, { isLoading: isUpdating }] = useUpdatePersonMutation();

  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      gendor: GENDER_MALE,
      nationalityCountryID: DEFAULT_COUNTRY_ID,
    },
  });

  const inputClass =
    "block w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:opacity-50";
  const labelClass =
    "block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300";

  useEffect(() => {
    if (personData) {
      reset({
        fullName: personData.fullName,
        nationalNo: personData.nationalNo,
        email: personData.email || "",
        phone: personData.phone,
        address: personData.address,
        dateOfBirth: personData.dateOfBirth,
        gendor: personData.gendor,
        nationalityCountryID: personData.nationalityCountryID,
      });

      if (personData.imageUrl) {
        const timer = setTimeout(() => setPreview(personData.imageUrl!), 0);
        return () => clearTimeout(timer);
      }
    }
  }, [personData, reset]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onSubmit: SubmitHandler<PersonFormValues> = async (data) => {
    try {
      const { imageFile, ...person } = data;
      const file = imageFile?.[0] instanceof File ? imageFile[0] : undefined;

      if (isEditMode) {
        await updatePerson({
          id: Number(personID),
          personData: person,
          imageFile: file,
        }).unwrap();
        toast.success("Person updated successfully!");
      } else {
        await addPerson({ personData: person, imageFile: file }).unwrap();
        toast.success("Person added successfully!");
      }

      navigate("/people");
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error.data?.detail || "Operation failed");
    }
  };

  if (isEditMode && isLoadingPerson) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="size-10 animate-spin text-blue-600" />
        <p className="text-gray-500 animate-pulse">Loading person data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={isEditMode ? "Edit Person" : "Add New Person"}
        breadcrumbs={[
          { label: "People", path: "/people" },
          { label: isEditMode ? "Edit Person" : "Add New Person" },
        ]}
      />

      <main className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <UserPlus className="text-blue-600 size-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Personal Information
            </h3>
            <p className="text-sm text-gray-500">
              Please fill in all required fields marked with *
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                {...register("fullName")}
                className={inputClass}
                placeholder="Full Name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>National Number *</label>
              <input
                {...register("nationalNo")}
                className={inputClass}
                placeholder="National ID"
                disabled={isEditMode}
              />
              {errors.nationalNo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nationalNo.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Date of Birth *</label>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field }) => (
                  <DatePicker
                    autoComplete="off"
                    placeholderText="YYYY-MM-DD"
                    className={inputClass}
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date: Date | null) =>
                      field.onChange(date?.toISOString().split("T")[0] || "")
                    }
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                    showYearDropdown
                    scrollableYearDropdown
                  />
                )}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Gender *</label>
              <select
                {...register("gendor", { valueAsNumber: true })}
                className={inputClass}
              >
                <option value={0}>Male</option>
                <option value={1}>Female</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Nationality *</label>
              <select
                {...register("nationalityCountryID", { valueAsNumber: true })}
                className={inputClass}
                disabled={isLoadingCountries}
              >
                <option value={0}>Select Country</option>
                {countries?.map((c) => (
                  <option key={c.countryID} value={c.countryID}>
                    {c.countryName}
                  </option>
                ))}
              </select>
              {errors.nationalityCountryID && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nationalityCountryID.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Phone Number *</label>
              <input
                {...register("phone")}
                className={inputClass}
                placeholder="07XXXXXXXX"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                {...register("email")}
                className={inputClass}
                placeholder="mail@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Address *</label>
              <input
                {...register("address")}
                className={inputClass}
                placeholder="City, Street..."
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-white shadow-sm">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="text-blue-500 w-8 h-8" />
                )}
              </div>
              <label className="cursor-pointer text-sm font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 transition">
                Change Profile Image
                <Controller
                  control={control}
                  name="imageFile"
                  render={({ field }) => (
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                          field.onChange(e.target.files); // مهم
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  )}
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
              disabled={isAdding || isUpdating}
              className="px-8 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-70 transition-all active:scale-95"
            >
              {isAdding || isUpdating ? (
                <Edit3 className="size-4" />
              ) : (
                <Save className="size-4" />
              )}
              {isAdding || isUpdating
                ? "Saving..."
                : isEditMode
                  ? "Update Person"
                  : "Save Person"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
