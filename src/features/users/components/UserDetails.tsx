import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Loader2,
  ArrowLeft,
  Edit,
  ShieldCheck,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Hash,
  Mail,
  Phone,
  MapPin,
  Fingerprint,
  IdCard,
  UserCog,
  Calendar,
  Contact,
  Globe,
  VenetianMask,
  type LucideIcon,
} from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";
import { useGetPersonByIdQuery } from "../../people/peopleApiSlice";
import { type JSX } from "react";
import { useGetUserByIdQuery } from "../usersApiSlice";
import { useTitle } from "../../../hooks/useTitle";

const UserProfileField = ({
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

export default function UserDetails(): JSX.Element {
  const { userID } = useParams<{ userID: string }>();
  const navigate = useNavigate();
  const numericUserID = Number(userID);

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useGetUserByIdQuery(numericUserID);

  const {
    data: person,
    isLoading: personLoading,
    isError: personError,
  } = useGetPersonByIdQuery(user?.personID ?? 0, {
    skip: !user?.personID,
  });

  useTitle(user ? `Profile: ${user.userName}` : "User Profile");

  if (userLoading || (personLoading && user?.personID)) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-slate-600" />
        <p className="text-slate-500 font-bold tracking-tight">
          Accessing Secure Records...
        </p>
      </div>
    );
  }

  if (userError || personError || !user || !person) {
    return (
      <div className="p-10 text-center">
        <div className="inline-flex p-4 bg-rose-50 dark:bg-rose-900/20 rounded-full text-rose-600 mb-4">
          <XCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Registry Fault: Records Unavailable
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:text-blue-800 font-bold flex items-center justify-center gap-2 w-full transition-colors"
        >
          <ArrowLeft size={18} /> Return to Users List
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
      <PageHeader
        title="System User Profile"
        breadcrumbs={[
          { label: "Users", path: "/users" },
          { label: user.userName },
        ]}
      />

      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <UserCog size={16} className="text-blue-500" />
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
              Account Management
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/users/edit/${user.userID}`)}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest border-b border-transparent hover:border-blue-600 pb-0.5"
            >
              <Edit size={14} /> Update Account
            </button>
            <div className="h-3 w-px bg-slate-300 dark:bg-slate-600"></div>
            <button
              onClick={() => navigate(-1)}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest border-b border-transparent hover:border-slate-600 pb-0.5"
            >
              <ArrowLeft size={14} /> Close
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-700">
                <UserIcon size={48} strokeWidth={1} />
              </div>
              <div className="absolute -bottom-2 -right-2 p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-lg border-2 border-slate-50 dark:border-slate-700">
                {user.isActive ? (
                  <CheckCircle2 className="text-emerald-500" size={20} />
                ) : (
                  <XCircle className="text-rose-500" size={20} />
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {user.userName}
                </h1>
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                    user.isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-900/30"
                  }`}
                >
                  {user.isActive ? "Authorized" : "Revoked"}
                </span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <Hash size={14} /> ID: #{user.userID}
                </span>
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <ShieldCheck size={14} /> {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-12">
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="flex items-center gap-2">
                <Contact size={16} className="text-blue-500" />
                <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                  Personal Identity Record
                </h3>
              </div>
              <Link
                to={`/people/edit/${person.personID}`}
                className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
              >
                Modify Original Record
              </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
              <div className="flex flex-col xl:flex-row gap-12">
                {/* Person Photo */}
                <div className="flex flex-col items-center gap-4 shrink-0 self-center xl:self-start">
                  <div className="w-44 h-52 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-700 shadow-inner">
                    {person.imageUrl ? (
                      <img
                        src={person.imageUrl}
                        alt={person.fullName}
                        className="w-full h-full object-cover grayscale-[0.2]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon className="size-20 text-slate-200 dark:text-slate-800" />
                      </div>
                    )}
                  </div>
                  <div className="px-5 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-800">
                    Registry ID: {person.personID}
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
                  <UserProfileField
                    icon={UserIcon}
                    label="Legal Name"
                    value={person.fullName}
                    highlight
                  />
                  <UserProfileField
                    icon={Fingerprint}
                    label="National No."
                    value={person.nationalNo}
                    highlight
                  />
                  <UserProfileField
                    icon={Mail}
                    label="Contact Email"
                    value={person.email || "N/A"}
                  />
                  <UserProfileField
                    icon={Phone}
                    label="Contact Number"
                    value={person.phone || "N/A"}
                  />
                  <UserProfileField
                    icon={VenetianMask}
                    label="Gender"
                    value={person.gendor === 0 ? "Male" : "Female"}
                  />
                  <UserProfileField
                    icon={Calendar}
                    label="Date of Birth"
                    value={
                      person.dateOfBirth
                        ? new Date(person.dateOfBirth).toLocaleDateString(
                            "en-GB",
                          )
                        : "N/A"
                    }
                  />
                  <UserProfileField
                    icon={Globe}
                    label="Nationality"
                    value={person.nationalityCountryID || "N/A"}
                  />
                  <UserProfileField
                    icon={IdCard}
                    label="Linked Person ID"
                    value={person.personID}
                  />

                  <div className="sm:col-span-2 lg:col-span-3">
                    <UserProfileField
                      icon={MapPin}
                      label="Physical Address"
                      value={person.address}
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3 pt-4">
                    <div className="p-4 bg-blue-50/40 dark:bg-blue-900/10 rounded-xl border border-dashed border-blue-200 dark:border-blue-800/50">
                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        Notice: This user account is cryptographically mapped to
                        the identity record of{" "}
                        <span className="text-blue-700 dark:text-blue-400 font-bold">
                          {person.fullName}
                        </span>
                        . Any modifications to the legal identity will propagate
                        across all linked system accounts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
