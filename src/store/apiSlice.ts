import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  EatItemRequest,
  EatListRequest,
  EatRequest,
  EatResponse,
  IRemoveEatItemById,
  LoginRequest,
  LoginResponse,
} from "../types/api";

const baseUrl = import.meta.env.DEV
  ? "http://127.0.0.1:8080/api/v1"
  : "http://47.100.13.112/api/v1";
export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Eat", "Categories", "Evaluate", "Examine"],
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { arg }) => {
      // 从localStorage获取token
      const token = localStorage.getItem("token");

      // 如果token存在，添加到请求头
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      // @ts-ignore
      //   if (!(arg?.body instanceof FormData)) {
      // 添加其他必要的请求头
      // headers.set("Content-Type", "application/json");
      //   }
      headers.set("Accept", "application/json");

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 更新获取token的接口
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (params) => ({
        url: "/user/login",
        method: "POST",
        body: params,
      }),
    }),
    addEat: builder.mutation<EatResponse, EatRequest>({
      query: (params) => ({
        url: "/eat",
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["Eat"],
    }),

    getEatList: builder.query<EatResponse, EatListRequest>({
      query: (params) => ({
        url: "/eat",
        method: "GET",
        params: params,
      }),
      providesTags: ["Eat"],
    }),
    getEatItemById: builder.query<EatResponse, EatItemRequest>({
      query: (params) => ({
        url: `/eat/${params._id}`,
        method: "GET",
      }),
      providesTags: ["Eat"],
    }),
    removeEatItemById: builder.mutation<EatResponse, IRemoveEatItemById>({
      query: (params) => ({
        url: `/eat/${params._id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Eat"],
    }),
    getInsight: builder.query<EatResponse, void>({
      query: () => ({
        url: `/insight`,
        method: "GET",
      }),
    }),
  }),
});
export const {
  useLoginMutation,
  useAddEatMutation,
  useGetEatListQuery,
  useLazyGetEatItemByIdQuery,
  useRemoveEatItemByIdMutation,
  useGetInsightQuery,
} = apiSlice;
