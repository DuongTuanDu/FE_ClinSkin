import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: async (args, api, extraOptions) => {
    const { url, method, data, params } = args;
    return baseQuery({ url, method, data, params });
  },
  endpoints: (builder) => ({
    // get
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
    })
  }),
});

export const {
  useGetAllOrderAdminQuery
} = orderApi;
