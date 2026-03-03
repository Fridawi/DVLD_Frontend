import { type JSX } from "react";
import { useNavigate } from "react-router-dom";
import {
  IdCard,
  User,
  Calendar,
  AlertOctagon,
  FileText,
  Activity,
  Loader2,
  CalendarCheck,
  CalendarX,
  UserCheck,
  ShieldAlert,
  Hash,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";

import { useGetDriverLicenseDetailQuery } from "../LicenseApiSlice";

const LicenseInfoItem = ({
  icon: Icon,
  label,
  value,
  highlight = false,
  textColor,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  highlight?: boolean;
  textColor?: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 p-1.5 bg-slate-50 dark:bg-slate-700/50 rounded text-slate-400 shrink-0">
      <Icon size={14} />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight leading-tight">
        {label}
      </span>
      <span
        className={`text-sm font-semibold truncate ${
          textColor
            ? textColor
            : highlight
              ? "text-blue-700 dark:text-blue-400"
              : "text-slate-700 dark:text-slate-200"
        }`}
      >
        {value}
      </span>
    </div>
  </div>
);

interface DriverLicenseCardProps {
  licenseId: number;
}

export default function DriverLicenseCard({
  licenseId,
}: DriverLicenseCardProps): JSX.Element {
  const navigate = useNavigate();

  const {
    data: license,
    isLoading,
    isError,
  } = useGetDriverLicenseDetailQuery(licenseId);

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (isError || !license) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
        <p className="font-bold">License Not Found</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <IdCard size={16} className="text-blue-500" />
          Driver License Details
        </h3>

        <button
          onClick={() => navigate(-1)}
          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest border-b border-transparent hover:border-slate-600 pb-0.5"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/10 flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            License ID: #{license.licenseID}
          </span>
          <div className="flex gap-2">
            <span
              className={`px-2 py-0.5 text-[10px] font-black uppercase rounded border ${
                license.isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800"
                  : "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20"
              }`}
            >
              {license.isActive ? "Active" : "Inactive"}
            </span>
            {license.isDetained && (
              <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded border bg-rose-100 text-rose-700 border-rose-200">
                Detained
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-row md:flex-col items-center gap-4 md:w-44 shrink-0 md:border-e border-slate-100 dark:border-slate-700 md:pe-6">
              <div className="relative shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-md bg-slate-50">
                  {license.driverImageUrl ? (
                    <img
                      src={license.driverImageUrl}
                      alt={license.driverFullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="size-12 text-slate-300" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:items-center md:text-center min-w-0">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
                  Driver Name
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {license.driverFullName}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                  {license.licenseClassName}
                </p>
              </div>
            </div>

            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-6">
              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700 pb-1">
                  Personal
                </h5>
                <LicenseInfoItem
                  icon={Hash}
                  label="National No."
                  value={license.nationalNo}
                />
                <LicenseInfoItem
                  icon={UserCheck}
                  label="Gender"
                  value={license.genderText}
                />
                <LicenseInfoItem
                  icon={Calendar}
                  label="Date of Birth"
                  value={new Date(license.driverBirthDate).toLocaleDateString(
                    "en-GB",
                  )}
                />
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700 pb-1">
                  License Info
                </h5>
                <LicenseInfoItem
                  icon={CalendarCheck}
                  label="Issue Date"
                  value={new Date(license.issueDate).toLocaleDateString(
                    "en-GB",
                  )}
                />
                <LicenseInfoItem
                  icon={CalendarX}
                  label="Expiration"
                  value={new Date(license.expirationDate).toLocaleDateString(
                    "en-GB",
                  )}
                  textColor={
                    license.isExpired
                      ? "text-red-600 dark:text-red-400"
                      : undefined
                  }
                />
                <LicenseInfoItem
                  icon={AlertOctagon}
                  label="Issue Reason"
                  value={license.issueReasonText}
                />
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700 pb-1">
                  Status
                </h5>
                <LicenseInfoItem
                  icon={UserCheck}
                  label="Driver ID"
                  value={`#${license.driverID}`}
                />
                <LicenseInfoItem
                  icon={Activity}
                  label="Is Detained?"
                  value={license.isDetained ? "Yes" : "No"}
                  textColor={
                    license.isDetained
                      ? "text-red-600 font-bold"
                      : "text-emerald-600"
                  }
                />
                {license.isDetained && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded border border-rose-100 dark:border-rose-800/30">
                    <ShieldAlert size={12} />
                    <span className="text-[10px] font-bold uppercase">
                      Detained
                    </span>
                  </div>
                )}
              </div>

              {license.notes && (
                <div className="lg:col-span-3 mt-2 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={14} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Notes
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                    {license.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
