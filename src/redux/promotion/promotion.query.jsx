import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const promotionApi = createApi({
  reducerPath: "promotionApi",
  baseQuery: async (args, api, extraOptions) => {
    const { url, method, data, params } = args;
    return baseQuery({ url, method, data, params });
  },
  endpoints: (builder) => ({
    getPromotionalProducts: builder.query({
      query: ({ page = 1, limit = 12, name = "", discountMin = 0, discountMax = 100, startDate, endDate }) => {
        const queryStrings = new URLSearchParams({
          page,
          limit,
          name,
          discountMin: discountMin.toString(),
          discountMax: discountMax.toString(),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        }).toString();

        return {
          url: `/promotion/promotionProduct?${queryStrings}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response.data,
    }),

    getAllActivePromotions: builder.query({
      query: () => ({
        url: "/promotion/active",
        method: "GET",
      }),
    }),

    getPromotionProductBySlug: builder.query({
      query: ({ slug, name, discountMin, discountMax, minPrice, maxPrice }) => ({
        url: `/promotion/promotionProduct/${slug}`,
        method: "GET",
        params: { name, discountMin, discountMax, minPrice, maxPrice },
      }),
    })


  }),
});

export const {
  useGetPromotionalProductsQuery,
  useGetAllActivePromotionsQuery,
  useGetPromotionProductBySlugQuery
} = promotionApi;
