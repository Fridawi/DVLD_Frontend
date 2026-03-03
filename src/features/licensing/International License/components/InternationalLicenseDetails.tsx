import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, XCircle } from "lucide-react";
import { type JSX } from "react";
import PageHeader from "../../../../components/common/PageHeader";
import { useGetInternationalLicenseByIdQuery } from "../InternationalLicenseApiSlice";
import InternationalLicenseCard from "./InternationalLicenseCard";

export default function InternationalLicenseDetails(): JSX.Element {
  const { intLicenseID } = useParams<{ intLicenseID: string }>();
  const navigate = useNavigate();
  const numericID = Number(intLicenseID);

  const {
    data: license,
    isLoading,
    isError,
  } = useGetInternationalLicenseByIdQuery(numericID);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-slate-500 text-sm font-bold tracking-tight">
          Fetching International Record...
        </p>
      </div>
    );
  }

  if (isError || !license) {
    return (
      <div className="p-8 text-center animate-in fade-in duration-300">
        <div className="inline-flex p-3 bg-rose-50 dark:bg-rose-900/20 rounded-full text-rose-600 mb-3">
          <XCircle size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          International Record Not Found
        </h2>
        <p className="text-slate-500 text-sm mt-1 mb-4">
          The requested international license ID #{numericID} could not be
          located in our system.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mx-auto text-indigo-600 text-sm font-bold flex items-center justify-center gap-2 hover:underline transition-all"
        >
          <ArrowLeft size={16} /> Back to Management
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      <PageHeader
        title="International License Details"
        breadcrumbs={[
          { label: "Licenses", path: "/licenses/manage" },
          {
            label: "International Licenses",
            path: "/Licenses/international",
          },
          { label: `Details #${license.internationalLicenseID}` },
        ]}
      />

      <div className="relative group">
        <div className="relative">
          <InternationalLicenseCard license={license} />
        </div>
      </div>
    </div>
  );
}
