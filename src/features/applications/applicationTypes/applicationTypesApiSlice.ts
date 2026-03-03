import { apiSlice } from "../../../api/apiSlice";
import type { ApplicationType } from "../../../types/applicationTypes";
import type { PagedResult } from "../../../types/CommonTypes";

export const applicationTypesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApplicationTypes: builder.query<
      PagedResult<ApplicationType>,
      {
        pageNumber: number;
        pageSize: number;
        filterColumn?: string;
        filterValue?: string;
      }
    >({
      query: ({ pageNumber, pageSize, filterColumn, filterValue }) => ({
        url: `api/ApplicationTypes`,
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
              ...result.data.map(({ applicationTypeID }) => ({
                type: "ApplicationType" as const,
                id: applicationTypeID,
              })),
              { type: "ApplicationType", id: "LIST" },
            ]
          : [{ type: "ApplicationType", id: "LIST" }],
    }),

    getApplicationTypeById: builder.query<ApplicationType, number>({
      query: (id) => ({
        url: `api/ApplicationTypes/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "ApplicationType", id }],
    }),

    addApplicationType: builder.mutation<ApplicationType, ApplicationType>({
      query: (newApplicationType) => ({
        url: `api/ApplicationTypes`,
        method: "POST",
        data: newApplicationType,
      }),
      invalidatesTags: [{ type: "ApplicationType", id: "LIST" }],
    }),

    updateApplicationType: builder.mutation<
      ApplicationType,
      { id: number; updatedData: ApplicationType }
    >({
      query: ({ id, updatedData }) => ({
        url: `api/ApplicationTypes/${id}`,
        method: "PUT",
        data: updatedData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "ApplicationType", id: "LIST" },
        { type: "ApplicationType", id },
      ],
    }),
  }),
});

export const {
  useGetApplicationTypesQuery,
  useGetApplicationTypeByIdQuery,
  useAddApplicationTypeMutation,
  useUpdateApplicationTypeMutation,
} = applicationTypesApiSlice;
