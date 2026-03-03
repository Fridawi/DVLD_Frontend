import { apiSlice } from "../../api/apiSlice";
import type { PagedResult } from "../../types/CommonTypes";
import type { User, UserCreate, UserUpdate } from "../../types/users";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      PagedResult<User>,
      {
        pageNumber: number;
        pageSize: number;
        filterColumn?: string;
        filterValue?: string;
      }
    >({
      query: ({ pageNumber, pageSize, filterColumn, filterValue }) => ({
        url: `api/Users`,
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
              ...result.data.map(({ userID }) => ({
                type: "User" as const,
                id: userID,
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    getUserById: builder.query<User, number>({
      query: (id) => ({
        url: `api/Users/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "User", id }],
    }),

    getUserByPersonId: builder.query<User, number>({
      query: (id) => ({
        url: `api/Users/person/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "User", id }],
    }),

    addUser: builder.mutation<User, UserCreate>({
      query: (newUser) => ({
        url: `api/Users`,
        method: "POST",
        data: newUser,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation<User, { id: number; updatedData: UserUpdate }>(
      {
        query: ({ id, updatedData }) => ({
          url: `api/Users/${id}`,
          method: "PUT",
          data: updatedData,
        }),
        invalidatesTags: (_, __, { id }) => [
          { type: "User", id: "LIST" },
          { type: "User", id },
        ],
      },
    ),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `api/Users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "User", id: "LIST" },
        { type: "User", id },
      ],
    }),

    toggleStatus: builder.mutation<void, number>({
      query: (id) => ({
        url: `api/Users/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "User", id: "LIST" },
        { type: "User", id },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserByPersonIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleStatusMutation,
} = usersApiSlice;
