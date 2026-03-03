import { apiSlice } from "../../api/apiSlice";
import type { Application } from "../../types/applications";

export const applicationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetActiveApplicationId: builder.query<
      number,
      { personID: number; applicationTypeID: number }
    >({
      query: ({ personID, applicationTypeID }) => ({
        url: `api/Applications/active-id`,
        params: { personID, applicationTypeID },
        method: "GET",
      }),
      providesTags: (_, __, { personID, applicationTypeID }) => [
        { type: "Application", id: `${personID}-${applicationTypeID}` },
      ],
    }),

    GetActiveApplicationIdForLicenseClass: builder.query<
      number,
      { personID: number; applicationTypeID: number; licenseClassID: number }
    >({
      query: ({ personID, applicationTypeID, licenseClassID }) => ({
        url: `api/Applications/active-id-for-license-class`,
        params: { personID, applicationTypeID, licenseClassID },
        method: "GET",
      }),
      providesTags: (
        _,
        __,
        { personID, applicationTypeID, licenseClassID },
      ) => [
        {
          type: "Application",
          id: `${personID}-${applicationTypeID}-${licenseClassID}`,
        },
      ],
    }),

    GetDoesPersonHaveActiveApplication: builder.query<
      boolean,
      { personID: number; applicationTypeID: number }
    >({
      query: ({ personID, applicationTypeID }) => ({
        url: `api/Applications/check-active`,
        params: { personID, applicationTypeID },
        method: "GET",
      }),
      providesTags: (_, __, { personID, applicationTypeID }) => [
        { type: "Application", id: `${personID}-${applicationTypeID}` },
      ],
    }),

    GetApplicationById: builder.query<Application, number>({
      query: (id) => ({
        url: `api/Applications/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [
        { type: "Application" as const, id },
        { type: "Application" as const, id: "LIST" },
      ],
    }),

    AddApplication: builder.mutation<Application, Application>({
      query: (newApplication) => ({
        url: `api/Applications`,
        method: "POST",
        data: newApplication,
      }),
      invalidatesTags: [{ type: "Application", id: "LIST" }],
    }),

    UpdateStatus: builder.mutation<
      Application,
      { id: number; updatedData: Application }
    >({
      query: ({ id, updatedData }) => ({
        url: `api/Applications/${id}`,
        method: "PUT",
        data: updatedData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Application", id: "LIST" },
        { type: "Application", id },
      ],
    }),

    DeleteApplication: builder.mutation<void, number>({
      query: (id) => ({
        url: `api/Applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Application", id: "LIST" },
        { type: "Application", id },
      ],
    }),
  }),
});

export const {
  useGetActiveApplicationIdQuery,
  useAddApplicationMutation,
  useUpdateStatusMutation,
  useDeleteApplicationMutation,
  useGetApplicationByIdQuery,
  useGetDoesPersonHaveActiveApplicationQuery,
  useGetActiveApplicationIdForLicenseClassQuery,
} = applicationApiSlice;
