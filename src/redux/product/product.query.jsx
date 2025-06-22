import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, data, params } = args;
        return baseQuery({ url, method, data, params });
    },
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: () => ({
                url: `/admin/product`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Product"],
        }),

        getProductList: builder.query({
            query: ({ page = 1, pageSize = 10, name = "", category = "", brandId = "", minPrice = "", maxPrice = "" }) => {
                const queryParams = { page, pageSize };

                if (name) queryParams.name = name;
                if (category) queryParams.category = category;
                if (brandId) queryParams.brandId = brandId;
                if (minPrice) queryParams.minPrice = minPrice;
                if (maxPrice) queryParams.maxPrice = maxPrice;

                const queryStrings = new URLSearchParams(queryParams).toString();
                return {
                    url: `/admin/product?${queryStrings}`,
                    method: "GET",
                };
            },
            providesTags: ["Product"],
        }),

        getProductById: builder.query({
            query: (id) => ({
                url: `/admin/product/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Product", id }],
        }),

        createProduct: builder.mutation({
            query: (productData) => ({
                url: `/admin/product`,
                method: "POST",
                data: productData,
            }),
            invalidatesTags: ["Product"],
        }),

        updateProduct: builder.mutation({
            query: ({ id, ...productData }) => ({
                url: `/admin/product/${id}`,
                method: "PUT",
                data: productData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Product", id },
                "Product",
            ],
        }),

        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/admin/product/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),

        restoreProduct: builder.mutation({
            query: (id) => ({
                url: `/admin/product/${id}/restore`,
                method: "POST",
            }),
            invalidatesTags: ["Product"],
        }),

        getProductHome: builder.query({
            query: () => ({
                url: "/products/home?tags=HOT,NEW",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),

        getProductDetail: builder.query({
            query: ({ slug }) => ({
                url: `/products/detail/${slug}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
    }),
});

export const {
    useGetAllProductsQuery,
    useGetProductListQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useRestoreProductMutation,
    useGetProductHomeQuery,
    useGetProductDetailQuery,
} = productApi;
