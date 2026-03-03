import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Hash,
  User,
  CheckCircle,
  ArrowLeft,
  Globe,
  Link as LinkIcon,
  type LucideIcon,
} from "lucide-react";
import { type JSX } from "react";
import type { InternationalLicense } from "../../../../types/internationalLicenses";

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
            ? "text-indigo-700 dark:text-indigo-400"
            : "text-slate-700 dark:text-slate-200"
        }`}
      >
        {value}
      </span>
    </div>
  </div>
);

export default function InternationalLicenseCard({
  license,
}: {
  license: InternationalLicense;
}): JSX.Element {
  const navigate = useNavigate();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const isExpired = new Date(license.expirationDate) < new Date();

  return (
    <div className="w-full flex flex-col gap-3 animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Globe size={16} className="text-indigo-500" />
          International License Information
        </h3>

        <button
          onClick={() => navigate(-1)}
          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest border-b border-transparent hover:border-slate-600 pb-0.5"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 ${
                license.isActive && !isExpired ? "bg-indigo-500" : "bg-rose-500"
              }`}
            >
              <Globe size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                Type: International
              </span>
              <h1 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                Int. License ID: #{license.internationalLicenseID}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-full border ${
                license.isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400"
              }`}
            >
              {license.isActive ? "Active" : "Inactive"}
            </span>

            {isExpired && (
              <span className="px-3 py-1.5 text-[10px] font-black uppercase rounded-full bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
                Expired
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
          <InfoField
            icon={User}
            label="Driver ID"
            value={license.driverID}
            highlight
          />

          <InfoField
            icon={LinkIcon}
            label="Local License ID"
            value={license.issuedUsingLocalLicenseID}
            highlight
          />

          <InfoField
            icon={Calendar}
            label="Issue Date"
            value={formatDate(license.issueDate)}
          />

          <InfoField
            icon={Calendar}
            label="Expiration Date"
            value={formatDate(license.expirationDate)}
            highlight={isExpired}
          />

          <InfoField
            icon={Hash}
            label="Application ID"
            value={license.applicationID}
          />

          <InfoField
            icon={CheckCircle}
            label="Is Active?"
            value={license.isActive ? "Yes" : "No"}
          />

          <InfoField
            icon={User}
            label="Created By User ID"
            value={license.createdByUserID}
          />
        </div>
      </div>
    </div>
  );
}
