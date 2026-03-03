import { apiSlice } from "../../../api/apiSlice";
import type { PagedResult } from "../../../types/CommonTypes";
import type {
  InternationalLicense,
  InternationalLicenseCreate,
} from "../../../types/internationalLicenses";

export const internationalLicenseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetAllInternationalLicenses: builder.query<
      PagedResult<InternationalLicense>,
      {
        pageNumber?: number;
        pageSize?: number;
        filterColumn?: string;
        filterValue?: string;
      }
    >({
      query: (params) => ({
        url: `api/InternationalLicenses`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ internationalLicenseID }) => ({
                type: "InternationalLicense" as const,
                id: internationalLicenseID,
              })),
              { type: "InternationalLicense", id: "LIST" },
            ]
          : [{ type: "InternationalLicense", id: "LIST" }],
    }),

    GetInternationalLicensesByDriverId: builder.query<
      PagedResult<InternationalLicense>,
      {
        driverId: number;
        pageNumber?: number;
        pageSize?: number;
        filterColumn?: string;
        filterValue?: string;
      }
    >({
      query: ({ driverId, ...params }) => ({
        url: `api/InternationalLicenses/Driver/${driverId}`,
        method: "GET",
        params,
      }),
      providesTags: (result, _, { driverId }) =>
        result
          ? [
              ...result.data.map(({ internationalLicenseID }) => ({
                type: "InternationalLicense" as const,
                id: internationalLicenseID,
              })),
              { type: "InternationalLicense", id: `DRIVER-${driverId}` },
            ]
          : [{ type: "InternationalLicense", id: "LIST" }],
    }),

    GetInternationalLicenseById: builder.query<InternationalLicense, number>({
      query: (id) => ({
        url: `api/InternationalLicenses/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "InternationalLicense", id }],
    }),

    IssueInternationalLicense: builder.mutation<
      { message: string; result: InternationalLicense },
      InternationalLicenseCreate
    >({
      query: (createDto) => ({
        url: `api/InternationalLicenses`,
        method: "POST",
        data: createDto,
      }),
      invalidatesTags: [
        { type: "InternationalLicense", id: "LIST" },
        { type: "Application", id: "LIST" },
      ],
    }),

    CheckInternationalEligibility: builder.query<
      { eligible: boolean; message: string },
      number
    >({
      query: (localLicenseId) => ({
        url: `api/InternationalLicenses/eligibility/${localLicenseId}`,
        method: "GET",
      }),
    }),

    DeactivateInternationalLicense: builder.mutation<
      { message: string },
      number
    >({
      query: (id) => ({
        url: `api/InternationalLicenses/deactivate/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "InternationalLicense", id: "LIST" },
        { type: "InternationalLicense", id: id },
      ],
    }),

    GetActiveInternationalLicenseId: builder.query<number | null, number>({
      query: (driverId) => ({
        url: `api/InternationalLicenses/active-id/${driverId}`,
        method: "GET",
      }),
      providesTags: (_, __, driverId) => [
        { type: "InternationalLicense", id: `ACTIVE-${driverId}` },
      ],
    }),
  }),
});

export const {
  useGetAllInternationalLicensesQuery,
  useGetInternationalLicensesByDriverIdQuery,
  useGetInternationalLicenseByIdQuery,
  useIssueInternationalLicenseMutation,
  useCheckInternationalEligibilityQuery,
  useDeactivateInternationalLicenseMutation,
  useGetActiveInternationalLicenseIdQuery,
} = internationalLicenseApiSlice;
