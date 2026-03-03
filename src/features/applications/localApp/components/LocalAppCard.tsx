import { type JSX } from "react";
import {
  Award,
  Edit,
  ArrowLeft,
  CheckCircle2,
  Fingerprint,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../hooks/hooks";
import type { LocalDrivingLicenseApplication } from "../../../../types/localDrivingLicenseApplication";

interface LocalAppCardProps {
  app: LocalDrivingLicenseApplication;
}

// مكون الحقل الصغير الموحد
const LocalField = ({
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

export default function LocalAppCard({ app }: LocalAppCardProps): JSX.Element {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="w-full flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-400">
      {/* Header & Actions */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Award size={16} className="text-blue-500" /> Driving License Details
        </h3>

        <div className="flex items-center gap-4">
          {user?.role === "Admin" && (
            <button
              onClick={() =>
                navigate(
                  `/applications/local/edit/${app.localDrivingLicenseApplicationID}`,
                )
              }
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest border-b border-transparent hover:border-blue-600 pb-0.5"
            >
              <Edit size={14} /> Edit Local App
            </button>
          )}
          <div className="h-3 w-px bg-slate-300 dark:bg-slate-600"></div>
          <button
            onClick={() => navigate(-1)}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest border-b border-transparent hover:border-slate-600 pb-0.5"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
        {/* Quick Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                L.D.L. App ID
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white leading-none">
                #{app.localDrivingLicenseApplicationID}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                Applied Class
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 leading-none">
                {app.className}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Tests Status:
            </span>
            <span
              className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${
                app.passedTestCount === 3
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400"
                  : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400"
              }`}
            >
              {app.passedTestCount} / 3 PASSED
            </span>
          </div>
        </div>

        {/* Detailed Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-8">
          <LocalField
            icon={Award}
            label="License Class"
            value={app.className}
            highlight
          />
          <LocalField
            icon={CheckCircle2}
            label="Passed Tests"
            value={`${app.passedTestCount} / 3`}
            highlight={app.passedTestCount === 3}
          />
          <LocalField
            icon={Fingerprint}
            label="National No"
            value={app.nationalNo}
          />
          <LocalField
            icon={FileText}
            label="Applicant Name"
            value={app.fullName}
          />
        </div>
      </div>
    </div>
  );
}
