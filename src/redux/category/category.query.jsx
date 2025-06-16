import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, data, params } = args;
        return baseQuery({ url, method, data, params });
    },
    endpoints: (builder) => ({
        getAllCategory: builder.query({
            query: () => ({
                url: `/admin/categories`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Category"],
        }),

        getCategoryList: builder.query({
            query: ({ page = 1, pageSize = 10, name = "" }) => {
                const queryStrings = new URLSearchParams({
                    page,
                    pageSize,
                    name,
                }).toString();
                return {
                    url: `/admin/categories?${queryStrings}`,
                    method: "GET",
                };
            },
            providesTags: ["Category"],
        }),

        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/admin/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),

        getAllCategoryUser: builder.query({
            query: () => ({
                url: `/categories`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
    }),
});

export const {
    useGetAllCategoryQuery,
    useGetCategoryListQuery,
    useDeleteCategoryMutation,
    useGetAllCategoryUserQuery
} = categoryApi;
