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
  Globe,
  CheckCircle2,
} from "lucide-react";

import PageHeader from "../../../../components/common/PageHeader";
import type { License } from "../../../../types/licenses";
import type { SerializedError } from "../../../../types/auth";
import {
  useIssueInternationalLicenseMutation,
  useCheckInternationalEligibilityQuery,
} from "../InternationalLicenseApiSlice";
import LicenseSelectorCard from "../../Licenses/components/LicenseSelectorCard";
import { useTitle } from "../../../../hooks/useTitle";

const issueInternationalSchema = z.object({
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof issueInternationalSchema>;

export default function AddInternationalLicense(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id")
    ? Number(searchParams.get("id"))
    : null;
  useTitle("New International License");

  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);

  const { data: eligibility, isLoading: isCheckingEligibility } =
    useCheckInternationalEligibilityQuery(selectedLicense?.licenseID ?? 0, {
      skip: !selectedLicense,
    });

  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(issueInternationalSchema),
    defaultValues: { notes: "" },
  });

  const [issueLicense, { isLoading: isIssuing }] =
    useIssueInternationalLicenseMutation();

  const canIssue = selectedLicense && eligibility?.eligible;

  const onSubmit: SubmitHandler<FormValues> = async () => {
    if (!selectedLicense) return;
    try {
      const response = await issueLicense({
        localLicenseID: selectedLicense.licenseID,
      }).unwrap();

      toast.success(
        `International License issued successfully! ID: #${response.result.internationalLicenseID}`,
      );
      navigate(
        `/international-licenses/manage/${response.result.internationalLicenseID}`,
      );
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(
        error?.data?.detail ?? "Failed to issue international license",
      );
    }
  };

  const inputClass =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors disabled:opacity-50";
  const labelClass =
    "block mb-2 text-sm font-medium text-gray-900 dark:text-white";

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="New International License"
        breadcrumbs={[
          { label: "Licenses", path: "/licenses/manage" },
          {
            label: "International Licenses",
            path: "/licenses/international",
          },
          { label: "New International License" },
        ]}
      />

      <LicenseSelectorCard
        onLicenseSelected={setSelectedLicense}
        initialLicenseId={initialId}
      />

      {selectedLicense && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-6 space-y-6">
            {isCheckingEligibility ? (
              <div className="flex items-center justify-center p-6 border border-dashed rounded-lg border-gray-200 dark:border-gray-700">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600 me-2" />
                <span className="text-gray-500 font-medium">
                  Checking eligibility...
                </span>
              </div>
            ) : !eligibility?.eligible ? (
              <div className="p-4 text-sm text-red-800 bg-red-50 rounded-lg dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertCircle size={16} /> Not Eligible for International
                  License
                </div>
                <p className="ml-6 mt-1 text-[13px]">
                  {eligibility?.message ||
                    "This license does not meet the requirements for an international license."}
                </p>
              </div>
            ) : (
              <div className="p-4 text-sm text-green-800 bg-green-50 rounded-lg dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={16} /> Eligible
                </div>
                <p className="ml-6 mt-1 text-[13px]">
                  This local license is active, not expired, and belongs to
                  Class 3. You can proceed.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                <Globe size={16} className="text-indigo-500" />
                International Application Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase">Fees</span>
                  <span className="font-bold text-gray-700 dark:text-gray-200">
                    $50.00
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase">
                    Validity Period
                  </span>
                  <span className="font-bold text-gray-700 dark:text-gray-200">
                    1 Year
                  </span>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  <FileText className="inline w-4 h-4 me-1 text-gray-400" />{" "}
                  Notes (Optional)
                </label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Add any relevant notes for this international license..."
                  disabled={!canIssue || isIssuing}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 pt-0 border-t-0 bg-white dark:bg-slate-800">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-[13px] font-bold text-slate-600 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-all active:scale-95 shrink-0"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={!canIssue || isIssuing}
              className="px-4 sm:px-8 py-2.5 text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-100 dark:shadow-none flex items-center gap-2 disabled:opacity-70 transition-all active:scale-95 shrink-0"
            >
              {isIssuing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span className="whitespace-nowrap">
                {isIssuing ? (
                  "Processing..."
                ) : (
                  <>
                    Issue{" "}
                    <span className="hidden sm:inline ml-1 text-[12px] opacity-90 font-medium tracking-tight">
                      International License
                    </span>
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
