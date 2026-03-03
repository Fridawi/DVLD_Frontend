import { apiSlice } from "../../../api/apiSlice";
import type { PagedResult } from "../../../types/CommonTypes";
import type {
  DetainedLicense,
  DetainLicenseCreate,
} from "../../../types/Detaineds";

export const detainedLicenseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetAllDetainedLicenses: builder.query<
      PagedResult<DetainedLicense>,
      {
        pageNumber?: number;
        pageSize?: number;
        filterColumn?: string;
        filterValue?: string;
      }
    >({
      query: (params) => ({
        url: `api/DetainedLicenses`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ detainID }) => ({
                type: "DetainedLicense" as const,
                id: detainID,
              })),
              { type: "DetainedLicense", id: "LIST" },
            ]
          : [{ type: "DetainedLicense", id: "LIST" }],
    }),

    GetDetainedLicenseById: builder.query<DetainedLicense, number>({
      query: (id) => ({
        url: `api/DetainedLicenses/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "DetainedLicense", id }],
    }),

    GetDetainedLicenseByLicenseId: builder.query<DetainedLicense, number>({
      query: (licenseId) => ({
        url: `api/DetainedLicenses/license/${licenseId}`,
        method: "GET",
      }),
      providesTags: (_, __, licenseId) => [
        { type: "DetainedLicense", id: `LIC-${licenseId}` },
      ],
    }),

    DetainLicense: builder.mutation<DetainedLicense, DetainLicenseCreate>({
      query: (createDto) => ({
        url: `api/DetainedLicenses/detain`,
        method: "POST",
        data: createDto,
      }),
      invalidatesTags: [
        { type: "DetainedLicense", id: "LIST" },
        { type: "License", id: "LIST" },
      ],
    }),

    ReleaseLicense: builder.mutation<DetainedLicense, number>({
      query: (licenseId) => ({
        url: `api/DetainedLicenses/release/${licenseId}`,
        method: "POST",
      }),
      invalidatesTags: (_, __, licenseId) => [
        { type: "DetainedLicense", id: "LIST" },
        { type: "DetainedLicense", id: `LIC-${licenseId}` },
        { type: "License", id: "LIST" },
      ],
    }),

    CheckIsLicenseDetained: builder.query<boolean, number>({
      query: (licenseId) => ({
        url: `api/DetainedLicenses/is-detained/${licenseId}`,
        method: "GET",
      }),
      providesTags: (_, __, licenseId) => [
        { type: "DetainedLicense", id: `STATUS-${licenseId}` },
      ],
    }),
  }),
});

export const {
  useGetAllDetainedLicensesQuery,
  useGetDetainedLicenseByIdQuery,
  useGetDetainedLicenseByLicenseIdQuery,
  useDetainLicenseMutation,
  useReleaseLicenseMutation,
  useCheckIsLicenseDetainedQuery,
} = detainedLicenseApiSlice;
