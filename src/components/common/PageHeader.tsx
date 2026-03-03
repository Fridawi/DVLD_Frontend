import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
}

const PageHeader = ({ title, breadcrumbs }: PageHeaderProps) => {
  return (
    <header className="mb-8">
      <nav className="flex mb-3" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4 me-1.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                />
              </svg>
              Dashboard
            </Link>
          </li>

          {breadcrumbs.map((item, index) => (
            <li
              key={index}
              aria-current={
                index === breadcrumbs.length - 1 ? "page" : undefined
              }
            >
              <div className="flex items-center">
                <svg
                  className="w-3.5 h-3.5 text-gray-400 rtl:rotate-180 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m9 5 7 7-7 7"
                  />
                </svg>

                {item.path ? (
                  <Link
                    to={item.path}
                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="ms-1 text-sm font-medium text-blue-600 dark:text-blue-500">
                    {item.label}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>

      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
        {title}
      </h2>
    </header>
  );
};

export default PageHeader;
