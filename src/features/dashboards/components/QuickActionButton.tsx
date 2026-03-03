type Props = {
  label: string;
  icon: React.ElementType;
  color: string;
  onClick?: () => void;
};

export default function QuickActionButton({
  label,
  icon: Icon,
  color,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-900 transition-all group active:scale-95"
    >
      <div
        className={`p-3 rounded-lg ${color} text-white mb-2 group-hover:scale-110 transition-transform shadow-sm`}
      >
        <Icon size={20} />
      </div>
      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
        {label}
      </span>
    </button>
  );
}
