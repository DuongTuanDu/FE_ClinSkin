import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const addressApi = createApi({
    reducerPath: "addressApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, data, params } = args;
        return baseQuery({ url, method, data, params });
    },
    endpoints: (builder) => ({
        getAllAddress: builder.query({
            query: () => ({
                url: "/address",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Address"],
        }),
        // create
        createAddress: builder.mutation({
            query: (data) => ({
                url: "/address",
                method: "POST",
                data,
            }),
            invalidatesTags: ["Address"],
        }),
        // update
        updateAddress: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/address/${id}`,
                method: "PUT",
                data,
            }),
            invalidatesTags: ["Address"],
        }),
        // delete
        deleteAddress: builder.mutation({
            query: (id) => ({
                url: `/address/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Address"],
        }),
        // set default
        setDefaultAddress: builder.mutation({
            query: (id) => ({
                url: `/address/${id}/set-default`,
                method: "PATCH",
            }),
            invalidatesTags: ["Address"],
        }),
    }),
});

export const {
    useGetAllAddressQuery,
    useCreateAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
    useSetDefaultAddressMutation
} = addressApi;
