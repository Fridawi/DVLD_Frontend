import { apiSlice } from "../../api/apiSlice";
import type { AuthResponse, LoginRequest } from "../../types/auth";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "api/Users/login",
        method: "POST",
        data: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
