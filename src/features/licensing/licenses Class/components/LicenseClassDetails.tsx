import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  Edit,
  ArrowLeft,
  FileText,
  DollarSign,
  Hash,
  Info,
  XCircle,
  ShieldCheck,
  Calendar,
  User,
  type LucideIcon,
} from "lucide-react";
import { type JSX } from "react";
import PageHeader from "../../../../components/common/PageHeader";
import { useAppSelector } from "../../../../hooks/hooks";
import { useGetLicenseClassByIdQuery } from "../LicensesClassApiSlice";
import { useTitle } from "../../../../hooks/useTitle";

const ClassField = ({
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

export default function LicenseClassDetails(): JSX.Element {
  const { licenseClassID } = useParams<{ licenseClassID: string }>();
  const navigate = useNavigate();
  const numericID = Number(licenseClassID);
  const { user } = useAppSelector((state) => state.auth);

  const {
    data: licenseClass,
    isLoading,
    isError,
  } = useGetLicenseClassByIdQuery(numericID);

  useTitle(
    licenseClass
      ? `Class: ${licenseClass.className} (#${licenseClass.licenseClassID})`
      : "License Class Details",
  );

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
        <p className="text-slate-500 text-sm font-bold tracking-tight">
          Fetching Record...
        </p>
      </div>
    );
  }

  if (isError || !licenseClass) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex p-3 bg-rose-50 dark:bg-rose-900/20 rounded-full text-rose-600 mb-3">
          <XCircle size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Record Not Found
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
        title="License Class Details"
        breadcrumbs={[
          { label: "Licenses Class", path: "/licenses/classes" },
          { label: licenseClass.className },
        ]}
      />

      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-500" /> License Category
            Info
          </h3>

          <div className="flex items-center gap-4">
            {user?.role === "Admin" && (
              <button
                onClick={() =>
                  navigate(
                    `/licenses/classes/edit/${licenseClass.licenseClassID}`,
                  )
                }
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest border-b border-transparent hover:border-blue-600 pb-0.5"
              >
                <Edit size={14} /> Edit Class
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

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                  Class ID: #{licenseClass.licenseClassID}
                </span>
                <h1 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                  {licenseClass.className}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
                Authorized Class
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 gap-x-12">
            <ClassField
              icon={FileText}
              label="Class Name"
              value={licenseClass.className}
              highlight
            />

            <ClassField
              icon={DollarSign}
              label="Standard Fees"
              value={`$${licenseClass.classFees.toFixed(2)}`}
              highlight
            />

            <ClassField
              icon={User}
              label="Min. Allowed Age"
              value={`${licenseClass.minimumAllowedAge} Years`}
            />

            <ClassField
              icon={Calendar}
              label="Validity Period"
              value={`${licenseClass.defaultValidityLength} Years`}
            />

            <ClassField
              icon={Hash}
              label="System ID"
              value={licenseClass.licenseClassID}
            />

            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                  Class Description
                </span>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{licenseClass.classDescription}"
                  </p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 pt-2">
              <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <div className="p-1.5 bg-white dark:bg-slate-800 rounded-md shadow-sm">
                  <Info size={14} className="text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Administrative Note
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    This license class configuration defines the age
                    requirements, financial fees, and validity span. Changes
                    will affect all new licenses issued under this category but
                    will not retroactively alter existing licenses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-4"></div>
    </div>
  );
}
