import {
  Calendar,
  DollarSign,
  Hash,
  User,
  Gavel,
  ShieldAlert,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { type JSX } from "react";
import type { DetainedLicense } from "../../../../types/Detaineds";

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
            ? "text-rose-600 dark:text-rose-400"
            : "text-slate-700 dark:text-slate-200"
        }`}
      >
        {value}
      </span>
    </div>
  </div>
);

export default function DetainedInfoCard({
  detention,
}: {
  detention: DetainedLicense;
}): JSX.Element {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="w-full flex flex-col gap-3 animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Gavel size={16} className="text-rose-500" />
          Detention & Fine Information
        </h3>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 bg-rose-600">
              <ShieldAlert size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                Detain ID
              </span>
              <h1 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                #{detention.detainID}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-full border bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 animate-pulse`}
            >
              Currently Detained
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
          <InfoField
            icon={Hash}
            label="License ID"
            value={detention.licenseID}
            highlight
          />

          <InfoField
            icon={DollarSign}
            label="Fine Fees"
            value={`$${detention.fineFees.toFixed(2)}`}
            highlight
          />

          <InfoField
            icon={Calendar}
            label="Detain Date"
            value={formatDate(detention.detainDate)}
          />

          <InfoField
            icon={User}
            label="Created By User"
            value={detention.createdByUserName}
          />

          <InfoField
            icon={Hash}
            label="National No"
            value={detention.nationalNo}
          />

          <InfoField
            icon={Clock}
            label="Release Status"
            value={detention.isReleased ? "Released" : "Waiting for Payment"}
          />
        </div>
      </div>
    </div>
  );
}
