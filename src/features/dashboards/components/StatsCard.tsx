import { type LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  color: "blue" | "green" | "rose" | "amber";
};

const colors = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  green:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
};

export function StatsCard({
  title,
  value,
  subValue,
  icon: Icon,
  color,
}: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
      <div className={`p-4 rounded-lg ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
          {value}
        </h3>
        {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
      </div>
    </div>
  );
}
