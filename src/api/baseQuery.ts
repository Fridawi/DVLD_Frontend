import { type BaseQueryFn } from "@reduxjs/toolkit/query";
import { type AxiosRequestConfig, AxiosError } from "axios";
import axiosInstance from "./axiosInstance";
import type { ApiErrorData } from "../types/auth";

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    { status?: number; data: ApiErrorData | string }
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<ApiErrorData>;

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || { detail: err.message },
        },
      };
    }
  };
