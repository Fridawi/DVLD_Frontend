import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  ArrowLeft,
  StickyNote,
  CheckCircle2,
  XCircle,
  UserCheck,
  ClipboardList,
  Edit,
} from "lucide-react";
import { type JSX } from "react";
import PageHeader from "../../../../components/common/PageHeader";
import TestAppointmentCard from "../../Test Appointments/components/TestAppointmentCard";
import { useGetTestByIdQuery } from "../TestApiSlice";
import { useTitle } from "../../../../hooks/useTitle";

export default function TestDetails(): JSX.Element {
  const { testID } = useParams();
  const navigate = useNavigate();

  const { data: testData, isLoading: isLoadingTest } = useGetTestByIdQuery(
    Number(testID),
  );

  useTitle(
    testData
      ? `Test Result: ${testData.testResult ? "Passed" : "Failed"}`
      : "Test Details",
  );

  if (isLoadingTest) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-500 text-sm font-bold">
          Loading Test Results...
        </p>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <XCircle size={40} className="mx-auto text-rose-500 mb-4" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          No Test Record Found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 font-bold flex items-center justify-center gap-2 w-full"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      <PageHeader
        title="Test Result Details"
        breadcrumbs={[
          { label: "Appointments", path: "/tests/appointments" },
          { label: "Test Result" },
        ]}
      />

      <TestAppointmentCard appointmentId={testData.testAppointmentID} />

      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between px-1 sm:px-2">
          <h3 className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
            <UserCheck size={14} className="text-emerald-500" />
            <span className="hidden xs:inline">Final</span> Decision
          </h3>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => navigate(`/tests/manage/edit/${testID}`)}
              className="text-[10px] sm:text-[11px] font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1 transition-colors uppercase tracking-tight sm:tracking-widest"
            >
              <Edit size={13} className="shrink-0" />
              <span>
                Edit <span className="hidden sm:inline">Result</span>
              </span>
            </button>

            <div className="h-3 w-px bg-slate-300 dark:bg-slate-600 shrink-0"></div>

            <button
              onClick={() => navigate(-1)}
              className="text-[10px] sm:text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 flex items-center gap-1 transition-colors uppercase tracking-tight sm:tracking-widest"
            >
              <ArrowLeft size={13} className="shrink-0" />
              <span>
                Back <span className="hidden sm:inline">to List</span>
              </span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
          <div
            className={`p-6 flex items-center justify-between ${testData.testResult ? "bg-emerald-50/50 dark:bg-emerald-900/10" : "bg-rose-50/50 dark:bg-rose-900/10"}`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg ${testData.testResult ? "bg-emerald-500" : "bg-rose-500"}`}
              >
                {testData.testResult ? (
                  <CheckCircle2 size={32} />
                ) : (
                  <XCircle size={32} />
                )}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">
                  Test Outcome
                </p>
                <h2
                  className={`text-2xl font-black uppercase tracking-tight ${testData.testResult ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}
                >
                  {testData.testResult ? "Passed" : "Failed"}
                </h2>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Test Reference
              </p>
              <p className="text-lg font-black text-slate-700 dark:text-slate-300">
                #{testData.testID}
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <StickyNote size={14} className="text-blue-500" /> Examiner
                  Notes
                </span>
                <div className="relative p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
                    {testData.notes ||
                      "No additional comments provided for this test session."}
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <ClipboardList size={14} className="text-slate-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">
                      Created By
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      User ID: #{testData.createdByUserID}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 ml-auto">
                  <span className="text-[10px] font-medium text-slate-400 italic">
                    DVLD Official Record
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
