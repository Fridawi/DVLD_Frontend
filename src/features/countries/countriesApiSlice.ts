import { apiSlice } from "../../api/apiSlice";
import type { Country } from "../../types/conutries";

export const countriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], void>({
      query: () => ({
        url: "api/Countries",
        method: "GET",
      }),
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const { useGetCountriesQuery } = countriesApiSlice;
