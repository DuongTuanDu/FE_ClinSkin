
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const productSearchApi = createApi({
  reducerPath: "productSearchApi",
  baseQuery: async (args, api, extraOptions) => {
    const { url, method, data, params } = args;
    return baseQuery({ url, method, data, params });
  },
  endpoints: (builder) => ({
    // Lấy danh sách sản phẩm theo filter người dùng
    getFilteredProducts: builder.query({
      query: ({ page = 1, pageSize = 12, name = "", category, brandId, minPrice = 0, maxPrice = 1000000 }) => ({
        url: "/products",
        method: "GET",
        params: {
          page,
          pageSize,
          name,
          category,
          brandId,
          minPrice,
          maxPrice,
        },
      }),
      // Có thể thêm transform nếu cần xử lý dữ liệu đầu ra
      transformResponse: (response) => response, // hoặc response.data nếu bạn cắt trong interceptor
      providesTags: ["ProductSearch"],
    }),
  }),
});

export const { useGetFilteredProductsQuery } = productSearchApi;
