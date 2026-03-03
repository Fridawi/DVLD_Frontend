import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  Edit,
  ArrowLeft,
  Calendar,
  DollarSign,
  Hash,
  Info,
  XCircle,
  User,
  ClipboardList,
  ClipboardCheck,
  Lock,
  Unlock,
  type LucideIcon,
  Eye,
} from "lucide-react";
import { type JSX } from "react";
import PageHeader from "../../../../components/common/PageHeader";
import { useGetTestAppointmentByIdQuery } from "../TestAppointmentApiSlice";

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

export default function TestAppointmentDetails(): JSX.Element {
  const { appointmentID, testTypeID } = useParams();
  const navigate = useNavigate();

  const {
    data: appointment,
    isLoading,
    isError,
  } = useGetTestAppointmentByIdQuery(Number(appointmentID));

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
        <p className="text-slate-500 text-sm font-bold tracking-tight">
          Fetching Appointment Record...
        </p>
      </div>
    );
  }

  if (isError || !appointment) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex p-3 bg-rose-50 dark:bg-rose-900/20 rounded-full text-rose-600 mb-3">
          <XCircle size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Appointment Not Found
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
        title="Appointment Details"
        breadcrumbs={[
          { label: "Appointments", path: "/tests/appointments" },
          { label: `ID: #${appointment.testAppointmentID}` },
        ]}
      />

      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ClipboardList size={16} className="text-blue-500" />
            Appointment Information
          </h3>

          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                navigate(
                  `/applications/local/${appointment.localDrivingLicenseApplicationID}`,
                )
              }
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest border-b border-transparent hover:border-blue-600 pb-0.5"
            >
              <Eye size={12} /> View Local App
            </button>
            {!appointment.isLocked && (
              <button
                onClick={() =>
                  navigate(
                    `/tests/appointments/scheduleTest/${appointment.localDrivingLicenseApplicationID}/${testTypeID}/${appointment.testAppointmentID}`,
                  )
                }
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest border-b border-transparent hover:border-blue-600 pb-0.5"
              >
                <Edit size={14} /> Reschedule
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
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 ${appointment.isLocked ? "bg-amber-500" : "bg-emerald-500"}`}
              >
                {appointment.isLocked ? (
                  <Lock size={20} />
                ) : (
                  <Unlock size={20} />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                  Appointment ID: #{appointment.testAppointmentID}
                </span>
                <h1 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                  {appointment.fullName}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-full border ${
                  appointment.isLocked
                    ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50"
                    : "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50"
                }`}
              >
                {appointment.isLocked
                  ? "Locked / Completed"
                  : "Open Appointment"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
            <InfoField
              icon={User}
              label="Applicant Full Name"
              value={appointment.fullName}
              highlight
            />

            <InfoField
              icon={ClipboardList}
              label="Test Category"
              value={appointment.testTypeName}
              highlight
            />

            <InfoField
              icon={Info}
              label="Driving Class"
              value={appointment.className}
            />

            <InfoField
              icon={Calendar}
              label="Scheduled Date"
              value={new Date(appointment.appointmentDate).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                },
              )}
            />

            <InfoField
              icon={DollarSign}
              label="Paid Fees"
              value={`$${appointment.paidFees.toFixed(2)}`}
              highlight
            />

            <InfoField
              icon={Hash}
              label="L.D.L. App ID"
              value={appointment.localDrivingLicenseApplicationID}
            />

            {appointment.testID && (
              <InfoField
                icon={ClipboardCheck}
                label="Actual Test ID"
                value={appointment.testID}
                highlight
              />
            )}

            <InfoField
              icon={appointment.isLocked ? Lock : Unlock}
              label="Is Locked?"
              value={appointment.isLocked ? "Yes (Finalized)" : "No (Open)"}
            />

            <InfoField
              icon={Hash}
              label="Appointment Ref"
              value={appointment.testAppointmentID}
            />
          </div>
        </div>
      </div>

      <div className="h-4"></div>
    </div>
  );
}
