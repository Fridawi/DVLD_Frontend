import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import ProtectedRoute from "../components/common/ProtectedRoute";
import App from "../App";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/NotFound";
import PeoplePage from "../features/people/PeoplePage";
import AddEditPersonForm from "../features/people/components/AddEditPersonForm";
import PersonDetails from "../features/people/components/PersonDetails";
import UserPage from "../features/users/UsersPage";
import UserDetails from "../features/users/components/UserDetails";
import AddUser from "../features/users/components/AddUser";
import UpdateUser from "../features/users/components/UpdateUser";
import ApplicationTypePage from "../features/applications/applicationTypes/ApplicationTypesPage";
import AddEditApplicationTypeForm from "../features/applications/applicationTypes/components/AddEditApplicationType";
import ApplicationTypeDetails from "../features/applications/applicationTypes/components/ApplicationTypeDetails";
import TestTypePage from "../features/tests/test Types/TestTypesPage";
import AddEditTestTypeForm from "../features/tests/test Types/components/AddEditTestType";
import TestTypeDetails from "../features/tests/test Types/components/TestTypeDetails";
import LicensesClassPage from "../features/licensing/licenses Class/LicensesClassPage";
import LicenseClassDetails from "../features/licensing/licenses Class/components/LicenseClassDetails";
import AddEditLicenseClassForm from "../features/licensing/licenses Class/components/AddEditLicenseClass";
import LocalAppPage from "../features/applications/localApp/LocalAppPage";
import LocalAppDetails from "../features/applications/localApp/components/LocalAppDetails";
import AddEditLocalApp from "../features/applications/localApp/components/AddEditLocalApp";
import TestAppointmentsPage from "../features/tests/Test Appointments/TestAppointmentsPage";
import Schedule from "../features/tests/Test Appointments/components/Schedule";
import ScheduleTestPage from "../features/tests/Test Appointments/components/ScheduleTestPage";
import TestAppointmentDetails from "../features/tests/Test Appointments/components/TestAppointmentDetails";
import TestDetails from "../features/tests/manageTests/components/TestDetails";
import TakeTest from "../features/tests/manageTests/components/TakeTest";
import TestsPage from "../features/tests/manageTests/TestsPage";
import LicensesPage from "../features/licensing/Licenses/LicensesPage";
import IssueFirstLicensePage from "../features/licensing/Licenses/components/IssueFirstLicensePage";
import RenewLicensePage from "../features/licensing/Licenses/components/RenewLicensePage";
import ReplacementLicensePage from "../features/licensing/Licenses/components/ReplacementLicensePage";
import LicenseDetails from "../features/licensing/Licenses/components/LicenseDetails";
import DriverHistoryPage from "../features/licensing/Licenses/components/DriverHistory";
import InternationalLicensesPage from "../features/licensing/International License/InternationalLicensesPage";
import AddInternationalLicense from "../features/licensing/International License/components/AddInternationalLicense";
import InternationalLicenseDetails from "../features/licensing/International License/components/InternationalLicenseDetails";
import DriversPage from "../features/drivers/DriversPage";
import DriverDetails from "../features/drivers/components/DriverDetails";
import DetainedsPage from "../features/licensing/Detained/DetainedsPage";
import ReleaseLicensePage from "../features/licensing/Detained/components/ReleaseLicensePage";
import DetainLicensePage from "../features/licensing/Detained/components/DetainLicensePage";
import Dashboard from "../features/dashboards/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "login", element: <Login /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { index: true, element: <Navigate to="/dashboard" replace /> },
              {
                path: "dashboard",
                element: <Dashboard />,
              },

              {
                path: "people",
                children: [
                  { index: true, element: <PeoplePage /> },
                  { path: "add", element: <AddEditPersonForm /> },
                  { path: "edit/:personID", element: <AddEditPersonForm /> },
                  { path: ":personID", element: <PersonDetails /> },
                ],
              },

              {
                path: "drivers",
                children: [
                  {
                    index: true,
                    element: <DriversPage />,
                  },
                  {
                    path: ":licenseID/history",
                    element: <DriverHistoryPage />,
                  },
                  {
                    path: ":driverID",
                    element: <DriverDetails />,
                  },
                ],
              },

              {
                path: "users",
                children: [
                  {
                    element: <ProtectedRoute allowedRoles={["Admin"]} />,
                    children: [
                      { index: true, element: <UserPage /> },
                      { path: "add", element: <AddUser /> },
                    ],
                  },
                  {
                    element: (
                      <ProtectedRoute allowedRoles={["Admin", "User"]} />
                    ),
                    children: [
                      { path: ":userID", element: <UserDetails /> },
                      { path: "edit/:userID", element: <UpdateUser /> },
                    ],
                  },
                ],
              },

              {
                path: "applications",
                children: [
                  {
                    path: "local",
                    children: [
                      { index: true, element: <LocalAppPage /> },
                      { path: "add", element: <AddEditLocalApp /> },
                      {
                        path: "edit/:id",
                        element: <AddEditLocalApp />,
                      },
                      {
                        path: ":id",
                        element: <LocalAppDetails />,
                      },
                    ],
                  },
                  {
                    path: "types",
                    children: [
                      { index: true, element: <ApplicationTypePage /> },
                      {
                        path: ":applicationTypeID",
                        element: <ApplicationTypeDetails />,
                      },
                      {
                        element: <ProtectedRoute allowedRoles={["Admin"]} />,
                        children: [
                          {
                            path: "add",
                            element: <AddEditApplicationTypeForm />,
                          },
                          {
                            path: "edit/:applicationTypeID",
                            element: <AddEditApplicationTypeForm />,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },

              {
                path: "licenses",
                children: [
                  {
                    path: "manage",
                    children: [
                      { index: true, element: <LicensesPage /> },
                      {
                        path: "issue-first-time/:localAppID",
                        element: <IssueFirstLicensePage />,
                      },
                      {
                        path: ":licenseID",
                        element: <LicenseDetails />,
                      },
                    ],
                  },

                  {
                    path: "international",
                    children: [
                      {
                        index: true,
                        element: <InternationalLicensesPage />,
                      },
                      {
                        path: "add",
                        element: <AddInternationalLicense />,
                      },
                      {
                        path: ":intLicenseID",
                        element: <InternationalLicenseDetails />,
                      },
                    ],
                  },

                  {
                    path: "renew/:oldLicenseID?",
                    element: <RenewLicensePage />,
                  },

                  {
                    path: "replacement/:oldLicenseID?",
                    element: <ReplacementLicensePage />,
                  },

                  {
                    path: "detaineds",
                    children: [
                      {
                        index: true,
                        element: <DetainedsPage />,
                      },
                      {
                        path: "release/:licenseID?",
                        element: <ReleaseLicensePage />,
                      },
                      {
                        path: "detained/:licenseID?",
                        element: <DetainLicensePage />,
                      },
                    ],
                  },

                  {
                    path: "classes",
                    children: [
                      { index: true, element: <LicensesClassPage /> },
                      {
                        path: ":licenseClassID",
                        element: <LicenseClassDetails />,
                      },
                      {
                        element: <ProtectedRoute allowedRoles={["Admin"]} />,
                        children: [
                          {
                            path: "add",
                            element: <AddEditLicenseClassForm />,
                          },
                          {
                            path: "edit/:licenseClassID",
                            element: <AddEditLicenseClassForm />,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },

              {
                path: "tests",
                children: [
                  {
                    path: "appointments",
                    children: [
                      { index: true, element: <TestAppointmentsPage /> },
                      {
                        path: ":appointmentID",
                        element: <TestAppointmentDetails />,
                      },
                      {
                        path: "scheduleTest/:localAppID/:testTypeID/:appointmentID?",
                        element: <ScheduleTestPage />,
                      },
                      {
                        path: "schedule/:localAppID/:testTypeID",
                        element: <Schedule />,
                      },
                    ],
                  },
                  {
                    path: "types",
                    children: [
                      { index: true, element: <TestTypePage /> },
                      {
                        path: ":testTypeID",
                        element: <TestTypeDetails />,
                      },
                      {
                        element: <ProtectedRoute allowedRoles={["Admin"]} />,
                        children: [
                          {
                            path: "add",
                            element: <AddEditTestTypeForm />,
                          },
                          {
                            path: "edit/:testTypeID",
                            element: <AddEditTestTypeForm />,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: "manage",
                    children: [
                      {
                        index: true,
                        element: <TestsPage />,
                      },
                      {
                        path: ":testID",
                        element: <TestDetails />,
                      },

                      {
                        path: "take/:appointmentID",
                        element: <TakeTest />,
                      },
                      {
                        path: "edit/:testID",
                        element: <TakeTest />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
