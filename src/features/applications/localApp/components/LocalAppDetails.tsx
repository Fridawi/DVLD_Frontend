import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, XCircle } from "lucide-react";
import { type JSX } from "react";
import PageHeader from "../../../../components/common/PageHeader";
import { useGetLocalDrivingLicenseApplicationByIdQuery } from "../LocalAppApiSlice";
import ApplicationCard from "../../components/ApplicationDetails";
import LocalAppCard from "./LocalAppCard";

export default function LocalAppDetails(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericID = Number(id);

  const {
    data: app,
    isLoading,
    isError,
  } = useGetLocalDrivingLicenseApplicationByIdQuery(numericID);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
        <p className="text-slate-500 text-sm font-bold tracking-tight">
          Fetching Application Data...
        </p>
      </div>
    );
  }

  if (isError || !app) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex p-3 bg-rose-50 dark:bg-rose-900/20 rounded-full text-rose-600 mb-3">
          <XCircle size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Application Not Found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 text-blue-600 text-sm font-bold flex items-center justify-center gap-2 w-full"
        >
          <ArrowLeft size={16} /> Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      <PageHeader
        title="Local Application Details"
        breadcrumbs={[
          { label: "Applications", path: "/applications/local" },
          { label: `Details (#${app.localDrivingLicenseApplicationID})` },
        ]}
      />

      <LocalAppCard app={app} />

      <ApplicationCard applicationId={app.applicationID} />
    </div>
  );
}
