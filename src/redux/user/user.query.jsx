import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: async (args, api, extraOptions) => {
    const { url, method, data, params } = args;
    return baseQuery({ url, method, data, params });
  },
  endpoints: (builder) => ({
    getAccountUser: builder.query({
      query: () => ({
        url: `/auth/account`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetAccountUserQuery,
} = userApi;
