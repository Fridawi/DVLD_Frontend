import { apiSlice } from "../../api/apiSlice";
import type { Person } from "./../../types/people";
import type { PagedResult } from "../../types/CommonTypes";

export const peopleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPeople: builder.query<
      PagedResult<Person>,
      {
        pageNumber: number;
        pageSize: number;
        filterColumn?: string;
        filterValue?: string;
      }
    >({
      query: ({ pageNumber, pageSize, filterColumn, filterValue }) => ({
        url: `api/People`,
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
              ...result.data.map(({ personID }) => ({
                type: "Person" as const,
                id: personID,
              })),
              { type: "Person", id: "LIST" },
            ]
          : [{ type: "Person", id: "LIST" }],
    }),

    getPersonById: builder.query<Person, number>({
      query: (id) => ({
        url: `api/People/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "Person", id }],
    }),

    getPersonByNationalNumber: builder.query<Person, string>({
      query: (nationalNumber) => ({
        url: `api/People/${nationalNumber}`,
        method: "GET",
      }),
      providesTags: (_, __, nationalNumber) => [
        { type: "Person", id: nationalNumber },
      ],
    }),

    addPerson: builder.mutation<
      Person,
      { personData: Partial<Person>; imageFile?: File }
    >({
      query: ({ personData, imageFile }) => {
        const formData = new FormData();

        Object.entries(personData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            let formattedValue: string;

            if ((value as unknown) instanceof Date) {
              formattedValue = (value as unknown as Date).toISOString();
            } else {
              formattedValue = String(value);
            }

            formData.append(key, formattedValue);
          }
        });

        if (imageFile) {
          formData.append("imageFile", imageFile);
        }

        return {
          url: `api/People`,
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: [{ type: "Person", id: "LIST" }],
    }),

    updatePerson: builder.mutation<
      Person,
      { id: number; personData: Partial<Person>; imageFile?: File }
    >({
      query: ({ id, personData, imageFile }) => {
        const formData = new FormData();
        formData.append("PersonID", id.toString());

        Object.entries(personData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            let formattedValue: string;

            if ((value as unknown) instanceof Date) {
              formattedValue = (value as unknown as Date).toISOString();
            } else {
              formattedValue = String(value);
            }

            formData.append(key, formattedValue);
          }
        });

        if (imageFile) {
          formData.append("imageFile", imageFile);
        }

        return {
          url: `api/People/${id}`,
          method: "PUT",
          data: formData,
        };
      },
      invalidatesTags: (_, __, { id }) => [
        { type: "Person", id: "LIST" },
        { type: "Person", id: id },
      ],
    }),

    deletePerson: builder.mutation<void, number>({
      query: (id) => ({
        url: `api/People/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Person", id: "LIST" },
        { type: "Person", id },
      ],
    }),
  }),
});

export const {
  useGetPeopleQuery,
  useGetPersonByIdQuery,
  useGetPersonByNationalNumberQuery,
  useAddPersonMutation,
  useUpdatePersonMutation,
  useDeletePersonMutation,
} = peopleApiSlice;
