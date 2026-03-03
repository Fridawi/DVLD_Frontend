import { useState, type JSX } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import {
  ArrowLeft,
  Lock,
  Gavel,
  Loader2,
  ShieldAlert,
  Banknote,
} from "lucide-react";

import PageHeader from "../../../../components/common/PageHeader";
import LicenseSelectorCard from "../../Licenses/components/LicenseSelectorCard";
import type { License } from "../../../../types/licenses";
import type { SerializedError } from "../../../../types/auth";
import { useDetainLicenseMutation } from "../DetainedApiSlice";
import { useTitle } from "../../../../hooks/useTitle";

const detainLicenseSchema = z.object({
  fineFees: z
    .number({ error: "Fine fees must be a number" })
    .min(1, "Fine fees must be at least 1$"),
});

type DetainLicenseFormValues = z.infer<typeof detainLicenseSchema>;

export default function DetainLicensePage(): JSX.Element {
  const navigate = useNavigate();
  const { licenseID } = useParams();
  const [searchParams] = useSearchParams();

  const initialId = licenseID
    ? Number(licenseID)
    : searchParams.get("id")
      ? Number(searchParams.get("id"))
      : null;

  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DetainLicenseFormValues>({
    resolver: zodResolver(detainLicenseSchema),
    defaultValues: { fineFees: 0 },
  });

  useTitle(
    selectedLicense
      ? `Detain License: #${selectedLicense.licenseID}`
      : "Detain Driving License",
  );

  const [detainLicense, { isLoading: isDetaining }] =
    useDetainLicenseMutation();

  const canDetain =
    selectedLicense && selectedLicense.isActive && !selectedLicense.isDetained;

  const onSubmit: SubmitHandler<DetainLicenseFormValues> = async (data) => {
    if (!selectedLicense) return;

    try {
      await detainLicense({
        licenseID: selectedLicense.licenseID,
        fineFees: data.fineFees,
      }).unwrap();

      toast.success(
        `License #${selectedLicense.licenseID} has been detained successfully!`,
      );
      navigate(`/licenses/detaineds`);
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error?.data?.detail ?? "Failed to detain license");
    }
  };

  const inputClass =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors disabled:opacity-50";
  const labelClass =
    "block mb-2 text-sm font-medium text-gray-900 dark:text-white";

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Detain Driving License"
        breadcrumbs={[
          { label: "Licenses", path: "/licenses" },
          { label: "Detained Licenses", path: "/licenses/detained" },
          { label: "Detain License" },
        ]}
      />

      <LicenseSelectorCard
        onLicenseSelected={setSelectedLicense}
        initialLicenseId={initialId}
      />

      {selectedLicense && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-6 space-y-6">
            {!canDetain && (
              <div className="p-4 text-sm text-red-800 bg-red-50 rounded-lg dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldAlert size={16} /> Cannot Detain This License
                </div>
                <ul className="list-disc list-inside space-y-1 ml-1 mt-2 text-[13px]">
                  {!selectedLicense.isActive && (
                    <li>
                      The license is currently <b>inactive</b>.
                    </li>
                  )}
                  {selectedLicense.isDetained && (
                    <li>
                      The license is <b>already detained</b>.
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                <Gavel size={16} className="text-red-500" />
                Detention Details
              </h3>

              <div className="max-w-md">
                <label className={labelClass}>
                  <Banknote className="inline w-4 h-4 me-1 text-gray-400" />{" "}
                  Fine Fees ($)
                </label>
                <input
                  {...register("fineFees", { valueAsNumber: true })}
                  className={`${inputClass} ${errors.fineFees ? "border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="Enter the fine amount..."
                  disabled={!canDetain || isDetaining}
                />
                {errors.fineFees && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.fineFees.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/20 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium px-5 py-2.5 inline-flex items-center dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 me-2" /> Cancel
            </button>

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={!canDetain || isDetaining}
              className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-8 py-2.5 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              {isDetaining ? (
                <Loader2 className="w-4 h-4 me-2 animate-spin" />
              ) : (
                <Lock className="w-4 h-4 me-2" />
              )}
              {isDetaining ? "Processing..." : "Detain License"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
