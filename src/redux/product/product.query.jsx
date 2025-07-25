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

        getProductOther: builder.query({
            query: ({ page = 1, pageSize = 15 }) => {
                const queryString = new URLSearchParams({
                    page,
                    pageSize,
                }).toString();
                return {
                    url: `/products/all-other?${queryString}`,
                    method: "GET",
                };
            },
        }),

        getFilterOptions: builder.query({
            query: () => ({
                url: "/products/filter-options",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),

        getProductFromBrand: builder.query({
            query: ({
                page = 1,
                pageSize = 12,
                priceRange = "",
                categories = [],
                tags = [],
                sortOrder = "",
                slug,
            }) => {
                const queryString = new URLSearchParams({
                    priceRange,
                    categories,
                    tags,
                    sortOrder,
                    page,
                    pageSize,
                }).toString();
                return {
                    url: `/products/brands/${slug}?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (response) => response.data,
        }),

        getProductAddPromotion: builder.query({
            query: ({ name, sort }) => ({
                url: `/admin/product/promotion-create?name=${name}&sort=${sort}`,
                method: "GET",
            }),
        }),

        getProductFromCategory: builder.query({
            query: ({
                page = 1,
                pageSize = 12,
                priceRange = "",
                categories = [],
                tags = [],
                sortOrder = "",
                slug,
            }) => {
                const queryString = new URLSearchParams({
                    priceRange,
                    categories: categories.join(","),
                    tags: tags.join(","),
                    sortOrder,
                    page,
                    pageSize,
                }).toString();

                return {
                    url: `/products/categories/${slug}?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (response) => response.data,
        }),

        getProductPromtion: builder.query({
            query: ({
                page = 1,
                pageSize = 12,
                priceRange = "",
                brands = [],
                rating = "",
                categories = [],
                tags = [],
                sortOrder = "",
            }) => {
                const queryString = new URLSearchParams({
                    priceRange,
                    rating,
                    categories,
                    tags,
                    sortOrder,
                    page,
                    brands,
                    pageSize,
                }).toString();
                return {
                    url: `/products/promotions?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (response) => response.data,
        }),

        getPromotionActive: builder.query({
            query: () => ({
                url: "/products/promotions-info",
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
    useGetProductOtherQuery,
    useGetFilterOptionsQuery,
    useGetProductFromBrandQuery,
    useGetProductAddPromotionQuery,
    useGetProductFromCategoryQuery,
    useGetProductPromtionQuery,
    useGetPromotionActiveQuery
} = productApi;
