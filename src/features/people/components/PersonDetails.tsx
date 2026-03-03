import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  Edit,
  ArrowLeft,
  User as UserIcon,
  Contact,
  Fingerprint,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  VenetianMask,
  Hash,
  type LucideIcon,
} from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";
import { useGetPersonByIdQuery } from "../peopleApiSlice";
import { type JSX } from "react";

const PersonInfoField = ({
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

export default function PersonDetails(): JSX.Element {
  const { personID } = useParams<{ personID: string }>();
  const navigate = useNavigate();
  const numericPersonId = Number(personID);

  const {
    data: person,
    isLoading,
    isError,
  } = useGetPersonByIdQuery(numericPersonId);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-slate-600" />
        <p className="text-slate-500 font-bold tracking-tight">
          System Fetching Record...
        </p>
      </div>
    );
  }

  if (isError || !person) {
    return (
      <div className="p-10 text-center">
        <div className="inline-flex p-4 bg-rose-50 dark:bg-rose-900/20 rounded-full text-rose-600 mb-4">
          <Fingerprint size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Registry Error: Profile Not Found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 font-bold flex items-center justify-center gap-2 w-full hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={18} /> Return to People List
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
      <PageHeader
        title="Identity Profile"
        breadcrumbs={[
          { label: "People", path: "/people" },
          { label: person.fullName },
        ]}
      />

      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Contact size={16} className="text-blue-500" />
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
              Registry Information
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/people/edit/${person.personID}`)}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest border-b border-transparent hover:border-blue-600 pb-0.5"
            >
              <Edit size={14} /> Edit Identity
            </button>
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
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                <UserIcon size={40} strokeWidth={1.5} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {person.fullName}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-900 text-[10px] font-black text-slate-500 uppercase rounded-md border border-slate-200 dark:border-slate-700">
                  <Hash size={12} /> Person ID: {person.personID}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase rounded-md border border-blue-100 dark:border-blue-800/50">
                  <Fingerprint size={12} /> National: {person.nationalNo}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col xl:flex-row gap-12">
            <div className="flex flex-col items-center gap-4 shrink-0 self-center xl:self-start">
              <div className="w-48 h-56 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-700 shadow-inner group relative">
                {person.imageUrl ? (
                  <img
                    src={person.imageUrl}
                    alt={person.fullName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="size-24 text-slate-200 dark:text-slate-800" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Official Portrait
              </p>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
                <PersonInfoField
                  icon={UserIcon}
                  label="Full Legal Name"
                  value={person.fullName}
                  highlight
                />
                <PersonInfoField
                  icon={Fingerprint}
                  label="National Number"
                  value={person.nationalNo}
                  highlight
                />
                <PersonInfoField
                  icon={VenetianMask}
                  label="Gender"
                  value={
                    person.genderName ||
                    (person.gendor === 0 ? "Male" : "Female")
                  }
                />

                <PersonInfoField
                  icon={Calendar}
                  label="Date of Birth"
                  value={
                    person.dateOfBirth
                      ? new Date(person.dateOfBirth).toLocaleDateString("en-GB")
                      : "N/A"
                  }
                />
                <PersonInfoField
                  icon={Globe}
                  label="Country / Nationality"
                  value={person.countryName || person.nationalityCountryID}
                />
                <PersonInfoField
                  icon={Phone}
                  label="Contact Number"
                  value={person.phone}
                />

                <div className="sm:col-span-2">
                  <PersonInfoField
                    icon={Mail}
                    label="Email Address"
                    value={person.email || "N/A"}
                  />
                </div>

                <PersonInfoField
                  icon={Hash}
                  label="System Registry ID"
                  value={person.personID}
                />

                <div className="sm:col-span-2 lg:col-span-3">
                  <PersonInfoField
                    icon={MapPin}
                    label="Physical Residence Address"
                    value={person.address}
                  />
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <div className="p-1.5 bg-white dark:bg-slate-800 rounded shadow-sm text-blue-500">
                    <Contact size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Registry Note
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      This identity record is verified by the Department of
                      Motor Vehicles (DVLD). Any updates to this legal profile
                      will affect all associated licenses, applications, and
                      user accounts linked to this National ID.
                    </p>
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
