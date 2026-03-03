import { apiSlice } from "../../../api/apiSlice";
import type { PagedResult } from "../../../types/CommonTypes";
import type { LicenseClass } from "../../../types/licenseClass";

export const licensesClassApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLicensesClass: builder.query<
      PagedResult<LicenseClass>,
      {
        pageNumber: number;
        pageSize: number;
        filterColumn?: string;
        filterValue?: string;
      }
    >({
      query: ({ pageNumber, pageSize, filterColumn, filterValue }) => ({
        url: `api/LicenseClasses`,
        method: "GET",
        params: {
          pageNumber,
          pageSize,
          filterColumn,
          filterValue,
        },
      }),
      keepUnusedDataFor: 3600,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ licenseClassID }) => ({
                type: "LicenseClass" as const,
                id: licenseClassID,
              })),
              { type: "LicenseClass", id: "LIST" },
            ]
          : [{ type: "LicenseClass", id: "LIST" }],
    }),

    getLicenseClassById: builder.query<LicenseClass, number>({
      query: (id) => ({
        url: `api/LicenseClasses/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "LicenseClass", id }],
    }),

    getLicenseClassByClassName: builder.query<LicenseClass, string>({
      query: (className) => ({
        url: `api/LicenseClasses/ByName/${className}`,
        method: "GET",
      }),
      providesTags: (_, __, className) => [
        { type: "LicenseClass", id: className },
      ],
    }),

    addLicenseClass: builder.mutation<LicenseClass, LicenseClass>({
      query: (newLicenseClass) => ({
        url: `api/LicenseClasses`,
        method: "POST",
        data: newLicenseClass,
      }),
      invalidatesTags: [{ type: "LicenseClass", id: "LIST" }],
    }),

    updateLicenseClass: builder.mutation<
      LicenseClass,
      { id: number; updatedData: LicenseClass }
    >({
      query: ({ id, updatedData }) => ({
        url: `api/LicenseClasses/${id}`,
        method: "PUT",
        data: updatedData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "LicenseClass", id: "LIST" },
        { type: "LicenseClass", id },
      ],
    }),
  }),
});

export const {
  useGetLicensesClassQuery,
  useGetLicenseClassByIdQuery,
  useAddLicenseClassMutation,
  useUpdateLicenseClassMutation,
} = licensesClassApiSlice;
