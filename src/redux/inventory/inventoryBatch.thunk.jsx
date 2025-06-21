import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@axios/axios";

export const createInventoryBatch = createAsyncThunk(
    "inventoryBatch/createInventoryBatch",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/admin/inventory-batches", payload);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateInventoryBatch = createAsyncThunk(
    "inventoryBatch/updateInventoryBatch",
    async ({ batchNumber, ...payload }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/admin/inventory-batches/${batchNumber}`, payload);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteInventoryBatch = createAsyncThunk(
    "inventoryBatch/deleteInventoryBatch",
    async (batchNumber, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/admin/inventory-batches/${batchNumber}`);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getInventoryBatchByBatchNumber = createAsyncThunk(
    "inventoryBatch/getInventoryBatchByBatchNumber",
    async (batchNumber, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/admin/inventory-batches/${batchNumber}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getBatchesByProductId = createAsyncThunk(
    "inventoryBatch/getBatchesByProductId",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/admin/inventory-batches/product/${productId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
