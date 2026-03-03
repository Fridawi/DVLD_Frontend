import { useState, useEffect, cloneElement } from "react";
import {
  Search,
  User,
  Fingerprint,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Hash,
  AlertCircle,
} from "lucide-react";
import { useGetPeopleQuery } from "../peopleApiSlice";
import Filters from "../../../components/common/Filters";

interface PersonSelectorCardProps {
  onPersonSelected: (personID: number | null) => void;
}

export default function PersonSelectorCard({
  onPersonSelected,
}: PersonSelectorCardProps) {
  const [filter, setFilter] = useState<{ column: string; value: string }>({
    column: "personid",
    value: "",
  });

  const {
    data: pagedResult,
    isFetching,
    isError,
  } = useGetPeopleQuery(
    {
      pageNumber: 1,
      pageSize: 1,
      filterColumn: filter.column,
      filterValue: filter.value,
    },
    {
      skip: !filter.value,
    },
  );

  const person = pagedResult?.data?.[0];

  const handleSearch = (column: string, value: string) => {
    setFilter({ column, value });
  };

  useEffect(() => {
    if (person?.personID) {
      onPersonSelected(person.personID);
    } else {
      onPersonSelected(null);
    }
  }, [person?.personID, onPersonSelected]);

  const filterOptions = [
    { label: "Person ID", value: "personid" },
    { label: "National No", value: "nationalno" },
    { label: "Full Name", value: "name" },
    { label: "Phone", value: "phone" },
    { label: "Nationality", value: "nationality" },
  ];

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 transition-all">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Search className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight"> 
                Identify Person
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Select person to link with user account
              </p>
            </div>
          </div>
          <Filters filterOptions={filterOptions} onSearch={handleSearch} />
        </div>
      </div>

      <div className="p-6">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-12 animate-pulse">
            <Loader2 className="size-10 animate-spin text-blue-600 mb-4" />
            <p className="text-sm font-medium text-gray-500">
              Scanning Database...
            </p>
          </div>
        ) : isError ? (
          <div className="flex items-center p-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800 rounded-lg">
            <AlertCircle className="size-5 me-3" />
            <div className="text-sm font-medium">
              No results found for your search criteria.
            </div>
          </div>
        ) : person ? (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex flex-col items-center space-y-4 w-full lg:w-48 shrink-0">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl">
                  {person.imageUrl ? (
                    <img
                      src={person.imageUrl}
                      alt={person.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <User className="size-16 text-gray-300 dark:text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase">
                  ID: {person.personID}
                </div>
              </div>
            </div>

            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoGroup title="Identity">
                <InfoItem
                  icon={<Fingerprint />}
                  label="Full Name"
                  value={person.fullName}
                  highlight
                />
                <InfoItem
                  icon={<Hash />}
                  label="National No"
                  value={person.nationalNo}
                />
                <InfoItem
                  icon={<Globe />}
                  label="Nationality"
                  value={person.countryName || "N/A"}
                />
              </InfoGroup>

              <InfoGroup title="Contact Details">
                <InfoItem icon={<Phone />} label="Phone" value={person.phone} />
                <InfoItem
                  icon={<Mail />}
                  label="Email"
                  value={person.email || "Not Provided"}
                />
              </InfoGroup>

              <InfoGroup title="Residence">
                <InfoItem
                  icon={<MapPin />}
                  label="Address"
                  value={person.address}
                />
              </InfoGroup>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl">
            <div className="bg-gray-50 dark:bg-gray-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="size-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h4 className="text-gray-900 dark:text-white font-bold">
              No Person Selected
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Use the search bar above to find a person by ID, Name or Phone.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h4 className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 pb-2">
        {title}
      </h4>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactElement;
  label: string;
  value: string | number | null;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-gray-400 dark:text-gray-500">
        {cloneElement(icon, {
          className: "size-4",
        } as React.HTMLAttributes<SVGElement>)}
      </div>
      <div>
        <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
          {label}
        </p>
        <p
          className={`text-sm ${
            highlight
              ? "font-bold text-gray-900 dark:text-white"
              : "font-medium text-gray-700 dark:text-gray-300"
          }`}
        >
          {value || "Not Provided"}
        </p>
      </div>
    </div>
  );
}
