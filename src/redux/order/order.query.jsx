import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: async (args, api, extraOptions) => {
    const { url, method, data, params } = args;
    return baseQuery({ url, method, data, params });
  },
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // 🔍 Get danh sách order (phân trang, filter, search)
    getOrderList: builder.query({
      query: ({
        page = 1,
        limit = 10,
        status = "",
        keyword = "",
        sort = "-createdAt",
        startDate = ''
      } = {}) => {
        const queryStrings = new URLSearchParams({
          page,
          limit,
          status,
          keyword,
          sort,
          startDate
        }).toString();
        return {
          url: `/admin/orders?${queryStrings}`,
          method: "GET"
        };
      },
      providesTags: ["Order"]
    }),

    // 📄 Get chi tiết đơn hàng
    getOrderDetail: builder.query({
      query: (id) => ({
        url: `/admin/orders/${id}`,
        method: "GET"
      }),
      providesTags: ["Order"]
    }),
  })
});

export const {
  useGetOrderListQuery,
  useGetOrderDetailQuery,
} = orderApi;
