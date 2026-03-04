import { useState, type JSX } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  RefreshCcw,
  Loader2,
  AlertCircle,
  FileWarning,
  Search,
} from "lucide-react";

import PageHeader from "../../../../components/common/PageHeader";
import LicenseSelectorCard from "./LicenseSelectorCard";
import type { License } from "../../../../types/licenses";
import type { SerializedError } from "../../../../types/auth";
import { useReplaceLicenseMutation } from "../LicenseApiSlice";
import { useTitle } from "../../../../hooks/useTitle";

type ReplacementType = "damaged" | "lost";

export default function ReplacementLicensePage(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id")
    ? Number(searchParams.get("id"))
    : null;

  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [replaceType, setReplaceType] = useState<ReplacementType>("damaged");

  useTitle(
    selectedLicense
      ? `Replace (${replaceType}): #${selectedLicense.licenseID}`
      : "License Replacement",
  );

  const [replaceLicense, { isLoading: isReplacing }] =
    useReplaceLicenseMutation();

  const canReplace =
    selectedLicense &&
    selectedLicense.isActive &&
    !selectedLicense.isExpired &&
    !selectedLicense.isDetained;

  const handleReplacement = async () => {
    if (!selectedLicense) return;

    try {
      const response = await replaceLicense({
        oldLicenseId: selectedLicense.licenseID,
        reason: replaceType === "damaged" ? 3 : 4,
      }).unwrap();

      toast.success(
        `License replaced successfully! New ID: #${response.licenseID}`,
      );
      navigate(`/licenses/manage/${response.licenseID}`);
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error?.data?.detail ?? "Failed to replace license");
    }
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Replacement for Damaged/Lost License"
        breadcrumbs={[
          { label: "Licenses", path: "/licenses" },
          { label: "Replacement" },
        ]}
      />

      <LicenseSelectorCard
        onLicenseSelected={setSelectedLicense}
        initialLicenseId={initialId}
      />

      {selectedLicense && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-6 space-y-6">
            {!canReplace && (
              <div className="p-4 text-sm text-amber-800 bg-amber-50 rounded-lg dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertCircle size={16} /> Cannot Replace This License
                </div>
                <ul className="list-disc list-inside space-y-1 ml-1 mt-2 text-[13px]">
                  {selectedLicense.isExpired && (
                    <li>
                      The license is <b>expired</b>. Please renew it instead.
                    </li>
                  )}
                  {!selectedLicense.isActive && (
                    <li>
                      The license is <b>inactive</b>.
                    </li>
                  )}
                  {selectedLicense.isDetained && (
                    <li>
                      The license is <b>detained</b>.
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                <RefreshCcw size={16} className="text-blue-500" />
                Replacement Reason
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setReplaceType("damaged")}
                  disabled={!canReplace || isReplacing}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    replaceType === "damaged"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-100 dark:border-gray-700 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${replaceType === "damaged" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}
                    >
                      <FileWarning size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold dark:text-white">
                        Damaged License
                      </p>
                      <p className="text-xs text-gray-500">
                        Replace a physically broken card
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${replaceType === "damaged" ? "border-blue-600" : "border-gray-300"}`}
                  >
                    {replaceType === "damaged" && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setReplaceType("lost")}
                  disabled={!canReplace || isReplacing}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    replaceType === "lost"
                      ? "border-amber-600 bg-amber-50 dark:bg-amber-900/20"
                      : "border-gray-100 dark:border-gray-700 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${replaceType === "lost" ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-400"}`}
                    >
                      <Search size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold dark:text-white">
                        Lost License
                      </p>
                      <p className="text-xs text-gray-500">
                        Issue a new card for a lost one
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${replaceType === "lost" ? "border-amber-600" : "border-gray-300"}`}
                  >
                    {replaceType === "lost" && (
                      <div className="w-2.5 h-2.5 bg-amber-600 rounded-full" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 p-4 bg-gray-50 dark:bg-gray-900/20 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 me-1" />
              <span className="xs:inline">Cancel</span>
            </button>

            <button
              onClick={handleReplacement}
              disabled={!canReplace || isReplacing}
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
            >
              {isReplacing ? (
                <Loader2 className="w-4 h-4 me-2 animate-spin" />
              ) : (
                <RefreshCcw className="w-4 h-4 me-2" />
              )}

              <span>
                {isReplacing ? (
                  "Processing..."
                ) : (
                  <>
                    <span className="hidden sm:inline">
                      Issue Replacement for{" "}
                    </span>
                    <span className="capitalize">{replaceType}</span>
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
