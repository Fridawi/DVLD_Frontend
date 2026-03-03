import { apiSlice } from "../../api/apiSlice";
import type { PagedResult } from "../../types/CommonTypes";
import type { Driver, DriverCreate } from "../../types/drivers";

export const driverApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDrivers: builder.query<
      PagedResult<Driver>,
      {
        pageNumber: number;
        pageSize: number;
        filterColumn?: string;
        filterValue?: string;
      }
    >({
      query: ({ pageNumber, pageSize, filterColumn, filterValue }) => ({
        url: `api/Drivers`,
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
              ...result.data.map(({ driverID }) => ({
                type: "Driver" as const,
                id: driverID,
              })),
              { type: "Driver", id: "LIST" },
            ]
          : [{ type: "Driver", id: "LIST" }],
    }),

    getDriverById: builder.query<Driver, number>({
      query: (id) => ({
        url: `api/Drivers/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "Driver", id }],
    }),

    getDriverByPersonId: builder.query<Driver, number>({
      query: (personId) => ({
        url: `api/Drivers/person/${personId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Driver", id: result.driverID }] : [],
    }),

    addDriver: builder.mutation<Driver, DriverCreate>({
      query: (newDriver) => ({
        url: `api/Drivers`,
        method: "POST",
        data: newDriver,
      }),
      invalidatesTags: [{ type: "Driver", id: "LIST" }],
    }),

    checkDriverExists: builder.query<boolean, number>({
      query: (personId) => ({
        url: `api/Drivers/exists/person/${personId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetDriversQuery,
  useGetDriverByIdQuery,
  useGetDriverByPersonIdQuery,
  useAddDriverMutation,
  useCheckDriverExistsQuery,
} = driverApiSlice;
