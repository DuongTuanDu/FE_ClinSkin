import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: async (args, api, extraOptions) => {
    const { url, method, data, params } = args;
    return baseQuery({ url, method, data, params });
  },
  endpoints: (builder) => ({
    getAllOrderAdmin: builder.query({
      query: ({
        page = 1,
        pageSize = 10,
        search = "",
        status = "",
        paymentMethod = "",
        fromDate = "",
        toDate = "",
      }) => {
        const queryString = new URLSearchParams({
          page,
          pageSize,
          search,
          status,
          paymentMethod,
          fromDate,
          toDate,
        }).toString();
        return {
          url: `/admin/orders?${queryString}`,
          method: "GET",
        };
      },
    }),
    getOrderHistory: builder.query({
      query: ({ page = 1, pageSize = 10, status = "all" }) => {
        const queryString = new URLSearchParams({
          page,
          pageSize,
          status,
        }).toString();
        return {
          url: `/orders?${queryString}`,
          method: "GET",
        };
      },
    }),
    getOrderDetailByUser: builder.query({
      query: ({ id }) => ({
        url: `/orders/detail/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllOrderAdminQuery,
  useGetOrderHistoryQuery,
  useGetOrderDetailByUserQuery,
} = orderApi;
