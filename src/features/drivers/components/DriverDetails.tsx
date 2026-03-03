import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, UserX } from "lucide-react";
import { type JSX } from "react";
import PageHeader from "../../../components/common/PageHeader";
import DriverCard from "./DriverCard";
import { useGetDriverByIdQuery } from "../DriverApiSlice";
import { useTitle } from "../../../hooks/useTitle";

export default function DriverDetails(): JSX.Element {
  const { driverID } = useParams<{ driverID: string }>();
  const navigate = useNavigate();
  const numericID = Number(driverID);

  const { data: driver, isLoading, isError } = useGetDriverByIdQuery(numericID);
  useTitle(`Driver #${numericID}`);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-500 text-sm font-bold tracking-tight font-arabic">
          Fetching Drover Record...
        </p>
      </div>
    );
  }

  if (isError || !driver) {
    return (
      <div className="p-8 text-center animate-in fade-in duration-300">
        <div className="inline-flex p-3 bg-rose-50 dark:bg-rose-900/20 rounded-full text-rose-600 mb-3">
          <UserX size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Driver Record Not Found
        </h2>
        <p className="text-slate-500 text-sm mt-1 mb-4">
          The requested driver ID #{numericID} could not be located in our
          system.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mx-auto text-blue-600 text-sm font-bold flex items-center justify-center gap-2 hover:underline transition-all font-arabic"
        >
          <ArrowLeft size={16} /> Back to Management
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      <PageHeader
        title="Driver Profile Details"
        breadcrumbs={[
          { label: "Drivers", path: "/drivers" },

          { label: `details #${driver.driverID}` },
        ]}
      />

      <div className="relative group">
        <div className="relative">
          <DriverCard driverId={numericID} />
        </div>
      </div>
    </div>
  );
}
