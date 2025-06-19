import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const inventoryBatchApi = createApi({
    reducerPath: "inventoryBatchApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, data, params } = args;
        return baseQuery({ url, method, data, params });
    },
    tagTypes: ["InventoryBatch"],
    endpoints: (builder) => ({
        getAllBatches: builder.query({
            query: ({ 
                page = 1, 
                limit = 10, 
                batchNumber = "", 
                productId = "", 
                importer = "",
                sortBy = "createdAt",
                sortOrder = "desc" 
            } = {}) => {
                const queryParams = { page, limit, sortBy, sortOrder };
                
                if (batchNumber) queryParams.batchNumber = batchNumber;
                if (productId) queryParams.productId = productId;
                if (importer) queryParams.importer = importer;
                
                const queryStrings = new URLSearchParams(queryParams).toString();
                return {
                    url: `/admin/inventory-batches?${queryStrings}`,
                    method: "GET",
                };
            },
            providesTags: ["InventoryBatch"],
        }),
        
        getBatchByBatchNumber: builder.query({
            query: (batchNumber) => ({
                url: `/admin/inventory-batches/${batchNumber}`,
                method: "GET",
            }),
            providesTags: (result, error, batchNumber) => [{ type: "InventoryBatch", id: batchNumber }],
        }),
        
        getBatchesByProductId: builder.query({
            query: (productId) => ({
                url: `/admin/inventory-batches/product/${productId}`,
                method: "GET",
            }),
            providesTags: (result, error, productId) => [{ type: "InventoryBatch", id: `product-${productId}` }],
        }),
        
        getBatchesByOrderId: builder.query({
            query: (orderId) => ({
                url: `/admin/inventory-batches/order/${orderId}`,
                method: "GET",
            }),
            providesTags: (result, error, orderId) => [{ type: "InventoryBatch", id: `order-${orderId}` }],
        }),
        
        createBatch: builder.mutation({
            query: (batchData) => ({
                url: `/admin/inventory-batches`,
                method: "POST",
                data: batchData,
            }),
            invalidatesTags: ["InventoryBatch"],
        }),
        
        updateBatch: builder.mutation({
            query: ({ batchNumber, ...batchData }) => ({
                url: `/admin/inventory-batches/${batchNumber}`,
                method: "PUT",
                data: batchData,
            }),
            invalidatesTags: (result, error, { batchNumber }) => [
                { type: "InventoryBatch", id: batchNumber },
                "InventoryBatch",
            ],
        }),
        
        deleteBatch: builder.mutation({
            query: (batchNumber) => ({
                url: `/admin/inventory-batches/${batchNumber}`,
                method: "DELETE",
            }),
            invalidatesTags: ["InventoryBatch"],
        }),
    }),
});

export const {
    useGetAllBatchesQuery,
    useGetBatchByBatchNumberQuery,
    useGetBatchesByProductIdQuery,
    useGetBatchesByOrderIdQuery,
    useCreateBatchMutation,
    useUpdateBatchMutation,
    useDeleteBatchMutation
} = inventoryBatchApi;
