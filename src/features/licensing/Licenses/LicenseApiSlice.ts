import { apiSlice } from "../../../api/apiSlice";
import type { PagedResult } from "../../../types/CommonTypes";
import type {
  DriverLicense,
  IssueReason,
  License,
  LicenseCreate,
} from "../../../types/licenses";

export const licenseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetAllLicenses: builder.query<
      PagedResult<License>,
      {
        pageNumber?: number;
        pageSize?: number;
        filterColumn?: string;
        filterValue?: string;
      }
    >({
      query: (params) => ({
        url: `api/Licenses`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ licenseID }) => ({
                type: "License" as const,
                id: licenseID,
              })),
              { type: "License", id: "LIST" },
            ]
          : [{ type: "License", id: "LIST" }],
    }),

    GetLicensesByDriverId: builder.query<
      PagedResult<DriverLicense>,
      {
        driverId: number;
        pageNumber?: number;
        pageSize?: number;
        filterColumn?: string;
        filterValue?: string;
      }
    >({
      query: ({ driverId, ...params }) => ({
        url: `api/Licenses/driver/${driverId}`,
        method: "GET",
        params,
      }),
      providesTags: (result, _, { driverId }) =>
        result
          ? [
              ...result.data.map(({ licenseID }) => ({
                type: "License" as const,
                id: licenseID,
              })),
              { type: "License", id: `DRIVER-${driverId}` },
            ]
          : [{ type: "License", id: "LIST" }],
    }),

    GetDriverLicenseDetail: builder.query<DriverLicense, number>({
      query: (id) => ({
        url: `api/Licenses/${id}/detail`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "License", id }],
    }),

    GetLicenseById: builder.query<License, number>({
      query: (id) => ({
        url: `api/Licenses/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "License", id }],
    }),

    GetActiveLicense: builder.query<
      License,
      { personID: number; licenseClassID: number }
    >({
      query: (params) => ({
        url: `api/Licenses/active-check`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result ? [{ type: "License", id: result.licenseID }] : [],
    }),

    IssueFirstTimeLicense: builder.mutation<License, LicenseCreate>({
      query: (newLicense) => ({
        url: `api/Licenses/first-time`,
        method: "POST",
        data: newLicense,
      }),
      invalidatesTags: [
        { type: "License", id: "LIST" },
        { type: "Application", id: "LIST" },
      ],
    }),

    RenewLicense: builder.mutation<
      License,
      { oldLicenseId: number; notes?: string }
    >({
      query: ({ oldLicenseId, notes }) => ({
        url: `api/Licenses/${oldLicenseId}/renew`,
        method: "POST",
        data: JSON.stringify(notes),
      }),
      invalidatesTags: (_, __, { oldLicenseId }) => [
        { type: "License", id: "LIST" },
        { type: "License", id: oldLicenseId },
      ],
    }),

    ReplaceLicense: builder.mutation<
      License,
      { oldLicenseId: number; reason: IssueReason }
    >({
      query: ({ oldLicenseId, reason }) => ({
        url: `api/Licenses/${oldLicenseId}/replace`,
        method: "POST",
        params: { reason },
      }),
      invalidatesTags: (_, __, { oldLicenseId }) => [
        { type: "License", id: "LIST" },
        { type: "License", id: oldLicenseId },
      ],
    }),

    DeactivateLicense: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `api/Licenses/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "License", id: "LIST" },
        { type: "License", id: id },
      ],
    }),
  }),
});

export const {
  useGetAllLicensesQuery,
  useGetLicensesByDriverIdQuery,
  useGetDriverLicenseDetailQuery,
  useGetLicenseByIdQuery,
  useGetActiveLicenseQuery,
  useIssueFirstTimeLicenseMutation,
  useRenewLicenseMutation,
  useReplaceLicenseMutation,
  useDeactivateLicenseMutation,
} = licenseApiSlice;
