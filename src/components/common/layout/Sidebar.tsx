import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  ChevronDown,
  Circle,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useAppSelector } from "../../../hooks/hooks";

interface MenuItem {
  icon?: LucideIcon;
  label: string;
  path: string;
  roles?: string[];
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "People", path: "/people" },
  { icon: Users, label: "Drivers", path: "/drivers" },
  {
    icon: FileText,
    label: "Applications",
    path: "/applications",
    children: [
      { label: "Local License Applications", path: "/applications/local" },
      { label: "Application Types", path: "/applications/types" },
    ],
  },
  {
    icon: CreditCard,
    label: "Licenses",
    path: "/licenses",
    children: [
      { label: "Manage Licenses", path: "/licenses/manage" },
      { label: "Renew License", path: "/licenses/renew" },
      { label: "Replacement Services", path: "/licenses/replacement" },
      {
        label: "Detained Licenses",
        path: "/licenses/detaineds",
        children: [
          { label: "Manage Detained", path: "/licenses/detaineds" },
          { label: "Release License", path: "/licenses/detaineds/release" },
          { label: "Detain License", path: "/licenses/detaineds/detained" },
        ],
      },
      { label: "International Licenses", path: "/licenses/international" },
      { label: "License Classes", path: "/licenses/classes" },
    ],
  },
  {
    icon: FileText,
    label: "Tests",
    path: "/tests",
    children: [
      { label: "Manage Tests", path: "/tests/manage" },
      { label: "Test Appointments", path: "/tests/appointments" },
      { label: "Test Types", path: "/tests/types" },
    ],
  },
  { icon: Users, label: "Users", path: "/users", roles: ["Admin"] },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const userRole = user?.role || "";

  // تصفية القوائم بناءً على الصلاحيات
  const filterItems = (items: MenuItem[]): MenuItem[] => {
    return items
      .filter((item) => !item.roles || item.roles.includes(userRole))
      .map((item) => ({
        ...item,
        children: item.children ? filterItems(item.children) : undefined,
      }))
      .filter((item) => !item.children || item.children.length > 0);
  };

  const filteredMenuItems = filterItems(menuItems);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isPathActive = location.pathname.startsWith(item.path);
    const isOpen =
      openMenus[item.label] ||
      (isPathActive && openMenus[item.label] === undefined);

    if (hasChildren) {
      return (
        <li key={item.label} className="w-full">
          <button
            type="button"
            onClick={() => toggleMenu(item.label)}
            className={`flex items-center justify-between w-full p-2.5 rounded-lg transition-all group ${
              isPathActive && level === 0
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            } ${level > 0 ? "ps-4 text-sm" : ""}`}
          >
            <div className="flex items-center">
              {item.icon ? (
                <item.icon
                  className={`w-5 h-5 ${isPathActive ? "text-blue-600" : "text-gray-500"}`}
                />
              ) : (
                <Circle
                  className={`size-1.5 me-3 ${isPathActive ? "fill-blue-600" : "fill-current"}`}
                />
              )}
              <span className="ms-3">{item.label}</span>
            </div>
            <ChevronDown
              className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${isOpen ? "ax-h-125 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <ul className="mt-1 ms-4 space-y-1 border-s border-gray-200 dark:border-gray-700">
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </ul>
          </div>
        </li>
      );
    }

    return (
      <li key={item.path}>
        <NavLink
          to={item.path}
          end={item.path.split("/").length > 2}
          className={({ isActive }) =>
            `flex items-center p-2.5 rounded-lg transition-all group ${
              isActive
                ? "text-blue-700 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            } ${level > 0 ? "ps-6 text-sm" : ""}`
          }
        >
          {item.icon ? (
            <item.icon className="w-5 h-5" />
          ) : (
            <Circle className="size-1.5 me-3 fill-current" />
          )}
          <span className="ms-3">{item.label}</span>
        </NavLink>
      </li>
    );
  };

  return (
    <aside className="fixed top-0 left-0 z-40 w-72 h-full transition-transform -translate-x-full sm:translate-x-0 pt-16">
      <div className="h-full px-3 py-4 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-800 border-e border-gray-200 dark:border-gray-700">
        <ul className="space-y-1.5 font-medium">
          {filteredMenuItems.map((item) => renderMenuItem(item))}
        </ul>
      </div>
    </aside>
  );
}
