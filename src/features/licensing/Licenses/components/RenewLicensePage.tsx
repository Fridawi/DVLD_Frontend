import { useState, type JSX } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  FileText,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

import PageHeader from "../../../../components/common/PageHeader";
import LicenseSelectorCard from "./LicenseSelectorCard";
import type { License } from "../../../../types/licenses";
import type { SerializedError } from "../../../../types/auth";
import { useRenewLicenseMutation } from "../LicenseApiSlice";
import { useTitle } from "../../../../hooks/useTitle";

const renewLicenseSchema = z.object({
  notes: z.string().optional(),
});

type RenewLicenseFormValues = z.infer<typeof renewLicenseSchema>;

export default function RenewLicensePage(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id")
    ? Number(searchParams.get("id"))
    : null;

  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);

  useTitle(
    selectedLicense
      ? `Renew License: #${selectedLicense.licenseID}`
      : "Renew Driving License",
  );

  const { register, handleSubmit } = useForm<RenewLicenseFormValues>({
    resolver: zodResolver(renewLicenseSchema),
    defaultValues: { notes: "" },
  });

  const [renewLicense, { isLoading: isRenewing }] = useRenewLicenseMutation();

  const canRenew =
    selectedLicense &&
    selectedLicense.isActive &&
    selectedLicense.isExpired &&
    !selectedLicense.isDetained;

  const onSubmit: SubmitHandler<RenewLicenseFormValues> = async (data) => {
    if (!selectedLicense) return;
    try {
      const response = await renewLicense({
        oldLicenseId: selectedLicense.licenseID,
        notes: data.notes,
      }).unwrap();

      toast.success(
        `License renewed successfully! New ID: #${response.licenseID}`,
      );
      navigate(`/licenses/manage/${response.licenseID}`);
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error?.data?.detail ?? "Failed to renew license");
    }
  };

  const inputClass =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors disabled:opacity-50";
  const labelClass =
    "block mb-2 text-sm font-medium text-gray-900 dark:text-white";

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Renew Driving License"
        breadcrumbs={[
          { label: "Licenses", path: "/licenses" },
          { label: "Renew License" },
        ]}
      />

      <LicenseSelectorCard
        onLicenseSelected={setSelectedLicense}
        initialLicenseId={initialId}
      />

      {selectedLicense && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-6 space-y-6">
            {!canRenew && (
              <div className="p-4 text-sm text-amber-800 bg-amber-50 rounded-lg dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertCircle size={16} /> Cannot Renew This License
                </div>
                <ul className="list-disc list-inside space-y-1 ml-1 mt-2 text-[13px]">
                  {!selectedLicense.isActive && (
                    <li>
                      The license is currently <b>inactive</b>.
                    </li>
                  )}
                  {!selectedLicense.isExpired && (
                    <li>
                      The license is <b>not yet expired</b>.
                    </li>
                  )}
                  {selectedLicense.isDetained && (
                    <li>
                      The license is currently <b>detained</b>.
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                <ShieldCheck size={16} className="text-green-500" />
                Renewal Application Details
              </h3>

              <div>
                <label className={labelClass}>
                  <FileText className="inline w-4 h-4 me-1 text-gray-400" />{" "}
                  Notes (Optional)
                </label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Add any relevant notes for this renewal..."
                  disabled={!canRenew || isRenewing}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 p-4 bg-gray-50 dark:bg-gray-900/20 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 me-1" />
              <span className="xs:inline">Cancel</span>
            </button>

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={!canRenew || isRenewing}
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
            >
              {isRenewing ? (
                <Loader2 className="w-4 h-4 me-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 me-2" />
              )}

              <span>
                {isRenewing ? (
                  "Processing..."
                ) : (
                  <>
                    <span className="hidden sm:inline">Confirm & </span>
                    Issue Renewed
                    <span className="hidden sm:inline"> License</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
