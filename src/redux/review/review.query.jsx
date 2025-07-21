import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: async (args, api, extraOptions) => {
    const { url, method, data, params } = args;
    return baseQuery({ url, method, data, params });
  },
  endpoints: (builder) => ({
    getReviewListAdmin: builder.query({
      query: ({
        page = 1,
        pageSize = 10,
        customerName = "",
        rate = 0,
        productName = "",
        fromDate = "",
        toDate = "",
      }) => {
        const queryString = new URLSearchParams({
          page,
          pageSize,
          customerName,
          rate,
          productName,
          fromDate,
          toDate,
        }).toString();
        return {
          url: `/admin/reviews?${queryString}`,
          method: "GET",
        };
      },
    }),
    getReviewByUser: builder.query({
      query: ({
        productId,
        page = 1,
        pageSize = 10,
        rate = "",
        hasComment = "",
        hasImage = "",
      }) => {
        const queryString = new URLSearchParams({
          page,
          pageSize,
          rate,
          hasComment,
          hasImage,
        }).toString();
        return {
          url: `/reviews/${productId}?${queryString}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetReviewListAdminQuery, useGetReviewByUserQuery } = reviewApi;
