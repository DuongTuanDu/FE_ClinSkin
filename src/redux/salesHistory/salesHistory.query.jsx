import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const salesHistoryApi = createApi({
    reducerPath: "salesHistoryApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, data, params } = args;
        return baseQuery({ url, method, data, params });
    },
    tagTypes: ["SalesHistory"],
    endpoints: (builder) => ({
        createSalesHistory: builder.mutation({
            query: (salesData) => ({
                url: `/admin/sales-history/create`,
                method: "POST",
                data: salesData,
            }),
            invalidatesTags: ["SalesHistory"],
        }),
    }),
});

export const {
    useCreateSalesHistoryMutation
} = salesHistoryApi;
