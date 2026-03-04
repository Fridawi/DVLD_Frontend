import { type JSX } from "react";
import {
  type LucideIcon,
  FileText,
  User,
  Calendar,
  DollarSign,
  UserPlus,
  Eye,
  Loader2,
  Hash,
  Fingerprint,
  ShieldCheck,
  History,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGetApplicationByIdQuery } from "../ApplicationApiSlice";

const ApplicationField = ({
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

interface ApplicationCardProps {
  applicationId: number;
}

export default function ApplicationCard({
  applicationId,
}: ApplicationCardProps): JSX.Element {
  const {
    data: application,
    isLoading,
    isError,
  } = useGetApplicationByIdQuery(applicationId);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
        <p className="font-bold">Error</p>
        <p className="text-sm">
          Failed to load application #{applicationId} details.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FileText size={16} className="text-blue-500" />
          Application Details
        </h3>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link
            to={`/people/${application.applicantPersonID}`}
            className="text-[10px] sm:text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 transition-colors uppercase tracking-tight sm:tracking-widest"
          >
            <Eye size={13} className="shrink-0" />
            <span>
              <span className="hidden xs:inline">View </span>Person
            </span>
          </Link>

          <div className="h-3 w-px bg-slate-300 dark:bg-slate-600 shrink-0"></div>

          <Link
            to={`/applications/types/${application.applicationTypeID}`}
            className="text-[10px] sm:text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 transition-colors uppercase tracking-tight sm:tracking-widest"
          >
            <Eye size={13} className="shrink-0" />
            <span>
              <span className="hidden xs:inline">View </span>Type
            </span>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                App ID
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white leading-none">
                #{application.applicationID}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                Type
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 leading-none">
                {application.applicationTypeTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Status:
            </span>
            <span className="px-3 py-1.5 text-xs font-black uppercase tracking-tighter rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
              {application.statusText} ({application.applicationStatus})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-8">
          <ApplicationField
            icon={User}
            label="Applicant Full Name"
            value={application.applicantFullName}
            highlight
          />
          <ApplicationField
            icon={Fingerprint}
            label="Applicant Person ID"
            value={`#${application.applicantPersonID}`}
          />

          <ApplicationField
            icon={Calendar}
            label="Application Date"
            value={new Date(application.applicationDate).toLocaleDateString(
              "en-GB",
            )}
          />
          <ApplicationField
            icon={History}
            label="Last Status Date"
            value={new Date(application.lastStatusDate).toLocaleDateString(
              "en-GB",
            )}
          />

          <ApplicationField
            icon={DollarSign}
            label="Paid Fees"
            value={`$${application.paidFees.toFixed(2)}`}
            highlight
          />
          <ApplicationField
            icon={Hash}
            label="App Type ID"
            value={application.applicationTypeID}
          />
          <ApplicationField
            icon={UserPlus}
            label="Created By User"
            value={application.createdByUserName}
          />
          <ApplicationField
            icon={ShieldCheck}
            label="Creator User ID"
            value={`#${application.createdByUserID}`}
          />
        </div>
      </div>
    </div>
  );
}
