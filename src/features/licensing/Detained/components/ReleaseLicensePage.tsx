import { useState, type JSX } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Unlock,
  Loader2,
  AlertCircle,
  Gavel,
  ShieldCheck,
} from "lucide-react";

import PageHeader from "../../../../components/common/PageHeader";
import type { License } from "../../../../types/licenses";
import type { SerializedError } from "../../../../types/auth";
import {
  useGetDetainedLicenseByLicenseIdQuery,
  useReleaseLicenseMutation,
} from "../DetainedApiSlice";
import DetainedInfoCard from "./DetainedInfoCard";
import LicenseSelectorCard from "../../Licenses/components/LicenseSelectorCard";
import { useTitle } from "../../../../hooks/useTitle";

export default function ReleaseLicensePage(): JSX.Element {
  const navigate = useNavigate();

  const { licenseID } = useParams();
  const [searchParams] = useSearchParams();

  const initialId = licenseID
    ? Number(licenseID)
    : searchParams.get("id")
      ? Number(searchParams.get("id"))
      : null;

  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);

  const { data: detentionData, isLoading: isLoadingDetention } =
    useGetDetainedLicenseByLicenseIdQuery(selectedLicense?.licenseID ?? 0, {
      skip: !selectedLicense || !selectedLicense.isDetained,
    });
  useTitle(
    selectedLicense
      ? `Release: #${selectedLicense.licenseID}`
      : "Release Detained License",
  );
  const [releaseLicense, { isLoading: isReleasing }] =
    useReleaseLicenseMutation();

  const canRelease =
    selectedLicense && selectedLicense.isDetained && detentionData;

  const handleRelease = async () => {
    if (!selectedLicense) return;

    try {
      await releaseLicense(selectedLicense.licenseID).unwrap();
      toast.success(
        `License #${selectedLicense.licenseID} has been released successfully!`,
      );

      navigate(`/licenses/detaineds`);
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error?.data?.detail ?? "Failed to release license");
    }
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Release Detained License"
        breadcrumbs={[
          { label: "Licenses", path: "/licenses/manage" },
          { label: "Detained Licenses", path: "/licenses/detained" },
          { label: "Release" },
        ]}
      />

      <LicenseSelectorCard
        onLicenseSelected={setSelectedLicense}
        initialLicenseId={initialId}
      />

      {selectedLicense && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-6 space-y-6">
            {!selectedLicense.isDetained && (
              <div className="p-4 text-sm text-blue-800 bg-blue-50 rounded-lg dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-3">
                <ShieldCheck size={20} />
                <p className="font-medium">
                  This license is <b>not detained</b>. No action required.
                </p>
              </div>
            )}

            {isLoadingDetention && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              </div>
            )}

            {selectedLicense.isDetained &&
              !detentionData &&
              !isLoadingDetention && (
                <div className="p-4 text-sm text-red-800 bg-red-50 rounded-lg dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 flex items-center gap-3">
                  <AlertCircle size={20} />
                  <p className="font-medium">
                    System shows license is detained but no record was found.
                  </p>
                </div>
              )}

            {detentionData && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                  <Gavel size={16} className="text-rose-500" />
                  Detention Information & Fees
                </h3>
                <DetainedInfoCard detention={detentionData} />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/20 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium px-5 py-2.5 inline-flex items-center dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 me-2" /> Back
            </button>

            <button
              onClick={handleRelease}
              disabled={!canRelease || isReleasing}
              className="text-white bg-emerald-600 hover:bg-emerald-700 font-bold rounded-lg text-sm px-8 py-2.5 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              {isReleasing ? (
                <Loader2 className="w-4 h-4 me-2 animate-spin" />
              ) : (
                <Unlock className="w-4 h-4 me-2" />
              )}
              {isReleasing ? "Releasing..." : "Release License"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
