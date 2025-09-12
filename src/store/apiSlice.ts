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
  tagTypes: ["Eat", "Weight", "Timeline"],
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
    addWeight: builder.mutation({
      query: (params) => ({
        url: "/weight",
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["Weight"],
    }),
    getWeightList: builder.query({
      query: (params) => ({
        url: "/weight",
        method: "GET",
        params: params,
      }),
      providesTags: ["Weight"],
    }),
    removeWeightItemById: builder.mutation({
      query: (params) => ({
        url: `/weight/${params._id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Weight"],
    }),

    addTimeline: builder.mutation({
      query: (params) => ({
        url: "/timeline",
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["Timeline"],
    }),
    getTimelineList: builder.query({
      query: (params) => ({
        url: "/timeline",
        method: "GET",
        params: params,
      }),
      providesTags: ["Timeline"],
    }),
    removeTimelineItemById: builder.mutation({
      query: (params) => ({
        url: `/timeline/${params._id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Timeline"],
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
    getCharts: builder.query<EatResponse, void>({
      query: () => ({
        url: `/insight/charts`,
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
  useGetChartsQuery,
  useGetWeightListQuery,
  useAddWeightMutation,
  useRemoveWeightItemByIdMutation,
  useGetTimelineListQuery,
  useAddTimelineMutation,
  useRemoveTimelineItemByIdMutation,
} = apiSlice;
