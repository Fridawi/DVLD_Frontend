import { type JSX } from "react";
import {
  Loader2,
  Calendar,
  DollarSign,
  Hash,
  Info,
  XCircle,
  ClipboardList,
  ClipboardCheck,
  Lock,
  Unlock,
  Edit,
  Eye,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetTestAppointmentByIdQuery } from "../TestAppointmentApiSlice";

const AppointmentField = ({
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
  <div className="flex items-center gap-2.5">
    <div className="p-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-md text-slate-500 dark:text-slate-400 shrink-0">
      <Icon size={14} />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight leading-none mb-0.5">
        {label}
      </span>
      <span
        className={`text-xs font-semibold truncate ${
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

interface TestAppointmentCardProps {
  appointmentId: number;
  testTypeID?: string | number;
}

export default function TestAppointmentCard({
  appointmentId,
  testTypeID,
}: TestAppointmentCardProps): JSX.Element {
  const navigate = useNavigate();
  const {
    data: appointment,
    isLoading,
    isError,
  } = useGetTestAppointmentByIdQuery(appointmentId);

  if (isLoading) {
    return (
      <div className="w-full h-32 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (isError || !appointment) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
        <p className="text-xs font-bold flex items-center justify-center gap-2">
          <XCircle size={14} /> Failed to load appointment #{appointmentId}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <ClipboardList size={14} className="text-blue-500" /> Appointment Info
        </h3>

        <div className="flex items-center gap-3">
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

          <div className="h-3 w-px bg-slate-300 dark:bg-slate-600"></div>

          {!appointment.isLocked && testTypeID && (
            <button
              onClick={() =>
                navigate(
                  `/tests/appointments/scheduleTest/${appointment.localDrivingLicenseApplicationID}/${testTypeID}/${appointment.testAppointmentID}`,
                )
              }
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1 transition-colors uppercase tracking-tighter"
            >
              <Edit size={12} /> Edit Appointment
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-white ${
                appointment.isLocked ? "bg-slate-400" : "bg-blue-500"
              }`}
            >
              {appointment.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase leading-none">
                ID: #{appointment.testAppointmentID}
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white truncate max-w-37.5 sm:max-w-none">
                {appointment.fullName}
              </span>
            </div>
          </div>

          <span
            className={`px-2 py-1 text-[9px] font-black uppercase rounded-md border ${
              appointment.isLocked
                ? "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-700"
                : "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
            }`}
          >
            {appointment.isLocked ? "Locked / Completed" : "Active / Open"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AppointmentField
            icon={ClipboardCheck}
            label="Test Type"
            value={appointment.testTypeName}
            highlight
          />
          <AppointmentField
            icon={Info}
            label="Class"
            value={appointment.className}
          />
          <AppointmentField
            icon={Calendar}
            label="Date"
            value={new Date(appointment.appointmentDate).toLocaleDateString(
              "en-GB",
            )}
          />
          <AppointmentField
            icon={DollarSign}
            label="Fees"
            value={`$${appointment.paidFees.toFixed(2)}`}
            highlight
          />
          <AppointmentField
            icon={Hash}
            label="L.D.L App ID"
            value={`#${appointment.localDrivingLicenseApplicationID}`}
          />
          {appointment.testID && (
            <AppointmentField
              icon={ClipboardCheck}
              label="Actual Test ID"
              value={`#${appointment.testID}`}
              highlight
            />
          )}
        </div>
      </div>
    </div>
  );
}
