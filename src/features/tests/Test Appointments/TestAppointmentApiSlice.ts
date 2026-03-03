import { apiSlice } from "../../../api/apiSlice";
import type { PagedResult } from "../../../types/CommonTypes";
import type {
  TestAppointment,
  TestAppointmentCreate,
  TestAppointmentUpdate,
} from "../../../types/testAppointments";

export const testAppointmentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTestAppointments: builder.query<
      PagedResult<TestAppointment>,
      {
        pageNumber?: number;
        pageSize?: number;
        filterColumn?: string;
        filterValue?: string;
      }
    >({
      query: ({ pageNumber, pageSize, filterColumn, filterValue }) => ({
        url: `api/TestAppointments`,
        method: "GET",
        params: {
          pageNumber,
          pageSize,
          filterColumn,
          filterValue,
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ testAppointmentID }) => ({
                type: "TestAppointment" as const,
                id: testAppointmentID,
              })),
              { type: "TestAppointment", id: "LIST" },
            ]
          : [{ type: "TestAppointment", id: "LIST" }],
    }),

    getTestAppointmentById: builder.query<TestAppointment, number>({
      query: (id) => ({
        url: `api/TestAppointments/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "TestAppointment", id }],
    }),

    getAppointmentsByLocalAppAndTestType: builder.query<
      PagedResult<TestAppointment>,
      {
        localAppID: number;
        testTypeID: number;
        pageNumber?: number;
        pageSize?: number;
        filterColumn?: string;
        filterValue?: string;
      }
    >({
      query: ({ localAppID, testTypeID, ...params }) => ({
        url: `api/TestAppointments/localApp/${localAppID}/test-type/${testTypeID}`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ testAppointmentID }) => ({
                type: "TestAppointment" as const,
                id: testAppointmentID,
              })),
              { type: "TestAppointment", id: "LIST" },
            ]
          : [{ type: "TestAppointment", id: "LIST" }],
    }),

    getLastTestAppointment: builder.query<
      TestAppointment,
      { localAppID: number; testTypeID: number }
    >({
      query: ({ localAppID, testTypeID }) => ({
        url: `api/TestAppointments/last-appointment/localApp/${localAppID}/test-type/${testTypeID}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [{ type: "TestAppointment", id: result.testAppointmentID }]
          : [],
    }),

    hasActiveAppointment: builder.query<
      boolean,
      { localAppID: number; testTypeID: number }
    >({
      query: ({ localAppID, testTypeID }) => ({
        url: `api/TestAppointments/has-active/localApp/${localAppID}/test-type/${testTypeID}`,
        method: "GET",
      }),
      providesTags: (_, __, { localAppID, testTypeID }) => [
        { type: "TestAppointment", id: `ACTIVE-${localAppID}-${testTypeID}` },
      ],
    }),

    addTestAppointment: builder.mutation<
      TestAppointment,
      TestAppointmentCreate
    >({
      query: (newAppointment) => ({
        url: `api/TestAppointments`,
        method: "POST",
        data: newAppointment,
      }),
      invalidatesTags: (
        _,
        __,
        { localDrivingLicenseApplicationID, testTypeID },
      ) => [
        { type: "TestAppointment", id: "LIST" },
        {
          type: "TestAppointment",
          id: `ACTIVE-${localDrivingLicenseApplicationID}-${testTypeID}`,
        },
      ],
    }),

    updateTestAppointment: builder.mutation<
      TestAppointment,
      TestAppointmentUpdate
    >({
      query: (updateData) => ({
        url: `api/TestAppointments/${updateData.testAppointmentID}`,
        method: "PATCH",
        data: updateData,
      }),
      invalidatesTags: (_, __, { testAppointmentID }) => [
        { type: "TestAppointment", id: "LIST" },
        { type: "TestAppointment", id: testAppointmentID },
      ],
    }),
  }),
});

export const {
  useGetTestAppointmentsQuery,
  useGetTestAppointmentByIdQuery,
  useGetAppointmentsByLocalAppAndTestTypeQuery,
  useGetLastTestAppointmentQuery,
  useHasActiveAppointmentQuery,
  useAddTestAppointmentMutation,
  useUpdateTestAppointmentMutation,
} = testAppointmentsApiSlice;
