import { apiSlice } from "../../../api/apiSlice";
import type { PagedResult } from "../../../types/CommonTypes";
import type { Test, TestCreate, TestUpdate } from "../../../types/tests";

export const testsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTests: builder.query<
      PagedResult<Test>,
      {
        pageNumber?: number;
        pageSize?: number;
        filterColumn?: string;
        filterValue?: string;
      }
    >({
      query: ({ pageNumber, pageSize, filterColumn, filterValue }) => ({
        url: `api/Tests`,
        method: "GET",
        params: { pageNumber, pageSize, filterColumn, filterValue },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ testID }) => ({
                type: "Test" as const,
                id: testID,
              })),
              { type: "Test", id: "LIST" },
            ]
          : [{ type: "Test", id: "LIST" }],
    }),

    getTestById: builder.query<Test, number>({
      query: (id) => ({
        url: `api/Tests/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "Test", id }],
    }),

    addTest: builder.mutation<Test, TestCreate>({
      query: (newTest) => ({
        url: `api/Tests`,
        method: "POST",
        data: newTest,
      }),
      invalidatesTags: [
        { type: "Test", id: "LIST" },
        { type: "TestAppointment", id: "LIST" },
        { type: "Application" as const, id: "LIST" },
        "Application",
        "LocalDrivingLicenseApplication",
      ],
    }),

    updateTest: builder.mutation<Test, { id: number; updatedData: TestUpdate }>(
      {
        query: ({ id, updatedData }) => ({
          url: `api/Tests/${id}`,
          method: "PUT",
          data: updatedData,
        }),
        invalidatesTags: (_, __, { id }) => [
          { type: "Test", id: "LIST" },
          { type: "Test", id },
          "Application",
          "LocalDrivingLicenseApplication",
          "TestAppointment",
        ],
      },
    ),

    checkPassedAllTests: builder.query<boolean, number>({
      query: (localAppID) => ({
        url: `api/Tests/check-passed-all/${localAppID}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "Test", id }],
    }),

    getPassedTestCount: builder.query<number, number>({
      query: (localAppID) => ({
        url: `api/Tests/passed-count/${localAppID}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [
        { type: "LocalDrivingLicenseApplication", id },
      ],
    }),

    getLastTestPerPerson: builder.query<
      Test,
      { personId: number; licenseClassId: number; testTypeID: number }
    >({
      query: (params) => ({
        url: `api/Tests/last-test`,
        method: "GET",
        params,
      }),
      providesTags: ["Test"],
    }),
  }),
});

export const {
  useGetTestsQuery,
  useGetTestByIdQuery,
  useAddTestMutation,
  useUpdateTestMutation,
  useCheckPassedAllTestsQuery,
  useGetPassedTestCountQuery,
  useGetLastTestPerPersonQuery,
} = testsApiSlice;
