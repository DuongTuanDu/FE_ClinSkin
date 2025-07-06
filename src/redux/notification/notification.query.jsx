import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: async (args, api, extraOptions) => {
    const { url, method, data, params } = args;
    return baseQuery({ url, method, data, params });
  },
  endpoints: (builder) => ({
    getAllNotiStoreByUser: builder.query({
      query: ({ page = 1, limit = 10, type = "STORE" }) => {
        const queryString = new URLSearchParams({
          page,
          limit,
          type,
        }).toString();
        return {
          url: `/notifications/by-user?${queryString}`,
          method: "GET",
        };
      },
      transformResponse: (res) => res.data,
    }),
  }),
});

export const {
  useGetAllNotiStoreByUserQuery,
} = notificationApi;
