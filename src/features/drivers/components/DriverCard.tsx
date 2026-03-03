import { Link, useNavigate } from "react-router-dom";
import {
  IdCard,
  Calendar,
  Hash,
  User,
  ShieldCheck,
  UserCheck,
  ArrowLeft,
  Loader2,
  Fingerprint,
  type LucideIcon,
  Eye,
} from "lucide-react";
import { type JSX } from "react";
import { useGetDriverByIdQuery } from "../DriverApiSlice";

const InfoField = ({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  highlight?: boolean;
}) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-slate-500 dark:text-slate-400 shrink-0">
      <Icon size={16} />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">
        {label}
      </span>
      <span
        className={`text-sm font-semibold truncate ${
          highlight
            ? "text-blue-700 dark:text-blue-400"
            : "text-slate-700 dark:text-slate-200"
        }`}
      >
        {value}
      </span>
    </div>
  </div>
);

interface DriverCardProps {
  driverId: number;
}

export default function DriverCard({ driverId }: DriverCardProps): JSX.Element {
  const navigate = useNavigate();

  const { data: driver, isLoading, isError } = useGetDriverByIdQuery(driverId);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (isError || !driver) {
    return (
      <div className="p-8 text-center bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30">
        <p className="font-bold text-rose-600">Driver Record Not Found</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <User size={16} className="text-blue-500" />
          Driver Profile Information
        </h3>
        <div className="flex items-center gap-4">
          <Link
            to={`/people/${driver.personID}`}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest border-b border-transparent hover:border-blue-600 pb-0.5"
          >
            <Eye size={14} /> View Person
          </Link>

          <div className="h-3 w-px bg-slate-300 dark:bg-slate-600"></div>
          <button
            onClick={() => navigate(-1)}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest border-b border-transparent hover:border-slate-600 pb-0.5"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 bg-blue-600">
              <UserCheck size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                Full Name
              </span>
              <h1 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                {driver.fullName}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 text-[10px] font-black uppercase rounded-full border bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
              Active Driver
            </span>
            <span className="px-3 py-1.5 text-[10px] font-black uppercase rounded-full border bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-700 dark:text-slate-300">
              ID: #{driver.driverID}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
          <InfoField
            icon={Fingerprint}
            label="Driver ID"
            value={driver.driverID}
            highlight
          />
          <InfoField
            icon={IdCard}
            label="Person ID"
            value={driver.personID}
            highlight
          />
          <InfoField
            icon={Hash}
            label="National No"
            value={driver.nationalNo}
            highlight
          />

          <InfoField
            icon={Calendar}
            label="Registration Date"
            value={formatDate(driver.createdDate)}
          />

          <InfoField
            icon={User}
            label="Created By User"
            value={`User #${driver.createdByUserID}`}
          />

          <InfoField
            icon={ShieldCheck}
            label="Account Status"
            value="Verified System Record"
          />
        </div>
      </div>
    </div>
  );
}
