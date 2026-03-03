import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "User",
    "Person",
    "Application",
    "LocalDrivingLicenseApplication",
    "License",
    "InternationalLicense",
    "LicenseClass",
    "DetainedLicense",
    "Country",
    "Driver",
    "Test",
    "TestType",
    "TestAppointment",
    "ApplicationType",
  ],
  endpoints: () => ({}),
});
