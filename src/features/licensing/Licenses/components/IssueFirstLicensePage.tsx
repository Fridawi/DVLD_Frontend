import { useNavigate, useParams } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import PageHeader from "../../../../components/common/PageHeader";
import ApplicationCard from "../../../applications/components/ApplicationDetails";
import LocalAppCard from "../../../applications/localApp/components/LocalAppCard";
import { useGetLocalDrivingLicenseApplicationByIdQuery } from "../../../applications/localApp/LocalAppApiSlice";
import { useIssueFirstTimeLicenseMutation } from "../LicenseApiSlice";
import { IssueReason, type LicenseCreate } from "../../../../types/licenses";
import type { SerializedError } from "../../../../types/auth";

const issueLicenseSchema = z.object({
  notes: z.string().max(500, "Notes cannot exceed 500 characters"),
});

type IssueLicenseFormValues = z.infer<typeof issueLicenseSchema>;

export default function IssueFirstLicensePage() {
  const { localAppID } = useParams();
  const navigate = useNavigate();

  const { data: localApp, isLoading } =
    useGetLocalDrivingLicenseApplicationByIdQuery(Number(localAppID));
  const [issueLicense, { isLoading: isIssuing }] =
    useIssueFirstTimeLicenseMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueLicenseFormValues>({
    resolver: zodResolver(issueLicenseSchema),
    defaultValues: {
      notes: "",
    },
  });

  if (isLoading)
    return <div className="p-10 text-center text-slate-500">Loading...</div>;
  if (!localApp)
    return (
      <div className="p-10 text-center text-red-500">Application Not Found</div>
    );

  const breadcrumbPaths = [
    { label: "Licenses Applications", path: "/licenses/issue-first-time" },
    { label: "Issue First Time License" },
  ];

  const onSubmit: SubmitHandler<IssueLicenseFormValues> = async (data) => {
    try {
      const licensePayload: LicenseCreate = {
        localDrivingLicenseApplicationID:
          localApp.localDrivingLicenseApplicationID,
        notes: data.notes || null,
        issueReason: IssueReason.FirstTime,
      };

      await issueLicense(licensePayload).unwrap();

      toast.success("License created successfully");
      navigate("/licenses/manage");
    } catch (err: unknown) {
      const error = err as SerializedError;
      toast.error(error?.data?.detail ?? "Failed to issue license.");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <PageHeader
        title="Issue First Time License"
        breadcrumbs={breadcrumbPaths}
      />

      <div className="space-y-4">
        <LocalAppCard app={localApp} />
        <ApplicationCard applicationId={localApp.applicationID} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mt-6">
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2 tracking-wider">
            Issue Notes
          </label>
          <textarea
            {...register("notes")}
            className={`w-full p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none ${
              errors.notes
                ? "border-red-500"
                : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
            }`}
            rows={3}
            placeholder="Enter any notes here (optional)..."
          />
          {errors.notes && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.notes.message}
            </p>
          )}

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={localApp.passedTestCount < 3 || isIssuing}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2"
            >
              {isIssuing ? <>Saving...</> : <>Issue License</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
