import { apiSlice } from "../../../api/apiSlice";
import type { PagedResult } from "../../../types/CommonTypes";
import type {
  LocalDrivingLicenseApplication,
  LocalDrivingLicenseApplicationCreate,
  LocalDrivingLicenseApplicationUpdate,
} from "../../../types/localDrivingLicenseApplication";

export const localAppApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetAllLocalDrivingLicenseApplications: builder.query<
      PagedResult<LocalDrivingLicenseApplication>,
      {
        pageNumber?: number;
        pageSize?: number;
        filterColumn?: string;
        filterValue?: string;
      }
    >({
      query: (params) => ({
        url: `api/LocalDrivingLicenseApplications`,
        params,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ localDrivingLicenseApplicationID }) => ({
                type: "LocalDrivingLicenseApplication" as const,
                id: localDrivingLicenseApplicationID,
              })),
              { type: "LocalDrivingLicenseApplication", id: "LIST" },
            ]
          : [{ type: "LocalDrivingLicenseApplication", id: "LIST" }],
    }),

    GetLocalDrivingLicenseApplicationById: builder.query<
      LocalDrivingLicenseApplication,
      number
    >({
      query: (id) => ({
        url: `api/LocalDrivingLicenseApplications/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [
        { type: "LocalDrivingLicenseApplication", id },
      ],
    }),

    GetLocalDrivingLicenseApplicationByApplicationId: builder.query<
      LocalDrivingLicenseApplication,
      number
    >({
      query: (id) => ({
        url: `api/LocalDrivingLicenseApplications/ApplicationId/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [
        { type: "LocalDrivingLicenseApplication", id: `APP-${id}` },
      ],
    }),

    AddLocalDrivingLicenseApplication: builder.mutation<
      LocalDrivingLicenseApplication,
      LocalDrivingLicenseApplicationCreate
    >({
      query: (newLocalApp) => ({
        url: `api/LocalDrivingLicenseApplications`,
        method: "POST",
        data: newLocalApp,
      }),
      invalidatesTags: [{ type: "LocalDrivingLicenseApplication", id: "LIST" }],
    }),

    UpdateLocalDrivingLicenseApplication: builder.mutation<
      LocalDrivingLicenseApplication,
      { id: number; updatedData: LocalDrivingLicenseApplicationUpdate }
    >({
      query: ({ id, updatedData }) => ({
        url: `api/LocalDrivingLicenseApplications/${id}`,
        method: "PATCH",
        data: updatedData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "LocalDrivingLicenseApplication", id: "LIST" },
        { type: "LocalDrivingLicenseApplication", id },
      ],
    }),

    // حذف طلب رخصة محلية
    DeleteLocalDrivingLicenseApplication: builder.mutation<void, number>({
      query: (id) => ({
        url: `api/LocalDrivingLicenseApplications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "LocalDrivingLicenseApplication", id: "LIST" },
        { type: "LocalDrivingLicenseApplication", id },
      ],
    }),

    GetActiveLocalApplicationId: builder.query<
      number,
      { personId: number; appTypeId: number; licenseClassId: number }
    >({
      query: (params) => ({
        url: `api/LocalDrivingLicenseApplications/active-id`,
        params,
        method: "GET",
      }),
      providesTags: (_, __, { personId, licenseClassId }) => [
        {
          type: "LocalDrivingLicenseApplication",
          id: `ACTIVE-${personId}-${licenseClassId}`,
        },
      ],
    }),
  }),
});

export const {
  useGetAllLocalDrivingLicenseApplicationsQuery,
  useGetLocalDrivingLicenseApplicationByIdQuery,
  useGetLocalDrivingLicenseApplicationByApplicationIdQuery,
  useAddLocalDrivingLicenseApplicationMutation,
  useUpdateLocalDrivingLicenseApplicationMutation,
  useDeleteLocalDrivingLicenseApplicationMutation,
  useGetActiveLocalApplicationIdQuery,
} = localAppApiSlice;
