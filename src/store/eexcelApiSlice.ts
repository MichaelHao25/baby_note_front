import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  EexcelData,
  EexcelListRequest,
  EexcelListResponse,
  EexcelSeqRequest,
  EexcelSeqResponse,
  EexcelAddRequest,
  EexcelAddResponse,
  UpdateEexcelRequest,
  UpdateEexcelResponse,
} from "../types/api";

// 创建单独的eexcel API slice
export const eexcelApiSlice = createApi({
  reducerPath: "eexcelApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://teapi.ourschool.cc/api",
    prepareHeaders: (headers, { arg }) => {
      // 从localStorage获取token
      const token = localStorage.getItem("token");

      // 如果token存在，添加到请求头
      if (token) {
        headers.set("token", token);
      }
      if (!(arg?.body instanceof FormData)) {
        // 添加其他必要的请求头
        headers.set("Content-Type", "application/json");
      }
      headers.set("Accept", "application/json");

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // eexcel更新接口
    updateEexcel: builder.mutation<UpdateEexcelResponse, UpdateEexcelRequest>({
      query: (body) => ({
        url: "/eexcel/update",
        method: "POST",
        body,
      }),
    }),
    // eexcel列表查询接口
    getEexcelList: builder.query<EexcelListResponse, EexcelListRequest>({
      query: (params) => ({
        url: "/eexcel/lists",
        method: "POST",
        body: params,
      }),
    }),
    // eexcel排序接口
    updateEexcelSeq: builder.mutation<EexcelSeqResponse, EexcelSeqRequest>({
      query: (body) => ({
        url: "/eexcel/seq",
        method: "POST",
        body,
      }),
    }),
    // eexcel初始化接口
    addEexcel: builder.mutation<EexcelAddResponse, EexcelAddRequest>({
      query: (body) => ({
        url: "/eexcel/add",
        method: "POST",
        body,
      }),
    }),
  }),
});

// 导出生成的hooks
export const {
  useUpdateEexcelMutation,
  useGetEexcelListQuery,
  useUpdateEexcelSeqMutation,
  useAddEexcelMutation,
} = eexcelApiSlice;
