import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const brandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: async (args, api, extraOptions) => {
    const { url, method, data, params } = args;
    return baseQuery({ url, method, data, params });
  },
  // tagTypes: ["Brand"],
  endpoints: (builder) => ({
    getAllBrands: builder.query({
      query: () => ({
        url: `/admin/brands`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),
    // get
    getBrandList: builder.query({
      query: ({ page = 1, pageSize = 10, name = "" }) => {
        const queryStrings = new URLSearchParams({
          page,
          pageSize,
          name,
        }).toString();
        return {
          url: `/admin/brands?${queryStrings}`,
          method: "GET",
        };
      },
    }),
    // create
    getAllBrandByUser: builder.query({
      query: () => ({
        url: `/brands`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetAllBrandsQuery,
  useGetBrandListQuery,
  useGetAllBrandByUserQuery,
} = brandApi;
