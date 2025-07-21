import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@axios/axios";
import { message } from "antd";

export const updateReview = createAsyncThunk(
    "review/updateReview",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await axios.put(
                `/admin/reviews/${id}`, payload
            );
            return res;
        } catch (error) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteReview = createAsyncThunk(
    "review/deleteReview",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.delete(
                `/admin/reviews/${id}`
            );
            return res;
        } catch (error) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
);

export const createReview = createAsyncThunk(
    "review/createReview",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await axios.post("/reviews", payload);
            return res;
        } catch (error) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
);

export const getReviewList = createAsyncThunk(
    "review/getReviewList",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `/admin/reviews?customerName=${payload.customerName || ""}&page=${payload.page}&pageSize=${payload.pageSize}&rate=${payload.rate || 0}&fromDate=${payload.fromDate || ""}&toDate=${payload.toDate || ""}&productName=${payload.productName || ""}`
            );
            return res;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getReviewProduct = createAsyncThunk(
    "review/getReviewProduct",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `/reviews/${payload.productId}?page=${payload.page}&pageSize=${payload.pageSize}&rate=${payload.rate || ""}&hasComment=${payload.hasComment}&hasImage=${payload.hasImage}`
            );
            return res;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
