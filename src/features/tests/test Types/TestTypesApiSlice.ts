import { apiSlice } from "../../../api/apiSlice";
import type { PagedResult } from "../../../types/CommonTypes";
import type { TestType } from "../../../types/testTypes";

export const testTypesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTestTypes: builder.query<
      PagedResult<TestType>,
      {
        pageNumber?: number;
        pageSize?: number;
        filterColumn?: string;
        filterValue?: string;
      }
    >({
      query: ({ pageNumber, pageSize, filterColumn, filterValue }) => ({
        url: `api/TestTypes`,
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
              ...result.data.map(({ testTypeID }) => ({
                type: "TestType" as const,
                id: testTypeID,
              })),
              { type: "TestType", id: "LIST" },
            ]
          : [{ type: "TestType", id: "LIST" }],
    }),

    getTestTypeById: builder.query<TestType, number>({
      query: (id) => ({
        url: `api/TestTypes/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "TestType", id }],
    }),

    addTestType: builder.mutation<TestType, TestType>({
      query: (newTestType) => ({
        url: `api/TestTypes`,
        method: "POST",
        data: newTestType,
      }),
      invalidatesTags: [{ type: "TestType", id: "LIST" }],
    }),

    updateTestType: builder.mutation<
      TestType,
      { id: number; updatedData: TestType }
    >({
      query: ({ id, updatedData }) => ({
        url: `api/TestTypes/${id}`,
        method: "PUT",
        data: updatedData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "TestType", id: "LIST" },
        { type: "TestType", id },
      ],
    }),
  }),
});

export const {
  useGetTestTypesQuery,
  useGetTestTypeByIdQuery,
  useAddTestTypeMutation,
  useUpdateTestTypeMutation,
} = testTypesApiSlice;
